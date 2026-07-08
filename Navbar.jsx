import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Prime Safety" className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <div className="font-display text-sm font-black text-paper">
              PRIME <span className="text-gold">SAFETY</span>
            </div>
            <div className="text-[10px] tracking-widest text-muted">LEARN · APPLY · PROTECT</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-silver hover:text-gold">
            الرئيسية
          </Link>
          <a href="/#courses" className="text-sm font-medium text-silver hover:text-gold">
            الكورسات
          </a>
          {user ? (
            <>
              <Link
                to={isAdmin ? "/admin" : "/portal"}
                className="flex items-center gap-1.5 text-sm font-medium text-silver hover:text-gold"
              >
                <LayoutDashboard size={15} />
                {isAdmin ? "لوحة الإدارة" : "حسابي"}
              </Link>
              <span className="text-xs text-muted">{profile?.full_name || user.email}</span>
              <button onClick={handleSignOut} className="flex items-center gap-1.5 rounded-lg bg-surfaceAlt px-3 py-2 text-xs font-bold text-paper">
                <LogOut size={14} /> خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-silver hover:text-gold">
                تسجيل الدخول
              </Link>
              <Link to="/signup" className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-ink">
                <ShieldCheck size={15} /> إنشاء حساب
              </Link>
            </>
          )}
        </nav>

        <button className="text-paper md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-ink px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium text-silver">
              الرئيسية
            </Link>
            <a href="/#courses" onClick={() => setOpen(false)} className="text-sm font-medium text-silver">
              الكورسات
            </a>
            {user ? (
              <>
                <Link to={isAdmin ? "/admin" : "/portal"} onClick={() => setOpen(false)} className="text-sm font-medium text-silver">
                  {isAdmin ? "لوحة الإدارة" : "حسابي"}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="rounded-lg bg-surfaceAlt px-3 py-2 text-right text-sm font-bold text-paper"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-silver">
                  تسجيل الدخول
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-lg bg-gold px-4 py-2 text-center text-sm font-bold text-ink">
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
