import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, CheckCheck, ArrowLeft, AlertTriangle } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { AppIcon, appLabel } from "@/components/site/AppIcon";
import { team } from "@/data/team";
import { kpis, workFeed, statusLabel } from "@/data/work";
import { approvals, tasks, taskStatusLabel, usage } from "@/data/app";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "مساحة عملك | سهل" },
      { name: "description", content: "نظرة عامة على عمل فريقك الرقمي اليوم." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppHome,
});

function AppHome() {
  const paused = tasks.filter((t) => t.status === "paused");

  return (
    <AppShell
      title="صباح الخير، عبدالله 👋"
      lead={`${approvals.length} عناصر تنتظر موافقتك · فريقك يعمل الآن على ${tasks.filter((t) => t.status === "running").length} مهام`}
      actions={
        <button className="hidden items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background sm:inline-flex">
          <Plus className="size-4" /> مهمة جديدة
        </button>
      }
    >
      {paused.length ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-coral/30 bg-coral/8 p-4">
          <AlertTriangle className="size-5 shrink-0 text-coral" />
          <p className="flex-1 text-sm font-semibold">
            مهمة «{paused[0]!.title}» متوقفة بسبب انقطاع ربط حساب. أعد الربط ليكمل فريقك العمل.
          </p>
          <Link
            to="/app/integrations"
            className="rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background"
          >
            إصلاح الربط
          </Link>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.k} className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm font-semibold text-muted-foreground">{k.k}</p>
            <p className="mt-2 font-display text-3xl font-black">{k.v}</p>
            <p className="mt-1 text-xs text-jade-deep">{k.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-black">آخر ما أنجزه فريقك</h2>
            <Link to="/app/tasks" className="text-sm font-bold text-primary">
              كل المهام
            </Link>
          </div>
          <ul className="mt-5 space-y-3">
            {workFeed.slice(0, 5).map((w) => {
              const member = team.find((t) => t.id === w.employee);
              return (
                <li key={w.id} className="rounded-2xl border border-border/70 p-4">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    {member ? (
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <span
                          className="grid size-6 place-items-center rounded-lg"
                          style={{ background: member.tintSoft, color: member.tint }}
                        >
                          <member.icon className="size-3" strokeWidth={2.4} />
                        </span>
                        {member.name}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <AppIcon name={w.channel} className="size-3.5" />
                      {appLabel(w.channel)}
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 font-bold">
                      {statusLabel[w.status]}
                    </span>
                    <span className="ms-auto text-muted-foreground">{w.time}</span>
                  </div>
                  <p className="mt-2.5 font-bold">{w.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{w.detail}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-black">بانتظار موافقتك</h2>
              <span className="rounded-full bg-coral/15 px-2.5 py-0.5 text-xs font-black text-coral">
                {approvals.length}
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {approvals.slice(0, 3).map((a) => (
                <li key={a.id} className="rounded-2xl bg-secondary/50 p-4">
                  <p className="text-xs font-bold text-muted-foreground">{a.type}</p>
                  <p className="mt-1 font-bold">{a.title}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/app/approvals"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-bold text-background"
            >
              <CheckCheck className="size-4" /> راجع الكل
            </Link>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-black">استهلاك الباقة</h2>
            <ul className="mt-4 space-y-4">
              {usage.map((u) => (
                <li key={u.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-ink-soft">{u.label}</span>
                    <span className="font-display font-black">
                      {u.used}/{u.total}
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
          </section>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-black">مهام جارية</h2>
            <ul className="mt-4 space-y-3">
              {tasks.slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-center gap-3 text-sm">
                  <span className="size-2 shrink-0 rounded-full bg-amber" />
                  <span className="min-w-0 flex-1 truncate font-semibold">{t.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {taskStatusLabel[t.status]}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/app/tasks"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary"
            >
              افتح لوحة المهام <ArrowLeft className="size-4" />
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
