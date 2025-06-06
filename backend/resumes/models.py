from django.db import models

from JobTracker import settings
import os
from django.utils import timezone
from datetime import timedelta

class ResumeManager(models.Manager):
    def recent(self, days=30):
        from django.utils import timezone
        from datetime import timedelta
        since = timezone.now() - timedelta(days=days)
        return self.filter(created_at__gte=since)

    def for_user(self, user):
        return self.filter(owner=user)


class Resume(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    file = models.FileField(upload_to='resumes/')
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    objects = ResumeManager()

    def file_extension(self):
        return os.path.splitext(self.file.name)[1].lower()

    def was_created_recently(self, days=7):
        return self.created_at >= timezone.now() - timedelta(days=days)

