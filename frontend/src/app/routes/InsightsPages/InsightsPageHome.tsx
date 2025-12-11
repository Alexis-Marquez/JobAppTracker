import { useState } from "react";
import { Navbar } from "../home/components/Navbar";
import { ApplicationsFilters } from "@/types/api";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useApplicationsStatusQuery } from "@/features/applications/api/get_stats";
import "./insightsHome.css"

export function InsightsPageHome(){
     const [filters, setFilters] = useState<ApplicationsFilters>({
            status: undefined,
            search: undefined,
        });
    
        const { data, isLoading, isError } = useApplicationsStatusQuery(filters);

        if (isLoading) return <FullScreenLoader></FullScreenLoader>;


    return(
        <div className="container-page">
            <Navbar></Navbar>
            <h1>Insights</h1>
            <div>Total Applications: {data?.total}</div>
            <div>Rejected %: {data?.rejected_percentage}</div>
            <div>Interviewing: {data?.interviewing}</div>
            <div>Older than 30 days and in applied: {data?.older_than_30_days_and_in_applied}</div>
        </div>

    )
}
