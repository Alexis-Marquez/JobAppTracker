from rest_framework import serializers

from applications.models import Application
from interviews.models import Interview


class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Interview
        fields = '__all__'
        # fields = ['id', 'application_date', 'benefits', ..., 'is_active', 'days_since_applied']
