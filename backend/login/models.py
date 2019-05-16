from django.db import models

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class Manager(User):
    work_place = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)

class Courier(User):
    transport = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)

class Admin(User):
    computer = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=100)


# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()


# artist = models.ForeignKey(Musician, on_delete=models.CASCADE)
# release_date = models.DateField()
# num_stars = models.IntegerField()