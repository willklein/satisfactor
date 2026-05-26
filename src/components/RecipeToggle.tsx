"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { getRecipesForPart, getPartName } from "@/data/recipes"

interface RecipeToggleProps {
  partId: string
  activeRecipeId: string
  onSelect: (partId: string, recipeId: string) => void
}

const closeListeners = new Set<() => void>()

export default function RecipeToggle({ partId, activeRecipeId, onSelect }: RecipeToggleProps) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const recipes = getRecipesForPart(partId)

  useEffect(() => {
    const fn = () => setOpen(false)
    if (open) {
      closeListeners.add(fn)
    }
    return () => { closeListeners.delete(fn) }
  }, [open])

  const openThis = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    closeListeners.forEach((fn) => fn())
    setOpen(true)
  }, [])

  if (recipes.length === 0) return null

  const hasMultiple = recipes.length > 1

  function startClose() {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 300)
  }

  function cancelClose() {
    if (timer.current) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={openThis}
        onMouseLeave={startClose}
        className="inline-flex items-center gap-1 rounded bg-zinc-700/60 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
      >
        {hasMultiple && (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
        Recipe
      </button>
      {open && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
          className="absolute right-0 top-full z-20 mt-1 w-64 rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl"
        >
          <div className="border-b border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400">
            {getPartName(partId)} recipes
          </div>
          {recipes.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                onSelect(partId, r.id)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-zinc-800 ${
                r.id === activeRecipeId ? "text-yellow-400" : "text-zinc-300"
              }`}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                r.id === activeRecipeId ? "bg-yellow-400" : "bg-zinc-600"
              }`} />
              <div className="flex-1 min-w-0">
                <span className="block truncate">
                  {r.isAlternate ? `Alt: ${r.name}` : r.name}
                </span>
                <span className="block text-zinc-500">
                  {r.inputs.map((i) => `${i.quantity}× ${getPartName(i.partId)}`).join(", ")
                  }{" → "}{r.outputs.quantity}×
                </span>
              </div>
              {r.id === activeRecipeId && (
                <svg className="h-3 w-3 shrink-0 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
