import { Application } from "@/types/api";
import "../components/ApplicationListDetailedView.css";
import { capitalizeFirstLetter } from "@/lib/functions/helperFuncs";

type Props = {
    setDetailedView: (value: boolean) => void;
    app: Application;
};

export function ApplicationListDetailedView({ app }: Props) {
    return (
        <div className="additional-fields">
             {app.posting_url && (
                <div className="application-link">
                    <a href={app.posting_url} target="_blank" rel="noopener noreferrer">
                        Posting URL
                    </a>
                </div>
            )}
            <section className="application-list-history-section">
                {app.history && app.history.length > 0 ? (
                    <>
                        <h3 className="timeline-title">Timeline</h3>
                        <ul className="application-history-list">
                            {app.history.map((entry, index) => (
                                <li key={index} className="application-history-item">
                                    {entry.old_status === null ? (
                                        <div className="application-history-item-box">
                                        <span className="history-timestamp">
                                            {capitalizeFirstLetter(entry.new_status)} on{" "}
                                            {new Date(entry.changed_at).toLocaleDateString()}
                                        </span>
                                        </div>
                                    ) : (
                                        <div className="application-history-item-box">
                                            <span className="history-timestamp">
                                                {new Date(entry.changed_at).toLocaleDateString()}
                                            </span>
                                            :
                                            <span className="history-status-change">
                                                {" "}
                                                Status changed from{" "}
                                                {entry.old_status} to{" "}
                                                {entry.new_status}
                                            </span>
                                            </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p>No history available.</p>
                )}
            </section>
        </div>
    );
}
