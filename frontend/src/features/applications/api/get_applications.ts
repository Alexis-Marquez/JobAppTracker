import { api } from '@/lib/api/api-client';
import { ApplicationsFilters, GetApplicationsResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";



export const getApplications = async (filters: ApplicationsFilters) => {
    const response = await api.get<GetApplicationsResponse>('/applications', {
        params: filters,
    });
    return response;
};

export const getApplicationsQueryOptions = (filters: ApplicationsFilters) => ({
    queryKey: ['applications', filters],
    queryFn: () => getApplications(filters),
    retry: true,
});

export const useApplicationsQuery = (filters: ApplicationsFilters) => {
    return useQuery(getApplicationsQueryOptions(filters));
};