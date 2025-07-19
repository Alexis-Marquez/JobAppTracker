import { api } from "@/lib/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateStatusInput = {
    id: number;
    status: string;
};

export const updateApplicationStatus = async ({ id, status }: UpdateStatusInput) => {
    const response = await api.patch(`/applications/${id}/`, { status });
    return response.data;
};

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateApplicationStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["applications"]});
        },
    });
};
