# from django.test import TestCase
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from orderapi.models import Order, Client, Transportation
from django.urls import reverse
from orderapi.serializers import TransportationSerializer

import json

transportation = APIClient()

class GetSingleAndAllTransportationTest(APITestCase):
    """ Test module for transportation model """

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
        Transportation.objects.create(
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
        Transportation.objects.create(
            pk=2,
            order=self.testOrder,
            start_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.655773639678955,
                    47.24402189254761
                ]
            })),
            end_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.842541217803955,
                    47.26393461227417
                ]
            })),
            parcel='example_parcel2'
        )

    def test_get_all_transportation(self):
        # get API response
        print('test_get_all_transportation')
        response = transportation.get('/api/transportation/')
        # get data from db
        transportations = Transportation.objects.all()
        serializer = TransportationSerializer(transportations, many=True)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_valid_single_transportation(self):
        print('test_get_valid_single_transportation')
        # get API response
        response = transportation.get('/api/transportation/1/')
        # get data from db
        transportations = Transportation.objects.get(pk=1)
        serializer = TransportationSerializer(transportations)

        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_transportation(self):
        print('test_get_invalid_single_transportation')
        # get API response
        response = transportation.get('/api/transportation/30/')

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
        self.valid_payload = {
            "order": self.testOrder.pk,
            "start_location": {
                "type": "Point",
                "coordinates": [
                    39.6211302280426,
                    47.22098708152772
                ]
            },
            "end_location": {
                "type": "Point",
                "coordinates": [
                    39.809582233428955,
                    47.25088834762573
                ]
            },
            "parcel": "example_parcel"
        }

        self.invalid_payload = {
            "order": self.testOrder.pk,
            "start_location": None,
            "end_location": None,
            "parcel": None
        }

    def test_create_valid_transportation(self):
        print('test_create_valid_transportation')
        response = transportation.post(
            "/api/transportation/",
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_transportation(self):
        print('test_create_invalid_transportation')
        response = transportation.post(
            "/api/transportation/",
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
        self.testTransportation = Transportation.objects.create(
            pk=1,
            order=self.testOrder,
            start_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.655773639678955,
                    47.24402189254761
                ]
            })),
            end_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.842541217803955,
                    47.26393461227417
                ]
            })),
            parcel='example_parcel2'
        )
        self.valid_payload = {
            "order": self.testOrder.pk,
            "start_location": {
                "type": "Point",
                "coordinates": [
                    39.6211302280426,
                    47.22098708152772
                ]
            },
            "end_location": {
                "type": "Point",
                "coordinates": [
                    39.809582233428955,
                    47.25088834762573
                ]
            },
            "parcel": "example_parcel"
        }

        self.invalid_payload = {
            "order": self.testOrder.pk,
            "start_location": None,
            "end_location": None,
            "parcel": None
        }

    def test_valid_update_transportation(self):
        print('test_valid_update_transportation')
        response = transportation.put(
            '/api/transportation/{}/'.format(self.testTransportation.pk),
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_update_transportation(self):
        print('test_invalid_update_transportation')
        response = transportation.put(
            '/api/transportation/{}/'.format(self.testTransportation.pk),
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
        self.testTransportation = Transportation.objects.create(
            pk=1,
            order=self.testOrder,
            start_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.655773639678955,
                    47.24402189254761
                ]
            })),
            end_location=GEOSGeometry(json.dumps({
                "type": "Point",
                "coordinates": [
                    39.842541217803955,
                    47.26393461227417
                ]
            })),
            parcel='example_parcel2'
        )

    def test_valid_delete_transportation(self):
        print('test_valid_delete_transportation')
        response = transportation.delete(
            '/api/transportation/{}/'.format(self.testTransportation.pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_delete_transportation(self):
        print('test_invalid_delete_transportation')
        response = transportation.delete(
            '/api/transportation/{}/'.format(30))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)