from django.shortcuts import render

from rest_framework.viewsets import ModelViewSet
from .models import (
    Client,
    Order,
    Transportation,
    Task
)
from .serializers import (
    ClientSerializer,
    OrderSerializer,
    TransportationSerializer,
    TaskSerializer
)

# Create your views here.

class ClientView(ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class OrderView(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class TransportationView(ModelViewSet):
    queryset = Transportation.objects.all()
    serializer_class = TransportationSerializer

class TaskView(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer