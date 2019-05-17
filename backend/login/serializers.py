from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Admin,
    Courier,
    Manager
)

from django.contrib.auth.hashers import (
    check_password, is_password_usable, make_password,
)


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'

    def save(self, **kwargs):
        self.validated_data['password'] = make_password(self.validated_data['password'])

        return super().save(**kwargs)

class CourierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courier
        fields = '__all__'

    def save(self, **kwargs):
        self.validated_data['password'] = make_password(self.validated_data['password'])

        return super().save(**kwargs)

class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'

    def save(self, **kwargs):
        self.validated_data['password'] = make_password(self.validated_data['password'])

        return super().save(**kwargs)


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
