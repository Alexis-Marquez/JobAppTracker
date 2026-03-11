import { useState } from "react";
import { useDeleteApplication } from "@/features/applications/api/delete_application";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import {Application} from "@/types/api";
import "../styles.css"
type Props = {
    app_id: number;
};

export const DeleteApplicationButton = ({app_id}: Props) => {
    const [showModal, setShowModal] = useState(false);
    const { mutate: deleteApp, isPending } = useDeleteApplication();

    const handleDelete = () => {
        deleteApp(app_id);
        setShowModal(false);
    };

    return (
        <>
            <button className="application-button" onClick={() => setShowModal(true)}>
                🗑️
            </button>

            <ConfirmDeleteModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
            />
        </>
    );
};
