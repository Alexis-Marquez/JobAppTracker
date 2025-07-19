import { z } from 'zod';
import {api} from "@/lib/api/api-client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {getApplicationsQueryOptions} from "@/features/applications/api/get_applications";
import {Application} from "@/types/api";
export const createApplicationInputSchema = z.object({
    position_title: z.string().min(1, "Position is required"),
    company_data: z.object({name: z.string().min(1, "Company name is required"), website: z.union([z.literal(""), z.string().url()]).optional()}),
    location_data: z.object({city: z.string().min(1, "City name is required"), state: z.string().min(1).optional(), country: z.string().min(1).optional(), location_type: z.enum(["ONSITE", "REMOTE","HYBRID"]).optional()}).optional(),
    application_date: z.date().min(new Date(0)),
    status: z.enum(["applied", "interview", "offer", "rejected"]).optional(),
    posting_url: z.string().url().optional(),
    description: z.string().optional()
});
export type CreateApplicationInput = z.infer<typeof createApplicationInputSchema>;

export const create_application = (data: CreateApplicationInput): Promise<Application> => {
    return api.post('/applications/', data);
};

export const useCreateApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateApplicationInput) => create_application(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['applications']}).then(r => (console.log(r)));
        }
    });
};
