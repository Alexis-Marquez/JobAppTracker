from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)


from rest_framework import generics
from rest_framework.permissions import AllowAny
from users.models import CustomUser
from users.serializers import RegistrationSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

class CookieTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Extract refresh token from response data
        refresh_token = response.data.get("refresh")
        if refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,   # True in production with HTTPS
                samesite='Lax',
                path='/api/token/refresh/'
            )

        # Optionally remove refresh token from response data
        response.data.pop("refresh", None)

        return response

class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token missing."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            return Response({"access": access_token}, status=status.HTTP_200_OK)

        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            return response

        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
