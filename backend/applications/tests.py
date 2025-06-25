from django.test import TestCase
from django.utils import timezone
from applications.models import Application
from applications.serializers import ApplicationSerializer
from companies.models import Company
from locations.models import Location
from users.models import CustomUser

class ApplicationSerializerTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="alex", password="pass123")

    def test_create_application_with_company_and_location_data(self):
        """Test creating an application with nested company and location data"""
        data = {
            "application_date": timezone.now().isoformat(),
            "position_title": "Software Engineer",
            "description": "Exciting job",
            "company_data": {
                "name": "OpenAI",
                "website": "https://openai.com"
            },
            "location_data": {
                "city": "Austin",
                "state": "TX"
            },
            "user": self.user.id
        }

        serializer = ApplicationSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        app = serializer.save()

        self.assertEqual(app.company.name, "OpenAI")
        self.assertEqual(app.location.city, "Austin")

        output_serializer = ApplicationSerializer(app)
        self.assertEqual(output_serializer.data['company']['name'], "OpenAI")
        self.assertEqual(output_serializer.data['location']['city'], "Austin")

    def test_create_application_with_future_date(self):
        """Test creating an application with nested company and location data"""
        data = {
            "application_date": (timezone.now() + timezone.timedelta(days=1)).isoformat(),
            "position_title": "Software Engineer",
            "description": "Exciting job",
            "company_data": {
                "name": "OpenAI",
                "website": "https://openai.com"
            },
            "location_data": {
                "city": "Austin",
                "state": "TX"
            },
            "user": self.user.id
        }

        serializer = ApplicationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('application_date', serializer.errors)


    def test_missing_required_fields(self):
        """Test that missing application_date makes the serializer invalid"""
        data = {
            "position_title": "Software Engineer",
            "description": "Job description",
            "user": self.user.id
        }

        serializer = ApplicationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('application_date', serializer.errors)

    def test_missing_required_fields2(self):
        """Test that missing company_data makes the serializer invalid"""
        data = {
            "application_date": timezone.now().isoformat(),
            "position_title": "Software Engineer",
            "description": "Job description",
            "company_data": {},
            "user": self.user.id
        }

        serializer = ApplicationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('company_data', serializer.errors)

    def test_missing_required_fields3(self):
        """Test that missing location_data makes the serializer invalid"""
        data = {
            "application_date": timezone.now().isoformat(),
            "position_title": "Software Engineer",
            "description": "Job description",
            "company_data": {
                'name': 'OpenAI'
            },
            "location_data": {
            },
            "user": self.user.id
        }

        serializer = ApplicationSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('location_data', serializer.errors)

    def test_reuse_existing_company(self):
        """Test that existing company is reused instead of creating a duplicate"""
        Company.objects.create(name="OpenAI", website="https://openai.com")

        data = {
            "application_date": timezone.now().isoformat(),
            "position_title": "Software Engineer",
            "description": "Another job",
            "company_data": {
                "name": "OpenAI",
                "website": "https://openai.com"
            },
            "user": self.user.id
        }

        serializer = ApplicationSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        app = serializer.save()

        self.assertEqual(Company.objects.count(), 1)
        self.assertEqual(app.company.name, "OpenAI")

    def test_application_serializer_output_fields(self):
        """Test the nested and calculated fields in the serializer output"""
        company = Company.objects.create(name="OpenAI", website="https://openai.com")
        location = Location.objects.create(city="Austin", country="USA")

        app = Application.objects.create(
            application_date=timezone.now(),
            description="Job description",
            position_title="Software Engineer",
            company=company,
            user=self.user,
            location=location
        )

        serializer = ApplicationSerializer(app)
        data = serializer.data

        self.assertEqual(data['company']['name'], "OpenAI")
        self.assertEqual(data['location']['city'], "Austin")
        self.assertTrue(data['is_active'])
        self.assertEqual(data['days_since_applied'], 0)

from rest_framework.test import APIClient
from rest_framework import status

class ApplicationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="alex", password="pass123")
        # self.client.force_authenticate(user=self.user)

    def test_create_application_via_api(self):
        """Test creating an application with nested company and location via API"""
        data = {
            "application_date": timezone.now().isoformat(),
            "position_title": "Software Engineer",
            "description": "Great job",
            "company_data": {
                "name": "OpenAI",
                "website": "https://openai.com"
            },
            "location_data": {
                "city": "Austin",
                "state": "TX"
            },
            "user": self.user.id
        }

        response = self.client.post("/api/applications/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        app_data = response.data
        self.assertEqual(app_data['company']['name'], "OpenAI")
        self.assertEqual(app_data['location']['city'], "Austin")
        self.assertEqual(app_data['position_title'], "Software Engineer")

    def test_create_application_missing_fields(self):
        """Test API rejects incomplete application data"""
        data = {
            "position_title": "Software Engineer",
            "description": "Only partial info",
            "user": self.user.id
        }

        response = self.client.post("/api/applications/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('application_date', response.data)

    def test_get_application_list(self):
        """Test fetching application list via API"""
        company = Company.objects.create(name="OpenAI", website="https://openai.com")
        location = Location.objects.create(city="Austin", country="USA")

        Application.objects.create(
            application_date=timezone.now(),
            description="Job description",
            position_title="Software Engineer",
            company=company,
            user=self.user,
            location=location
        )

        response = self.client.get("/api/applications/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['company']['name'], "OpenAI")

