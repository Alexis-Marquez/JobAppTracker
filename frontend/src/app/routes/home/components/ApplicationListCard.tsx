import {StatusButton} from "@/app/routes/home/components/StatusButton";
import {DeleteApplicationButton} from "@/app/routes/home/components/DeleteApplicationButton";
import {ApplicationListDetailedView} from "@/app/routes/home/components/ApplicationListDetailedView";
import {Application} from "@/types/api";
import {useState} from "react";
import "../styles.css";

type Props = {
    app: Application
}

export function ApplicationListCard ({app}: Props){
    const [open, setOpen] = useState(false);

    function toggleDetail() {
    setOpen(v => !v);
}

    return(
        <div className="application-list-item-card">
            <div className="application-list-content">
                <section className="application-list-item-section">
                    <StatusButton id={app.id} currentStatus={app.status || ""} />
                    <div className="application-days-since">Applied {app.days_since_applied} days ago</div>
                </section>
                <section className="application-list-item-section">
                    <div className="application-position-title">
                        {app.posting_url && (
                <div className="application-link">
                    <a href={app.posting_url} target="_blank" rel="noopener noreferrer">
                        {app.position_title}
                    </a>
                </div>
            )}
                        {!app.posting_url && (
                            <span>{app.position_title}</span>
                        )}
                        </div>
                    <div className="application-company-name">{app.company.name}</div>
                    <div className="application-location">{app.location.location_type}</div>
                </section>
                <button className="edit-button">✎</button>
                <DeleteApplicationButton app_id={app.id}></DeleteApplicationButton>
            </div>
            <div className="application-footer">
                <button className="detailed-view" onClick={toggleDetail}>
                    {open ? "^" : "v"}
                </button>
            </div>
                <div className={`detailed-view-animated ${open ? "open" : ""}`}>
                    <ApplicationListDetailedView
                        setDetailedView={toggleDetail}
                        app={app}
                    />
                </div>
        </div>
    )
}