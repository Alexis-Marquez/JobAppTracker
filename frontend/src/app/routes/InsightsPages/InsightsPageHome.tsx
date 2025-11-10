import { useState } from "react";
import { Navbar } from "../home/components/Navbar";
import { ApplicationsFilters } from "@/types/api";
import { useApplicationsQuery } from "@/features/applications/api/get_applications";
import FullScreenLoader from "@/components/FullScreenLoader";

export function InsightsPageHome(){
     const [filters, setFilters] = useState<ApplicationsFilters>({
            status: undefined,
            search: undefined,
            page: 1,
        });
    
        const { data, isLoading, isError } = useApplicationsQuery(filters);

        if (isLoading) return <FullScreenLoader></FullScreenLoader>;


    return(
        <div className="container-page">
            <Navbar></Navbar>
            <h1>Insights</h1>
            <div>Total Applications: {data?.count}</div>
        </div>

    )
}
