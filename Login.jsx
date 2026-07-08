import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Facebook, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabaseReady } from "../lib/supabaseClient";
import { NotConfigured } from "./Signup";
import logo from "../assets/logo.png";

export default function Login() {
  const { signIn, signInWithFacebook } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("من فضلك اكتب الإيميل وكلمة المرور");
      return;
    }
    setLoading(true);
    const { error: err } = await signIn({ email, password });
    setLoading(false);
    if (err) {
      setError("الإيميل أو كلمة المرور غير صحيحة");
      return;
    }
    navigate("/portal");
  }

  async function handleFacebook() {
    setError("");
    const { error: err } = await signInWithFacebook();
    if (err) setError(err.message);
  }

  if (!supabaseReady) return <NotConfigured />;

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="mb-8 text-center">
        <img src={logo} alt="Prime Safety" className="mx-auto mb-3 h-16 w-16 rounded-full object-cover" />
        <h1 className="font-display text-2xl font-black text-paper">تسجيل الدخول</h1>
        <p className="text-sm text-muted">ادخل بحسابك لمتابعة كورساتك وشهاداتك</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        <label className="flex items-center gap-2 rounded-lg border border-border bg-ink px-3 py-2.5">
          <Mail size={16} className="shrink-0 text-muted" />
          <input
            type="email"
            dir="ltr"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-muted"
          />
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-border bg-ink px-3 py-2.5">
          <Lock size={16} className="shrink-0 text-muted" />
          <input
            type="password"
            dir="ltr"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-sm text-paper outline-none placeholder:text-muted"
          />
        </label>

        {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{error}</p>}

        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3 text-sm font-bold text-ink disabled:opacity-60">
          <LogIn size={16} /> {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" /> أو <span className="h-px flex-1 bg-border" />
        </div>

        <button type="button" onClick={handleFacebook} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-bold text-paper">
          <Facebook size={16} className="text-[#1877F2]" /> الدخول بفيسبوك
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        لسه معملتش حساب؟{" "}
        <Link to="/signup" className="font-bold text-gold">
          إنشاء حساب جديد
        </Link>
      </p>
    </div>
  );
}
