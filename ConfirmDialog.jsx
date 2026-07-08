import React from "react";
import { TriangleAlert } from "lucide-react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(5,6,8,0.7)" }}>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <div className="mb-2 flex items-center gap-2">
          <TriangleAlert size={20} color="#E4574F" />
          <h3 className="text-base font-bold text-paper">{title}</h3>
        </div>
        <p className="mb-5 text-sm text-muted">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg bg-surfaceAlt px-4 py-2 text-sm font-medium text-paper">
            إلغاء
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white">
            تأكيد الحذف
          </button>
        </div>
      </div>
    </div>
  );
}
