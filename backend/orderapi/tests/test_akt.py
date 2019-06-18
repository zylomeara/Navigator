# from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from login.models import Manager
from orderapi.models import Client
from django.urls import reverse
from django.contrib.auth.models import User
from orderapi.serializers import ClientSerializer

from django.test import Client

import json

client = APIClient()

class RegisterTest(APITestCase):

    def test_register_user(self):
        newUser = {
            "first_name": "asdf",
            "middle_name": "asdf",
            "last_name": "asdf",
            "password": "qwerty321",
            "phone_number": "123",
            "position": "courier",
            "transport": "123",
            "username": "courier"
        }

        response = client.post(
            '/api/client/',
            data=json.dumps(newUser),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['first_name'], newUser['first_name'])
        self.assertEqual(response.data['middle_name'], newUser['middle_name'])
        self.assertEqual(response.data['last_name'], newUser['last_name'])
        self.assertEqual(response.data['phone_number'], newUser['phone_number'])

class AuthTest(APITestCase):
    def setUp(self):
        self.credentials = {
            'username': 'manager',
            'password': 'qwerty321'
        }

        self.manager = Manager.objects.create(
            first_name="asdf",
            last_name="asdf",
            # password="qwerty321",
            phone_number="123",
            work_place="123",
            username="manager",
        )
        self.manager.set_password('qwerty321')

    def test_auth_user(self):
        client.post(
            '/account/login/',
            data=json.dumps(self.credentials),
            content_type='application/json'
        )

        self.assertEqual(Manager.objects.get(username="manager").is_authenticated, True)

class UserInfoTest(APITestCase):
    def setUp(self):
        Manager.objects.create(
            pk=1,
            first_name="asdf",
            last_name="asdf",
            password="qwerty321",
            phone_number="123",
            work_place="123",
            username="manager",
        )

    def test_user_info(self):
        response = client.get('/account/manager/1/')

        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['first_name'], "asdf")
        self.assertEqual(response.data['last_name'], "asdf")
        self.assertEqual(response.data['password'], "qwerty321")
        self.assertEqual(response.data['phone_number'], "123")
        self.assertEqual(response.data['work_place'], "123")
        self.assertEqual(response.data['username'], "manager")

class ListEmpTest(APITestCase):
    def setUp(self):
        Manager.objects.create(
            pk=1,
            first_name="asdf",
            last_name="asdf",
            password="qwerty321",
            phone_number="123",
            work_place="123",
            username="manager",
        )
        Manager.objects.create(
            pk=2,
            first_name="asdf",
            last_name="asdf",
            password="qwerty321",
            phone_number="123",
            work_place="123",
            username="manager2",
        )

    def test_user_list(self):
        response = client.get('/account/manager/')

        self.assertEqual(len(response.data), 2)