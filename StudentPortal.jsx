import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Printer, ClipboardList, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import EnrollForm from "../components/EnrollForm";
import PrintArea from "../components/PrintArea";
import Toast from "../components/Toast";
import { money, certLabel } from "../lib/helpers";

const statusTint = (s) =>
  s === "مكتمل" ? { bg: "rgba(47,190,107,0.15)", fg: "#2FBE6B" } : s === "مؤكد" ? { bg: "rgba(217,166,46,0.15)", fg: "#D9A62E" } : { bg: "rgba(139,148,163,0.15)", fg: "#8B94A3" };

export default function StudentPortal() {
  const { profile } = useAuth();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get("course") ? "form" : "list");
  const [courses, setCourses] = useState([]);
  const [myRows, setMyRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printTarget, setPrintTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: courseRows }, { data: enrollments }] = await Promise.all([
      supabase.from("courses").select("*").order("sort_order"),
      supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
    ]);
    setCourses(courseRows || []);
    setMyRows(enrollments || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (printTarget) {
      const t = setTimeout(() => {
        window.print();
        setPrintTarget(null);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [printTarget]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-paper">أهلًا، {profile?.full_name || "بطل السيفتي"} 👋</h1>
          <p className="text-sm text-muted">تابع تسجيلاتك أو سجّل في كورس جديد.</p>
        </div>
        <div className="flex gap-2 rounded-xl border border-border bg-surface p-1">
          <button onClick={() => setTab("list")} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold ${tab === "list" ? "bg-gold text-ink" : "text-silver"}`}>
            <ClipboardList size={15} /> تسجيلاتي
          </button>
          <button onClick={() => setTab("form")} className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold ${tab === "form" ? "bg-gold text-ink" : "text-silver"}`}>
            <UserPlus size={15} /> تسجيل جديد
          </button>
        </div>
      </div>

      {tab === "form" && (
        <EnrollForm
          courses={courses}
          defaultCourse={params.get("course") || ""}
          notify={notify}
          onSaved={() => {
            load();
            setTab("list");
          }}
        />
      )}

      {tab === "list" &&
        (loading ? (
          <div className="py-16 text-center text-sm text-muted">جاري التحميل...</div>
        ) : myRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="mb-4 text-sm text-muted">لسه مفيش أي تسجيل. ابدأ بتسجيل في أول كورس.</p>
            <button onClick={() => setTab("form")} className="rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-ink">
              تسجيل جديد
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myRows.map((r) => {
              const rem = (Number(r.fees) || 0) - (Number(r.paid) || 0);
              const tint = statusTint(r.status);
              return (
                <div key={r.id} className="rounded-2xl border border-border bg-surface p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-display text-lg font-bold text-paper">{certLabel(r, courses)}</div>
                      <div className="text-xs text-muted">تاريخ التسجيل: {r.reg_date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: tint.bg, color: tint.fg }}>
                        {r.status}
                      </span>
                      <button onClick={() => setPrintTarget(r)} className="rounded-lg bg-ink p-2 text-paper" title="طباعة الاستمارة">
                        <Printer size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <div className="text-xs text-muted">الرسوم</div>
                      <div className="font-bold text-paper">{money(r.fees)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">المدفوع</div>
                      <div className="font-bold text-success">{money(r.paid)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">المتبقي</div>
                      <div className="font-bold" style={{ color: rem > 0 ? "#E2A63B" : "#2FBE6B" }}>
                        {money(rem)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">طريقة الدفع</div>
                      <div className="font-bold text-silver">{r.payment_method}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      <Toast toast={toast} />
      <PrintArea enrollment={printTarget} courses={courses} />
    </div>
  );
}
