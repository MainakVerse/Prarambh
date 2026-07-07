import { Icon } from "@/lib/icons";
import type { ActivityItem } from "@/lib/dashboard-data";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.round(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function ActivityTimeline({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="glass rounded-3xl p-5 text-sm text-ink-muted">
        No activity yet in this stage.
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="text-sm font-semibold text-ink">Activity</h3>
      <ol className="mt-3 flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-100 text-primary-600">
              <Icon.message className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm text-ink-body">
              <span className="font-medium text-ink">{item.actor}</span> {item.action}{" "}
              <span className="font-medium text-ink">{item.target}</span>
              <span className="block text-xs text-ink-faint">{timeAgo(item.timestamp)}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
