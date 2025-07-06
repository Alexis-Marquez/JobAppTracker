import { api } from '@/lib/api/api-client';

export const getApplicationsQueryOptions = () => ({
    queryKey: ['applications'],
    queryFn: async () => {
        const response = await api.get('/api/applications');
        return response.data;
    },
});
