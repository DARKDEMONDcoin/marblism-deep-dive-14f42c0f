import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, RefreshCw } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { AppIcon, appLabel } from "@/components/site/AppIcon";
import { team } from "@/data/team";
import { integrations, integrationStatusLabel } from "@/data/app";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({
    meta: [
      { title: "التكاملات | سهل" },
      { name: "description", content: "اربط حسابات علامتك ليعمل فريقك مباشرة عليها." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const connected = integrations.filter((i) => i.status === "connected").length;
  const broken = integrations.filter((i) => i.status === "error");

  return (
    <AppShell
      title="التكاملات"
      lead={`${connected} حساباً مرتبطاً · حساب واحد لكل منصة داخل مساحة العمل`}
    >
      {broken.length ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-coral/30 bg-coral/8 p-4">
          <RefreshCw className="size-5 shrink-0 text-coral" />
          <p className="flex-1 text-sm font-semibold">
            {broken.length} حسابات تحتاج إعادة ربط — المهام المرتبطة بها متوقفة مؤقتاً.
          </p>
        </div>
      ) : null}

      <div className="space-y-6">
        {team.map((m) => {
          const owned = integrations.filter((i) => i.owner === m.id);
          if (!owned.length) return null;
          return (
            <section key={m.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span
                  className="grid size-10 place-items-center rounded-2xl"
                  style={{ background: m.tintSoft, color: m.tint }}
                >
                  <m.icon className="size-5" strokeWidth={2.2} />
                </span>
                <div>
                  <h2 className="font-display font-black">{m.name}</h2>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {owned.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 p-4"
                  >
                    <AppIcon name={i.id} className="size-6 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{appLabel(i.id)}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {i.account ?? "لم يُربط بعد"}
                      </span>
                    </span>
                    <button
                      className={cn(
                        "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                        i.status === "connected" && "bg-jade/12 text-jade-deep",
                        i.status === "error" && "bg-coral text-background",
                        i.status === "disconnected" && "bg-foreground text-background",
                      )}
                    >
                      {i.status === "connected"
                        ? integrationStatusLabel.connected
                        : i.status === "error"
                          ? "أعد الربط"
                          : "اربط"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-3xl border border-border bg-secondary/50 p-6">
        <ShieldCheck className="size-5 shrink-0 text-jade-deep" />
        <p className="text-sm leading-relaxed text-ink-soft">
          الربط يتم عبر OAuth الرسمي لكل منصة — لا نطلب كلمات مرورك أبداً، ويمكنك فصل أي حساب بضغطة
          واحدة.
        </p>
      </div>
    </AppShell>
  );
}
