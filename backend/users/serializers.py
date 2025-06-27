from rest_framework import serializers

from applications.models import Application
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    applications = serializers.PrimaryKeyRelatedField(many=True, queryset=Application.objects.all())
    class Meta:
        model = CustomUser
        fields = '__all__'
        # fields = ['id', 'application_date', 'benefits', ..., 'is_active', 'days_since_applied']
from rest_framework import serializers
from users.models import CustomUser

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
