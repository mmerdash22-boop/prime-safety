import React, { useEffect, useMemo, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  Users,
  TrendingUp,
  Wallet,
  Receipt,
  Award,
  Search,
  Pencil,
  Trash2,
  Printer,
  Download,
  ChevronUp,
  ChevronDown,
  X,
  Save,
  ImageOff,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { money, certLabel, todayISO } from "../lib/helpers";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";
import PrintArea from "../components/PrintArea";

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: tint.bg }}>
        <Icon size={22} color={tint.fg} />
      </div>
      <div>
        <div className="text-xs font-medium text-muted">{label}</div>
        <div className="text-xl font-bold text-paper">{value}</div>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ["قيد المراجعة", "مؤكد", "مكتمل"];
const statusTint = (s) =>
  s === "مكتمل" ? { bg: "rgba(47,190,107,0.15)", fg: "#2FBE6B" } : s === "مؤكد" ? { bg: "rgba(217,166,46,0.15)", fg: "#D9A62E" } : { bg: "rgba(139,148,163,0.15)", fg: "#8B94A3" };

function EditModal({ row, courses, onClose, onSaved, notify }) {
  const [paid, setPaid] = useState(row.paid);
  const [status, setStatus] = useState(row.status);
  const [saving, setSaving] = useState(false);
  const [idUrl, setIdUrl] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(null);

  useEffect(() => {
    (async () => {
      if (row.id_image_path) {
        const { data } = await supabase.storage.from("attachments").createSignedUrl(row.id_image_path, 300);
        if (data) setIdUrl(data.signedUrl);
      }
      if (row.receipt_image_path) {
        const { data } = await supabase.storage.from("attachments").createSignedUrl(row.receipt_image_path, 300);
        if (data) setReceiptUrl(data.signedUrl);
      }
    })();
  }, [row]);

  async function save() {
    setSaving(true);
    const { error } = await supabase.from("enrollments").update({ paid: Number(paid) || 0, status }).eq("id", row.id);
    setSaving(false);
    if (error) {
      notify("تعذر حفظ التعديل", "error");
      return;
    }
    notify("تم تحديث السجل");
    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4" style={{ background: "rgba(5,6,8,0.75)" }}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-paper">{row.name_ar}</h3>
          <button onClick={onClose} className="text-muted hover:text-paper">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-ink p-3">
            <div className="text-xs text-muted">الشهادة</div>
            <div className="font-bold text-gold">{certLabel(row, courses)}</div>
          </div>
          <div className="rounded-lg bg-ink p-3">
            <div className="text-xs text-muted">الرسوم الكلية</div>
            <div className="font-bold text-paper">{money(row.fees)}</div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-silver">المدفوع</span>
            <input type="number" className="rounded-lg border border-border bg-ink px-3 py-2 text-paper" value={paid} onChange={(e) => setPaid(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-silver">حالة الطلب</span>
            <select className="rounded-lg border border-border bg-ink px-3 py-2 text-paper" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div>
            <div className="mb-1 text-xs text-muted">صورة البطاقة</div>
            {idUrl ? <img src={idUrl} alt="بطاقة" className="h-28 w-full rounded-lg border border-border object-cover" /> : <div className="flex h-28 items-center justify-center gap-1 rounded-lg border border-border text-xs text-muted"><ImageOff size={14} /> لا توجد صورة</div>}
          </div>
          <div>
            <div className="mb-1 text-xs text-muted">صورة الإيصال</div>
            {receiptUrl ? <img src={receiptUrl} alt="إيصال" className="h-28 w-full rounded-lg border border-border object-cover" /> : <div className="flex h-28 items-center justify-center gap-1 rounded-lg border border-border text-xs text-muted"><ImageOff size={14} /> لا توجد صورة</div>}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper">
            إلغاء
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2 text-sm font-bold text-ink disabled:opacity-60">
            <Save size={15} /> حفظ
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("reg_date");
  const [sortDir, setSortDir] = useState("desc");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [printTarget, setPrintTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: enrollments }, { data: courseRows }] = await Promise.all([
      supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
      supabase.from("courses").select("*").order("sort_order"),
    ]);
    setRows(enrollments || []);
    setCourses(courseRows || []);
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

  const totals = useMemo(() => {
    const totalFees = rows.reduce((s, r) => s + (Number(r.fees) || 0), 0);
    const totalPaid = rows.reduce((s, r) => s + (Number(r.paid) || 0), 0);
    return { count: rows.length, totalFees, totalPaid, totalRemaining: totalFees - totalPaid };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows;
    if (q) {
      list = list.filter(
        (r) => r.name_ar?.toLowerCase().includes(q) || r.name_en?.toLowerCase().includes(q) || r.national_id?.includes(q) || r.phone?.includes(q)
      );
    }
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (sortKey === "remaining") {
        va = (Number(a.fees) || 0) - (Number(a.paid) || 0);
        vb = (Number(b.fees) || 0) - (Number(b.paid) || 0);
      }
      if (typeof va === "string") return va.localeCompare(vb || "") * dir;
      return ((va || 0) - (vb || 0)) * dir;
    });
  }, [rows, query, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleDeleteConfirmed() {
    const { error } = await supabase.from("enrollments").delete().eq("id", confirmDelete.id);
    setConfirmDelete(null);
    if (error) {
      notify("تعذر حذف السجل", "error");
      return;
    }
    notify("تم حذف السجل");
    load();
  }

  function exportExcel() {
    const dataRows = filtered.map((r) => ({
      "الاسم بالعربية": r.name_ar,
      "الاسم بالإنجليزية": r.name_en,
      "الرقم القومي": r.national_id,
      السن: r.age,
      واتساب: r.whatsapp,
      الهاتف: r.phone,
      العنوان: r.address,
      "تاريخ التسجيل": r.reg_date,
      "بداية الكورس": r.course_start,
      "نهاية الكورس": r.course_end,
      الشهادة: certLabel(r, courses),
      الرسوم: r.fees,
      المدفوع: r.paid,
      المتبقي: (Number(r.fees) || 0) - (Number(r.paid) || 0),
      "طريقة الدفع": r.payment_method,
      الحالة: r.status,
      ملاحظات: r.notes,
    }));
    const ws = XLSX.utils.json_to_sheet(dataRows);
    ws["!cols"] = Object.keys(dataRows[0] || {}).map(() => ({ wch: 18 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "المتدربين");
    XLSX.writeFile(wb, `prime-safety-trainees_${todayISO()}.xlsx`);
  }

  const Th = ({ label, sortField }) => (
    <th
      onClick={() => sortField && toggleSort(sortField)}
      className={`px-4 py-3 text-right text-xs font-bold text-gold ${sortField ? "cursor-pointer select-none" : ""}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortField && sortKey === sortField && (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </span>
    </th>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 font-display text-2xl font-black text-paper">لوحة إدارة برايم سيفتي</h1>
      <p className="mb-6 text-sm text-muted">كل التسجيلات اللي بيرسلها الطلبة بتتجمع هنا في مكان واحد.</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="عدد المتدربين" value={totals.count} tint={{ bg: "rgba(217,166,46,0.15)", fg: "#D9A62E" }} />
        <StatCard icon={TrendingUp} label="إجمالي الرسوم" value={money(totals.totalFees)} tint={{ bg: "rgba(47,190,107,0.15)", fg: "#2FBE6B" }} />
        <StatCard icon={Wallet} label="إجمالي المدفوع" value={money(totals.totalPaid)} tint={{ bg: "rgba(47,190,107,0.15)", fg: "#2FBE6B" }} />
        <StatCard icon={Receipt} label="إجمالي المتبقي" value={money(totals.totalRemaining)} tint={{ bg: "rgba(226,166,59,0.15)", fg: "#E2A63B" }} />
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="w-full rounded-lg border border-border bg-ink py-2 pr-9 pl-3 text-sm text-paper outline-none"
              placeholder="بحث بالاسم أو الرقم القومي أو الهاتف..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">
              {filtered.length} من {rows.length} متدرب
            </span>
            <button onClick={exportExcel} disabled={!filtered.length} className="flex items-center gap-2 rounded-lg bg-success px-3 py-2 text-xs font-bold text-ink disabled:opacity-40">
              <Download size={14} /> تصدير Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-ink/60">
              <tr>
                <Th label="الاسم" sortField="name_ar" />
                <Th label="الرقم القومي" />
                <Th label="الهاتف" />
                <Th label="الشهادة" />
                <Th label="التسجيل" sortField="reg_date" />
                <Th label="الرسوم" sortField="fees" />
                <Th label="المدفوع" sortField="paid" />
                <Th label="المتبقي" sortField="remaining" />
                <Th label="الحالة" />
                <Th label="إجراءات" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted">
                    جاري تحميل البيانات...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted">
                    لا توجد نتائج مطابقة.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const rem = (Number(r.fees) || 0) - (Number(r.paid) || 0);
                  const tint = statusTint(r.status);
                  return (
                    <tr key={r.id} className="border-t border-border text-sm">
                      <td className="px-4 py-3 font-medium text-paper">{r.name_ar}</td>
                      <td className="px-4 py-3 text-silver" dir="ltr">
                        {r.national_id}
                      </td>
                      <td className="px-4 py-3 text-silver" dir="ltr">
                        {r.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold">{certLabel(r, courses)}</span>
                      </td>
                      <td className="px-4 py-3 text-silver">{r.reg_date}</td>
                      <td className="px-4 py-3 text-silver">{money(r.fees)}</td>
                      <td className="px-4 py-3 text-success">{money(r.paid)}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: rem > 0 ? "#E2A63B" : "#2FBE6B" }}>
                        {money(rem)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: tint.bg, color: tint.fg }}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setEditing(r)} className="rounded-lg bg-gold/10 p-2 text-gold" title="تعديل">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setPrintTarget(r)} className="rounded-lg bg-ink p-2 text-paper" title="طباعة">
                            <Printer size={14} />
                          </button>
                          <button onClick={() => setConfirmDelete(r)} className="rounded-lg bg-danger/10 p-2 text-danger" title="حذف">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <EditModal row={editing} courses={courses} onClose={() => setEditing(null)} onSaved={load} notify={notify} />}
      <ConfirmDialog
        open={!!confirmDelete}
        title="تأكيد الحذف"
        message={confirmDelete ? `هل أنت متأكد من حذف سجل "${confirmDelete.name_ar}"؟` : ""}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDelete(null)}
      />
      <Toast toast={toast} />
      <PrintArea enrollment={printTarget} courses={courses} />
    </div>
  );
}
