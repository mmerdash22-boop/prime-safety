import React from "react";
import { CircleCheck, CircleAlert } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type !== "error";
  return (
    <div
      className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg"
      style={{ background: ok ? "#171A20" : "#3A1614", color: "#fff", border: `1px solid ${ok ? "#D9A62E" : "#E4574F"}` }}
    >
      {ok ? <CircleCheck size={18} color="#D9A62E" /> : <CircleAlert size={18} color="#E4574F" />}
      {toast.msg}
    </div>
  );
}
