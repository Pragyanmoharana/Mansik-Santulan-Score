import joblib
import pandas as pd

from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import PredictionSerializer


# Load trained ML pipeline
model = joblib.load("Mental_Health_Model.pkl")


# Home page
def home(request):
    return render(request, "index.html")


class PredictionView(APIView):

    def post(self, request):

        print("\n========== PREDICTION REQUEST ==========")
        print("Request received!")

        serializer = PredictionSerializer(data=request.data)

        if not serializer.is_valid():

            print("Serializer error:")
            print(serializer.errors)

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data

        # Convert data to DataFrame
        input_data = pd.DataFrame([data])

        print("\n========== BEFORE PROCESSING ==========")
        print(input_data)

        # ------------------------------------------------
        # CONVERT NUMERIC STRESS LEVEL TO MODEL CATEGORY
        # ------------------------------------------------

        stress = float(input_data.loc[0, "Stress_Level"])

        if stress <= 2:
            stress_category = "Low"

        elif stress <= 5:
            stress_category = "Medium"

        elif stress <= 8:
            stress_category = "High"

        else:
            stress_category = "Very High"

        input_data["Stress_Level"] = stress_category

        # ------------------------------------------------
        # FIX COUNTRY COLUMN NAME
        # ------------------------------------------------

        input_data = input_data.rename(
            columns={
                "Grouped_Country": "Grouped_country"
            }
        )

        print("\n========== FINAL INPUT TO MODEL ==========")
        print(input_data)

        print("\n========== DATA TYPES ==========")
        print(input_data.dtypes)

        try:

            # Make prediction
            prediction = model.predict(input_data)

            print("\n========== PREDICTION ==========")
            print(prediction)

            return Response({
                "prediction": float(prediction[0])
            })

        except Exception as e:

            print("\n========== ML ERROR ==========")
            print(type(e)._name_)
            print(str(e))

            return Response(
                {
                    "error": "ML prediction failed",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )