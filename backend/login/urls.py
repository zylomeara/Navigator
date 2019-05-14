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
