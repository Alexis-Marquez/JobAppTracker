import {api} from '@/lib/api/api-client';
import {GetApplicationsResponse} from "@/types/api";

export const getApplicationsQueryOptions = () => ({
    queryKey: ['applications'],
    queryFn: async () => {
        return await api.get<GetApplicationsResponse>('/api/applications');
    },
});
