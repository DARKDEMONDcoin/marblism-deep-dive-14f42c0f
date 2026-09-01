import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { AuthShell, authInput, SocialButtons } from "@/components/site/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب | ١٤ يوماً مجاناً بدون بطاقة — سهل" },
      {
        name: "description",
        content: "أنشئ حسابك في دقيقة، عرّفنا على علامتك، وشغّل أول موظف رقمي اليوم — بدون بطاقة.",
      },
      { property: "og:title", content: "ابدأ مجاناً مع سهل" },
      { property: "og:description", content: "فريق رقمي عربي يعمل 24/7 داخل حساباتك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

const perks = ["١٤ يوماً مجاناً", "بدون بطاقة ائتمان", "إلغاء بضغطة"];

function SignupPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  return (
    <AuthShell
      title="أنشئ حسابك"
      lead="دقيقة واحدة الآن، وفريقك يبدأ العمل قبل نهاية اليوم."
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="font-bold text-primary">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {perks.map((p) => (
          <span
            key={p}
            className="inline-flex items-center gap-1.5 rounded-full bg-jade/12 px-3 py-1 text-xs font-bold text-jade-deep"
          >
            <Check className="size-3.5" strokeWidth={3} />
            {p}
          </span>
        ))}
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
          navigate({ to: "/dashboard" });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-bold" htmlFor="name">
              الاسم
            </label>
            <input id="name" required className={authInput} placeholder="اسمك الكريم" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold" htmlFor="company">
              اسم النشاط
            </label>
            <input id="company" required className={authInput} placeholder="متجر / شركة" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input id="email" type="email" required className={authInput} placeholder="you@company.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold" htmlFor="password">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            className={authInput}
            placeholder="٨ أحرف على الأقل"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold" htmlFor="dialect">
            لهجة المحتوى
          </label>
          <select id="dialect" className={authInput} defaultValue="خليجية">
            <option>خليجية</option>
            <option>مصرية</option>
            <option>شامية</option>
            <option>مغاربية</option>
            <option>فصحى معاصرة</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-foreground py-3.5 font-bold text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "جارٍ التجهيز…" : "ابدأ ١٤ يوماً مجاناً"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          بإنشائك حساباً فأنت توافق على{" "}
          <Link to="/terms" className="underline">
            الشروط
          </Link>{" "}
          و
          <Link to="/privacy" className="underline">
            سياسة الخصوصية
          </Link>
          .
        </p>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px grow bg-border" />
        أو
        <span className="h-px grow bg-border" />
      </div>
      <SocialButtons />
    </AuthShell>
  );
}
