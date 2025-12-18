import { useState } from "react";
import { Navbar } from "../home/components/Navbar";
import { ApplicationsFilters } from "@/types/api";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useApplicationsStatusQuery } from "@/features/applications/api/get_stats";
import "./insightsHome.css"
import { MySankey } from "../landingPage/components/sankey";

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
            <div className="stats-container">
            <h1 className="stats-title">Stats</h1>
                <div className="banner-container">
                    <div className="stat-bubble">Total Applications: <b className="banner-number">{data?.total}</b></div>
                    <div className="stat-bubble">Rejected %: <b className="banner-number">{data?.rejected_percentage.toFixed(2)}</b></div>
                    <div className="stat-bubble">Interviewing: <b className="banner-number">{data?.interviewing}</b></div>
                    <div className="stat-bubble">Ghosted: <b className="banner-number">{data?.older_than_30_days_and_in_applied}</b></div>
                </div>
                <div className="sankey-container" style={{ height: "400px" }}>
                     {data?.sankey_data && <MySankey data={data.sankey_data} />}
                </div>
            </div>
        </div>

    )
}
