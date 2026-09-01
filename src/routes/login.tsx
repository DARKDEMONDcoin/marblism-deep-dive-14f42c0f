import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthShell, authInput, SocialButtons } from "@/components/site/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | لوحة تحكم فريقك الرقمي — سهل" },
      {
        name: "description",
        content: "ادخل إلى لوحة سهل لمتابعة مهام موظفيك الرقميين واعتماد الأعمال بانتظار موافقتك.",
      },
      { property: "og:title", content: "تسجيل الدخول — سهل" },
      { property: "og:description", content: "تابع فريقك الرقمي من مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  return (
    <AuthShell
      title="أهلاً بعودتك"
      lead="فريقك أنجز مهامّ بينما كنت بعيداً — لنرَ ما ينتظر موافقتك."
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link to="/signup" className="font-bold text-primary">
            أنشئ حساباً مجاناً
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setBusy(true);
          navigate({ to: "/dashboard" });
        }}
      >
        <div>
          <label className="mb-1.5 block text-sm font-bold" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input id="email" type="email" required className={authInput} placeholder="you@company.com" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-bold" htmlFor="password">
              كلمة المرور
            </label>
            <span className="cursor-pointer text-xs font-semibold text-primary">نسيتها؟</span>
          </div>
          <input id="password" type="password" required className={authInput} placeholder="••••••••" />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" className="size-4 rounded" defaultChecked />
          أبقني مسجّلاً على هذا الجهاز
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-foreground py-3.5 font-bold text-background transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "جارٍ الدخول…" : "تسجيل الدخول"}
        </button>
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
