import fs from "fs"
import path from "path"

const CACHE_PATH = path.join(process.cwd(), "public", "cache", "calculated-totals.json")

export interface CacheData {
  checkedMilestones: string[]
  activeRecipes: Record<string, string>
  totals: Record<string, number>
  rawResources: Record<string, number>
  timestamp: string
}

export function writeCache(data: CacheData): void {
  try {
    const dir = path.dirname(CACHE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2), "utf-8")
  } catch {
    // Silently fail in browser/runtime errors
  }
}

export function readCache(): CacheData | null {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const raw = fs.readFileSync(CACHE_PATH, "utf-8")
      return JSON.parse(raw)
    }
  } catch {
    // Silently fail
  }
  return null
}
