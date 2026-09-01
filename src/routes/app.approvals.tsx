import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Pencil, X, PartyPopper } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { AppIcon, appLabel } from "@/components/site/AppIcon";
import { getMember } from "@/data/team";
import { approvals } from "@/data/app";

export const Route = createFileRoute("/app/approvals")({
  head: () => ({
    meta: [
      { title: "الموافقات | سهل" },
      { name: "description", content: "راجع ما أنجزه فريقك واعتمده قبل النشر." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const [handled, setHandled] = useState<Record<string, "approved" | "rejected">>({});
  const remaining = approvals.filter((a) => !handled[a.id]);

  return (
    <AppShell
      title="طابور الموافقات"
      lead={`${remaining.length} عنصراً بانتظارك · متوسط المراجعة ٩ دقائق`}
      actions={
        remaining.length ? (
          <button
            onClick={() =>
              setHandled(Object.fromEntries(approvals.map((a) => [a.id, "approved" as const])))
            }
            className="hidden items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background sm:inline-flex"
          >
            <Check className="size-4" /> اعتماد الكل
          </button>
        ) : null
      }
    >
      {remaining.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-jade/12 text-jade-deep">
            <PartyPopper className="size-7" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-black">لا شيء ينتظرك</h2>
          <p className="mt-2 text-ink-soft">فريقك يكمل العمل — سنخبرك فور جاهزية عنصر جديد.</p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {remaining.map((a) => {
            const member = getMember(a.employee);
            return (
              <article key={a.id} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {member ? (
                    <span className="inline-flex items-center gap-1.5 font-bold">
                      <span
                        className="grid size-7 place-items-center rounded-lg"
                        style={{ background: member.tintSoft, color: member.tint }}
                      >
                        <member.icon className="size-3.5" strokeWidth={2.4} />
                      </span>
                      {member.name}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <AppIcon name={a.channel} className="size-3.5" />
                    {appLabel(a.channel)}
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 font-bold">{a.type}</span>
                  <span className="ms-auto text-muted-foreground">{a.scheduled}</span>
                </div>

                <h2 className="mt-4 font-display text-lg font-black">{a.title}</h2>
                <p className="mt-3 rounded-2xl bg-secondary/50 p-4 leading-relaxed text-ink-soft">
                  {a.preview}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => setHandled((h) => ({ ...h, [a.id]: "approved" }))}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background"
                  >
                    <Check className="size-4" /> اعتماد ونشر
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:bg-secondary">
                    <Pencil className="size-4" /> طلب تعديل
                  </button>
                  <button
                    onClick={() => setHandled((h) => ({ ...h, [a.id]: "rejected" }))}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <X className="size-4" /> رفض
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
