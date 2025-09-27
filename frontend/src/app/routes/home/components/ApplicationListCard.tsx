import {StatusButton} from "@/app/routes/home/components/StatusButton";
import {DeleteApplicationButton} from "@/app/routes/home/components/DeleteApplicationButton";
import {ApplicationListDetailedView} from "@/app/routes/home/components/ApplicationListDetailedView";
import {Application} from "@/types/api";
import {useState} from "react";

type Props = {
    app: Application
}

export function ApplicationListCard ({app}: Props){
    const [detailedView, setDetailedView] = useState(false);
    return(
        <div className="application-list-item-card">
            <div className="application-list-content">
                <section className="application-list-item-section">
                    <StatusButton id={app.id} currentStatus={app.status || ""} />
                    <div className="application-days-since">Applied {app.days_since_applied} days ago</div>
                </section>
                <section className="application-list-item-section">
                    <div className="application-position-title">{app.position_title}</div>
                    <div className="application-company-name">{app.company.name}</div>
                    <div className="application-location">{app.location.location_type}</div>
                </section>
                <button className="edit-button">✎</button>
                <DeleteApplicationButton app_id={app.id}></DeleteApplicationButton>
            </div>
            <div className="application-footer">
                <button className="detailed-view" onClick={()=>{setDetailedView(!detailedView)}}>Detailed View</button>
            </div>
            {detailedView &&
                <ApplicationListDetailedView setDetailedView={setDetailedView} app={app}></ApplicationListDetailedView>
            }
        </div>
    )
}