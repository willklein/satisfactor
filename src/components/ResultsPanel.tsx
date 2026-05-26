"use client"

import { useState, useMemo } from "react"
import { calculateSingle, getMilestoneById, type CalcNode } from "@/lib/calculator"
import { getPartName, getPartDepth, isRawResource, getRecipesForPart } from "@/data/recipes"
import tiers from "@/data/milestones"
import RecipeToggle from "./RecipeToggle"

interface ResultsPanelProps {
  selectedMilestoneId: string | null
  activeRecipes: Record<string, string>
  hiddenParts: Set<string>
  checkedIds: Set<string>
  inventory: Record<string, string[]>
  onRecipeSelect: (partId: string, recipeId: string) => void
  onInventoryToggle: (milestoneId: string, partId: string) => void
}

function pruneHiddenNodes(nodes: CalcNode[], hiddenParts: Set<string>): CalcNode[] {
  return nodes.reduce<CalcNode[]>((acc, node) => {
    if (hiddenParts.has(node.partId)) return acc
    acc.push({ ...node, children: pruneHiddenNodes(node.children, hiddenParts) })
    return acc
  }, [])
}

interface TreeNodeProps {
  node: CalcNode
  depth?: number
  activeRecipes: Record<string, string>
  onRecipeSelect: (partId: string, recipeId: string) => void
}

function TreeNode({ node, depth = 0, activeRecipes, onRecipeSelect }: TreeNodeProps) {
  if (node.partId.startsWith("milestone:")) {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-zinc-200 mb-2">{node.name}</h4>
        <div className="flex flex-col gap-1">
          {node.children.map((child) => (
            <TreeNode key={child.partId} node={child} depth={0} activeRecipes={activeRecipes} onRecipeSelect={onRecipeSelect} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={depth === 0 ? "border-b border-zinc-700/30 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0" : ""}>
      <div
        className="flex items-center gap-2 py-1"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <span className="text-sm text-zinc-300">{node.name}</span>
        <span className="text-sm tabular-nums text-zinc-100 font-medium">
          {node.quantity.toLocaleString()}
        </span>
        <RecipeToggle
          partId={node.partId}
          activeRecipeId={activeRecipes[node.partId] || node.partId}
          onSelect={onRecipeSelect}
        />
      </div>
      {depth < 5 && node.children.length > 0 && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.partId} node={child} depth={depth + 1} activeRecipes={activeRecipes} onRecipeSelect={onRecipeSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

function getIntermediateEntries(
  tree: CalcNode[],
  totals: Record<string, number>
): [string, number, number][] {
  const parts = new Set<string>()
  const queue: CalcNode[] = []

  for (const node of tree) {
    if (node.partId.startsWith("milestone:")) {
      for (const child of node.children) {
        queue.push(child)
      }
    }
  }

  while (queue.length > 0) {
    const node = queue.shift()!
    if (!isRawResource(node.partId) && !parts.has(node.partId)) {
      parts.add(node.partId)
    }
    if (!isRawResource(node.partId)) {
      for (const child of node.children) {
        queue.push(child)
      }
    }
  }

  return Array.from(parts)
    .map((id) => [id, totals[id] || 0, getPartDepth(id)] as [string, number, number])
    .filter(([, qty]) => qty > 0)
    .sort((a, b) => b[2] - a[2] || b[1] - a[1])
}

export default function ResultsPanel({
  selectedMilestoneId,
  activeRecipes,
  hiddenParts,
  checkedIds,
  inventory,
  onRecipeSelect,
  onInventoryToggle,
}: ResultsPanelProps) {
  const [showRaw, setShowRaw] = useState(true)
  const [showTierRemaining, setShowTierRemaining] = useState(true)
  const [showIntermediate, setShowIntermediate] = useState(true)

  const result = useMemo(() => {
    if (!selectedMilestoneId) return null
    const invParts = inventory[selectedMilestoneId]
    return calculateSingle(selectedMilestoneId, activeRecipes, invParts ? new Set(invParts) : undefined)
  }, [selectedMilestoneId, activeRecipes, inventory])

  const remainingTierParts = useMemo(() => {
    if (!selectedMilestoneId) return null
    const milestone = getMilestoneById(selectedMilestoneId)
    if (!milestone) return null
    const tierData = tiers.find((t) => t.number === milestone.tier)
    if (!tierData) return null
    const totals: Record<string, number> = {}
    for (const m of tierData.milestones) {
      if (checkedIds.has(m.id)) continue
      for (const part of m.parts) {
        totals[part.partId] = (totals[part.partId] || 0) + part.quantity
      }
    }
    return Object.entries(totals)
      .filter(([, qty]) => qty > 0)
      .sort(([, a], [, b]) => b - a)
  }, [selectedMilestoneId, checkedIds])

  const prunedTree = useMemo(
    () => (result ? pruneHiddenNodes(result.tree, hiddenParts) : []),
    [result, hiddenParts]
  )

  const sortedRaw = useMemo(
    () =>
      result
        ? Object.entries(result.rawResources)
            .filter(([, qty]) => qty > 0)
            .sort(([, a], [, b]) => b - a)
        : [],
    [result]
  )

  const sortedIntermediate = useMemo(
    () =>
      result
        ? getIntermediateEntries(result.tree, result.totals).filter(
            ([id]) => !hiddenParts.has(id)
          )
        : [],
    [result, hiddenParts]
  )

  return (
    <div className="flex flex-col gap-6">
      {!result ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="h-12 w-12 text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-zinc-500">Click a milestone to see its parts breakdown</p>
        </div>
      ) : (
        <>
          {selectedMilestoneId && result && (() => {
            const milestone = getMilestoneById(selectedMilestoneId)
            const invParts = inventory[selectedMilestoneId] || []
            if (!milestone) return null
            const topLevelIds = new Set(milestone.parts.map((p) => p.partId))
            const intermediateIds = Object.keys(result.totals).filter(
              (id) => !isRawResource(id) && !topLevelIds.has(id)
            )
            const sortedIds = [
              ...milestone.parts.map((p) => p.partId),
              ...intermediateIds.sort((a, b) => getPartDepth(b) - getPartDepth(a)),
            ].filter((id) => !hiddenParts.has(id))
            return (
              <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                  <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Inventory
                </h3>
                <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/20 p-4">
                  <p className="text-xs text-zinc-500 mb-3">Mark parts you already have to exclude them from the calculation.</p>
                  <div className="flex flex-col gap-1">
                    {sortedIds.map((partId) => (
                      <label key={partId} className="flex items-center gap-2 rounded bg-zinc-800/40 px-3 py-1.5 cursor-pointer hover:bg-zinc-700/40 transition-colors">
                        <input
                          type="checkbox"
                          checked={invParts.includes(partId)}
                          onChange={() => onInventoryToggle(selectedMilestoneId, partId)}
                          className="rounded border-zinc-600 bg-zinc-700 text-yellow-500 focus:ring-yellow-500/40"
                        />
                        <span className="text-xs text-zinc-300">{getPartName(partId)}</span>
                        <RecipeToggle
                          partId={partId}
                          activeRecipeId={activeRecipes[partId] || partId}
                          onSelect={onRecipeSelect}
                        />
                        <span className="text-xs tabular-nums text-zinc-100 font-medium ml-auto">
                          {(result.totals[partId] || milestone.parts.find((p) => p.partId === partId)?.quantity || 0).toLocaleString()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {remainingTierParts && remainingTierParts.length > 0 && (() => {
            const tier = tiers.find((t) => t.milestones.some((m) => m.id === selectedMilestoneId))
            return (
              <div>
                <button
                  type="button"
                  onClick={() => setShowTierRemaining(!showTierRemaining)}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-3"
                >
                  <svg className={`h-3 w-3 text-zinc-500 transition-transform ${showTierRemaining ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {tier ? `${tier.name} Remaining` : "Tier Remaining"}
                  <span className="text-xs text-zinc-500 font-normal">({remainingTierParts.length})</span>
                </button>
                {showTierRemaining && (
                  <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/20 p-4">
                    <div className="flex flex-col gap-1">
                      {remainingTierParts.map(([partId, qty]) => (
                        <div key={partId} className="flex items-center justify-between rounded bg-zinc-800/40 px-3 py-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs text-zinc-300 truncate">{getPartName(partId)}</span>
                            <RecipeToggle
                              partId={partId}
                              activeRecipeId={activeRecipes[partId] || partId}
                              onSelect={onRecipeSelect}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-zinc-100 font-medium shrink-0 ml-3">{qty.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Parts Breakdown
            </h3>
            <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/20 p-4">
              {prunedTree.map((node) => (
                <TreeNode key={node.partId} node={node} activeRecipes={activeRecipes} onRecipeSelect={onRecipeSelect} />
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-3"
            >
              <svg className={`h-3 w-3 text-zinc-500 transition-transform ${showRaw ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Raw Resources Required
              <span className="text-xs text-zinc-500 font-normal">({sortedRaw.length})</span>
            </button>
            {showRaw && (
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/20 p-4">
                {sortedRaw.length === 0 ? (
                  <p className="text-xs text-zinc-500">No raw resources</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {sortedRaw.map(([id, qty]) => (
                      <div key={id} className="flex items-center justify-between rounded bg-zinc-800/40 px-3 py-1.5">
                        <span className="text-xs text-zinc-400">{getPartName(id)}</span>
                        <span className="text-xs tabular-nums text-zinc-100 font-medium">{qty.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowIntermediate(!showIntermediate)}
              className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-3"
            >
              <svg className={`h-3 w-3 text-zinc-500 transition-transform ${showIntermediate ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Intermediate Parts
              <span className="text-xs text-zinc-500 font-normal">({sortedIntermediate.length})</span>
            </button>
            {showIntermediate && (
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/20 p-4">
                {sortedIntermediate.length === 0 ? (
                  <p className="text-xs text-zinc-500">No milestones checked</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {sortedIntermediate.map(([id, qty]) => (
                      <div key={id} className="flex items-center justify-between rounded bg-zinc-800/40 px-3 py-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-zinc-300 truncate">{getPartName(id)}</span>
                          <RecipeToggle
                            partId={id}
                            activeRecipeId={activeRecipes[id] || id}
                            onSelect={onRecipeSelect}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-zinc-100 font-medium shrink-0 ml-3">
                          {qty.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
