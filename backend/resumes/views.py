from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Resume
from .permissions import IsOwner
from .serializers import ResumeSerializer

class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Resume.objects.filter(owner=self.request.user)

