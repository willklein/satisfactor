"use client"

import type { PartCost } from "@/data/milestones"
import { getPartName } from "@/data/recipes"

interface MilestoneRowProps {
  id: string
  name: string
  parts: PartCost[]
  checked: boolean
  selected: boolean
  hiddenParts: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}

export default function MilestoneRow({ id, name, parts, checked, selected, hiddenParts, onSelect, onToggle }: MilestoneRowProps) {
  const visibleParts = parts.filter((p) => !hiddenParts.has(p.partId))
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
        selected
          ? "border-cyan-500/50 bg-cyan-500/10"
          : checked
            ? "border-yellow-500/50 bg-yellow-500/5"
            : "border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/50"
      }`}
      onClick={() => onSelect(id)}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => { e.stopPropagation(); onToggle(id) }}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-700 text-yellow-500 focus:ring-yellow-500/50 focus:ring-offset-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-100 truncate">{name}</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {visibleParts.map((p) => (
            <span key={p.partId} className="text-xs text-zinc-400 whitespace-nowrap">
              {p.quantity.toLocaleString()}× {getPartName(p.partId)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
