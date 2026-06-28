"use client";
import React from "react";
import Button from "../../button/Button";
 import { Modal } from "../index";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  className = "max-w-2xl",
  children,
}) => {
  const footer = (
   <>
    <Button
      key="cancel"
      type="button"
      form="modal-form"
      variant="outline"
      size="sm"
      onClick={onClose}
      disabled={isSubmitting}
    >
      {cancelLabel}
    </Button>
    <Button
      key="submit"
      type="submit"
      form="modal-form"
      size="sm"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Saving...
        </span>
      ) : (
        submitLabel
      )}
    </Button>
  </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className={className}
      footer={footer}
    >
      <form
      autoComplete="off"
        id="modal-form"
        onSubmit={onSubmit}
        // footer buttons are outside the form tag so we wire submit via form id on the button
      >
<div className="grid  gap-5">
  {React.Children.toArray(children)}
</div>      </form>
    </Modal>
  );
};