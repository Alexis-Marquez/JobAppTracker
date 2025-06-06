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

    def get_headquarters_city(self):
        return self.headquarters_location.city if self.headquarters_location else "No headquarters location set"

    def has_website(self):
        return bool(self.website)

    def short_notes(self, char_limit=100):
        if len(self.notes) > char_limit:
            return f"{self.notes[:char_limit]}..."
        return self.notes

    def is_in_industry(self, industry_name):
        return self.industry.lower() == industry_name.lower()