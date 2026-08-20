import joblib
import os
from django.conf import settings

MODEL_PATH = os.path.join(settings.BASE_DIR, "Mental_Health_Model.pkl")

model = joblib.load(MODEL_PATH)