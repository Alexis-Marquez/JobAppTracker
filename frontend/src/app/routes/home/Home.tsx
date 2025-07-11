import {useAuth} from "@/lib/auth";

import { useState } from "react";
import { useApplicationsQuery } from "@/features/applications/api/get_applications";
import {Application} from "@/types/api";

export const Home = () => {
    const [filters, setFilters] = useState<{ status?: string; page?: number }>({
        status: undefined,
        page: 1,
    });

    const { data, isLoading, isError } = useApplicationsQuery(filters);

    if (isLoading) return <p>Loading applications...</p>;
    if (isError) return <p>Failed to load applications.</p>;

    return (
        <div className="space-y-4 max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-semibold">Job Applications</h2>

            <div className="flex gap-4">
                <select
                    value={filters.status || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, status: e.target.value || undefined }))
                    }
                    className="border p-2"
                >
                    <option value="">All</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                </select>

                <button
                    onClick={() =>
                        setFilters((prev) => ({ ...prev, page: Math.max((prev.page || 1) - 1, 1) }))
                    }
                    disabled={(filters.page || 1) === 1}
                    className="border px-2 py-1"
                >
                    Prev
                </button>

                <button
                    onClick={() =>
                        setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
                    }
                    className="border px-2 py-1"
                >
                    Next
                </button>
            </div>

            <ul className="divide-y">
                {data?.results.map((app:Application) => (
                    <li key={app.id} className="py-3">
                        <div className="font-semibold">{app.position_title}</div>
                        <div className="text-gray-600">{app.company.name}</div>
                        <div className="text-sm text-gray-500">Status: {app.status}</div>
                    </li>
                ))}
            </ul>

            <p className="text-sm text-gray-500">Page: {filters.page}</p>
        </div>
    );
};
