import React from "react";
import ReactDOM from "react-dom";
import "./ConfirmDeleteModal.css";

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    app_id?: number;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          onConfirm,
                                                                          app_id
                                                                      }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal">
                <h2>Delete Application?</h2>
                <p>This action cannot be undone.</p>
                <div className="modal-buttons">
                    <button className="button danger" onClick={onConfirm}>
                        Yes, delete
                    </button>
                    <button className="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById("modal-root")! // ⬅️ this must exist in your HTML
    );
};
