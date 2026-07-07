import { Icon } from "@/lib/icons";
import type { Stage } from "@/lib/stages";

/** Stage not started yet — teaches what the stage produces instead of showing a blank grid. */
export function StageEmptyState({ stage }: { stage: Stage }) {
  const StageIcon = Icon[stage.icon];
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-100 text-primary-600">
        <StageIcon className="h-6 w-6" />
      </span>
      <h3 className="text-base font-semibold text-ink">{stage.name} hasn&apos;t started yet</h3>
      <p className="max-w-md text-sm text-ink-body">{stage.purpose}</p>
      <p className="text-xs text-ink-muted">
        Entry criteria: {stage.entryCriteria}
      </p>
      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-muted shadow-neo-inset-sm">
        <Icon.lock className="h-3 w-3" />
        Owner: {stage.owner}
      </span>
    </div>
  );
}

export function StageLoadingState() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Loading stage">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[68px] animate-pulse rounded-2xl bg-cream-200/70" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-cream-200/70" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-3xl bg-cream-200/70" />
    </div>
  );
}

export function StageBlockedState({
  blockers,
}: {
  blockers: { reason: string; owner: string; since: string }[];
}) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50/80 p-5">
      <div className="flex items-center gap-2 text-red-900">
        <Icon.warning className="h-5 w-5" />
        <h3 className="text-sm font-semibold">This stage is blocked</h3>
      </div>
      <ul className="mt-3 flex flex-col gap-2.5">
        {blockers.map((b, i) => (
          <li key={i} className="rounded-2xl bg-white/70 p-3 text-sm">
            <p className="font-medium text-ink">{b.reason}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Blocking: {b.owner} · since {b.since}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Viewer role: status is visible, but document contents are withheld. */
export function StagePermissionPartialState() {
  return (
    <div className="glass flex flex-col items-center gap-2.5 rounded-3xl px-6 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-100 text-ink-faint">
        <Icon.lock className="h-5 w-5" />
      </span>
      <h3 className="text-sm font-semibold text-ink">Documents are restricted</h3>
      <p className="max-w-sm text-sm text-ink-muted">
        You can see this stage&apos;s status and timeline, but your role doesn&apos;t include document access.
        Ask the stage owner to grant you Contributor or Reviewer access.
      </p>
    </div>
  );
}
