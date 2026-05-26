"use client"

import { useMemo, useEffect, useRef } from "react"
import { partDepths, getPartName } from "@/data/recipes"

interface SettingsPanelProps {
  hiddenParts: Set<string>
  onToggle: (partId: string) => void
  onClose: () => void
}

const MAX_DEPTH = 2

export default function SettingsPanel({ hiddenParts, onToggle, onClose }: SettingsPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const parts = useMemo(
    () =>
      Object.entries(partDepths)
        .filter(([, depth]) => depth <= MAX_DEPTH)
        .sort((a, b) => a[1] - b[1] || getPartName(a[0]).localeCompare(getPartName(b[0])))
        .map(([id, depth]) => ({ id, depth, name: getPartName(id) })),
    []
  )

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-zinc-700 bg-zinc-800 shadow-xl z-40 max-h-96 overflow-y-auto"
    >
      <div className="sticky top-0 bg-zinc-800 p-3 border-b border-zinc-700/50">
        <h3 className="text-xs font-semibold text-zinc-300">Hide Low-Depth Parts</h3>
        <p className="text-xs text-zinc-500 mt-0.5">Parts with depth &#8804; {MAX_DEPTH}</p>
      </div>
      <div className="p-2 flex flex-col gap-0.5">
        {parts.map(({ id, depth, name }) => (
          <label
            key={id}
            className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-zinc-700/40 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={hiddenParts.has(id)}
              onChange={() => onToggle(id)}
              className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-700 text-yellow-500 focus:ring-yellow-500/50 focus:ring-offset-0"
            />
            <span className="text-xs text-zinc-300 flex-1 truncate">{name}</span>
            <span className="text-xs text-zinc-500 shrink-0">d{depth}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
