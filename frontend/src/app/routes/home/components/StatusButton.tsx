import { useState } from "react";
import { useUpdateApplicationStatus } from "@/features/applications/api/update_application";
import "./StatusButton.css"
import {capitalizeFirstLetter} from "@/lib/functions/helperFuncs"

const STATUS_OPTIONS = ["applied", "interviewing", "offered", "rejected", "withdrawn", "accepted"] as const;
const statusColors: Record<string, string> = {
    applied: "#9ebcf3",
    interviewing: "#f4cc8c",
    offered: "#6fae94",
    rejected: "#e89c9c",
    withdrawn: "#838383",
    accepted: "#bbf3a8"
};

export function StatusButton({ id, currentStatus }: { id: number; currentStatus: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [newStatus, setNewStatus] = useState(currentStatus);
    const { mutate, isPending } = useUpdateApplicationStatus();

    const handleSave = () => {
        mutate(
            { id, status: newStatus },
            { onSuccess: () => setIsOpen(false) }
        );
    };

    return (
        <>
            <button className="status-button"
                style={{ backgroundColor: statusColors[currentStatus]}}
                onClick={() => setIsOpen(true)}
            >
                {capitalizeFirstLetter(currentStatus)}
            </button>

            {isOpen && (
                <div className="modal-backdrop">
                    <div className="status-button-modal">
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="filter-selector-select"
                            style={{backgroundColor: statusColors[newStatus]}}
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status} style={{backgroundColor: "var(--color-white)", color:"var(--color-primary-dark"}}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <div className="modal-status-buttons">
                            <button onClick={() => setIsOpen(false)}>Cancel</button>
                            <button onClick={handleSave} disabled={isPending}>
                                {isPending ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
