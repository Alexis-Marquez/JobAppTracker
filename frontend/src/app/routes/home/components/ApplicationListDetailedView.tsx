import {Application} from "@/types/api";

type Props = {
    setDetailedView:(value:boolean) => void,
    app: Application
}
export function ApplicationListDetailedView ({app}: Props){
    return(
        <div className="additional-fields">
            <section className="application-list-item-section">
                <div className="application-resume-used">{app.resume_used}</div>
                <div className="application-benefits">{app.benefits}</div>
                <div className="application-pay">{app.pay}</div>
            </section>
            <div className="application-description">{app.description}</div>
            <div className="application-requirements">{app.requirements}</div>
        </div>
    )
}