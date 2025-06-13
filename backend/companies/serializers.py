from rest_framework import serializers

from applications.models import Application
from companies.models import Company


class CompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = Company
        fields = ['name', 'website']
        # fields = ['id', 'application_date', 'benefits', ..., 'is_active', 'days_since_applied']