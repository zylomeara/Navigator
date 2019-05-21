import json

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Client,
    Order,
    Transportation,
    Task
)
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from django.contrib.gis.gdal import GDALException


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class GeometryField(serializers.Field):
    """A field for GeoJSON geometry serialization"""

    def to_internal_value(self, data):
        if data == '' or data is None:
            return None
        if isinstance(data, GEOSGeometry):
            return data
        if isinstance(data, dict):
            data = json.dumps(data)
        try:
            return GEOSGeometry(data)
        except (GDALException, GEOSException, TypeError, ValueError):
            pass
            # raise serializers.ValidationError(_('Cannot deserialize geometry'))

    def to_representation(self, value):
        if isinstance(value, dict) or value is None:
            return value
        return json.loads(value.geojson)


class TransportationSerializer(serializers.ModelSerializer):
    # start_location = GeometryField(allow_null=True)
    start_location = GeometryField()
    end_location = GeometryField()

    class Meta:
        model = Transportation
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
