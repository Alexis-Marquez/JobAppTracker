from django.db import models

from django.conf import settings
from companies.models import Company
from locations.models import Location
from resumes.models import Resume
from django.utils import timezone

from django.db import models
from django.utils import timezone

class ApplicationManager(models.Manager):
    def active(self):
        return self.filter(status__in=[
            Application.ApplicationStatus.APPLIED,
            Application.ApplicationStatus.INTERVIEWING
        ])

    def offers(self):
        return self.filter(status=Application.ApplicationStatus.OFFERED)

    def recent(self, days=7):
        since = timezone.now() - timezone.timedelta(days=days)
        return self.filter(application_date__gte=since)

    def by_company(self, company):
        return self.filter(company=company)

    def for_user(self, user):
        return self.filter(user=user)

class ApplicationStatusHistory(models.Model):
    application = models.ForeignKey(
        'Application',
        on_delete=models.CASCADE,
        related_name='history'
    )
    old_status = models.CharField(max_length=20, blank=True, null=True)
    new_status = models.CharField(max_length=20)
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['changed_at']

    def __str__(self):
        return f"{self.application} changed to {self.new_status} on {self.changed_at}"


class Application(models.Model):
    class ApplicationStatus(models.TextChoices):
        APPLIED = 'applied', 'Applied'
        INTERVIEWING = 'interviewing', 'Interviewing'
        OFFERED = 'offered', 'Offered'
        FAILED_INTERVIEW = 'failed_interview', 'Failed Interview'
        REJECTED = 'rejected', 'Rejected'
        WITHDRAWN = 'withdrawn', 'Withdrawn'
        ACCEPTED = 'accepted', 'Accepted'
        ARCHIVED = 'archived', 'Archived'

    objects = ApplicationManager()
    application_date = models.DateTimeField("date applied")
    benefits = models.TextField(blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    pay = models.CharField(max_length=100, blank=True)
    position_title = models.CharField(max_length=200)
    posting_url = models.URLField(blank=True, null=True, max_length=500)
    resume_used = models.ForeignKey(Resume, on_delete=models.SET_NULL, null=True, blank=True)
    requirements = models.TextField(blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED
    )

    class Meta:
        ordering = ['-application_date']

    def __str__(self):
        return f"{self.position_title} at {self.company} ({self.status})"

    def is_active(self):
        return self.status in [
            self.ApplicationStatus.APPLIED,
            self.ApplicationStatus.INTERVIEWING
        ]

    def days_since_applied(self):
        delta = timezone.now() - self.application_date
        return delta.days

    def has_offer(self):
        return self.status == self.ApplicationStatus.OFFERED
    
    def save(self, *args, **kwargs):
        if self.pk:
            # Fetch the previous version
            previous = Application.objects.get(pk=self.pk)
            if previous.status != self.status:
                ApplicationStatusHistory.objects.create(
                    application=self,
                    old_status=previous.status,
                    new_status=self.status
                )
        else:
            # First time created — log initial status
            ApplicationStatusHistory.objects.create(
                application=self,
                old_status=None,
                new_status=self.status
            )

        super().save(*args, **kwargs)


