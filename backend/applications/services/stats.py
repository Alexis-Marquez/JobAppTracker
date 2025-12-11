from django.utils import timezone

def get_application_stats(user):
    from applications.models import Application

    qs = Application.objects.filter(user=user)
    total = qs.count()

    rejected = qs.filter(status=Application.ApplicationStatus.REJECTED).count()
    interviewing = qs.filter(status=Application.ApplicationStatus.INTERVIEWING).count()
    older_than_30 = qs.filter(status=Application.ApplicationStatus.APPLIED,
        application_date__lt=timezone.now() - timezone.timedelta(days=30)
    ).count()

    return {
        "total": total,
        "rejected_percentage": rejected / total * 100 if total else 0,
        "interviewing": interviewing,
        "older_than_30_days_and_in_applied": older_than_30,
    }
