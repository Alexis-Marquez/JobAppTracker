from rest_framework import serializers

from applications.models import Application
from locations.models import Location


class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = '__all__'