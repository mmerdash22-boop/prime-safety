import React from "react";
import logo from "../assets/logo.png";
import { money, paymentNote, todayISO, certLabel } from "../lib/helpers";

export default function PrintArea({ enrollment, courses }) {
  if (!enrollment) return null;
  const remaining = (Number(enrollment.fees) || 0) - (Number(enrollment.paid) || 0);
  const row = (label, value) => (
    <div className="flex border-b border-gray-300 py-1.5 text-sm">
      <span className="w-40 font-bold text-gray-600">{label}</span>
      <span className="flex-1 text-gray-900">{value || "—"}</span>
    </div>
  );
  return (
    <div id="print-area" className="hidden">
      <div style={{ padding: "28px", fontFamily: "Tajawal, sans-serif", direction: "rtl", background: "#fff" }}>
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Prime Safety" style={{ height: 56, width: 56, borderRadius: "50%", objectFit: "cover" }} />
            <div>
              <div className="text-lg font-bold text-gray-900">استمارة تسجيل متدرب</div>
              <div className="text-xs text-gray-500">PRIME SAFETY — Learn · Apply · Protect</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">تاريخ الطباعة: {todayISO()}</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-8">
          <div>
            {row("الاسم بالعربية", enrollment.name_ar)}
            {row("الاسم بالإنجليزية", enrollment.name_en)}
            {row("الرقم القومي", enrollment.national_id)}
            {row("السن", enrollment.age)}
            {row("الهاتف", enrollment.phone)}
            {row("واتساب", enrollment.whatsapp)}
            {row("العنوان", enrollment.address)}
          </div>
          <div>
            {row("الشهادة", certLabel(enrollment, courses))}
            {row("تاريخ التسجيل", enrollment.reg_date)}
            {row("بداية الكورس", enrollment.course_start)}
            {row("نهاية الكورس", enrollment.course_end)}
            {row("الرسوم الكلية", money(enrollment.fees))}
            {row("المدفوع", money(enrollment.paid))}
            {row("المتبقي", money(remaining))}
            {row("طريقة الدفع", `${enrollment.payment_method || ""}${paymentNote(enrollment.payment_method) ? " - " + paymentNote(enrollment.payment_method) : ""}`)}
          </div>
        </div>

        {enrollment.notes && (
          <div className="mt-4 text-sm">
            <span className="font-bold text-gray-600">ملاحظات: </span>
            {enrollment.notes}
          </div>
        )}

        <div className="mt-16 flex justify-between text-sm">
          <div className="text-center">
            <div className="mb-8">توقيع المتدرب</div>
            <div className="w-40 border-t border-gray-400" />
          </div>
          <div className="text-center">
            <div className="mb-8">توقيع الإدارة</div>
            <div className="w-40 border-t border-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
