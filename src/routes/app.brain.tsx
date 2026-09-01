import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileText, Link2, StickyNote, Images, Search, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app/AppShell";
import { getMember } from "@/data/team";
import { brainItems, brainKindLabel, type BrainItem } from "@/data/app";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/brain")({
  head: () => ({
    meta: [
      { title: "عقل العلامة | سهل" },
      {
        name: "description",
        content: "كل ما يعرفه فريقك عن علامتك: مستندات، روابط، قواعد نبرة، وصور.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BrainPage,
});

const kindIcon = {
  doc: FileText,
  link: Link2,
  note: StickyNote,
  image: Images,
} as const;

function BrainPage() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<BrainItem["kind"] | "all">("all");

  const list = brainItems.filter(
    (i) => (kind === "all" || i.kind === kind) && i.title.includes(query.trim()),
  );

  return (
    <AppShell
      title="عقل العلامة"
      lead="كلما أطعمته أكثر، صار فريقك أدق — النبرة والأسعار والقواعد الممنوعة."
      actions={
        <button className="hidden items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background sm:inline-flex">
          <Upload className="size-4" /> أضف معرفة
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-56 flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في معرفة علامتك…"
                className="min-w-0 flex-1 bg-transparent outline-none"
              />
            </div>
            {(["all", "doc", "link", "note", "image"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-bold transition-colors",
                  kind === k
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-secondary",
                )}
              >
                {k === "all" ? "الكل" : brainKindLabel[k]}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border-2 border-dashed border-border p-8 text-center">
            <Upload className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 font-bold">اسحب ملفاتك هنا</p>
            <p className="mt-1 text-sm text-muted-foreground">
              PDF، Word، Excel، صور، أو الصق رابط موقعك ليقرأه فريقك.
            </p>
          </div>

          <ul className="mt-5 space-y-3">
            {list.map((item) => {
              const Icon = kindIcon[item.kind];
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{item.title}</span>
                    <span className="block text-xs text-muted-foreground">{item.meta}</span>
                  </span>
                  <span className="flex -space-x-2 space-x-reverse">
                    {item.usedBy.map((uid) => {
                      const m = getMember(uid);
                      if (!m) return null;
                      return (
                        <span
                          key={uid}
                          title={m.name}
                          className="grid size-7 place-items-center rounded-full border-2 border-card"
                          style={{ background: m.tintSoft, color: m.tint }}
                        >
                          <m.icon className="size-3.5" strokeWidth={2.4} />
                        </span>
                      );
                    })}
                  </span>
                  <button
                    className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-coral"
                    aria-label="حذف"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display font-black">اكتمال المعرفة</h2>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full"
                style={{ width: "72%", backgroundImage: "var(--gradient-aurora)" }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">٧٢٪ — أضف ما ينقص لترتفع الدقة.</p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["نبرة العلامة", true],
                ["قائمة الأسعار", true],
                ["الكلمات الممنوعة", true],
                ["١٠ نصوص تفتخر بها", false],
                ["ملف العميل المثالي", false],
              ].map(([label, done]) => (
                <li key={label as string} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      done ? "bg-jade" : "bg-muted-foreground/30",
                    )}
                  />
                  <span className={done ? "text-ink-soft" : "text-muted-foreground"}>
                    {label as string}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-border bg-secondary/50 p-6">
            <h2 className="font-display font-black">قاعدة إلزامية</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              كل ما يُكتب في عقل العلامة يُطبَّق على جميع الموظفين فوراً — بدون إعادة تدريب.
            </p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
