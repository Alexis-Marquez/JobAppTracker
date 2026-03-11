import { Application, ApplicationsFilters } from "@/types/api";
import PaginationControls from "@/components/PaginationControls";
import { AddApplicationSection } from "@/app/routes/home/components/AddApplicationSection";
import { ApplicationListCard } from "@/app/routes/home/components/ApplicationListCard";
import SearchBar from "./SearchBar";
import "../styles.css";

interface ApplicationListProps {
    data: any; // Replace 'any' with your actual API response type
    filters: ApplicationsFilters;
    setFilters: React.Dispatch<React.SetStateAction<ApplicationsFilters>>;
}

export const ApplicationList = ({ data, filters, setFilters }: ApplicationListProps) => {
    return (
        <div className="Application-list-container">
            <h2 className="Application-list-title">
                <div className="filter-selector">
                    <select
                        value={filters.status || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, status: e.target.value || undefined, page: 1 }))
                        }
                        className="filter-selector-select"
                    >
                        <option value="">All Job Applications</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offers</option>
                        <option value="rejected">Rejected</option>
                        <option value="failed_interview">Failed Interview</option>
                        <option value="withdrawn">Withdrawn</option>
                    </select>
                </div>
            </h2>
            
            <AddApplicationSection />
            
            <SearchBar onSearch={(search) =>
                setFilters((prev) => ({
                    ...prev,
                    search: search || undefined,
                    page: 1,
                }))
            } />

            <ul className="application-list">
                {data?.results.map((app: Application) => (
                    <li key={app.id} className="application-list-item">
                        <ApplicationListCard app={app} />
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