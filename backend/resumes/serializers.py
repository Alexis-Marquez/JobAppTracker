from rest_framework import serializers

from applications.models import Application
from resumes.models import Resume


class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = ['name']