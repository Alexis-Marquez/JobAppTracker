import { z } from 'zod';
import {api} from "@/lib/api/api-client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { MutationConfig } from '@/lib/react-query';
import {getApplicationsQueryOptions} from "@/features/applications/api/get_applications";
import {Application} from "@/types/api";
export const createApplicationInputSchema = z.object({
    position_title: z.string().min(1, "Position is required"),
    company_data: z.object({company_name: z.string().min(1, "CompanyName is required"), company_website: z.union([z.literal(""), z.string().url()]).optional()}),
    location_data: z.object({city: z.string().min(1), state: z.string().min(1).optional(), country: z.string().min(1).optional(), location_type: z.enum(["ONSITE", "REMOTE","HYBRID"])}),
    application_date: z.date().min(new Date(0), "Date is required"),
    status: z.enum(["applied", "interview", "offer", "rejected"]).optional(),
    description: z.string().optional()
});
export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

export const createApplication = ({data,}: {
    data: CreateApplicationInput;
}): Promise<Application> => {
    return api.post('/api/applications', data);
};

type UseCreateApplicationOptions = {
    mutationConfig?: MutationConfig<typeof createApplication>;
};

export const useCreateApplication = ({ mutationConfig }: UseCreateApplicationOptions) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        mutationFn: createApplication,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({
                queryKey: getApplicationsQueryOptions().queryKey,
            });
            onSuccess?.(...args);
        },
        ...restConfig,
    });
};
