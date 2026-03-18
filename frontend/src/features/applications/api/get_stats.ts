import { api } from '@/lib/api/api';
import { ApplicationsFilters, ApplicationsStats } from "@/types/api";
import { useQuery } from "@tanstack/react-query";



export const getStats = async (
  filters: ApplicationsFilters
): Promise<ApplicationsStats> => {
  return await api.get<any, ApplicationsStats>(
    '/applications/stats',
    { params: filters }
  );
};

export const getApplicationsStatsQueryOptions = (filters: ApplicationsFilters) => ({
    queryKey: ['applications','stats', filters],
    queryFn: () => getStats(filters),
    retry: true,
});

export const useApplicationsStatusQuery = (filters: ApplicationsFilters) => {
    return useQuery(getApplicationsStatsQueryOptions(filters));
};