from django.db import models
class Location(models.Model):
    class LocationType(models.TextChoices):
        ONSITE = 'onsite', 'On-site'
        REMOTE = 'remote', 'Remote'
        HYBRID = 'hybrid', 'Hybrid'

    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='United States')
    location_type = models.CharField(
        max_length=10,
        choices=LocationType.choices,
        default=LocationType.ONSITE
    )
    state = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.city}, {self.country} ({self.get_location_type_display()})"

