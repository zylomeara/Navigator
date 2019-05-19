from django.contrib import admin
from .models import Client, Order, Transportation, Task

# Register your models here.

admin.site.register(Client)
admin.site.register(Order)
admin.site.register(Transportation)
admin.site.register(Task)
