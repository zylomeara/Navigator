# from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from orderapi.models import Client
from django.urls import reverse
from orderapi.serializers import ClientSerializer

import json

client = APIClient()

class GetSingleAndAllClientTest(APITestCase):
    """ Test module for client model """

    def setUp(self):
        Client.objects.create(pk=1, first_name='one')
        Client.objects.create(pk=2, first_name='two')
        Client.objects.create(pk=3, first_name='three')
        Client.objects.create(pk=4, first_name='four')

    def test_get_all_client(self):
        # get API response
        # print('Fetching all clients...')
        print('test_get_all_client')
        response = client.get('/api/client/')
        # get data from db
        clients = Client.objects.all()
        serializer = ClientSerializer(clients, many=True)

        # print('Fetched {} clients'.format(len(response.data)))
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_valid_single_client(self):
        print('test_get_valid_single_client')
        # get API response
        response = client.get('/api/client/1/')
        # get data from db
        clients = Client.objects.get(pk=1)
        serializer = ClientSerializer(clients)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_client(self):
        print('test_get_invalid_single_client')
        # get API response
        response = client.get('/api/client/30/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CreateNewClientTest(APITestCase):
    """ Test module for inserting a new client """

    def setUp(self):
        self.valid_payload = {
            "first_name": "first_name",
            "last_name": "last_name",
            "middle_name": "middle_name",
            "phone_number": "1234567890"
        }

        self.invalid_payload = {
            "first_name": None,
            "last_name": None,
            "middle_name": None,
            "phone_number": None
        }

    def test_create_valid_client(self):
        print('test_create_valid_client')
        response = client.post(
            "/api/client/",
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_client(self):
        print('test_create_invalid_client')
        response = client.post(
            "/api/client/",
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UpdateSingleClientTest(APITestCase):
    """ Test module for updating an existing client record """

    def setUp(self):
        self.testClient = Client.objects.create(
            first_name='first_name1',
            last_name="last_name1",
            middle_name="middle_name1",
            phone_number="12345678901"
        )
        self.valid_payload = {
            "first_name": "first_name2",
            "last_name": "last_name2",
            "middle_name": "middle_name2",
            "phone_number": "12345678902"
        }
        self.invalid_payload = {
            "first_name": None,
            "last_name": None,
            "middle_name": None,
            "phone_number": None
        }

    def test_valid_update_client(self):
        print('test_valid_update_client')
        response = client.put(
            '/api/client/{}/'.format(self.testClient.pk),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_update_client(self):
        print('test_invalid_update_client')
        response = client.put(
            '/api/client/{}/'.format(self.testClient.pk),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class DeleteSingleClientTest(APITestCase):
    """ Test module for deleting an existing client record """

    def setUp(self):
        self.testClient = Client.objects.create(
            first_name='first_name1',
            last_name="last_name1",
            middle_name="middle_name1",
            phone_number="12345678901"
        )

    def test_valid_delete_client(self):
        print('test_valid_delete_client')
        response = client.delete(
            '/api/client/{}/'.format(self.testClient.pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_client(self):
        print('test_invalid_delete_client')
        response = client.delete(
            '/api/client/{}/'.format(30))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)