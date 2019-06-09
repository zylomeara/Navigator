# from django.test import TestCase
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from orderapi.models import Order, Client, Transportation, Task
from login.models import Courier
from django.urls import reverse
from orderapi.serializers import TaskSerializer

import json

task = APIClient()

class GetSingleAndAllTaskTest(APITestCase):
    """ Test module for task model """

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
        self.testTransportation = Transportation.objects.create(
            pk=1,
            order=self.testOrder,
            start_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.6211302280426,
                    47.22098708152772
                ]
            })),
            end_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.809582233428955,
                    47.25088834762573
                ]
            })),
            parcel='example_parcel'
        )
        self.testCourier = Courier.objects.create(
            transport='Some transport',
            phone_number='1234567890'
        )
        Task.objects.create(
            pk=1,
            status=False,
            transportation=self.testTransportation,
            courier=self.testCourier,
        )
        # Task.objects.create(
        #     pk=2,
        #     status=False,
        #     transportation=self.testTransportation,
        #     courier=self.testCourier,
        # )
        # Task.objects.create(
        #     pk=3,
        #     status=False,
        #     transportation=self.testTransportation,
        #     courier=self.testCourier,
        # )


    def test_get_all_task(self):
        # get API response
        print('test_get_all_task')
        response = task.get('/api/task/')
        # get data from db
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_valid_single_task(self):
        print('test_get_valid_single_task')
        # get API response
        response = task.get('/api/task/1/')
        # get data from db
        tasks = Task.objects.get(pk=1)
        serializer = TaskSerializer(tasks)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_task(self):
        print('test_get_invalid_single_task')
        # get API response
        response = task.get('/api/transportation/30/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CreateNewTransportationTest(APITestCase):
    """ Test module for inserting a new transportation """

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
        self.testTransportation = Transportation.objects.create(
            pk=1,
            order=self.testOrder,
            start_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.6211302280426,
                    47.22098708152772
                ]
            })),
            end_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.809582233428955,
                    47.25088834762573
                ]
            })),
            parcel='example_parcel'
        )
        self.testCourier = Courier.objects.create(
            transport='Some transport',
            phone_number='1234567890'
        )
        self.valid_payload = {
            "transportation": self.testTransportation.pk,
            "courier": self.testCourier.pk,
            "status": False
        }

        self.invalid_payload = {
            "transportation": None,
            "courier": None,
            "status": False
        }

    def test_create_valid_task(self):
        print('test_create_valid_task')
        response = task.post(
            "/api/task/",
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_task(self):
        print('test_create_invalid_task')
        response = task.post(
            "/api/task/",
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UpdateSingleOrderTest(APITestCase):
    """ Test module for updating an existing task record """

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
        self.testTransportation = Transportation.objects.create(
            pk=1,
            order=self.testOrder,
            start_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.6211302280426,
                    47.22098708152772
                ]
            })),
            end_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.809582233428955,
                    47.25088834762573
                ]
            })),
            parcel='example_parcel'
        )
        self.testCourier = Courier.objects.create(
            transport='Some transport',
            phone_number='1234567890'
        )
        self.testTask = Task.objects.create(
            transportation=self.testTransportation,
            courier=self.testCourier,
            status=False
        )
        self.valid_payload = {
            "transportation": self.testTransportation.pk,
            "courier": self.testCourier.pk,
            "status": True
        }

        self.invalid_payload = {
            "transportation": None,
            "courier": None,
            "status": False
        }

    def test_valid_update_task(self):
        print('test_valid_update_task')
        response = task.put(
            '/api/task/{}/'.format(self.testTask.pk),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_update_task(self):
        print('test_invalid_update_task')
        response = task.put(
            '/api/task/{}/'.format(self.testTask.pk),
            data=json.dumps(self.invalid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class DeleteSingleOrderTest(APITestCase):
    """ Test module for deleting an existing task record """

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
        self.testTransportation = Transportation.objects.create(
            pk=1,
            order=self.testOrder,
            start_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.6211302280426,
                    47.22098708152772
                ]
            })),
            end_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.809582233428955,
                    47.25088834762573
                ]
            })),
            parcel='example_parcel'
        )
        self.testCourier = Courier.objects.create(
            transport='Some transport',
            phone_number='1234567890'
        )
        self.testTask = Task.objects.create(
            transportation=self.testTransportation,
            courier=self.testCourier,
            status=False
        )

    def test_valid_delete_task(self):
        print('test_valid_delete_task')
        response = task.delete(
            '/api/task/{}/'.format(self.testTask.pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_task(self):
        print('test_invalid_delete_task')
        response = task.delete(
            '/api/task/{}/'.format(30))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)