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

            <section className="application-list-history-section">
                {app.history && app.history.length > 0 ? (
                    <>
                        <h3 className="timeline-title">Timeline</h3>

                        <ul className="application-history-list timeline">
                            {app.history.map((entry, index) => (
                                <li key={index} className="application-history-item timeline-item">
                                    <div
                                        className={
                                            "timeline-dot " + entry.new_status.toLowerCase()
                                        }
                                    />

                                    <div className="timeline-content">
                                        {entry.old_status === null ? (
                                            <>
                                            <span className="history-timestamp">
                                                {new Date(entry.changed_at).toLocaleDateString()}
                                            </span>

                                            <span className="history-status-change">
                                                Application created with status{" "}
                                                <strong>{entry.new_status}</strong>
                                            </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="history-timestamp">
                                                    {new Date(entry.changed_at).toLocaleDateString()}
                                                </span>

                                                <span className="history-status-change">
                                                    Status changed from{" "}
                                                    <strong>{entry.old_status}</strong> to{" "}
                                                    <strong>{entry.new_status}</strong>
                                                </span>
                                            </>
                                        )}
                                    </div>
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
