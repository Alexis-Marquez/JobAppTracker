from django.db import models

from locations.models import Location


class Company(models.Model):
    headquarters_location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=255, unique=True)
    notes = models.TextField(blank=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.name

