import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Upload, Sparkles } from "lucide-react";

import { AppIcon, appLabel } from "@/components/site/AppIcon";
import { team } from "@/data/team";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "جهّز فريقك في ٤ خطوات | سهل" },
      {
        name: "description",
        content: "عرّف سهل على نشاطك، اختر موظفيك، اربط حساباتك، وابدأ العمل خلال دقائق.",
      },
      { property: "og:title", content: "جهّز فريقك الرقمي في ٤ خطوات — سهل" },
      { property: "og:description", content: "إعداد كامل خلال ١١ دقيقة، بدون خبرة تقنية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});

const steps = ["نشاطك", "نبرتك", "فريقك", "حساباتك"] as const;

const channels = ["instagram", "x", "linkedin", "tiktok", "facebook", "gmail", "calendar", "whatsapp", "wordpress", "shopify", "analytics", "hubspot"];

const tones = [
  { id: "warm", label: "دافئة وقريبة", sample: "أهلاً! جهّزنا لك شيئاً يعجبك اليوم 🌿" },
  { id: "pro", label: "احترافية ورصينة", sample: "يسرّنا مشاركتكم آخر تحديثات المنتج لهذا الربع." },
  { id: "bold", label: "جريئة ومباشرة", sample: "توقف عن إضاعة ميزانيتك. إليك ما ينجح فعلاً." },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [tone, setTone] = useState("warm");
  const [hired, setHired] = useState<string[]>(team.map((t) => t.id));
  const [linked, setLinked] = useState<string[]>(["instagram", "gmail"]);

  const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const next = () => (step === steps.length - 1 ? navigate({ to: "/app" }) : setStep(step + 1));

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Link to="/" className="font-display text-2xl font-black">
          سهل<span className="text-jade">.</span>
        </Link>
        <Link to="/app" className="text-sm font-bold text-muted-foreground">
          تخطّي الإعداد
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20">
        <ol className="flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full text-xs font-black transition-colors",
                  i < step && "bg-jade text-background",
                  i === step && "bg-foreground text-background",
                  i > step && "bg-secondary text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-bold sm:block",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 ? <span className="h-px flex-1 bg-border" /> : null}
            </li>
          ))}
        </ol>

        <div className="mt-8 rounded-3xl border border-border bg-card p-7 md:p-10">
          {step === 0 ? (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-black md:text-3xl">عرّفنا على نشاطك</h1>
              <p className="text-ink-soft">دقيقتان الآن توفّران عليك ساعات تصحيح لاحقاً.</p>
              <label className="block">
                <span className="mb-2 block text-sm font-bold">اسم النشاط</span>
                <input
                  className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-jade"
                  placeholder="مثال: نخلة للتمور الفاخرة"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold">ماذا تبيع ولمن؟</span>
                <textarea
                  className="min-h-32 w-full resize-none rounded-2xl border border-border px-4 py-3 outline-none focus:border-jade"
                  placeholder="نورّد تموراً فاخرة معبأة يدوياً للمتاجر والفنادق في السعودية…"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold">رابط موقعك أو حسابك (اختياري)</span>
                <input
                  dir="ltr"
                  className="w-full rounded-2xl border border-border px-4 py-3 text-start outline-none focus:border-jade"
                  placeholder="https://nakhla.sa"
                />
              </label>
              <p className="flex items-center gap-2 rounded-2xl bg-secondary/60 p-4 text-sm text-ink-soft">
                <Sparkles className="size-4 shrink-0 text-jade" />
                سنقرأ الرابط تلقائياً ونستخرج منه هويتك ومنتجاتك.
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-black md:text-3xl">كيف تتكلم علامتك؟</h1>
              <div className="grid gap-3">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={cn(
                      "rounded-2xl border p-5 text-start transition-colors",
                      tone === t.id ? "border-jade bg-jade/8" : "border-border hover:bg-secondary/50",
                    )}
                  >
                    <span className="block font-bold">{t.label}</span>
                    <span className="mt-1 block text-sm text-ink-soft">«{t.sample}»</span>
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-bold">كلمات ممنوعة</span>
                <input
                  className="w-full rounded-2xl border border-border px-4 py-3 outline-none focus:border-jade"
                  defaultValue="الأفضل في العالم، مجاناً ١٠٠٪"
                />
              </label>
              <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
                <Upload className="mx-auto size-5 text-muted-foreground" />
                <p className="mt-2 text-sm font-bold">ارفع دليل الهوية أو نصوصاً تفتخر بها</p>
                <p className="text-xs text-muted-foreground">PDF، Word، صور — تذهب إلى عقل العلامة.</p>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-black md:text-3xl">من تريد أن يعمل معك؟</h1>
              <p className="text-ink-soft">كل الموظفين مشمولون في اشتراكك — فعّل من تحتاجه الآن.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {team.map((m) => {
                  const on = hired.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggle(hired, setHired, m.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-4 text-start transition-colors",
                        on ? "border-jade bg-jade/8" : "border-border hover:bg-secondary/50",
                      )}
                    >
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-2xl"
                        style={{ background: m.tintSoft, color: m.tint }}
                      >
                        <m.icon className="size-5" strokeWidth={2.2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold">{m.name}</span>
                        <span className="block truncate text-sm text-muted-foreground">{m.role}</span>
                      </span>
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full border",
                          on ? "border-jade bg-jade text-background" : "border-border",
                        )}
                      >
                        {on ? <Check className="size-3.5" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <h1 className="font-display text-2xl font-black md:text-3xl">اربط حساباتك</h1>
              <p className="text-ink-soft">
                عبر OAuth الرسمي — لا نطلب كلمات مرورك، ويمكنك الفصل في أي وقت.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {channels.map((c) => {
                  const on = linked.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggle(linked, setLinked, c)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-4 text-start transition-colors",
                        on ? "border-jade bg-jade/8" : "border-border hover:bg-secondary/50",
                      )}
                    >
                      <AppIcon name={c} className="size-6 shrink-0" />
                      <span className="flex-1 font-bold">{appLabel(c)}</span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-bold",
                          on ? "bg-jade/15 text-jade-deep" : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {on ? "مرتبط" : "اربط"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold disabled:opacity-40"
            >
              <ArrowRight className="size-4" /> السابق
            </button>
            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-bold text-background"
            >
              {step === steps.length - 1 ? "ادخل مساحة عملك" : "التالي"}
              <ArrowLeft className="size-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
