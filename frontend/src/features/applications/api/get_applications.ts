import {api} from '@/lib/api/api-client';
import {GetApplicationsResponse} from "@/types/api";
import {useQuery} from "@tanstack/react-query";


export const getApplications = async (filters: { status?: string; page?: number }) => {
    return api.get<GetApplicationsResponse>('/applications', {
        params: filters,
    });
};

export const getApplicationsQueryOptions = (filters: { status?: string; page?: number }) => ({
    queryKey: ['applications', filters],
    queryFn: () => getApplications(filters),
    retry: true,
});

export const useApplicationsQuery = (filters: { status?: string; page?: number }) => {
    return useQuery(getApplicationsQueryOptions(filters));
};