import {useState} from "react";
import {useApplicationsQuery} from "@/features/applications/api/get_applications";
import {Application} from "@/types/api";
import "../styles.css"
import FullScreenLoader from "@/components/FullScreenLoader";
import PaginationControls from "@/components/PaginationControls";

export const ApplicationList= ()=>{

    const [filters, setFilters] = useState<{ status?: string; page?: number }>({
        status: undefined,
        page: 1,
    });

    const { data, isLoading, isError } = useApplicationsQuery(filters);

    if (isLoading) return <FullScreenLoader></FullScreenLoader>;
    if (isError) return <p>Failed to load applications.</p>;

    return (
        <div className="space-y-4 max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-semibold">Job Applications</h2>

            <div className="filter-selector">
                <select
                    value={filters.status || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, status: e.target.value || undefined, page: 1 }))
                    }
                    className="filter-selector-select"
                >
                    <option value="">All</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>

                <PaginationControls
                    next={data?.next || null}
                    previous={data?.previous || null}
                    page={filters.page || 1}
                    onPageChange={(newPage) =>
                        setFilters((prev) => ({ ...prev, page: newPage }))
                    }
                />
            </div>


            <ul className="application-list">
                {data?.results.map((app:Application) => (
                    <li key={app.id} className="application-list-item">
                        <div className="application-position-title">{app.position_title}</div>
                        <div className="application-company-name">{app.company.name}</div>
                        <div className="application-status">Status: {app.status}</div>
                    </li>
                ))}
            </ul>

            <p className="page-indicator">Page: {filters.page}</p>
        </div>
    );
};