"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import tiers from "@/data/milestones"
import { getDefaultRecipe } from "@/data/recipes"
import { calculate, getMilestoneById } from "@/lib/calculator"
import type { CalcResult } from "@/lib/calculator"
import MilestoneGroup from "@/components/MilestoneGroup"
import ResultsPanel from "@/components/ResultsPanel"

const allMilestones = tiers.flatMap((t) => t.milestones)

function loadPersistedState() {
  if (typeof window === "undefined") return { checked: [] as string[], recipes: {} as Record<string, string> }
  try {
    const checked = JSON.parse(localStorage.getItem("sf-checked") || "[]")
    const recipes = JSON.parse(localStorage.getItem("sf-recipes") || "{}")
    return { checked, recipes }
  } catch {
    return { checked: [] as string[], recipes: {} as Record<string, string> }
  }
}

export default function Home() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [activeRecipes, setActiveRecipes] = useState<Record<string, string>>({})
  const [result, setResult] = useState<CalcResult>({ totals: {}, rawResources: {}, tree: [] })
  const [expandedTiers, setExpandedTiers] = useState<Set<number>>(new Set())
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const { checked, recipes } = loadPersistedState()
    setCheckedIds(new Set(checked))
    setActiveRecipes(recipes)
    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) return
    const ids = Array.from(checkedIds)
    localStorage.setItem("sf-checked", JSON.stringify(ids))

    const calcResult = calculate(ids, activeRecipes)
    setResult(calcResult)

    try {
      fetch("/api/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkedMilestones: ids,
          activeRecipes,
          totals: calcResult.totals,
          rawResources: calcResult.rawResources,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch {}
  }, [checkedIds, activeRecipes, initialized])

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

  const handleClearAll = useCallback(() => {
    setCheckedIds(new Set())
    setSelectedMilestoneId(null)
  }, [])

  const handleToggleAll = useCallback(() => {
    setExpandedTiers((prev) => {
      if (prev.size > 0) return new Set()
      return new Set(tiers.map((t) => t.number))
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

  const hasAnyExpanded = expandedTiers.size > 0

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/80 sticky top-0 z-30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-yellow-500">Satisfactory</span>{" "}
            <span className="text-zinc-400 font-normal">Milestone Planner</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAll}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              {hasAnyExpanded ? "Collapse All" : "Expand All"}
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-zinc-400 mb-4 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Milestones
            </h2>
            <div className="flex flex-col gap-2">
              {tiers.map((tier) => (
                <MilestoneGroup
                  key={tier.number}
                  tier={tier}
                  checkedIds={checkedIds}
                  selectedId={selectedMilestoneId}
                  expanded={expandedTiers.has(tier.number)}
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
                onRecipeSelect={handleRecipeSelect}
              />
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        Satisfactory Milestone Planner &mdash; Data based on Satisfactory 1.0
      </footer>
    </div>
  )
}
