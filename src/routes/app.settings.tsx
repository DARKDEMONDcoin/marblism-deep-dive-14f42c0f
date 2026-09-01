import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CreditCard, Users, Building2, Bell, Plus } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { workspaces, usage } from "@/data/app";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات | سهل" },
      { name: "description", content: "مساحة العمل، الفريق، الاشتراك والتنبيهات." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

const tabs = [
  { id: "workspace", label: "مساحة العمل", icon: Building2 },
  { id: "team", label: "الفريق", icon: Users },
  { id: "billing", label: "الاشتراك", icon: CreditCard },
  { id: "notifications", label: "التنبيهات", icon: Bell },
] as const;

const members = [
  { name: "عبدالله الحربي", email: "abdullah@nakhla.sa", role: "مالك" },
  { name: "ريم القحطاني", email: "reem@nakhla.sa", role: "محرِّر" },
  { name: "سلمان العتيبي", email: "salman@nakhla.sa", role: "مشاهد" },
];

const field = "w-full rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-jade";

function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("workspace");

  return (
    <AppShell title="الإعدادات" lead="كل ما يخص مساحة عملك وفريقك واشتراكك.">
      <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors",
                tab === t.id ? "bg-foreground text-background" : "hover:bg-secondary",
              )}
            >
              <t.icon className="size-4.5" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="rounded-3xl border border-border bg-card p-7">
          {tab === "workspace" ? (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-black">مساحة العمل</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">اسم النشاط</span>
                  <input className={field} defaultValue={workspaces[0]!.name} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold">المجال</span>
                  <input className={field} defaultValue={workspaces[0]!.industry} />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-sm font-bold">وصف مختصر لعلامتك</span>
                  <textarea
                    className={cn(field, "min-h-28 resize-none")}
                    defaultValue="نورّد تموراً فاخرة معبأة يدوياً للمتاجر والفنادق في السعودية، بتركيز على الجودة والتغليف الأنيق."
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full bg-foreground px-6 py-2.5 text-sm font-bold text-background">
                  حفظ التغييرات
                </button>
                <Link
                  to="/onboarding"
                  className="rounded-full border border-border px-6 py-2.5 text-sm font-bold"
                >
                  مساحة عمل جديدة
                </Link>
              </div>
            </div>
          ) : null}

          {tab === "team" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-black">أعضاء الفريق</h2>
                <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background">
                  <Plus className="size-4" /> دعوة عضو
                </button>
              </div>
              <ul className="divide-y divide-border">
                {members.map((m) => (
                  <li key={m.email} className="flex flex-wrap items-center gap-3 py-4">
                    <span className="grid size-10 place-items-center rounded-2xl bg-secondary font-display font-black">
                      {m.name.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{m.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{m.email}</span>
                    </span>
                    <span className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-bold">
                      {m.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "billing" ? (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-black">الاشتراك</h2>
              <div className="rounded-2xl bg-secondary/60 p-6">
                <p className="text-sm font-bold text-muted-foreground">باقتك الحالية</p>
                <p className="mt-1 font-display text-2xl font-black">النمو — ٣٩٩ ر.س / شهرياً</p>
                <p className="mt-1 text-sm text-ink-soft">التجديد القادم ١ أكتوبر · إلغاء متى شئت</p>
              </div>
              <ul className="space-y-4">
                {usage.map((u) => (
                  <li key={u.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-ink-soft">{u.label}</span>
                      <span className="font-display font-black">
                        {u.used}/{u.total} {u.unit}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-jade"
                        style={{ width: `${(u.used / u.total) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/pricing"
                  className="rounded-full bg-foreground px-6 py-2.5 text-sm font-bold text-background"
                >
                  ترقية الباقة
                </Link>
                <button className="rounded-full border border-border px-6 py-2.5 text-sm font-bold">
                  الفواتير السابقة
                </button>
              </div>
            </div>
          ) : null}

          {tab === "notifications" ? (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-black">التنبيهات</h2>
              <ul className="divide-y divide-border">
                {[
                  ["ملخص صباحي يومي", "٧:٣٠ ص كل يوم عمل", true],
                  ["تنبيه فوري عند عنصر ينتظر موافقتك", "بريد + إشعار داخل التطبيق", true],
                  ["تقرير أسبوعي للأداء", "كل أحد ٩:٠٠ ص", true],
                  ["تنبيه انقطاع ربط حساب", "فوري", true],
                  ["نصائح ومستجدات سهل", "مرة شهرياً", false],
                ].map(([title, sub, on]) => (
                  <li key={title as string} className="flex items-center gap-3 py-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{title as string}</span>
                      <span className="block text-sm text-muted-foreground">{sub as string}</span>
                    </span>
                    <span
                      className={cn(
                        "flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
                        on ? "bg-jade" : "bg-secondary",
                      )}
                    >
                      <span
                        className={cn(
                          "size-5 rounded-full bg-card shadow transition-transform",
                          on ? "-translate-x-5" : "translate-x-0",
                        )}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
