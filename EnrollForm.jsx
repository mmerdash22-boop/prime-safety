import React, { useState, useRef } from "react";
import { Save, Upload, X, Users, Phone, Award, Wallet, CreditCard } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { PAYMENT_METHODS, paymentNote, money, todayISO, compressImage } from "../lib/helpers";

function Field({ label, required, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-silver">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-paper outline-none transition focus:border-gold focus:ring-1 focus:ring-gold";
const errCls = "border-danger";

function emptyForm(defaultCourse) {
  return {
    nameAr: "",
    nameEn: "",
    nationalId: "",
    age: "",
    whatsapp: "",
    phone: "",
    address: "",
    courseStart: "",
    courseEnd: "",
    certificateCode: defaultCourse || "",
    certificateCustom: "",
    fees: "",
    paid: "",
    paymentMethod: PAYMENT_METHODS[0].label,
    notes: "",
    idImageFile: null,
    receiptImageFile: null,
  };
}

export default function EnrollForm({ courses, defaultCourse, onSaved, notify }) {
  const { user, profile } = useAuth();
  const [form, setForm] = useState(emptyForm(defaultCourse));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const idRef = useRef(null);
  const receiptRef = useRef(null);

  const set = (key) => (e) => {
    const val = e && e.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: val }));
  };

  const remaining = (Number(form.fees) || 0) - (Number(form.paid) || 0);

  function validate() {
    const e = {};
    if (!form.nameAr.trim()) e.nameAr = true;
    if (!form.nationalId.trim()) e.nationalId = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.certificateCode) e.certificateCode = true;
    if (form.certificateCode === "OTHER" && !form.certificateCustom.trim()) e.certificateCustom = true;
    if (form.fees === "" || Number.isNaN(Number(form.fees))) e.fees = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function uploadImage(file, kind) {
    if (!file) return null;
    const blob = await compressImage(file);
    const path = `${user.id}/${kind}_${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("attachments").upload(path, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (error) throw error;
    return path;
  }

  async function submit(ev) {
    ev.preventDefault();
    if (!validate()) {
      notify("من فضلك استكمل الحقول المطلوبة", "error");
      return;
    }
    setSubmitting(true);
    try {
      const idImagePath = await uploadImage(form.idImageFile, "id");
      const receiptImagePath = await uploadImage(form.receiptImageFile, "receipt");

      const { error } = await supabase.from("enrollments").insert({
        user_id: user.id,
        name_ar: form.nameAr,
        name_en: form.nameEn,
        national_id: form.nationalId,
        age: form.age === "" ? null : Number(form.age),
        whatsapp: form.whatsapp,
        phone: form.phone,
        address: form.address,
        reg_date: todayISO(),
        course_start: form.courseStart || null,
        course_end: form.courseEnd || null,
        certificate_code: form.certificateCode,
        certificate_custom: form.certificateCode === "OTHER" ? form.certificateCustom : null,
        fees: Number(form.fees) || 0,
        paid: Number(form.paid) || 0,
        payment_method: form.paymentMethod,
        notes: form.notes,
        id_image_path: idImagePath,
        receipt_image_path: receiptImagePath,
      });
      if (error) throw error;

      notify("تم إرسال طلب التسجيل بنجاح، هيتم مراجعته من فريق برايم سيفتي");
      setForm(emptyForm(defaultCourse));
      onSaved && onSaved();
    } catch (err) {
      console.error(err);
      notify("حصل خطأ أثناء الإرسال، حاول مرة أخرى", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold">
          <Users size={16} /> البيانات الشخصية
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="الاسم بالعربية" required>
            <input className={`${inputCls} ${errors.nameAr ? errCls : ""}`} value={form.nameAr} onChange={set("nameAr")} placeholder="مثال: أحمد محمد علي" />
          </Field>
          <Field label="الاسم بالإنجليزية">
            <input className={inputCls} value={form.nameEn} onChange={set("nameEn")} dir="ltr" placeholder="Ahmed Mohamed Aly" />
          </Field>
          <Field label="الرقم القومي" required>
            <input className={`${inputCls} ${errors.nationalId ? errCls : ""}`} value={form.nationalId} onChange={set("nationalId")} maxLength={14} dir="ltr" placeholder="14 رقم" />
          </Field>
          <Field label="السن">
            <input type="number" min="0" className={inputCls} value={form.age} onChange={set("age")} />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold">
          <Phone size={16} /> بيانات التواصل
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="رقم الهاتف" required>
            <input className={`${inputCls} ${errors.phone ? errCls : ""}`} value={form.phone} onChange={set("phone")} dir="ltr" placeholder="01xxxxxxxxx" />
          </Field>
          <Field label="رقم الواتساب">
            <input className={inputCls} value={form.whatsapp} onChange={set("whatsapp")} dir="ltr" placeholder="01xxxxxxxxx" />
          </Field>
          <Field label="العنوان">
            <input className={inputCls} value={form.address} onChange={set("address")} placeholder="المحافظة / المدينة / الحي" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold">
          <Award size={16} /> الكورس والشهادة
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="تاريخ بداية الكورس">
            <input type="date" className={inputCls} value={form.courseStart} onChange={set("courseStart")} />
          </Field>
          <Field label="تاريخ نهاية الكورس">
            <input type="date" className={inputCls} value={form.courseEnd} onChange={set("courseEnd")} />
          </Field>
          <Field label="الشهادة المطلوبة" required>
            <select className={`${inputCls} ${errors.certificateCode ? errCls : ""}`} value={form.certificateCode} onChange={set("certificateCode")}>
              <option value="" disabled>
                اختر الشهادة
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
              <option value="OTHER">أخرى (اكتب الشهادة المطلوبة)</option>
            </select>
          </Field>
          {form.certificateCode === "OTHER" && (
            <Field label="اسم الشهادة المطلوبة" required>
              <input
                className={`${inputCls} ${errors.certificateCustom ? errCls : ""}`}
                value={form.certificateCustom}
                onChange={set("certificateCustom")}
                placeholder="اكتب اسم الشهادة اللي محتاج تحصل عليها"
              />
            </Field>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold">
          <Wallet size={16} /> الرسوم والمدفوعات
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Field label="الرسوم الكلية" required>
            <input type="number" min="0" className={`${inputCls} ${errors.fees ? errCls : ""}`} value={form.fees} onChange={set("fees")} />
          </Field>
          <Field label="المدفوع">
            <input type="number" min="0" className={inputCls} value={form.paid} onChange={set("paid")} />
          </Field>
          <Field label="المتبقي (تلقائي)">
            <input className={inputCls} style={{ fontWeight: 700, color: remaining > 0 ? "#E2A63B" : "#2FBE6B" }} value={money(remaining)} disabled />
          </Field>
          <Field label="طريقة الدفع" hint={paymentNote(form.paymentMethod) ? `الرقم: ${paymentNote(form.paymentMethod)}` : undefined}>
            <select className={inputCls} value={form.paymentMethod} onChange={set("paymentMethod")}>
              {PAYMENT_METHODS.map((p) => (
                <option key={p.label} value={p.label}>
                  {p.label}
                  {p.note ? ` — ${p.note}` : ""}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gold">
          <CreditCard size={16} /> المرفقات
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-medium text-silver">صورة البطاقة</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => idRef.current?.click()} className="flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-2 text-sm font-medium text-gold">
                <Upload size={15} /> رفع صورة
              </button>
              <input ref={idRef} type="file" accept="image/*" className="hidden" onChange={(e) => setForm((f) => ({ ...f, idImageFile: e.target.files?.[0] || null }))} />
              {form.idImageFile && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  {form.idImageFile.name.slice(0, 18)}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, idImageFile: null }))}>
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-silver">صورة إيصال الدفع</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => receiptRef.current?.click()} className="flex items-center gap-2 rounded-lg bg-gold/10 px-3 py-2 text-sm font-medium text-gold">
                <Upload size={15} /> رفع صورة
              </button>
              <input ref={receiptRef} type="file" accept="image/*" className="hidden" onChange={(e) => setForm((f) => ({ ...f, receiptImageFile: e.target.files?.[0] || null }))} />
              {form.receiptImageFile && (
                <span className="flex items-center gap-1 text-xs text-muted">
                  {form.receiptImageFile.name.slice(0, 18)}
                  <button type="button" onClick={() => setForm((f) => ({ ...f, receiptImageFile: null }))}>
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Field label="ملاحظات">
            <textarea className={inputCls} rows={3} value={form.notes} onChange={set("notes")} placeholder="أي ملاحظات إضافية..." />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-bold text-ink shadow-sm disabled:opacity-60"
        >
          <Save size={16} />
          {submitting ? "جاري الإرسال..." : "إرسال طلب التسجيل"}
        </button>
      </div>
    </form>
  );
}
