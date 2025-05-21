from django.db import models

from JobTracker import settings


class Resume(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='resumes/')
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)