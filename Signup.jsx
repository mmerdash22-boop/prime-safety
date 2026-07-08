import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Phone, Lock, Facebook, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabaseReady } from "../lib/supabaseClient";
import logo from "../assets/logo.png";

export default function Signup() {
  const { signUp, signInWithFacebook } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
      setError("من فضلك استكمل كل الحقول");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور لازم تكون 6 حروف/أرقام على الأقل");
      return;
    }
    if (password !== confirm) {
      setError("كلمة المرور وتأكيدها مش متطابقين");
      return;
    }
    setLoading(true);
    const { error: err } = await signUp({ email, password, fullName, phone });
    setLoading(false);
    if (err) {
      setError(err.message === "User already registered" ? "الإيميل ده متسجل قبل كده" : err.message);
      return;
    }
    setInfo("تم إنشاء الحساب بنجاح! لو طلب منك تأكيد الإيميل، افتح بريدك الإلكتروني واضغط رابط التأكيد ثم سجّل الدخول.");
    setTimeout(() => navigate("/login"), 2200);
  }

  async function handleFacebook() {
    setError("");
    const { error: err } = await signInWithFacebook();
    if (err) setError(err.message);
  }

  if (!supabaseReady) {
    return <NotConfigured />;
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <img src={logo} alt="Prime Safety" className="mx-auto mb-3 h-16 w-16 rounded-full object-cover" />
        <h1 className="font-display text-2xl font-black text-paper">إنشاء حساب جديد</h1>
        <p className="text-sm text-muted">اعمل حسابك وابدأ تسجل في شهادات السلامة المهنية</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        <Field icon={UserPlus} placeholder="الاسم بالكامل" value={fullName} onChange={setFullName} />
        <Field icon={Phone} placeholder="رقم الهاتف" value={phone} onChange={setPhone} dir="ltr" />
        <Field icon={Mail} placeholder="البريد الإلكتروني" value={email} onChange={setEmail} type="email" dir="ltr" />
        <Field icon={Lock} placeholder="كلمة المرور" value={password} onChange={setPassword} type="password" dir="ltr" />
        <Field icon={Lock} placeholder="تأكيد كلمة المرور" value={confirm} onChange={setConfirm} type="password" dir="ltr" />

        {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}
        {info && <p className="rounded-lg bg-success/10 px-3 py-2 text-xs text-success">{info}</p>}

        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-bold text-ink disabled:opacity-60">
          <ShieldCheck size={16} /> {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" /> أو <span className="h-px flex-1 bg-border" />
        </div>

        <button type="button" onClick={handleFacebook} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-bold text-paper">
          <Facebook size={16} className="text-[#1877F2]" /> إنشاء حساب بفيسبوك
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        عندك حساب بالفعل؟{" "}
        <Link to="/login" className="font-bold text-gold">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-border bg-ink px-3 py-2.5">
      <Icon size={16} className="shrink-0 text-muted" />
      <input {...props} onChange={(e) => props.onChange(e.target.value)} className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-muted" />
    </label>
  );
}

export function NotConfigured() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <ShieldCheck size={40} className="mb-4 text-gold" />
      <h2 className="mb-2 font-display text-xl font-bold text-paper">لسه محتاج تفعّل الاتصال بقاعدة البيانات</h2>
      <p className="text-sm text-muted">
        اتبع خطوات ملف <span className="text-gold">README.md</span> لإنشاء مشروع Supabase مجاني ووضع بياناته في ملف <code className="text-gold">.env</code>.
      </p>
    </div>
  );
}
