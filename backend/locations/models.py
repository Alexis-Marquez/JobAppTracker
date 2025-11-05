from django.db import models

class LocationManager(models.Manager):
    def remote(self):
        return self.filter(location_type=Location.LocationType.REMOTE)

    def onsite(self):
        return self.filter(location_type=Location.LocationType.ONSITE)

    def hybrid(self):
        return self.filter(location_type=Location.LocationType.HYBRID)

    def in_country(self, country):
        return self.filter(country=country)

    def in_state(self, state):
        return self.filter(state=state)


class Location(models.Model):
    class LocationType(models.TextChoices):
        ONSITE = 'onsite', 'On-site'
        REMOTE = 'remote', 'Remote'
        HYBRID = 'hybrid', 'Hybrid'

    objects = LocationManager()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='United States')
    location_type = models.CharField(
        max_length=10,
        choices=LocationType.choices,
        default=LocationType.ONSITE
    )
    state = models.CharField(max_length=100, blank=True)


    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['city', 'state', 'country','location_type'],
                name='unique_location'
            )
        ]

    def __str__(self):
        return f"{self.city}, {self.country} ({self.get_location_type_display()})"

    def is_remote(self):
        return self.location_type == self.LocationType.REMOTE

    def is_onsite_or_hybrid(self):
        return self.location_type in [self.LocationType.ONSITE, self.LocationType.HYBRID]
