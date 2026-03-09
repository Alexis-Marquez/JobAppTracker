from collections import defaultdict
from django.utils import timezone

from applications.models import Application

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
        "sankey_data": generate_sankey_data(qs)
    }


from collections import defaultdict
from applications.models import Application

def generate_sankey_data(queryset):
    transitions = defaultdict(int)
    stuck_counts = defaultdict(int)
    nodes = []
    links = []

    status_list = list(Application.ApplicationStatus.values)

    # Initialize counts
    for status in status_list:
        stuck_counts[status] = 0

    for app in queryset:
        history = list(app.history.order_by('changed_at'))

        if not history:
            # No history → still in progress if status is applied
            if app.status == "applied":
                stuck_counts[app.status] += 1
            continue

        # Count transitions
        for entry in history:
            if entry.old_status is None:
                continue
            if entry.old_status != entry.new_status:
                transitions[(entry.old_status, entry.new_status)] += 1

        # Only consider first history entry for stuck apps
        first_status = history[0].old_status or history[0].new_status
        if first_status == "applied" and history[0].old_status == None:
            stuck_counts[first_status] += 1

    # Build nodes
    for status in status_list:
        count = stuck_counts.get(status, 0)
        nodes.append({
            "id": status,
            "label": f"{status} ({count})" if count > 0 else status
        })

    # Add "Still in Progress" node if needed
    total_stuck = sum(stuck_counts.values())
    if total_stuck > 0:
        nodes.append({
            "id": "Still in Progress",
            "label": f"Still in Progress ({total_stuck})"
        })

        # Links from applied → Still in Progress
        for status, count in stuck_counts.items():
            if count > 0:
                links.append({
                    "source": status,
                    "target": "Still in Progress",
                    "value": count
                })

    # Add transition links
    for (source, target), value in transitions.items():
        links.append({
            "source": source,
            "target": target,
            "value": value
        })

    return {
        "nodes": nodes,
        "links": links
    }



