from rest_framework import serializers

from applications.models import Application
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    applications = serializers.PrimaryKeyRelatedField(many=True, queryset=Application.objects.all())
    class Meta:
        model = CustomUser
        fields = '__all__'
        # fields = ['id', 'application_date', 'benefits', ..., 'is_active', 'days_since_applied']
