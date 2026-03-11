import { useApplicationsStatusQuery } from "@/features/applications/api/get_stats";
import { Navbar } from "../home/components/Navbar";
import { MySankey } from "../landingPage/components/sankey";
import FullScreenLoader from "@/components/FullScreenLoader";
import { ApplicationsFilters } from "@/types/api";
import { useState } from "react";
import "./InsightsHome.css";

export function InsightsPageHome() {
  const [filters] = useState<ApplicationsFilters>({
    status: undefined,
    search: undefined,
  });

  const { data, isLoading } = useApplicationsStatusQuery(filters);

  if (isLoading) return <FullScreenLoader />;

  return (
    <div className="container-page">
      <Navbar />
      <main className="insights-content">
        <header className="insights-header">
          <h1>Application Insights</h1>
        </header>

        <div className="stats-grid">
          <div className="stat-card total">
            <span>Total Applications</span>
            <b className="stat-number">{data?.total}</b>
          </div>
          <div className="stat-card rejected">
            <span>Rejected Rate</span>
            <b className="stat-number">{data?.rejected_percentage.toFixed(1)}%</b>
          </div>
          <div className="stat-card interviewing">
            <span>Interviewing</span>
            <b className="stat-number">{data?.interviewing}</b>
          </div>
          <div className="stat-card ghosted">
            <span>Ghosted</span>
            <b className="stat-number">{data?.older_than_30_days_and_in_applied}</b>
          </div>
        </div>

        <section className="chart-section">
          <h3>Application Pipeline Flow</h3>
          <div className="sankey-wrapper">
            {data?.sankey_data && <MySankey data={data.sankey_data} />}
          </div>
        </section>
      </main>
    </div>
  );
}