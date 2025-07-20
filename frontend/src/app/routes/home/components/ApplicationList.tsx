import {useState} from "react";
import {useApplicationsQuery} from "@/features/applications/api/get_applications";
import {Application} from "@/types/api";
import "../styles.css"
import FullScreenLoader from "@/components/FullScreenLoader";
import PaginationControls from "@/components/PaginationControls";
import {AddApplicationSection} from "@/app/routes/home/components/AddApplicationSection";
import {StatusButton} from "@/app/routes/home/components/StatusButton";
import {useUpdateApplicationStatus} from "@/features/applications/api/update_application";
import {useDeleteApplication} from "@/features/applications/api/delete_application";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import {DeleteApplicationButton} from "@/app/routes/home/components/DeleteApplicationButton";

export const ApplicationList= ()=>{

    const [filters, setFilters] = useState<{ status?: string; page?: number }>({
        status: undefined,
        page: 1,
    });

    const { data, isLoading, isError } = useApplicationsQuery(filters);
    const { mutate } = useUpdateApplicationStatus();

    if (isLoading) return <FullScreenLoader></FullScreenLoader>;

    return (
        <div className="Application-list-container">
            <h2 className="Application-list-title"> <div className="filter-selector">
                <select
                    value={filters.status || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, status: e.target.value || undefined, page: 1 }))
                    }
                    className="filter-selector-select"
                >
                    <option value="">All Job Applications</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interviewing</option>
                    <option value="offer">Offers</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div></h2>
            <AddApplicationSection></AddApplicationSection>
            <ul className="application-list">
                {data?.results.map((app:Application) => (
                    <li key={app.id} className="application-list-item">
                        <div className="application-list-item-card">
                            <section className="application-list-item-section">
                                <StatusButton id={app.id} currentStatus={app.status} />
                                <div className="application-days-since">Applied {app.days_since_applied} days ago</div>
                            </section>
                            <button className="detailed-view">View More</button>
                            <section className="application-list-item-section">
                                <div className="application-position-title">{app.position_title}</div>
                                <div className="application-company-name">{app.company.name}</div>
                                <div className="application-location">{app.location.location_type}</div>
                            </section>
                            <button className="edit-button">✎</button>
                            <DeleteApplicationButton app_id={app.id}></DeleteApplicationButton>
                        </div>
                    </li>
                ))}
            </ul>
                <PaginationControls
                    next={data?.next || null}
                    previous={data?.previous || null}
                    page={filters.page || 1}
                    onPageChange={(newPage) =>
                        setFilters((prev) => ({ ...prev, page: newPage }))
                    }
                />

            <p className="page-indicator">Page: {filters.page}</p>
        </div>
    );
};