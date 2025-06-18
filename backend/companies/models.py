from django.db import models

from locations.models import Location


class Company(models.Model):
    industry = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    website = models.URLField(blank=True)

    def __str__(self):
        return self.name
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'website'],
                name='unique_company'
            )
        ]
    def has_website(self):
        return bool(self.website)

    def short_notes(self, char_limit=100):
        if len(self.notes) > char_limit:
            return f"{self.notes[:char_limit]}..."
        return self.notes

    def is_in_industry(self, industry_name):
        return self.industry.lower() == industry_name.lower()