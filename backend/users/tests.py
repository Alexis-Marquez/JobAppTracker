from django.test import TestCase, RequestFactory
from rest_framework.test import force_authenticate
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status

from applications.models import Application
from users.models import CustomUser
from applications.permissions import IsOwner

class IsOwnerPermissionTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.permission = IsOwner()

        self.user1 = CustomUser.objects.create_user(username="user1", password="pass123")
        self.user2 = CustomUser.objects.create_user(username="user2", password="pass123")

        self.application = Application.objects.create(
            application_date="2024-06-12",
            description="A job",
            position_title="Engineer",
            company=None,  # assuming null allowed for test simplicity
            user=self.user1
        )

    def test_has_permission_allows_authenticated_post(self):
        request = self.factory.post("/api/applications/")
        force_authenticate(request, user=self.user1)
        view = APIView()
        has_perm = self.permission.has_permission(request, view)
        self.assertTrue(has_perm)

    def test_has_permission_denies_unauthenticated_post(self):
        request = self.factory.post("/api/applications/")
        view = APIView()
        has_perm = self.permission.has_permission(request, view)
        self.assertFalse(has_perm)

    def test_has_object_permission_allows_owner(self):
        request = self.factory.get("/api/applications/1/")
        force_authenticate(request, user=self.user1)
        view = APIView()
        has_obj_perm = self.permission.has_object_permission(request, view, self.application)
        self.assertTrue(has_obj_perm)

    def test_has_object_permission_denies_non_owner(self):
        request = self.factory.get("/api/applications/1/")
        force_authenticate(request, user=self.user2)
        view = APIView()
        has_obj_perm = self.permission.has_object_permission(request, view, self.application)
        self.assertFalse(has_obj_perm)
