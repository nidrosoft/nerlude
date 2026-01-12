"use client";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: "file" | "folder";
    isDeleting?: boolean;
}

const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemName, 
    itemType,
    isDeleting = false 
}: DeleteConfirmModalProps) => {
    return (
        <Modal classWrapper="!max-w-md !p-6" open={isOpen} onClose={onClose}>
            <div className="text-center">
                {/* Warning Icon */}
                <div className="flex items-center justify-center size-16 rounded-full bg-red-100 mx-auto mb-4">
                    <Icon className="!w-8 !h-8 fill-red-500" name="trash" />
                </div>
                
                {/* Title */}
                <h3 className="text-h4 text-t-primary mb-2">
                    Delete {itemType === "folder" ? "Folder" : "File"}?
                </h3>
                
                {/* Description */}
                <p className="text-body text-t-secondary mb-6">
                    Are you sure you want to delete <span className="font-semibold text-t-primary">"{itemName}"</span>?
                    {itemType === "folder" && " All assets inside this folder will also be deleted."}
                    {" "}This action cannot be undone.
                </p>
                
                {/* Actions */}
                <div className="flex gap-3">
                    <Button 
                        className="flex-1" 
                        isStroke 
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        className="flex-1 !bg-red-500 hover:!bg-red-600 !border-red-500"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmModal;
