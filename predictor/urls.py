from django.urls import path
from .views import PredictionView, home

urlpatterns = [
    path("", home, name="home"),
    path("predict/", PredictionView.as_view(), name="predict"),
]