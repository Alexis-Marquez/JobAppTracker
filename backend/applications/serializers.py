from django.utils import timezone
from rest_framework import serializers
from applications.models import Application, ApplicationStatusHistory
from companies.models import Company
from companies.serializers import CompanySerializer
from locations.models import Location
from locations.serializers import LocationSerializer
from resumes.models import Resume
from resumes.serializers import ResumeSerializer


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationStatusHistory
        fields = ['old_status', 'new_status', 'changed_at']


class ApplicationSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    resume_used = ResumeSerializer(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    history = ApplicationStatusHistorySerializer(many=True, read_only=True)
    company_data = serializers.JSONField(write_only=True, required=False)
    # FORMAT
    # {
    #     "company_data": {
    #         "name": "OpenAI",
    #         "website": "https://openai.com"
    #     },
    #     "location_data": {
    #         "city": "San Francisco",
    #         "state": "CA"
    #     },
    #     "resume_id": 2,
    #     "application_date": "2025-06-17T14:00:00Z",
    #     "benefits": "Remote-friendly, equity options"
    # }

    location_data = serializers.JSONField(write_only=True, required=False)
    resume_id = serializers.PrimaryKeyRelatedField(
        queryset=Resume.objects.all(), source='resume_used', write_only=True, required=False
    )

    is_active = serializers.SerializerMethodField()
    days_since_applied = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'

    def get_is_active(self, obj):
        return obj.is_active()


    def get_days_since_applied(self, obj):
        return obj.days_since_applied()

    def validate_company_data(self, value):
        if value is None or value == '':
            raise serializers.ValidationError("Company data cannot be empty.")
        if 'name' not in value:
            raise serializers.ValidationError("Company name cannot be empty.")
        return value

    def validate_location_data(self, value):
        if value is None or value == '':
            raise serializers.ValidationError("Location data cannot be empty.")
        if 'city' not in value:
            raise serializers.ValidationError("Location data cannot be empty.")
        return value

    def validate_application_date(self, value):
        if value > timezone.now():
            raise serializers.ValidationError("Application date cannot be in the future.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context missing.")
        company_data = validated_data.pop('company_data', None)
        location_data = validated_data.pop('location_data', None)
        application_date = validated_data.get('application_date')

        if application_date and application_date > timezone.now():
            raise serializers.ValidationError("Application date cannot be in the future.")

        if company_data:
            company_obj, _ = Company.objects.get_or_create(**company_data)
            validated_data['company'] = company_obj

        if location_data:
            location_obj, _ = Location.objects.get_or_create(**location_data)
            validated_data['location'] = location_obj

        validated_data['user'] = request.user
        return super().create(validated_data)
