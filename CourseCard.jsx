import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CourseArt } from "./SafetyArt";

export default function CourseCard({ course, to = "/signup" }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-gold/60">
      <div className="h-40 w-full overflow-hidden">
        <CourseArt code={course.id} className="h-full w-full transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-lg font-black text-paper">{course.title}</h3>
          <span className="rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-bold text-gold">شهادة معتمدة</span>
        </div>
        {course.subtitle && <p className="mb-2 text-xs text-muted">{course.subtitle}</p>}
        <p className="mb-4 text-sm leading-relaxed text-silver">{course.description}</p>
        <Link to={to} className="flex items-center gap-1.5 text-sm font-bold text-gold hover:text-goldLight">
          سجّل في الكورس <ArrowLeft size={15} />
        </Link>
      </div>
    </div>
  );
}
