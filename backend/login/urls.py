from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('islog/', views.islog_view, name='islog'),
    # path('login/', views.log),
    # path('logout/', views.logout_view, name='logout'),
]


# -*- coding: utf-8 -*-


from django.conf.urls import url
from rest_framework.routers import DefaultRouter



router = DefaultRouter()
router.register(r'register',
                views.UserView, base_name='user')
router.register(r'courier', views.CourierView, base_name='courier')
router.register(r'manager', views.ManagerView, base_name='manager')

urlpatterns += router.urls

