import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, HardHat, Award, Users, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { supabase, supabaseReady } from "../lib/supabaseClient";
import CourseCard from "../components/CourseCard";
import { HeroArt } from "../components/SafetyArt";
import { PAYMENT_METHODS } from "../lib/helpers";
import logo from "../assets/logo.png";

const FALLBACK_COURSES = [
  { id: "NEBOSH", title: "NEBOSH", subtitle: "National Examination Board in Occupational Safety and Health", description: "شهادة عالمية معتمدة في السلامة والصحة المهنية، مناسبة لمهندسي ومسؤولي السيفتي في كل الصناعات." },
  { id: "IOSH", title: "IOSH", subtitle: "Institution of Occupational Safety and Health", description: "كورس متخصص في إدارة السلامة المهنية للمشرفين والإداريين، ومعترف بيه عالميًا." },
  { id: "OSHA", title: "OSHA", subtitle: "Occupational Safety and Health Administration", description: "شهادة أمريكية معتمدة في معايير السلامة المهنية داخل مواقع العمل والمصانع." },
  { id: "ISO45001", title: "ISO 45001", subtitle: "Occupational Health & Safety Management", description: "نظام إدارة السلامة والصحة المهنية طبقًا للمواصفة الدولية ISO 45001." },
];

export default function Landing() {
  const [courses, setCourses] = useState(FALLBACK_COURSES);

  useEffect(() => {
    if (!supabaseReady) return;
    supabase
      .from("courses")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length) setCourses(data);
      });
  }, []);

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
              <ShieldCheck size={14} /> منصة تدريب وشهادات السلامة المهنية
            </div>
            <h1 className="mb-4 font-display text-4xl font-black leading-tight text-paper sm:text-5xl">
              <span className="text-gold">Prime Safety</span>
              <br />
              Learn · Apply · Protect
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-silver">
              سجّل واحصل على شهاداتك المهنية المعتمدة في السلامة والصحة المهنية — NEBOSH و IOSH و OSHA و ISO 45001 — أو اطلب أي شهادة تانية محتاجها، وفريقنا هيتواصل معاك.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup" className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-gold/20">
                ابدأ التسجيل الآن <ArrowLeft size={16} />
              </Link>
              <a href="#courses" className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-bold text-paper">
                استعرض الكورسات
              </a>
            </div>
          </div>
          <div className="mx-auto h-72 w-full max-w-md sm:h-96">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* stats strip */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4 py-8 sm:px-6">
          {[
            { icon: Award, label: "شهادات معتمدة", value: "4+" },
            { icon: Users, label: "متدربين", value: "500+" },
            { icon: HardHat, label: "قطاعات صناعية", value: "10+" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <s.icon className="mx-auto mb-2 text-gold" size={26} />
              <div className="font-display text-2xl font-black text-paper">{s.value}</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* courses */}
      <section id="courses" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-2 font-display text-3xl font-black text-paper">الكورسات والشهادات المتاحة</h2>
          <p className="mx-auto max-w-xl text-sm text-muted">اختر الشهادة المناسبة لمجالك، ولو مش لاقي الشهادة اللي محتاجها، تقدر تطلبها بنفسك أثناء التسجيل.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} to={`/signup?course=${c.id}`} />
          ))}
        </div>
      </section>

      {/* about / trust */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "شهادات معتمدة دوليًا", desc: "كل الشهادات معترف بيها في السوق المحلي والدولي." },
              { icon: HardHat, title: "مدربين متخصصين", desc: "فريق تدريب من مهندسي السلامة أصحاب خبرة ميدانية حقيقية." },
              { icon: Award, title: "متابعة كاملة", desc: "من التسجيل لحد استلام الشهادة، هتتابع كل حالتك من حسابك." },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-6">
                <f.icon className="mb-3 text-gold" size={28} />
                <h3 className="mb-1 font-display text-lg font-bold text-paper">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <img src={logo} alt="Prime Safety" className="h-9 w-9 rounded-full object-cover" />
              <span className="font-display font-black text-paper">
                PRIME <span className="text-gold">SAFETY</span>
              </span>
            </div>
            <p className="text-sm text-muted">Learn · Apply · Protect</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-gold">تواصل معنا</h4>
            <ul className="space-y-2 text-sm text-silver">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold" /> 01228614557
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-gold" /> 01030486577
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-gold" /> info@primesafety.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-gold" /> جمهورية مصر العربية
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-gold">طرق الدفع المتاحة</h4>
            <ul className="space-y-2 text-sm text-silver">
              {PAYMENT_METHODS.filter((p) => p.label !== "أخرى").map((p) => (
                <li key={p.label} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                  <span>{p.label}</span>
                  {p.note && (
                    <span dir="ltr" className="font-bold text-gold">
                      {p.note}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Prime Safety. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
