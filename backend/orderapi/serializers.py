import json

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Client,
    Order,
    Transportation,
    Task
)
from django.contrib.gis.geos import GEOSGeometry


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class TransportationSerializer(serializers.ModelSerializer):
    start_location = serializers.SerializerMethodField()
    end_location = serializers.SerializerMethodField()

    def get_start_location(self, obj):
        return json.loads(obj.start_location.geojson)

    def get_end_location(self, obj):
        return json.loads(obj.end_location.geojson)

    def save(self, **kwargs):
        # start = json.dumps(self.data.pop('start_location'))
        # end = json.dumps(self.data.pop('end_location'))
        #
        # a = GEOSGeometry(start, srid=4326).wkt
        # b = GEOSGeometry(end, srid=4326).wkt
        #
        # self.start_location = a
        # self.end_location = b
        # print(a)
        # print(b)
        print(1)

        super().save(self.data)

    class Meta:
        model = Transportation
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
