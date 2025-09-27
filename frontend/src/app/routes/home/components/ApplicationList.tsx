import {useState} from "react";
import {useApplicationsQuery} from "@/features/applications/api/get_applications";
import {Application, ApplicationsFilters} from "@/types/api";
import "../styles.css"
import FullScreenLoader from "@/components/FullScreenLoader";
import PaginationControls from "@/components/PaginationControls";
import {AddApplicationSection} from "@/app/routes/home/components/AddApplicationSection";
import {useUpdateApplicationStatus} from "@/features/applications/api/update_application";
import {ApplicationListCard} from "@/app/routes/home/components/ApplicationListCard";
import SearchBar from "./SearchBar";

export const ApplicationList= ()=>{

    const [filters, setFilters] = useState<ApplicationsFilters>({
        status: undefined,
        search: undefined,
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
            <div>Total Number of Applications: {data?.count}</div>
            <SearchBar onSearch={(search) =>
                setFilters((prev) => ({
                ...prev,
                search: search || undefined,
                page: 1, 
                }))
            }></SearchBar>
            <ul className="application-list">
                {data?.results.map((app:Application) => (
                    <li key={app.id} className="application-list-item">
                       <ApplicationListCard app={app}></ApplicationListCard>
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