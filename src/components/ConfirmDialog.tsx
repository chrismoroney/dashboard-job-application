"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-slate-900/95 text-white ring-1 ring-white/10 shadow-2xl p-6 space-y-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              {description && <p className="text-sm text-slate-300">{description}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onCancel}
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="rounded-full px-4 py-2 text-sm font-semibold bg-rose-500 text-white hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
