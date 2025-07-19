import { useState } from "react";
import { useUpdateApplicationStatus } from "@/features/applications/api/update_application";

const STATUS_OPTIONS = ["applied", "interviewing", "offered", "rejected", "withdrawn", "accepted"] as const;
const statusColors: Record<string, string> = {
    applied: "#3B82F6",
    interviewing: "#F59E0B",
    offered: "#10B981",
    rejected: "#EF4444",
    withdrawn: "#838383",
    accepted: "#65f436"
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
            <button
                style={{ backgroundColor: statusColors[currentStatus], color: "white", border: "none", borderRadius: "6px", padding: "0.4rem 1rem", cursor: "pointer" }}
                onClick={() => setIsOpen(true)}
            >
                {currentStatus}
            </button>

            {isOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Update Status</h3>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <div className="modal-buttons">
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
