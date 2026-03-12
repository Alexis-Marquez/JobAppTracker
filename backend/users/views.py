from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return CustomUser.objects.filter(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        # Override list to return single object, not list
        user = self.get_queryset().first()
        serializer = self.get_serializer(user)
        return Response(serializer.data)


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
        refresh_token = response.data.get("refresh")
        if refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,

                path='/',
                domain=None
            )
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
            refresh.check_blacklist()
            access_token = str(refresh.access_token)

            return Response({"access": access_token}, status=status.HTTP_200_OK)

        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        print("!!! LOGOUT VIEW HIT !!!")
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            print(f"Attempting logout with refresh token: {refresh_token}")
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                except Exception:
                    print("Failed to blacklist token, it may already be invalid or expired.")

            response = Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
            
            response.delete_cookie(
                'refresh_token',
                path='/',
                samesite=None
            )
                        
            return response

        except Exception as e:
            print(f"LOGOUT ERROR: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def health_check(request):
    """A simple view that returns a 200 OK response."""
    return HttpResponse(status=200)