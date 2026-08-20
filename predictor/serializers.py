from rest_framework import serializers


class PredictionSerializer(serializers.Serializer):

    Study_Hours = serializers.FloatField()
    Age = serializers.FloatField()
    Avg_Daily_Usage_Hours = serializers.FloatField()
    Daily_Unlocks = serializers.FloatField()
    Physical_Activity_Hours = serializers.FloatField()
    Sleep_Hours_Per_Night = serializers.FloatField()
    Stress_Level = serializers.FloatField()

    Gender = serializers.CharField()
    Academic_Level = serializers.CharField()
    Most_Used_Platform = serializers.CharField()
    Purpose_Of_Use = serializers.CharField()
    Grouped_Country = serializers.CharField()