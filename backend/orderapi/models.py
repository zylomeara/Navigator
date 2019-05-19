# from django.db import models
from django.contrib.gis.db import models
from login.models import Courier


# Create your models here.

class Client(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)

    def __str__(self):
        return 'Client(first_name={}, last_name={}, middle_name={}, phone_number={})'.format(self.first_name, self.last_name, self.middle_name, self.phone_number)


class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Order(client={}, status={}, date={})'.format(self.client, self.status, self.date)


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

    def __str__(self):
        return 'Transportation(order={}, parcel={}, start_location={}, end_location={})'.format(self.order, self.parcel, self.start_location, self.end_location)


class Task(models.Model):
    transportation = models.ForeignKey(Transportation, on_delete=models.CASCADE)
    courier = models.ForeignKey(Courier, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    def __str__(self):
        return 'Task(transportation={}, courier={}, status={})'.format(self.transportation, self.courier, self.status)
