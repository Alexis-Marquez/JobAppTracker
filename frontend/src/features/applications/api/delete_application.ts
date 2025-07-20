import { api } from "@/lib/api/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteApplication = async ( id : number) => {
    const response = await api.delete(`/applications/${id}/`);
    return response.data;
};

export const useDeleteApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["applications"]});
        },
    });
};
