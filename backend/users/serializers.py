from rest_framework import serializers

from applications.models import Application
from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'id', 'first_name', 'last_name', 'email']
        # fields = [applications
        # date_joined
        # default_resume
        # email
        # first_name
        # groups
        # id
        # is_active
        # is_staff
        # is_superuser
        # last_login
        # last_name
        # notify_on_deadlines
        # password
        # preferred_timezone
        # user_permissions
        # username]
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
