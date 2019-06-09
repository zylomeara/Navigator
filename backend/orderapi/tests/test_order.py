# from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from orderapi.models import Order, Client
from django.urls import reverse
from orderapi.serializers import OrderSerializer

import json

order = APIClient()

class GetSingleAndAllOrderTest(APITestCase):
    """ Test module for order model """

    def setUp(self):
        self.testClient = Client.objects.create(
            first_name='first_name1',
            last_name="last_name1",
            middle_name="middle_name1",
            phone_number="12345678901"
        )
        Order.objects.create(pk=1, status=False, client=self.testClient)
        Order.objects.create(pk=2, status=False, client=self.testClient)
        Order.objects.create(pk=3, status=False, client=self.testClient)
        Order.objects.create(pk=4, status=False, client=self.testClient)

    def test_get_all_order(self):
        # get API response
        print('test_get_all_order')
        response = order.get('/api/order/')
        # get data from db
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_valid_single_order(self):
        print('test_get_valid_single_order')
        # get API response
        response = order.get('/api/order/1/')
        # get data from db
        orders = Order.objects.get(pk=1)
        serializer = OrderSerializer(orders)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_order(self):
        print('test_get_invalid_single_order')
        # get API response
        response = order.get('/api/client/30/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CreateNewOrderTest(APITestCase):
    """ Test module for inserting a new order """

    def setUp(self):
        self.testClient = Client.objects.create(
            first_name='first_name1',
            last_name="last_name1",
            middle_name="middle_name1",
            phone_number="12345678901"
        )
        self.valid_payload = {
            "client": self.testClient.pk,
            "status": False
        }

        self.invalid_payload = {
            "client": None,
            "status": None
        }

    def test_create_valid_order(self):
        print('test_create_valid_order')
        response = order.post(
            "/api/order/",
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_order(self):
        print('test_create_invalid_order')
        response = order.post(
            "/api/order/",
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UpdateSingleOrderTest(APITestCase):
    """ Test module for updating an existing client record """

    def setUp(self):
        self.testClient = Client.objects.create(
            first_name='first_name1',
            last_name="last_name1",
            middle_name="middle_name1",
            phone_number="12345678901"
        )
        self.testOrder = Order.objects.create(
            client=self.testClient,
            status=False
        )
        self.valid_payload = {
            "client": self.testClient.pk,
            "status": True
        }
        self.invalid_payload = {
            "client": None,
            "status": None
        }

    def test_valid_update_order(self):
        print('test_valid_update_order')
        response = order.put(
            '/api/order/{}/'.format(self.testOrder.pk),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_update_order(self):
        print('test_invalid_update_order')
        response = order.put(
            '/api/order/{}/'.format(self.testOrder.pk),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class DeleteSingleOrderTest(APITestCase):
    """ Test module for deleting an existing client record """

    def setUp(self):
        self.testClient = Client.objects.create(
            first_name='first_name1',
            last_name="last_name1",
            middle_name="middle_name1",
            phone_number="12345678901"
        )
        self.testOrder = Order.objects.create(
            client=self.testClient,
            status=False
        )

    def test_valid_delete_order(self):
        print('test_valid_delete_order')
        response = order.delete(
            '/api/order/{}/'.format(self.testOrder.pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_order(self):
        print('test_invalid_delete_order')
        response = order.delete(
            '/api/order/{}/'.format(30))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)