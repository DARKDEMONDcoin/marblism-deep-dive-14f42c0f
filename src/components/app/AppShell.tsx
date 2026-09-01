import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessagesSquare,
  CheckCheck,
  ListChecks,
  BrainCircuit,
  Plug,
  Settings,
  ChevronDown,
  Bell,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

import { team } from "@/data/team";
import { workspaces, usage, approvals } from "@/data/app";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "النظرة العامة", icon: LayoutDashboard, exact: true },
  { to: "/app/chat", label: "المحادثات", icon: MessagesSquare },
  { to: "/app/approvals", label: "الموافقات", icon: CheckCheck, badge: approvals.length },
  { to: "/app/tasks", label: "المهام", icon: ListChecks },
  { to: "/app/brain", label: "عقل العلامة", icon: BrainCircuit },
  { to: "/app/integrations", label: "التكاملات", icon: Plug },
  { to: "/app/settings", label: "الإعدادات", icon: Settings },
] as const;

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(workspaces[0]!);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-start transition-colors hover:bg-secondary/60"
      >
        <span
          className="grid size-9 shrink-0 place-items-center rounded-xl font-display text-sm font-black text-background"
          style={{ background: active.tint }}
        >
          {active.initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold">{active.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{active.industry}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-card">
          {workspaces.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                setActive(w);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl p-2.5 text-start transition-colors hover:bg-secondary"
            >
              <span
                className="grid size-8 shrink-0 place-items-center rounded-lg text-xs font-black text-background"
                style={{ background: w.tint }}
              >
                {w.initials}
              </span>
              <span className="truncate text-sm font-semibold">{w.name}</span>
            </button>
          ))}
          <Link
            to="/onboarding"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-xl p-2.5 text-sm font-bold text-primary transition-colors hover:bg-secondary"
          >
            <Sparkles className="size-4" /> مساحة عمل جديدة
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hours = usage[0]!;

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link to="/" className="font-display text-2xl font-black tracking-tight">
        سهل<span className="text-jade">.</span>
      </Link>

      <WorkspaceSwitcher />

      <nav className="space-y-1">
        {nav.map((item) => {
          const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-bold transition-colors",
                active ? "bg-foreground text-background" : "text-ink-soft hover:bg-secondary",
              )}
            >
              <item.icon className="size-4.5 shrink-0" strokeWidth={2.2} />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.7rem] font-black",
                    active ? "bg-background/20" : "bg-coral/15 text-coral",
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1.5">
        <p className="px-2 text-xs font-bold text-muted-foreground">فريقك</p>
        {team.map((m) => (
          <Link
            key={m.id}
            to="/app/chat/$id"
            params={{ id: m.id }}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-secondary",
              pathname === `/app/chat/${m.id}` && "bg-secondary",
            )}
          >
            <span
              className="grid size-7 shrink-0 place-items-center rounded-lg"
              style={{ background: m.tintSoft, color: m.tint }}
            >
              <m.icon className="size-3.5" strokeWidth={2.4} />
            </span>
            <span className="truncate font-semibold">{m.name}</span>
            <span className="ms-auto size-2 shrink-0 rounded-full bg-jade" />
          </Link>
        ))}
      </div>

      <div className="mt-auto rounded-2xl border border-border bg-secondary/50 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold text-ink-soft">{hours.label}</span>
          <span className="font-display text-sm font-black">
            {hours.used}/{hours.total}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-card">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(hours.used / hours.total) * 100}%`,
              backgroundImage: "var(--gradient-aurora)",
            }}
          />
        </div>
        <Link
          to="/pricing"
          className="mt-3 block rounded-xl bg-foreground py-2 text-center text-xs font-bold text-background"
        >
          زد ساعات فريقك
        </Link>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  lead,
  actions,
  children,
  padded = true,
}: {
  title: string;
  lead?: string;
  actions?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-72 border-e border-border bg-card lg:block">
        <SidebarBody />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="إغلاق"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-72 overflow-y-auto bg-card shadow-2xl">
            <SidebarBody onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:ps-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-5 py-4">
            <button
              className="grid size-10 place-items-center rounded-xl border border-border lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="القائمة"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-xl font-black md:text-2xl">{title}</h1>
              {lead ? <p className="truncate text-sm text-muted-foreground">{lead}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              <button
                className="relative grid size-10 place-items-center rounded-xl border border-border transition-colors hover:bg-secondary"
                aria-label="التنبيهات"
              >
                <Bell className="size-4.5" />
                <span className="absolute end-2.5 top-2.5 size-2 rounded-full bg-coral" />
              </button>
              <span className="grid size-10 place-items-center rounded-xl bg-foreground font-display text-sm font-black text-background">
                ع
              </span>
            </div>
          </div>
        </header>
        <main className={padded ? "px-5 py-7" : ""}>{children}</main>
      </div>
    </div>
  );
}
