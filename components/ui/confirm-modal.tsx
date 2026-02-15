"use client";

import { X } from "lucide-react";
import Button from "@/components/ui/button";

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border-500">
          <h2 className="text-lg font-semibold text-secondary-500">{title}</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-base text-neutral-500">{message}</p>
        </div>
        <div className="flex items-center justify-end gap-4 p-6 border-t border-border-500">
          <Button
            variant="outline"
            className="border border-neutral-500 px-6 py-3"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            className="px-6 py-3"
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
