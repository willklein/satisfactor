"use client"

import type { Tier } from "@/data/milestones"
import MilestoneRow from "./MilestoneRow"

interface MilestoneGroupProps {
  tier: Tier
  checkedIds: Set<string>
  selectedId: string | null
  expanded: boolean
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onToggleExpand: () => void
}

export default function MilestoneGroup({
  tier,
  checkedIds,
  selectedId,
  expanded,
  onSelect,
  onToggle,
  onToggleExpand,
}: MilestoneGroupProps) {
  const checkedCount = tier.milestones.filter((m) => checkedIds.has(m.id)).length
  const fullyChecked = checkedCount === tier.milestones.length && tier.milestones.length > 0

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-opacity ${
        fullyChecked
          ? "border-zinc-700/30 bg-zinc-800/10 opacity-60"
          : "border-zinc-700/50 bg-zinc-800/20"
      }`}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className="flex w-full items-center justify-between gap-2 px-5 py-3 text-left transition-colors hover:bg-zinc-800/40"
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg
            className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span
            className={`text-sm font-semibold truncate ${
              fullyChecked ? "text-zinc-500" : "text-zinc-200"
            }`}
          >
            Tier {tier.number}: {tier.name}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
              fullyChecked
                ? "bg-zinc-700/40 text-zinc-500"
                : "bg-zinc-700/60 text-zinc-400"
            }`}
          >
            {checkedCount}/{tier.milestones.length}
          </span>
          <span className="shrink-0 text-xs text-zinc-500">{tier.phase}</span>
        </div>
      </button>
      {expanded && (
        <div className="flex flex-col gap-2 px-5 pb-4">
          {tier.milestones.map((m) => (
            <MilestoneRow
              key={m.id}
              id={m.id}
              name={m.name}
              parts={m.parts}
              checked={checkedIds.has(m.id)}
              selected={selectedId === m.id}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
