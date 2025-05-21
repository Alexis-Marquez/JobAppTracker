from django.db import models

from JobTracker import settings
from companies.models import Company
from locations.models import Location
from resumes.models import Resume


class Application(models.Model):
    class ApplicationStatus(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        INTERVIEWING = 'interviewing', 'Interviewing'
        OFFERED = 'offered', 'Offered'
        REJECTED = 'rejected', 'Rejected'
        WITHDRAWN = 'withdrawn', 'Withdrawn'
        ACCEPTED = 'accepted', 'Accepted'
        ARCHIVED = 'archived', 'Archived'

    application_date = models.DateTimeField("date applied")
    benefits = models.TextField(blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    description = models.TextField()
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    pay = models.CharField(max_length=100, blank=True)
    position_title = models.CharField(max_length=200)
    resume_used = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True)
    requirements = models.TextField(blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED
    )

    def __str__(self):
        return f"{self.position_title} at {self.company} ({self.status})"
