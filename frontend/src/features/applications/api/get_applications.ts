import {api} from '@/lib/api/api-client';

export const getApplicationsQueryOptions = () => ({
    queryKey: ['applications'],
    queryFn: async () => {
        return await api.get('/api/applications');
    },
});
