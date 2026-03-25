"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "确定",
  cancelText = "取消",
  confirmVariant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="glass-card border-none p-6 sm:max-w-[420px]"
      >
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription>{t(description)}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t(cancelText)}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {t(confirmText)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
