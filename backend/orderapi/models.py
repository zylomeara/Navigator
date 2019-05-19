# from django.db import models
from django.contrib.gis.db import models
from login.models import Courier


# Create your models here.

class Client(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)


class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)


class Transportation(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    parcel = models.CharField(max_length=400)
    start_location = models.PointField(
        null=True,
        blank=True
    )
    end_location = models.PointField(
        null=True,
        blank=True
    )


class Task(models.Model):
    transportation = models.ForeignKey(Transportation, on_delete=models.CASCADE)
    courier = models.ForeignKey(Courier, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
