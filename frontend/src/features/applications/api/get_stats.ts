import { api } from '@/lib/api/api-client';
import { ApplicationsFilters, ApplicationsStats } from "@/types/api";
import { useQuery } from "@tanstack/react-query";



export const getStats = async (filters: ApplicationsFilters) => {
    const response = await api.get<ApplicationsStats>('/applications/stats', {
        params: filters,
    });
    return response;
};

export const getApplicationsStatsQueryOptions = (filters: ApplicationsFilters) => ({
    queryKey: ['applications','stats', filters],
    queryFn: () => getStats(filters),
    retry: true,
});

export const useApplicationsStatusQuery = (filters: ApplicationsFilters) => {
    return useQuery(getApplicationsStatsQueryOptions(filters));
};