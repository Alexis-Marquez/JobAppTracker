from django.test import TestCase
from locations.models import Location

class LocationModelTests(TestCase):
    def test_is_remote_true(self):
        loc = Location.objects.create(city="Austin", country="USA", location_type=Location.LocationType.REMOTE)
        self.assertTrue(loc.is_remote())

    def test_is_remote_false(self):
        loc = Location.objects.create(city="Austin", country="USA", location_type=Location.LocationType.ONSITE)
        self.assertFalse(loc.is_remote())

