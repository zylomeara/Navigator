from django.contrib import admin
from .models import Manager, Admin, Courier
# Register your models here.

admin.site.register(Manager)
admin.site.register(Admin)
admin.site.register(Courier)