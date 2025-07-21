from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from applications.models import Application
from companies.models import Company
from locations.models import Location
from users.models import CustomUser


class ApplicationAPIPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create two users
        self.user1 = CustomUser.objects.create_user(username="user1", password="pass123")
        self.user2 = CustomUser.objects.create_user(username="user2", password="pass123")

        # Generate JWT tokens
        self.token_user1 = str(RefreshToken.for_user(self.user1).access_token)
        self.token_user2 = str(RefreshToken.for_user(self.user2).access_token)

        # Create related data
        self.company = Company.objects.create(name="OpenAI")
        self.location = Location.objects.create(city="Austin", country="USA")

        # Create application for user1
        self.application = Application.objects.create(
            application_date=timezone.now(),
            position_title="Software Engineer",
            description="Some job",
            company=self.company,
            user=self.user1,
            location=self.location
        )

    def test_owner_can_retrieve_application(self):
        """User should be able to retrieve their own application"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_user1}')
        response = self.client.get(f"/api/applications/{self.application.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company']['name'], "OpenAI")

    def test_non_owner_cannot_retrieve_application(self):
        """Other users should not be able to retrieve someone else's application"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_user2}')
        response = self.client.get(f"/api/applications/{self.application.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_user_cannot_retrieve_application(self):
        """Unauthenticated requests should be denied"""
        self.client.credentials()  # Clear auth
        response = self.client.get(f"/api/applications/{self.application.id}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_owner_can_delete_their_application(self):
        """User should be able to delete their own application"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_user1}')
        response = self.client.delete(f"/api/applications/{self.application.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_non_owner_cannot_delete_application(self):
        """Other users cannot delete applications they don't own"""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_user2}')
        response = self.client.delete(f"/api/applications/{self.application.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
