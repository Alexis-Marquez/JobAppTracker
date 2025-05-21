from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
	default_resume = models.ForeignKey('resumes.Resume', on_delete=models.SET_NULL, null=True, blank=True)
	notify_on_deadlines = models.BooleanField(default=True)
	preferred_timezone = models.CharField(max_length=50, default='UTC')