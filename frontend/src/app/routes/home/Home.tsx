import { useState } from "react";
import { useApplicationsQuery } from "@/features/applications/api/get_applications";
import { ApplicationList } from "@/app/routes/home/components/ApplicationList";
import { Navbar } from "@/app/routes/home/components/Navbar";
import { ApplicationsFilters } from "@/types/api";
import FullScreenLoader from "@/components/FullScreenLoader";

export const Home = () => {
    const [filters, setFilters] = useState<ApplicationsFilters>({
        status: undefined,
        search: undefined,
        page: 1,
    });

    const { data, isLoading, isError } = useApplicationsQuery(filters);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (isError) {
        return <div>Error loading applications.</div>;
    }

    return (
        <div className="container-page">
            <Navbar />
            <ApplicationList data={data} filters={filters} setFilters={setFilters} />
        </div>
    );
};