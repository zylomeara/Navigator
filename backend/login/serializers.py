from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Admin,
    Courier,
    Manager
)


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

class CourierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courier
        fields = '__all__'

class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        if isinstance(instance, Admin):
            return AdminSerializer(instance=instance).data
        elif isinstance(instance, Courier):
            return CourierSerializer(instance=instance).data
        else:
            return ManagerSerializer(instance=instance).data

    class Meta:
        model = User
        fields = '__all__'
