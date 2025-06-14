from rest_framework import serializers

from applications.models import Application
from companies.serializers import CompanySerializer
from locations.serializers import LocationSerializer
from resumes.serializers import ResumeSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    resume_used = ResumeSerializer(read_only=True)
    is_active = serializers.SerializerMethodField()
    days_since_applied = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'
        # fields = ['id', 'application_date', 'benefits', ..., 'is_active', 'days_since_applied']

    def get_is_active(self, obj):
        return obj.is_active()

    def get_days_since_applied(self, obj):
        return obj.days_since_applied()
