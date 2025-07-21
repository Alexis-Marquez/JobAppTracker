from django.test import TestCase
from rest_framework_simplejwt.tokens import RefreshToken

from companies.serializers import CompanySerializer
from users.models import CustomUser


class CompanySerializerTests(TestCase):
    def test_create_company_with_name_and_website(self):
        """Test creating a company with a name and website"""

        serializer = CompanySerializer(data={"name": "OpenAI", "website": "https://www.openai.com"})
        self.assertTrue(serializer.is_valid(), serializer.errors)

        company = serializer.save()

        self.assertEqual(company.name, "OpenAI")
        self.assertEqual(company.website, "https://www.openai.com")

        output_serializer = CompanySerializer(company)
        self.assertEqual(output_serializer.data['name'], "OpenAI")
        self.assertEqual(output_serializer.data['website'], "https://www.openai.com")

    def test_missing_required_fields(self):
        """Test that missing name makes the serializer invalid"""

        serializer = CompanySerializer(data={"website":"https://www.openai.com"})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

from rest_framework.test import APIClient
from rest_framework import status

class ApplicationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username="alex", password="pass123")

        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    def test_create_company_via_api(self):
        """Test creating an application with nested company and location via API"""
        data = {
                "name": "OpenAI",
                "website": "https://www.openai.com"
        }

        response = self.client.post("/api/companies/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        app_data = response.data
        self.assertEqual(app_data['name'], "OpenAI")
        self.assertEqual(app_data['website'], "https://www.openai.com")

    def test_create_company_missing_fields(self):
        """Test API rejects incomplete application data"""
        data = {
        }

        response = self.client.post("/api/companies/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
