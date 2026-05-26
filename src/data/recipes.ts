export interface Recipe {
  id: string
  name: string
  isAlternate: boolean
  outputs: { partId: string; quantity: number }
  inputs: { partId: string; quantity: number }[]
  machine: string
  unlockedBy: string
}

export interface PartDefinition {
  name: string
  category: "raw" | "crafted"
}

const partDepths: Record<string, number> = {
  "alumina-solution": 1,
  "aluminum-scrap": 2,
  "aluminum-ingot": 3,
  "alclad-aluminum-sheet": 4,
  "aluminum-casing": 4,
  "ai-limiter": 4,
  "ai-expansion-server": 10,
  "assembly-director-system": 8,
  "automated-wiring": 4,
  "adaptive-control-unit": 7,
  "battery": 2,
  "biochemical-sculptor": 3,
  "ballistic-warp-drive": 9,
  "bauxite": 0,
  "cable": 3,
  "caterium-ore": 0,
  "circuit-board": 3,
  "cloth": 0,
  "coal": 0,
  "computer": 4,
  "concrete": 1,
  "cooling-system": 6,
  "copper-ingot": 1,
  "copper-ore": 0,
  "copper-powder": 2,
  "copper-sheet": 2,
  "crystal-oscillator": 4,
  "crude-oil": 0,
  "dark-matter-crystal": 7,
  "dark-matter-residue": 6,
  "diamonds": 1,
  "electromagnetic-control-rod": 5,
  "electromagnetic-rod": 6,
  "empty-canister": 0,
  "encased-industrial-beam": 3,
  "encased-plutonium-cell": 4,
  "encased-uranium-cell": 2,
  "excited-plutonic-matter": 7,
  "ficsite-ingot": 4,
  "ficsite-trigon": 5,
  "fuel": 0,
  "fused-modular-frame": 7,
  "gas-filter": 2,
  "heat-sink": 5,
  "heavy-modular-frame": 6,
  "heavy-oil-residue": 0,
  "high-speed-connector": 4,
  "iron-ingot": 1,
  "iron-ore": 0,
  "iron-plate": 2,
  "iron-rod": 2,
  "limestone": 0,
  "magnetic-field-generator": 6,
  "modular-engine": 6,
  "modular-frame": 5,
  "motor": 5,
  "neural-quantum-processor": 9,
  "nitric-acid": 1,
  "nitrogen-gas": 0,
  "non-fissile-uranium": 2,
  "nuclear-pasta": 4,
  "plastic": 1,
  "plutonium-fuel-rod": 5,
  "plutonium-pellet": 3,
  "petroleum-coke": 0,
  "polymer-resin": 0,
  "pressure-conversion-cube": 3,
  "quickwire": 1,
  "quartz-crystal": 1,
  "radio-control-unit": 5,
  "raw-quartz": 0,
  "reanimated-sam": 1,
  "reinforced-iron-plate": 4,
  "rotor": 4,
  "rubber": 1,
  "sam": 0,
  "sam-fluctuator": 2,
  "screw": 3,
  "silica": 1,
  "singularity-cell": 7,
  "steel-beam": 2,
  "steel-ingot": 1,
  "steel-pipe": 2,
  "stator": 3,
  "sulfur": 0,
  "sulfuric-acid": 1,
  "supercomputer": 5,
  "superposition-oscillator": 8,
  "time-crystal": 2,
  "thermal-propulsion-rocket": 8,
  "turbo-motor": 7,
  "uranium": 0,
  "uranium-fuel-rod": 7,
  "versatile-framework": 6,
  "water": 0,
  "wire": 2,
}

const partNames: Record<string, string> = {
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
}

function p(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
}

const recipes: Recipe[] = [
  // === TIER 0/1: Basic Smelting & Construction ===
  {
    id: "iron-ingot",
    name: "Iron Ingot",
    isAlternate: false,
    outputs: { partId: "iron-ingot", quantity: 1 },
    inputs: [{ partId: "iron-ore", quantity: 1 }],
    machine: "Smelter",
    unlockedBy: "Tier 0",
  },
  {
    id: "copper-ingot",
    name: "Copper Ingot",
    isAlternate: false,
    outputs: { partId: "copper-ingot", quantity: 1 },
    inputs: [{ partId: "copper-ore", quantity: 1 }],
    machine: "Smelter",
    unlockedBy: "Tier 0",
  },
  {
    id: "concrete",
    name: "Concrete",
    isAlternate: false,
    outputs: { partId: "concrete", quantity: 1 },
    inputs: [{ partId: "limestone", quantity: 3 }],
    machine: "Constructor",
    unlockedBy: "Tier 0",
  },
  {
    id: "wire",
    name: "Wire",
    isAlternate: false,
    outputs: { partId: "wire", quantity: 2 },
    inputs: [{ partId: "copper-ingot", quantity: 1 }],
    machine: "Constructor",
    unlockedBy: "Tier 0",
  },
  {
    id: "cable",
    name: "Cable",
    isAlternate: false,
    outputs: { partId: "cable", quantity: 1 },
    inputs: [{ partId: "wire", quantity: 2 }],
    machine: "Constructor",
    unlockedBy: "Tier 0",
  },
  {
    id: "iron-plate",
    name: "Iron Plate",
    isAlternate: false,
    outputs: { partId: "iron-plate", quantity: 2 },
    inputs: [{ partId: "iron-ingot", quantity: 3 }],
    machine: "Constructor",
    unlockedBy: "Tier 0",
  },
  {
    id: "iron-rod",
    name: "Iron Rod",
    isAlternate: false,
    outputs: { partId: "iron-rod", quantity: 2 },
    inputs: [{ partId: "iron-ingot", quantity: 1 }],
    machine: "Constructor",
    unlockedBy: "Tier 0",
  },
  {
    id: "screw",
    name: "Screw",
    isAlternate: false,
    outputs: { partId: "screw", quantity: 4 },
    inputs: [{ partId: "iron-rod", quantity: 1 }],
    machine: "Constructor",
    unlockedBy: "Tier 0",
  },

  // Alternate: Cast Screw (removes rod step)
  {
    id: "cast-screw",
    name: "Cast Screw",
    isAlternate: true,
    outputs: { partId: "screw", quantity: 5 },
    inputs: [{ partId: "iron-ingot", quantity: 1 }],
    machine: "Constructor",
    unlockedBy: "Hard Drive",
  },

  // === TIER 2: Assembly ===
  {
    id: "reinforced-iron-plate",
    name: "Reinforced Iron Plate",
    isAlternate: false,
    outputs: { partId: "reinforced-iron-plate", quantity: 1 },
    inputs: [
      { partId: "iron-plate", quantity: 6 },
      { partId: "screw", quantity: 12 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 0",
  },
  // Alternate: Stitched Iron Plate
  {
    id: "stitched-iron-plate",
    name: "Stitched Iron Plate",
    isAlternate: true,
    outputs: { partId: "reinforced-iron-plate", quantity: 1 },
    inputs: [
      { partId: "iron-plate", quantity: 6 },
      { partId: "wire", quantity: 8 },
    ],
    machine: "Assembler",
    unlockedBy: "Hard Drive",
  },
  {
    id: "rotor",
    name: "Rotor",
    isAlternate: false,
    outputs: { partId: "rotor", quantity: 1 },
    inputs: [
      { partId: "iron-rod", quantity: 5 },
      { partId: "screw", quantity: 25 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 2",
  },
  // Alternate: Steel Rotor
  {
    id: "steel-rotor",
    name: "Steel Rotor",
    isAlternate: true,
    outputs: { partId: "rotor", quantity: 1 },
    inputs: [
      { partId: "steel-pipe", quantity: 2 },
      { partId: "wire", quantity: 8 },
    ],
    machine: "Assembler",
    unlockedBy: "Hard Drive",
  },
  {
    id: "copper-sheet",
    name: "Copper Sheet",
    isAlternate: false,
    outputs: { partId: "copper-sheet", quantity: 1 },
    inputs: [{ partId: "copper-ingot", quantity: 2 }],
    machine: "Constructor",
    unlockedBy: "Tier 2",
  },
  {
    id: "modular-frame",
    name: "Modular Frame",
    isAlternate: false,
    outputs: { partId: "modular-frame", quantity: 1 },
    inputs: [
      { partId: "reinforced-iron-plate", quantity: 3 },
      { partId: "iron-rod", quantity: 12 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 2",
  },

  // === TIER 3: Steel ===
  {
    id: "steel-ingot",
    name: "Steel Ingot",
    isAlternate: false,
    outputs: { partId: "steel-ingot", quantity: 3 },
    inputs: [
      { partId: "iron-ore", quantity: 3 },
      { partId: "coal", quantity: 3 },
    ],
    machine: "Foundry",
    unlockedBy: "Tier 3",
  },
  {
    id: "steel-beam",
    name: "Steel Beam",
    isAlternate: false,
    outputs: { partId: "steel-beam", quantity: 1 },
    inputs: [{ partId: "steel-ingot", quantity: 4 }],
    machine: "Constructor",
    unlockedBy: "Tier 3",
  },
  {
    id: "steel-pipe",
    name: "Steel Pipe",
    isAlternate: false,
    outputs: { partId: "steel-pipe", quantity: 1 },
    inputs: [{ partId: "steel-ingot", quantity: 2 }],
    machine: "Constructor",
    unlockedBy: "Tier 3",
  },
  {
    id: "versatile-framework",
    name: "Versatile Framework",
    isAlternate: false,
    outputs: { partId: "versatile-framework", quantity: 1 },
    inputs: [
      { partId: "modular-frame", quantity: 1 },
      { partId: "steel-beam", quantity: 12 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 3",
  },

  // === TIER 4: Advanced Steel ===
  {
    id: "encased-industrial-beam",
    name: "Encased Industrial Beam",
    isAlternate: false,
    outputs: { partId: "encased-industrial-beam", quantity: 1 },
    inputs: [
      { partId: "steel-pipe", quantity: 4 },
      { partId: "concrete", quantity: 4 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 4",
  },
  {
    id: "stator",
    name: "Stator",
    isAlternate: false,
    outputs: { partId: "stator", quantity: 1 },
    inputs: [
      { partId: "steel-pipe", quantity: 3 },
      { partId: "wire", quantity: 8 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 4",
  },
  // Alternate: Quickwire Stator
  {
    id: "quickwire-stator",
    name: "Quickwire Stator",
    isAlternate: true,
    outputs: { partId: "stator", quantity: 2 },
    inputs: [
      { partId: "steel-pipe", quantity: 4 },
      { partId: "quickwire", quantity: 15 },
    ],
    machine: "Assembler",
    unlockedBy: "Hard Drive",
  },
  {
    id: "motor",
    name: "Motor",
    isAlternate: false,
    outputs: { partId: "motor", quantity: 1 },
    inputs: [
      { partId: "rotor", quantity: 2 },
      { partId: "stator", quantity: 2 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 4",
  },
  // Alternate: Electric Motor
  {
    id: "electric-motor",
    name: "Electric Motor",
    isAlternate: true,
    outputs: { partId: "motor", quantity: 1 },
    inputs: [
      { partId: "rotor", quantity: 1 },
      { partId: "stator", quantity: 1 },
    ],
    machine: "Assembler",
    unlockedBy: "Hard Drive",
  },
  {
    id: "automated-wiring",
    name: "Automated Wiring",
    isAlternate: false,
    outputs: { partId: "automated-wiring", quantity: 1 },
    inputs: [
      { partId: "stator", quantity: 1 },
      { partId: "cable", quantity: 20 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 4",
  },

  // === TIER 5: Oil Processing ===
  {
    id: "plastic",
    name: "Plastic",
    isAlternate: false,
    outputs: { partId: "plastic", quantity: 2 },
    inputs: [
      { partId: "crude-oil", quantity: 3 },
    ],
    machine: "Refinery",
    unlockedBy: "Tier 5",
  },
  {
    id: "rubber",
    name: "Rubber",
    isAlternate: false,
    outputs: { partId: "rubber", quantity: 2 },
    inputs: [
      { partId: "crude-oil", quantity: 3 },
    ],
    machine: "Refinery",
    unlockedBy: "Tier 5",
  },
  {
    id: "circuit-board",
    name: "Circuit Board",
    isAlternate: false,
    outputs: { partId: "circuit-board", quantity: 1 },
    inputs: [
      { partId: "copper-sheet", quantity: 2 },
      { partId: "plastic", quantity: 4 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 5",
  },
  {
    id: "computer",
    name: "Computer",
    isAlternate: false,
    outputs: { partId: "computer", quantity: 1 },
    inputs: [
      { partId: "circuit-board", quantity: 4 },
      { partId: "cable", quantity: 8 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 6",
  },

  // === TIER 6: Advanced Manufacturing ===
  {
    id: "heavy-modular-frame",
    name: "Heavy Modular Frame",
    isAlternate: false,
    outputs: { partId: "heavy-modular-frame", quantity: 1 },
    inputs: [
      { partId: "modular-frame", quantity: 5 },
      { partId: "encased-industrial-beam", quantity: 3 },
      { partId: "screw", quantity: 100 },
      { partId: "steel-pipe", quantity: 8 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 6",
  },
  {
    id: "modular-engine",
    name: "Modular Engine",
    isAlternate: false,
    outputs: { partId: "modular-engine", quantity: 1 },
    inputs: [
      { partId: "motor", quantity: 2 },
      { partId: "rubber", quantity: 15 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 6",
  },
  {
    id: "adaptive-control-unit",
    name: "Adaptive Control Unit",
    isAlternate: false,
    outputs: { partId: "adaptive-control-unit", quantity: 1 },
    inputs: [
      { partId: "automated-wiring", quantity: 5 },
      { partId: "circuit-board", quantity: 5 },
      { partId: "heavy-modular-frame", quantity: 1 },
      { partId: "computer", quantity: 2 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 6",
  },
  {
    id: "ai-limiter",
    name: "AI Limiter",
    isAlternate: false,
    outputs: { partId: "ai-limiter", quantity: 1 },
    inputs: [
      { partId: "circuit-board", quantity: 2 },
      { partId: "quickwire", quantity: 20 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 6",
  },
  {
    id: "high-speed-connector",
    name: "High-Speed Connector",
    isAlternate: false,
    outputs: { partId: "high-speed-connector", quantity: 1 },
    inputs: [
      { partId: "quickwire", quantity: 40 },
      { partId: "cable", quantity: 4 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 6",
  },
  {
    id: "supercomputer",
    name: "Supercomputer",
    isAlternate: false,
    outputs: { partId: "supercomputer", quantity: 1 },
    inputs: [
      { partId: "computer", quantity: 4 },
      { partId: "ai-limiter", quantity: 4 },
      { partId: "high-speed-connector", quantity: 6 },
      { partId: "plastic", quantity: 20 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 7",
  },

  // === TIER 7: Aluminum ===
  {
    id: "alumina-solution",
    name: "Alumina Solution",
    isAlternate: false,
    outputs: { partId: "alumina-solution", quantity: 6 },
    inputs: [
      { partId: "bauxite", quantity: 10 },
      { partId: "water", quantity: 6 },
    ],
    machine: "Refinery",
    unlockedBy: "Tier 7",
  },
  {
    id: "aluminum-scrap",
    name: "Aluminum Scrap",
    isAlternate: false,
    outputs: { partId: "aluminum-scrap", quantity: 6 },
    inputs: [
      { partId: "alumina-solution", quantity: 4 },
      { partId: "coal", quantity: 2 },
    ],
    machine: "Refinery",
    unlockedBy: "Tier 7",
  },
  {
    id: "aluminum-ingot",
    name: "Aluminum Ingot",
    isAlternate: false,
    outputs: { partId: "aluminum-ingot", quantity: 4 },
    inputs: [
      { partId: "aluminum-scrap", quantity: 6 },
    ],
    machine: "Smelter",
    unlockedBy: "Tier 7",
  },
  {
    id: "alclad-aluminum-sheet",
    name: "Alclad Aluminum Sheet",
    isAlternate: false,
    outputs: { partId: "alclad-aluminum-sheet", quantity: 3 },
    inputs: [
      { partId: "aluminum-ingot", quantity: 3 },
      { partId: "copper-ingot", quantity: 1 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 7",
  },
  {
    id: "aluminum-casing",
    name: "Aluminum Casing",
    isAlternate: false,
    outputs: { partId: "aluminum-casing", quantity: 2 },
    inputs: [
      { partId: "aluminum-ingot", quantity: 3 },
    ],
    machine: "Constructor",
    unlockedBy: "Tier 7",
  },
  // Alternate: Alclad Casing (more efficient)
  {
    id: "alclad-casing",
    name: "Alclad Casing",
    isAlternate: true,
    outputs: { partId: "aluminum-casing", quantity: 15 },
    inputs: [
      { partId: "aluminum-ingot", quantity: 20 },
      { partId: "copper-ingot", quantity: 10 },
    ],
    machine: "Assembler",
    unlockedBy: "Hard Drive",
  },
  {
    id: "silica",
    name: "Silica",
    isAlternate: false,
    outputs: { partId: "silica", quantity: 5 },
    inputs: [{ partId: "raw-quartz", quantity: 3 }],
    machine: "Constructor",
    unlockedBy: "Tier 7",
  },
  {
    id: "quartz-crystal",
    name: "Quartz Crystal",
    isAlternate: false,
    outputs: { partId: "quartz-crystal", quantity: 3 },
    inputs: [{ partId: "raw-quartz", quantity: 5 }],
    machine: "Constructor",
    unlockedBy: "Tier 7",
  },
  {
    id: "crystal-oscillator",
    name: "Crystal Oscillator",
    isAlternate: false,
    outputs: { partId: "crystal-oscillator", quantity: 1 },
    inputs: [
      { partId: "quartz-crystal", quantity: 4 },
      { partId: "cable", quantity: 4 },
      { partId: "screw", quantity: 16 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 7",
  },
  {
    id: "quickwire",
    name: "Quickwire",
    isAlternate: false,
    outputs: { partId: "quickwire", quantity: 3 },
    inputs: [{ partId: "caterium-ore", quantity: 1 }],
    machine: "Constructor",
    unlockedBy: "Tier 7",
  },
  {
    id: "radio-control-unit",
    name: "Radio Control Unit",
    isAlternate: false,
    outputs: { partId: "radio-control-unit", quantity: 2 },
    inputs: [
      { partId: "aluminum-casing", quantity: 32 },
      { partId: "crystal-oscillator", quantity: 1 },
      { partId: "computer", quantity: 2 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 7",
  },
  {
    id: "battery",
    name: "Battery",
    isAlternate: false,
    outputs: { partId: "battery", quantity: 2 },
    inputs: [
      { partId: "sulfuric-acid", quantity: 8 },
      { partId: "alumina-solution", quantity: 4 },
    ],
    machine: "Blender",
    unlockedBy: "Tier 7",
  },
  {
    id: "sulfuric-acid",
    name: "Sulfuric Acid",
    isAlternate: false,
    outputs: { partId: "sulfuric-acid", quantity: 5 },
    inputs: [
      { partId: "sulfur", quantity: 6 },
      { partId: "water", quantity: 4 },
    ],
    machine: "Refinery",
    unlockedBy: "Tier 7",
  },
  {
    id: "gas-filter",
    name: "Gas Filter",
    isAlternate: false,
    outputs: { partId: "gas-filter", quantity: 1 },
    inputs: [
      { partId: "rubber", quantity: 5 },
      { partId: "cloth", quantity: 2 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 7",
  },
  {
    id: "assembly-director-system",
    name: "Assembly Director System",
    isAlternate: false,
    outputs: { partId: "assembly-director-system", quantity: 1 },
    inputs: [
      { partId: "adaptive-control-unit", quantity: 2 },
      { partId: "supercomputer", quantity: 1 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 7",
  },

  // === TIER 8: Advanced Parts ===
  {
    id: "heat-sink",
    name: "Heat Sink",
    isAlternate: false,
    outputs: { partId: "heat-sink", quantity: 1 },
    inputs: [
      { partId: "alclad-aluminum-sheet", quantity: 5 },
      { partId: "copper-sheet", quantity: 3 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 8",
  },
  {
    id: "cooling-system",
    name: "Cooling System",
    isAlternate: false,
    outputs: { partId: "cooling-system", quantity: 1 },
    inputs: [
      { partId: "heat-sink", quantity: 2 },
      { partId: "motor", quantity: 1 },
      { partId: "rubber", quantity: 15 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 8",
  },
  {
    id: "fused-modular-frame",
    name: "Fused Modular Frame",
    isAlternate: false,
    outputs: { partId: "fused-modular-frame", quantity: 1 },
    inputs: [
      { partId: "heavy-modular-frame", quantity: 2 },
      { partId: "aluminum-casing", quantity: 30 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 8",
  },
  {
    id: "turbo-motor",
    name: "Turbo Motor",
    isAlternate: false,
    outputs: { partId: "turbo-motor", quantity: 1 },
    inputs: [
      { partId: "motor", quantity: 7 },
      { partId: "cooling-system", quantity: 2 },
      { partId: "radio-control-unit", quantity: 2 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 8",
  },
  {
    id: "electromagnetic-control-rod",
    name: "Electromagnetic Control Rod",
    isAlternate: false,
    outputs: { partId: "electromagnetic-control-rod", quantity: 2 },
    inputs: [
      { partId: "stator", quantity: 3 },
      { partId: "ai-limiter", quantity: 2 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 8",
  },
  {
    id: "encased-uranium-cell",
    name: "Encased Uranium Cell",
    isAlternate: false,
    outputs: { partId: "encased-uranium-cell", quantity: 6 },
    inputs: [
      { partId: "uranium", quantity: 10 },
      { partId: "concrete", quantity: 4 },
    ],
    machine: "Constructor",
    unlockedBy: "Tier 8",
  },
  {
    id: "electromagnetic-rod",
    name: "Electromagnetic Rod",
    isAlternate: false,
    outputs: { partId: "electromagnetic-rod", quantity: 1 },
    inputs: [
      { partId: "electromagnetic-control-rod", quantity: 1 },
      { partId: "steel-pipe", quantity: 2 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 8",
  },
  {
    id: "uranium-fuel-rod",
    name: "Uranium Fuel Rod",
    isAlternate: false,
    outputs: { partId: "uranium-fuel-rod", quantity: 1 },
    inputs: [
      { partId: "encased-uranium-cell", quantity: 25 },
      { partId: "electromagnetic-rod", quantity: 4 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 8",
  },
  {
    id: "magnetic-field-generator",
    name: "Magnetic Field Generator",
    isAlternate: false,
    outputs: { partId: "magnetic-field-generator", quantity: 1 },
    inputs: [
      { partId: "battery", quantity: 10 },
      { partId: "electromagnetic-control-rod", quantity: 3 },
      { partId: "alclad-aluminum-sheet", quantity: 12 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 8",
  },

  // === TIER 8: Particle Enrichment chain ===
  {
    id: "nitric-acid",
    name: "Nitric Acid",
    isAlternate: false,
    outputs: { partId: "nitric-acid", quantity: 4 },
    inputs: [
      { partId: "nitrogen-gas", quantity: 2 },
      { partId: "water", quantity: 2 },
    ],
    machine: "Blender",
    unlockedBy: "Tier 8",
  },
  {
    id: "non-fissile-uranium",
    name: "Non-Fissile Uranium",
    isAlternate: false,
    outputs: { partId: "non-fissile-uranium", quantity: 10 },
    inputs: [
      { partId: "uranium", quantity: 10 },
      { partId: "nitric-acid", quantity: 6 },
      { partId: "sulfuric-acid", quantity: 6 },
    ],
    machine: "Blender",
    unlockedBy: "Tier 8",
  },
  {
    id: "plutonium-pellet",
    name: "Plutonium Pellet",
    isAlternate: false,
    outputs: { partId: "plutonium-pellet", quantity: 1 },
    inputs: [
      { partId: "non-fissile-uranium", quantity: 10 },
    ],
    machine: "Particle Accelerator",
    unlockedBy: "Tier 8",
  },
  {
    id: "encased-plutonium-cell",
    name: "Encased Plutonium Cell",
    isAlternate: false,
    outputs: { partId: "encased-plutonium-cell", quantity: 5 },
    inputs: [
      { partId: "plutonium-pellet", quantity: 2 },
      { partId: "concrete", quantity: 4 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 8",
  },
  {
    id: "pressure-conversion-cube",
    name: "Pressure Conversion Cube",
    isAlternate: false,
    outputs: { partId: "pressure-conversion-cube", quantity: 1 },
    inputs: [
      { partId: "copper-powder", quantity: 50 },
      { partId: "rubber", quantity: 10 },
    ],
    machine: "Particle Accelerator",
    unlockedBy: "Tier 8",
  },
  {
    id: "copper-powder",
    name: "Copper Powder",
    isAlternate: false,
    outputs: { partId: "copper-powder", quantity: 5 },
    inputs: [
      { partId: "copper-ingot", quantity: 3 },
    ],
    machine: "Constructor",
    unlockedBy: "Tier 8",
  },
  {
    id: "plutonium-fuel-rod",
    name: "Plutonium Fuel Rod",
    isAlternate: false,
    outputs: { partId: "plutonium-fuel-rod", quantity: 1 },
    inputs: [
      { partId: "encased-plutonium-cell", quantity: 10 },
      { partId: "pressure-conversion-cube", quantity: 2 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 8",
  },
  {
    id: "nuclear-pasta",
    name: "Nuclear Pasta",
    isAlternate: false,
    outputs: { partId: "nuclear-pasta", quantity: 1 },
    inputs: [
      { partId: "copper-powder", quantity: 200 },
      { partId: "pressure-conversion-cube", quantity: 2 },
    ],
    machine: "Particle Accelerator",
    unlockedBy: "Tier 8",
  },
  {
    id: "thermal-propulsion-rocket",
    name: "Thermal Propulsion Rocket",
    isAlternate: false,
    outputs: { partId: "thermal-propulsion-rocket", quantity: 1 },
    inputs: [
      { partId: "turbo-motor", quantity: 5 },
      { partId: "fused-modular-frame", quantity: 3 },
      { partId: "electromagnetic-control-rod", quantity: 4 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 8",
  },

  // === TIER 9: Quantum ===
  {
    id: "reanimated-sam",
    name: "Reanimated SAM",
    isAlternate: false,
    outputs: { partId: "reanimated-sam", quantity: 4 },
    inputs: [{ partId: "sam", quantity: 1 }],
    machine: "Constructor",
    unlockedBy: "Tier 9",
  },
  {
    id: "sam-fluctuator",
    name: "SAM Fluctuator",
    isAlternate: false,
    outputs: { partId: "sam-fluctuator", quantity: 2 },
    inputs: [
      { partId: "reanimated-sam", quantity: 4 },
      { partId: "quartz-crystal", quantity: 1 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 9",
  },
  {
    id: "time-crystal",
    name: "Time Crystal",
    isAlternate: false,
    outputs: { partId: "time-crystal", quantity: 2 },
    inputs: [
      { partId: "diamonds", quantity: 1 },
      { partId: "quartz-crystal", quantity: 2 },
    ],
    machine: "Assembler",
    unlockedBy: "Tier 9",
  },
  {
    id: "diamonds",
    name: "Diamonds",
    isAlternate: false,
    outputs: { partId: "diamonds", quantity: 1 },
    inputs: [{ partId: "coal", quantity: 8 }],
    machine: "Converter",
    unlockedBy: "Tier 9",
  },
  {
    id: "ficsite-ingot",
    name: "Ficsite Ingot",
    isAlternate: false,
    outputs: { partId: "ficsite-ingot", quantity: 6 },
    inputs: [
      { partId: "sam-fluctuator", quantity: 2 },
      { partId: "aluminum-ingot", quantity: 6 },
      { partId: "copper-ingot", quantity: 6 },
    ],
    machine: "Converter",
    unlockedBy: "Tier 9",
  },
  {
    id: "ficsite-trigon",
    name: "Ficsite Trigon",
    isAlternate: false,
    outputs: { partId: "ficsite-trigon", quantity: 1 },
    inputs: [{ partId: "ficsite-ingot", quantity: 6 }],
    machine: "Constructor",
    unlockedBy: "Tier 9",
  },
  {
    id: "biochemical-sculptor",
    name: "Biochemical Sculptor",
    isAlternate: false,
    outputs: { partId: "biochemical-sculptor", quantity: 1 },
    inputs: [
      { partId: "time-crystal", quantity: 2 },
      { partId: "diamonds", quantity: 4 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 9",
  },
  {
    id: "dark-matter-residue",
    name: "Dark Matter Residue",
    isAlternate: false,
    outputs: { partId: "dark-matter-residue", quantity: 6 },
    inputs: [
      { partId: "ficsite-trigon", quantity: 2 },
      { partId: "sam-fluctuator", quantity: 4 },
    ],
    machine: "Particle Accelerator",
    unlockedBy: "Tier 9",
  },
  {
    id: "dark-matter-crystal",
    name: "Dark Matter Crystal",
    isAlternate: false,
    outputs: { partId: "dark-matter-crystal", quantity: 1 },
    inputs: [
      { partId: "dark-matter-residue", quantity: 10 },
      { partId: "time-crystal", quantity: 1 },
    ],
    machine: "Quantum Encoder",
    unlockedBy: "Tier 9",
  },
  {
    id: "excited-plutonic-matter",
    name: "Excited Plutonic Matter",
    isAlternate: false,
    outputs: { partId: "excited-plutonic-matter", quantity: 2 },
    inputs: [
      { partId: "plutonium-pellet", quantity: 3 },
      { partId: "dark-matter-residue", quantity: 10 },
    ],
    machine: "Particle Accelerator",
    unlockedBy: "Tier 9",
  },
  {
    id: "superposition-oscillator",
    name: "Superposition Oscillator",
    isAlternate: false,
    outputs: { partId: "superposition-oscillator", quantity: 1 },
    inputs: [
      { partId: "excited-plutonic-matter", quantity: 2 },
      { partId: "dark-matter-crystal", quantity: 2 },
    ],
    machine: "Quantum Encoder",
    unlockedBy: "Tier 9",
  },
  {
    id: "neural-quantum-processor",
    name: "Neural-Quantum Processor",
    isAlternate: false,
    outputs: { partId: "neural-quantum-processor", quantity: 1 },
    inputs: [
      { partId: "superposition-oscillator", quantity: 2 },
      { partId: "dark-matter-crystal", quantity: 2 },
    ],
    machine: "Quantum Encoder",
    unlockedBy: "Tier 9",
  },
  {
    id: "ai-expansion-server",
    name: "AI Expansion Server",
    isAlternate: false,
    outputs: { partId: "ai-expansion-server", quantity: 1 },
    inputs: [
      { partId: "neural-quantum-processor", quantity: 4 },
      { partId: "supercomputer", quantity: 4 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 9",
  },
  {
    id: "singularity-cell",
    name: "Singularity Cell",
    isAlternate: false,
    outputs: { partId: "singularity-cell", quantity: 5 },
    inputs: [
      { partId: "dark-matter-residue", quantity: 20 },
      { partId: "aluminum-casing", quantity: 40 },
    ],
    machine: "Blender",
    unlockedBy: "Tier 9",
  },
  {
    id: "ballistic-warp-drive",
    name: "Ballistic Warp Drive",
    isAlternate: false,
    outputs: { partId: "ballistic-warp-drive", quantity: 1 },
    inputs: [
      { partId: "superposition-oscillator", quantity: 4 },
      { partId: "thermal-propulsion-rocket", quantity: 5 },
    ],
    machine: "Manufacturer",
    unlockedBy: "Tier 9",
  },
]

export function getRecipesForPart(partId: string): Recipe[] {
  return recipes.filter((r) => r.outputs.partId === partId)
}

export function getDefaultRecipe(partId: string): Recipe | undefined {
  return recipes.find((r) => r.outputs.partId === partId && !r.isAlternate)
}

export function getAllAlternates(partId: string): Recipe[] {
  return recipes.filter((r) => r.outputs.partId === partId && r.isAlternate)
}

export function getPartName(partId: string): string {
  return partNames[partId] ?? partId
}

export function getAllPartIds(): string[] {
  const partSet = new Set<string>()
  partSet.add("iron-ore")
  partSet.add("copper-ore")
  partSet.add("limestone")
  partSet.add("coal")
  partSet.add("crude-oil")
  partSet.add("bauxite")
  partSet.add("raw-quartz")
  partSet.add("caterium-ore")
  partSet.add("sulfur")
  partSet.add("uranium")
  partSet.add("nitrogen-gas")
  partSet.add("sam")
  partSet.add("water")
  for (const r of recipes) {
    partSet.add(r.outputs.partId)
    for (const input of r.inputs) {
      partSet.add(input.partId)
    }
  }
  for (const name of Object.keys(partNames)) {
    partSet.add(name)
  }
  return Array.from(partSet)
}

export function getPartDepth(partId: string): number {
  return partDepths[partId] ?? 0
}

export function isRawResource(partId: string): boolean {
  const rawResources = new Set([
    "iron-ore",
    "copper-ore",
    "limestone",
    "coal",
    "crude-oil",
    "bauxite",
    "raw-quartz",
    "caterium-ore",
    "sulfur",
    "uranium",
    "nitrogen-gas",
    "sam",
    "water",
  ])
  return rawResources.has(partId)
}

export default recipes
