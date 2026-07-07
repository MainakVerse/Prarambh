"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/lib/icons";
import { Reveal } from "@/components/ui/Reveal";
import { communityPosts, type CommunityPost } from "@/lib/dashboard-data";
import { cn } from "@/lib/cn";

const categories: (CommunityPost["category"] | "All")[] = [
  "All",
  "Template",
  "Discussion",
  "Best Practice",
];

const categoryTone: Record<CommunityPost["category"], string> = {
  Template: "bg-primary-100 text-primary-700",
  Discussion: "bg-accent-100 text-accent-700",
  "Best Practice": "bg-green-100 text-green-800",
};

export default function CommunityPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    return communityPosts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="flex flex-col gap-6">
      <Reveal>
        <div>
          <h1 className="text-xl font-bold text-ink">Community</h1>
          <p className="text-sm text-ink-muted">
            Templates, discussions, and best practices shared by teams on Prarambh.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search discussions and templates…"
              aria-label="Search community"
              className="w-full rounded-xl border border-white/70 bg-white/60 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint shadow-neo-inset-sm focus:bg-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-cream-100 p-1 shadow-neo-inset-sm">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                  category === c ? "bg-white text-ink shadow-neo-xs" : "text-ink-muted hover:text-ink-soft"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex flex-col gap-4">
          {filtered.length > 0 ? (
            filtered.map((post) => (
              <article key={post.id} className="glass rounded-3xl p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", categoryTone[post.category])}>
                    {post.category}
                  </span>
                  <span className="text-xs text-ink-muted">by {post.author}</span>
                  <span className="text-xs text-ink-faint">· {post.updatedAt}</span>
                </div>
                <h2 className="mt-2 text-base font-semibold text-ink">{post.title}</h2>
                <p className="mt-1 text-sm text-ink-body">{post.excerpt}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
                  <Icon.message className="h-3.5 w-3.5" />
                  {post.replies} replies
                </div>
              </article>
            ))
          ) : (
            <div className="glass rounded-3xl p-10 text-center text-sm text-ink-muted">
              Nothing matches "{query}".
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
