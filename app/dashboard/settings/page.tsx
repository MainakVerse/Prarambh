"use client";

import { useState } from "react";
import { Icon, type IconKey } from "@/lib/icons";
import { Reveal } from "@/components/ui/Reveal";
import { NeoToggle } from "@/components/ui/NeoToggle";
import { cn } from "@/lib/cn";

type SectionKey = "profile" | "team" | "notifications" | "integrations" | "billing";

const sections: { key: SectionKey; label: string; icon: IconKey }[] = [
  { key: "profile", label: "Profile", icon: "users" },
  { key: "team", label: "Team & Roles", icon: "scale" },
  { key: "notifications", label: "Notifications", icon: "bell" },
  { key: "integrations", label: "Integrations", icon: "server" },
  { key: "billing", label: "Billing", icon: "clipboard" },
];

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <input
        defaultValue={defaultValue}
        className="rounded-xl border border-white/70 bg-white/60 px-3.5 py-2.5 text-sm text-ink shadow-neo-inset-sm focus:bg-white"
      />
    </label>
  );
}

function ToggleRow({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/40 p-3.5">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <NeoToggle label={label} defaultChecked={defaultChecked} />
    </div>
  );
}

const raci = [
  { name: "Mainak Chaudhuri", role: "Sponsor", raci: "A" },
  { name: "Priya Nair", role: "Business Analyst", raci: "R" },
  { name: "Arjun Mehta", role: "Solution Architect", raci: "R" },
  { name: "Devika Rao", role: "QA Lead", raci: "C" },
  { name: "Sam Okafor", role: "Ops Manager", raci: "I" },
];

function SectionContent({ section }: { section: SectionKey }) {
  if (section === "profile") {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-accent-400 to-primary-500 text-lg font-bold text-white shadow-neo-xs">
            MC
          </span>
          <button type="button" className="rounded-xl bg-cream-100 px-3.5 py-2 text-xs font-medium text-ink shadow-neo-xs hover:shadow-neo-sm">
            Change avatar
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" defaultValue="Mainak Chaudhuri" />
          <Field label="Email" defaultValue="mainakchaudhuri671@gmail.com" />
          <Field label="Role" defaultValue="Sponsor" />
          <Field label="Time zone" defaultValue="Asia/Kolkata" />
        </div>
      </div>
    );
  }

  if (section === "team") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-xs text-ink-muted">
              <th className="pb-2 font-medium">Member</th>
              <th className="pb-2 font-medium">Role</th>
              <th className="pb-2 font-medium">RACI</th>
            </tr>
          </thead>
          <tbody>
            {raci.map((m) => (
              <tr key={m.name} className="border-t border-white/60">
                <td className="py-2.5 font-medium text-ink">{m.name}</td>
                <td className="py-2.5 text-ink-body">{m.role}</td>
                <td className="py-2.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {m.raci}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section === "notifications") {
    return (
      <div className="flex flex-col gap-3">
        <ToggleRow label="Gate review reminders" description="Email me 48 hours before a scheduled gate review." defaultChecked />
        <ToggleRow label="Blocked stage alerts" description="Notify me immediately when any stage becomes blocked." defaultChecked />
        <ToggleRow label="Weekly digest" description="Summarize portfolio activity every Monday morning." />
        <ToggleRow label="Community replies" description="Notify me when someone replies to my post." />
      </div>
    );
  }

  if (section === "integrations") {
    return (
      <div className="flex flex-col gap-3">
        {["Slack", "Jira", "GitHub", "Google Drive"].map((name) => (
          <div key={name} className="flex items-center justify-between rounded-2xl bg-white/40 p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-100 text-primary-600">
                <Icon.server className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium text-ink">{name}</p>
            </div>
            <button type="button" className="rounded-xl bg-cream-100 px-3.5 py-1.5 text-xs font-medium text-ink shadow-neo-xs hover:shadow-neo-sm">
              Connect
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-2xl p-4">
        <p className="text-sm font-semibold text-ink">Starter plan</p>
        <p className="text-xs text-ink-muted">Up to 3 projects, 5 team members.</p>
      </div>
      <button type="button" className="w-fit rounded-xl bg-gradient-to-b from-primary-400 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow-primary hover:from-primary-500 hover:to-primary-600">
        Upgrade plan
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState<SectionKey>("profile");

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <h1 className="text-xl font-bold text-ink">Settings</h1>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)]">
        <nav aria-label="Settings sections" className="glass flex flex-row gap-1 overflow-x-auto rounded-2xl p-2 lg:flex-col lg:overflow-visible">
          {sections.map((s) => {
            const SIcon = Icon[s.icon];
            const isActive = active === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActive(s.key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  isActive ? "bg-cream-100 font-medium text-ink shadow-neo-inset-sm" : "text-ink-muted hover:bg-white/70 hover:text-ink"
                )}
              >
                <SIcon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{s.label}</span>
              </button>
            );
          })}
        </nav>

        <Reveal delay={0.05} className="glass rounded-3xl p-5 sm:p-6">
          <SectionContent section={active} />
        </Reveal>
      </div>
    </div>
  );
}
