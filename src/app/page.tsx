"use client"

import { useState, useCallback, useEffect } from "react"
import tiers from "@/data/milestones"
import { getDefaultRecipe } from "@/data/recipes"
import { calculate, getMilestoneById } from "@/lib/calculator"
import type { CalcResult } from "@/lib/calculator"
import MilestoneGroup from "@/components/MilestoneGroup"
import ResultsPanel from "@/components/ResultsPanel"
import SettingsPanel from "@/components/SettingsPanel"

const allMilestones = tiers.flatMap((t) => t.milestones)

interface PersistedState {
  checked: string[]
  recipes: Record<string, string>
  hidden: string[]
  inventory: Record<string, string[]>
}

function loadPersistedState(): PersistedState {
  if (typeof window === "undefined") return { checked: [], recipes: {}, hidden: [], inventory: {} }
  try {
    const checked = JSON.parse(localStorage.getItem("sf-checked") || "[]")
    const recipes = JSON.parse(localStorage.getItem("sf-recipes") || "{}")
    const hidden = JSON.parse(localStorage.getItem("sf-hidden") || "[]")
    const inventory = JSON.parse(localStorage.getItem("sf-inventory") || "{}")
    return { checked, recipes, hidden, inventory }
  } catch {
    return { checked: [], recipes: {}, hidden: [], inventory: {} }
  }
}

export default function Home() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [activeRecipes, setActiveRecipes] = useState<Record<string, string>>({})
  const [result, setResult] = useState<CalcResult>({ totals: {}, rawResources: {}, tree: [] })
  const [expandedTiers, setExpandedTiers] = useState<Set<number>>(new Set())
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null)
  const [hiddenParts, setHiddenParts] = useState<Set<string>>(new Set())
  const [inventory, setInventory] = useState<Record<string, string[]>>({})
  const [showSettings, setShowSettings] = useState(false)
  const [showPreviousTiers, setShowPreviousTiers] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const { checked, recipes, hidden, inventory } = loadPersistedState()
    setCheckedIds(new Set(checked))
    setActiveRecipes(recipes)
    setHiddenParts(new Set(hidden))
    setInventory(inventory)
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) return
    const ids = Array.from(checkedIds)
    localStorage.setItem("sf-checked", JSON.stringify(ids))
    localStorage.setItem("sf-hidden", JSON.stringify(Array.from(hiddenParts)))
    localStorage.setItem("sf-inventory", JSON.stringify(inventory))

    const calcResult = calculate(ids, activeRecipes)
    setResult(calcResult)
  }, [checkedIds, activeRecipes, hiddenParts, inventory, initialized])

  useEffect(() => {
    if (!initialized) return

    let highestFullyChecked = -1
    let highestChecked = -1

    for (const tier of tiers) {
      const count = tier.milestones.filter((m) => checkedIds.has(m.id)).length
      if (count > 0) highestChecked = tier.number
      if (count === tier.milestones.length && tier.milestones.length > 0) {
        highestFullyChecked = tier.number
      }
    }

    setExpandedTiers((prev) => {
      const next = new Set(prev)
      for (const tier of tiers) {
        if (tier.number < highestChecked) {
          next.delete(tier.number)
        }
      }
      if (highestFullyChecked >= 0 && highestFullyChecked < 9) {
        next.add(highestFullyChecked + 1)
      }
      return next
    })

    if (highestFullyChecked >= 0 && highestFullyChecked < 9) {
      const nextTier = tiers.find((t) => t.number === highestFullyChecked + 1)
      if (nextTier && nextTier.milestones.length > 0) {
        setSelectedMilestoneId((prev) => {
          const current = prev ? allMilestones.find((m) => m.id === prev) : undefined
          if (!current || current.tier <= highestFullyChecked) {
            return nextTier.milestones[0].id
          }
          return prev
        })
      }
    }
  }, [checkedIds, initialized])

  const handleToggle = useCallback((id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        return next
      }
      next.add(id)
      const milestone = allMilestones.find((m) => m.id === id)
      if (milestone) {
        for (let tn = 0; tn < milestone.tier; tn++) {
          const lowerTier = tiers.find((t) => t.number === tn)
          if (lowerTier) {
            for (const m of lowerTier.milestones) {
              next.add(m.id)
            }
          }
        }
      }
      return next
    })
  }, [])

  const handleInventoryToggle = useCallback((milestoneId: string, partId: string) => {
    setInventory((prev) => {
      const current = prev[milestoneId] || []
      if (current.includes(partId)) {
        const filtered = current.filter((id) => id !== partId)
        return filtered.length === 0
          ? { ...prev, [milestoneId]: [] }
          : { ...prev, [milestoneId]: filtered }
      }
      return { ...prev, [milestoneId]: [...current, partId] }
    })
  }, [])

  const handleSelect = useCallback((id: string) => {
    setSelectedMilestoneId(id)
  }, [])

  const handleRecipeSelect = useCallback((partId: string, recipeId: string) => {
    setActiveRecipes((prev) => {
      const defaultRecipe = getDefaultRecipe(partId)
      if (defaultRecipe && defaultRecipe.id === recipeId) {
        const next = { ...prev }
        delete next[partId]
        return next
      }
      return { ...prev, [partId]: recipeId }
    })
  }, [])

  const handleToggleHidden = useCallback((partId: string) => {
    setHiddenParts((prev) => {
      const next = new Set(prev)
      if (next.has(partId)) next.delete(partId)
      else next.add(partId)
      return next
    })
  }, [])

  const handleToggleExpand = useCallback((tierNumber: number) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev)
      if (next.has(tierNumber)) next.delete(tierNumber)
      else next.add(tierNumber)
      return next
    })
  }, [])

  const firstIncompleteTier = tiers.findIndex(
    (t) => t.milestones.some((m) => !checkedIds.has(m.id))
  )
  const visibleTiers = showPreviousTiers
    ? tiers
    : tiers.slice(firstIncompleteTier >= 0 ? firstIncompleteTier : 0)

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-yellow-500">Satisfactory</span>{" "}
            <span className="text-zinc-400 font-normal">Milestone Planner</span>
          </h1>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/willklein/satisfactor"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-zinc-700 p-1.5 text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings((p) => !p)}
                className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              {showSettings && (
                <SettingsPanel
                  hiddenParts={hiddenParts}
                  onToggle={handleToggleHidden}
                  onClose={() => setShowSettings(false)}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Milestones
              </h2>
              <button
                type="button"
                onClick={() => setShowPreviousTiers((p) => !p)}
                className="rounded-lg border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
              >
                {showPreviousTiers ? "Hide Completed" : "Show All"}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {visibleTiers.map((tier) => (
                <MilestoneGroup
                  key={tier.number}
                  tier={tier}
                  checkedIds={checkedIds}
                  selectedId={selectedMilestoneId}
                  expanded={expandedTiers.has(tier.number)}
                  hiddenParts={hiddenParts}
                  onSelect={handleSelect}
                  onToggle={handleToggle}
                  onToggleExpand={() => handleToggleExpand(tier.number)}
                />
              ))}
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-96 xl:w-[420px]">
            <div className="lg:sticky lg:top-16">
              <h2 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
                <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Calculation
              </h2>
              <ResultsPanel
                selectedMilestoneId={selectedMilestoneId}
                activeRecipes={activeRecipes}
                hiddenParts={hiddenParts}
                checkedIds={checkedIds}
                inventory={inventory}
                onRecipeSelect={handleRecipeSelect}
                onInventoryToggle={handleInventoryToggle}
              />
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        Satisfactory Milestone Planner &mdash; Data based on Satisfactory 1.0 &mdash;{" "}
        <a href="https://github.com/willklein/satisfactor" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Source</a>
        {" / "}
        <a href="https://github.com/willklein/satisfactor/issues" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Issues</a>
      </footer>
    </div>
  )
}
