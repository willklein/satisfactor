import tiers, { type Milestone, type PartCost } from "@/data/milestones"
import { getDefaultRecipe, getRecipesForPart, isRawResource } from "@/data/recipes"

export interface CalcNode {
  partId: string
  name: string
  quantity: number
  children: CalcNode[]
}

export interface CalcResult {
  totals: Record<string, number>
  rawResources: Record<string, number>
  tree: CalcNode[]
}

function getPartName(partId: string): string {
  const names: Record<string, string> = {
    "iron-ore": "Iron Ore",
    "copper-ore": "Copper Ore",
    "limestone": "Limestone",
    "coal": "Coal",
    "crude-oil": "Crude Oil",
    "bauxite": "Bauxite",
    "raw-quartz": "Raw Quartz",
    "caterium-ore": "Caterium Ore",
    "sulfur": "Sulfur",
    "uranium": "Uranium",
    "nitrogen-gas": "Nitrogen Gas",
    "sam": "SAM",
    "water": "Water",
    "iron-ingot": "Iron Ingot",
    "copper-ingot": "Copper Ingot",
    "concrete": "Concrete",
    "wire": "Wire",
    "cable": "Cable",
    "iron-plate": "Iron Plate",
    "iron-rod": "Iron Rod",
    "screw": "Screw",
    "reinforced-iron-plate": "Reinforced Iron Plate",
    "rotor": "Rotor",
    "copper-sheet": "Copper Sheet",
    "modular-frame": "Modular Frame",
    "steel-ingot": "Steel Ingot",
    "steel-beam": "Steel Beam",
    "steel-pipe": "Steel Pipe",
    "versatile-framework": "Versatile Framework",
    "encased-industrial-beam": "Encased Industrial Beam",
    "stator": "Stator",
    "motor": "Motor",
    "automated-wiring": "Automated Wiring",
    "plastic": "Plastic",
    "rubber": "Rubber",
    "circuit-board": "Circuit Board",
    "computer": "Computer",
    "heavy-modular-frame": "Heavy Modular Frame",
    "modular-engine": "Modular Engine",
    "adaptive-control-unit": "Adaptive Control Unit",
    "alumina-solution": "Alumina Solution",
    "aluminum-scrap": "Aluminum Scrap",
    "aluminum-ingot": "Aluminum Ingot",
    "alclad-aluminum-sheet": "Alclad Aluminum Sheet",
    "aluminum-casing": "Aluminum Casing",
    "radio-control-unit": "Radio Control Unit",
    "crystal-oscillator": "Crystal Oscillator",
    "battery": "Battery",
    "supercomputer": "Supercomputer",
    "assembly-director-system": "Assembly Director System",
    "heat-sink": "Heat Sink",
    "cooling-system": "Cooling System",
    "fused-modular-frame": "Fused Modular Frame",
    "turbo-motor": "Turbo Motor",
    "pressure-conversion-cube": "Pressure Conversion Cube",
    "gas-filter": "Gas Filter",
    "quickwire": "Quickwire",
    "time-crystal": "Time Crystal",
    "ficsite-trigon": "Ficsite Trigon",
    "sam-fluctuator": "SAM Fluctuator",
    "neural-quantum-processor": "Neural-Quantum Processor",
    "superposition-oscillator": "Superposition Oscillator",
    "electromagnetic-control-rod": "Electromagnetic Control Rod",
    "silica": "Silica",
    "quartz-crystal": "Quartz Crystal",
    "copper-powder": "Copper Powder",
    "heavy-oil-residue": "Heavy Oil Residue",
    "petroleum-coke": "Petroleum Coke",
    "polymer-resin": "Polymer Resin",
    "fuel": "Fuel",
    "empty-canister": "Empty Canister",
    "ai-limiter": "AI Limiter",
    "high-speed-connector": "High-Speed Connector",
    "encased-uranium-cell": "Encased Uranium Cell",
    "electromagnetic-rod": "Electromagnetic Rod",
    "uranium-fuel-rod": "Uranium Fuel Rod",
    "magnetic-field-generator": "Magnetic Field Generator",
    "non-fissile-uranium": "Non-Fissile Uranium",
    "plutonium-pellet": "Plutonium Pellet",
    "encased-plutonium-cell": "Encased Plutonium Cell",
    "plutonium-fuel-rod": "Plutonium Fuel Rod",
    "nitric-acid": "Nitric Acid",
    "thermal-propulsion-rocket": "Thermal Propulsion Rocket",
    "nuclear-pasta": "Nuclear Pasta",
    "dark-matter-crystal": "Dark Matter Crystal",
    "dark-matter-residue": "Dark Matter Residue",
    "excited-plutonic-matter": "Excited Plutonic Matter",
    "singularity-cell": "Singularity Cell",
    "ballistic-warp-drive": "Ballistic Warp Drive",
    "reanimated-sam": "Reanimated SAM",
    "ficsite-ingot": "Ficsite Ingot",
    "biochemical-sculptor": "Biochemical Sculptor",
    "diamonds": "Diamonds",
    "ai-expansion-server": "AI Expansion Server",
    "sulfuric-acid": "Sulfuric Acid",
    "cloth": "Cloth",
  }
  return names[partId] ?? partId
}

export function getMilestoneById(id: string): Milestone | undefined {
  for (const tier of tiers) {
    for (const m of tier.milestones) {
      if (m.id === id) return m
    }
  }
  return undefined
}

function scaleQuantity(quantity: number, recipeOutputQty: number): number {
  return Math.ceil(quantity / recipeOutputQty)
}

export function calculate(
  checkedMilestoneIds: string[],
  activeRecipes: Record<string, string>
): CalcResult {
  const totals: Record<string, number> = {}
  const visited = new Set<string>()

  function getRecipeFor(partId: string) {
    if (activeRecipes[partId]) {
      const recipes = getRecipesForPart(partId)
      const active = recipes.find((r) => r.id === activeRecipes[partId])
      if (active) return active
    }
    return getDefaultRecipe(partId)
  }

  function resolve(partId: string, quantity: number, depth = 0) {
    if (depth > 20) return

    totals[partId] = (totals[partId] || 0) + quantity

    if (isRawResource(partId)) return

    const recipe = getRecipeFor(partId)
    if (!recipe) return

    const batches = scaleQuantity(quantity, recipe.outputs.quantity)

    for (const input of recipe.inputs) {
      const inputTotal = input.quantity * batches
      resolve(input.partId, inputTotal, depth + 1)
    }
  }

  for (const milestoneId of checkedMilestoneIds) {
    const milestone = getMilestoneById(milestoneId)
    if (!milestone) continue
    for (const part of milestone.parts) {
      resolve(part.partId, part.quantity)
    }
  }

  const rawResources: Record<string, number> = {}
  const rawSet = new Set([
    "iron-ore", "copper-ore", "limestone", "coal", "crude-oil",
    "bauxite", "raw-quartz", "caterium-ore", "sulfur", "uranium",
    "nitrogen-gas", "sam", "water",
  ])
  for (const [partId, qty] of Object.entries(totals)) {
    if (rawSet.has(partId)) {
      rawResources[partId] = qty
    }
  }

  const tree = buildTree(checkedMilestoneIds, activeRecipes)

  return { totals, rawResources, tree }
}

export function calculateSingle(
  milestoneId: string,
  activeRecipes: Record<string, string>,
  inventoryParts?: Set<string>
): CalcResult {
  const totals: Record<string, number> = {}

  function getRecipeFor(partId: string) {
    if (activeRecipes[partId]) {
      const recipes = getRecipesForPart(partId)
      const active = recipes.find((r) => r.id === activeRecipes[partId])
      if (active) return active
    }
    return getDefaultRecipe(partId)
  }

  function resolve(partId: string, quantity: number, depth = 0) {
    if (depth > 20) return
    totals[partId] = (totals[partId] || 0) + quantity
    if (isRawResource(partId) || inventoryParts?.has(partId)) return
    const recipe = getRecipeFor(partId)
    if (!recipe) return
    const batches = scaleQuantity(quantity, recipe.outputs.quantity)
    for (const input of recipe.inputs) {
      resolve(input.partId, input.quantity * batches, depth + 1)
    }
  }

  const milestone = getMilestoneById(milestoneId)
  if (!milestone) return { totals: {}, rawResources: {}, tree: [] }

  for (const part of milestone.parts) {
    if (inventoryParts?.has(part.partId)) continue
    resolve(part.partId, part.quantity)
  }

  const rawResources: Record<string, number> = {}
  const rawSet = new Set([
    "iron-ore", "copper-ore", "limestone", "coal", "crude-oil",
    "bauxite", "raw-quartz", "caterium-ore", "sulfur", "uranium",
    "nitrogen-gas", "sam", "water",
  ])
  for (const [partId, qty] of Object.entries(totals)) {
    if (rawSet.has(partId)) {
      rawResources[partId] = qty
    }
  }

  function buildNode(partId: string, quantity: number, depth = 0): CalcNode {
    const node: CalcNode = {
      partId,
      name: getPartName(partId),
      quantity,
      children: [],
    }
    if (depth >= 6 || isRawResource(partId) || inventoryParts?.has(partId)) return node
    const recipe = getRecipeFor(partId)
    if (!recipe) return node
    const batches = scaleQuantity(quantity, recipe.outputs.quantity)
    for (const input of recipe.inputs) {
      node.children.push(buildNode(input.partId, input.quantity * batches, depth + 1))
    }
    return node
  }

  const milestoneNode: CalcNode = {
    partId: `milestone:${milestoneId}`,
    name: milestone.name,
    quantity: 0,
    children: [],
  }
  for (const part of milestone.parts) {
    if (inventoryParts?.has(part.partId)) continue
    milestoneNode.children.push(buildNode(part.partId, part.quantity))
  }

  return { totals, rawResources, tree: [milestoneNode] }
}

function buildTree(
  checkedMilestoneIds: string[],
  activeRecipes: Record<string, string>
): CalcNode[] {
  const roots: CalcNode[] = []

  function getRecipeFor(partId: string) {
    if (activeRecipes[partId]) {
      const recipes = getRecipesForPart(partId)
      const active = recipes.find((r) => r.id === activeRecipes[partId])
      if (active) return active
    }
    return getDefaultRecipe(partId)
  }

  function buildNode(partId: string, quantity: number, depth = 0): CalcNode {
    const node: CalcNode = {
      partId,
      name: getPartName(partId),
      quantity,
      children: [],
    }

    if (depth >= 6 || isRawResource(partId)) return node

    const recipe = getRecipeFor(partId)
    if (!recipe) return node

    const batches = scaleQuantity(quantity, recipe.outputs.quantity)

    for (const input of recipe.inputs) {
      const childQty = input.quantity * batches
      node.children.push(buildNode(input.partId, childQty, depth + 1))
    }

    return node
  }

  for (const milestoneId of checkedMilestoneIds) {
    const milestone = getMilestoneById(milestoneId)
    if (!milestone) continue
    const milestoneNode: CalcNode = {
      partId: `milestone:${milestoneId}`,
      name: milestone.name,
      quantity: 0,
      children: [],
    }
    for (const part of milestone.parts) {
      milestoneNode.children.push(buildNode(part.partId, part.quantity))
    }
    roots.push(milestoneNode)
  }

  return roots
}
