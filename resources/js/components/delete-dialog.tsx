"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  itemLabel?: string; // optional extra context like the item's name
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
  onError,
  title = "Confirm Delete",
  description = "This action cannot be undone. This will permanently delete the selected item.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loadingLabel = "Deleting...",
  itemLabel,
}: DeleteDialogProps) {
  const [processing, setProcessing] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setProcessing(true);
      await onConfirm();
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      onError?.(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !processing && onOpenChange(o)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
            {itemLabel ? (
              <>
                {" "}
                <span className="font-medium">{itemLabel}</span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={processing}
          >
            {processing ? loadingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
