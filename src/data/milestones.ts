export interface PartCost {
  partId: string
  quantity: number
}

export interface Milestone {
  id: string
  name: string
  tier: number
  parts: PartCost[]
  description?: string
}

export interface Tier {
  number: number
  name: string
  phase: string
  milestones: Milestone[]
}

const tiers: Tier[] = [
  {
    number: 0,
    name: "Onboarding",
    phase: "Tutorial",
    milestones: [
      {
        id: "hub-upgrade-1",
        name: "HUB Upgrade 1",
        tier: 0,
        parts: [{ partId: "iron-rod", quantity: 10 }],
      },
      {
        id: "hub-upgrade-2",
        name: "HUB Upgrade 2",
        tier: 0,
        parts: [
          { partId: "iron-rod", quantity: 20 },
          { partId: "iron-plate", quantity: 10 },
        ],
      },
      {
        id: "hub-upgrade-3",
        name: "HUB Upgrade 3",
        tier: 0,
        parts: [
          { partId: "iron-plate", quantity: 20 },
          { partId: "iron-rod", quantity: 20 },
          { partId: "wire", quantity: 20 },
        ],
      },
      {
        id: "hub-upgrade-4",
        name: "HUB Upgrade 4",
        tier: 0,
        parts: [
          { partId: "iron-plate", quantity: 75 },
          { partId: "cable", quantity: 20 },
          { partId: "concrete", quantity: 10 },
        ],
      },
      {
        id: "hub-upgrade-5",
        name: "HUB Upgrade 5",
        tier: 0,
        parts: [
          { partId: "iron-rod", quantity: 75 },
          { partId: "cable", quantity: 50 },
          { partId: "concrete", quantity: 20 },
        ],
      },
      {
        id: "hub-upgrade-6",
        name: "HUB Upgrade 6",
        tier: 0,
        parts: [
          { partId: "iron-rod", quantity: 100 },
          { partId: "iron-plate", quantity: 100 },
          { partId: "wire", quantity: 100 },
          { partId: "concrete", quantity: 50 },
        ],
      },
    ],
  },
  {
    number: 1,
    name: "Tier 1",
    phase: "Phase 1",
    milestones: [
      {
        id: "base-building",
        name: "Base Building",
        tier: 1,
        parts: [
          { partId: "concrete", quantity: 200 },
          { partId: "iron-plate", quantity: 100 },
          { partId: "iron-rod", quantity: 100 },
        ],
      },
      {
        id: "logistics",
        name: "Logistics",
        tier: 1,
        parts: [
          { partId: "iron-plate", quantity: 150 },
          { partId: "iron-rod", quantity: 150 },
          { partId: "wire", quantity: 300 },
        ],
      },
      {
        id: "field-research",
        name: "Field Research",
        tier: 1,
        parts: [
          { partId: "wire", quantity: 300 },
          { partId: "screw", quantity: 300 },
          { partId: "iron-plate", quantity: 100 },
        ],
      },
    ],
  },
  {
    number: 2,
    name: "Tier 2",
    phase: "Phase 1",
    milestones: [
      {
        id: "part-assembly",
        name: "Part Assembly",
        tier: 2,
        parts: [
          { partId: "cable", quantity: 200 },
          { partId: "iron-rod", quantity: 200 },
          { partId: "screw", quantity: 500 },
          { partId: "iron-plate", quantity: 300 },
        ],
      },
      {
        id: "obstacle-clearing",
        name: "Obstacle Clearing",
        tier: 2,
        parts: [
          { partId: "screw", quantity: 500 },
          { partId: "cable", quantity: 100 },
          { partId: "concrete", quantity: 100 },
        ],
      },
      {
        id: "jump-pads",
        name: "Jump Pads",
        tier: 2,
        parts: [
          { partId: "rotor", quantity: 50 },
          { partId: "iron-plate", quantity: 300 },
          { partId: "cable", quantity: 150 },
        ],
      },
      {
        id: "resource-sink-bonus",
        name: "Resource Sink Bonus Program",
        tier: 2,
        parts: [
          { partId: "concrete", quantity: 400 },
          { partId: "wire", quantity: 500 },
          { partId: "iron-rod", quantity: 200 },
          { partId: "iron-plate", quantity: 200 },
        ],
      },
      {
        id: "logistics-mk2",
        name: "Logistics Mk.2",
        tier: 2,
        parts: [
          { partId: "reinforced-iron-plate", quantity: 50 },
          { partId: "concrete", quantity: 200 },
          { partId: "iron-rod", quantity: 300 },
          { partId: "iron-plate", quantity: 300 },
        ],
      },
    ],
  },
  {
    number: 3,
    name: "Tier 3",
    phase: "Phase 2",
    milestones: [
      {
        id: "coal-power",
        name: "Coal Power",
        tier: 3,
        parts: [
          { partId: "reinforced-iron-plate", quantity: 150 },
          { partId: "rotor", quantity: 50 },
          { partId: "cable", quantity: 500 },
        ],
      },
      {
        id: "vehicular-transport",
        name: "Vehicular Transport",
        tier: 3,
        parts: [
          { partId: "modular-frame", quantity: 25 },
          { partId: "rotor", quantity: 100 },
          { partId: "cable", quantity: 200 },
          { partId: "iron-plate", quantity: 400 },
        ],
      },
      {
        id: "basic-steel-production",
        name: "Basic Steel Production",
        tier: 3,
        parts: [
          { partId: "modular-frame", quantity: 50 },
          { partId: "rotor", quantity: 150 },
          { partId: "concrete", quantity: 500 },
          { partId: "wire", quantity: 1000 },
        ],
      },
      {
        id: "enhanced-asset-security",
        name: "Enhanced Asset Security",
        tier: 3,
        parts: [
          { partId: "reinforced-iron-plate", quantity: 100 },
          { partId: "iron-rod", quantity: 600 },
          { partId: "wire", quantity: 1500 },
        ],
      },
    ],
  },
  {
    number: 4,
    name: "Tier 4",
    phase: "Phase 2",
    milestones: [
      {
        id: "ficsit-blueprints",
        name: "FICSIT Blueprints",
        tier: 4,
        parts: [
          { partId: "modular-frame", quantity: 100 },
          { partId: "steel-beam", quantity: 200 },
          { partId: "cable", quantity: 500 },
          { partId: "concrete", quantity: 1000 },
        ],
      },
      {
        id: "logistics-mk3",
        name: "Logistics Mk.3",
        tier: 4,
        parts: [
          { partId: "steel-beam", quantity: 200 },
          { partId: "steel-pipe", quantity: 200 },
          { partId: "reinforced-iron-plate", quantity: 400 },
        ],
      },
      {
        id: "advanced-steel-production",
        name: "Advanced Steel Production",
        tier: 4,
        parts: [
          { partId: "steel-pipe", quantity: 100 },
          { partId: "modular-frame", quantity: 100 },
          { partId: "rotor", quantity: 200 },
          { partId: "concrete", quantity: 500 },
        ],
      },
      {
        id: "expanded-power-infrastructure",
        name: "Expanded Power Infrastructure",
        tier: 4,
        parts: [
          { partId: "encased-industrial-beam", quantity: 50 },
          { partId: "steel-beam", quantity: 100 },
          { partId: "modular-frame", quantity: 200 },
          { partId: "wire", quantity: 2000 },
        ],
      },
      {
        id: "hypertubes",
        name: "Hypertubes",
        tier: 4,
        parts: [
          { partId: "encased-industrial-beam", quantity: 50 },
          { partId: "steel-pipe", quantity: 300 },
          { partId: "copper-sheet", quantity: 500 },
        ],
      },
    ],
  },
  {
    number: 5,
    name: "Tier 5",
    phase: "Phase 3",
    milestones: [
      {
        id: "jetpack",
        name: "Jetpack",
        tier: 5,
        parts: [
          { partId: "motor", quantity: 50 },
          { partId: "cable", quantity: 1000 },
          { partId: "iron-plate", quantity: 1000 },
        ],
      },
      {
        id: "oil-processing",
        name: "Oil Processing",
        tier: 5,
        parts: [
          { partId: "motor", quantity: 50 },
          { partId: "encased-industrial-beam", quantity: 100 },
          { partId: "steel-pipe", quantity: 500 },
          { partId: "copper-sheet", quantity: 500 },
        ],
      },
      {
        id: "logistics-mk4",
        name: "Logistics Mk.4",
        tier: 5,
        parts: [
          { partId: "rubber", quantity: 200 },
          { partId: "encased-industrial-beam", quantity: 300 },
          { partId: "modular-frame", quantity: 400 },
        ],
      },
      {
        id: "fluid-packaging",
        name: "Fluid Packaging",
        tier: 5,
        parts: [
          { partId: "plastic", quantity: 200 },
          { partId: "steel-beam", quantity: 400 },
          { partId: "copper-sheet", quantity: 1000 },
        ],
      },
      {
        id: "petroleum-power",
        name: "Petroleum Power",
        tier: 5,
        parts: [
          { partId: "motor", quantity: 100 },
          { partId: "encased-industrial-beam", quantity: 100 },
          { partId: "rubber", quantity: 200 },
          { partId: "plastic", quantity: 200 },
        ],
      },
    ],
  },
  {
    number: 6,
    name: "Tier 6",
    phase: "Phase 3",
    milestones: [
      {
        id: "industrial-manufacturing",
        name: "Industrial Manufacturing",
        tier: 6,
        parts: [
          { partId: "motor", quantity: 200 },
          { partId: "modular-frame", quantity: 200 },
          { partId: "plastic", quantity: 400 },
          { partId: "cable", quantity: 1000 },
        ],
      },
      {
        id: "monorail-train-technology",
        name: "Monorail Train Technology",
        tier: 6,
        parts: [
          { partId: "motor", quantity: 250 },
          { partId: "encased-industrial-beam", quantity: 500 },
          { partId: "steel-beam", quantity: 1000 },
          { partId: "steel-pipe", quantity: 1000 },
        ],
      },
      {
        id: "railway-signalling",
        name: "Railway Signalling",
        tier: 6,
        parts: [
          { partId: "computer", quantity: 50 },
          { partId: "steel-pipe", quantity: 500 },
          { partId: "copper-sheet", quantity: 1000 },
        ],
      },
      {
        id: "pipeline-engineering-mk2",
        name: "Pipeline Engineering Mk.2",
        tier: 6,
        parts: [
          { partId: "heavy-modular-frame", quantity: 50 },
          { partId: "plastic", quantity: 1000 },
          { partId: "rubber", quantity: 1000 },
        ],
      },
      {
        id: "ficsit-blueprints-mk2",
        name: "FICSIT Blueprints Mk.2",
        tier: 6,
        parts: [
          { partId: "heavy-modular-frame", quantity: 100 },
          { partId: "computer", quantity: 100 },
          { partId: "rubber", quantity: 400 },
          { partId: "concrete", quantity: 1500 },
        ],
      },
    ],
  },
  {
    number: 7,
    name: "Tier 7",
    phase: "Phase 3",
    milestones: [
      {
        id: "bauxite-refinement",
        name: "Bauxite Refinement",
        tier: 7,
        parts: [
          { partId: "computer", quantity: 100 },
          { partId: "heavy-modular-frame", quantity: 100 },
          { partId: "motor", quantity: 250 },
          { partId: "rubber", quantity: 500 },
        ],
      },
      {
        id: "hoverpack",
        name: "Hoverpack",
        tier: 7,
        parts: [
          { partId: "alclad-aluminum-sheet", quantity: 100 },
          { partId: "heavy-modular-frame", quantity: 100 },
          { partId: "computer", quantity: 100 },
          { partId: "motor", quantity: 250 },
        ],
      },
      {
        id: "logistics-mk5",
        name: "Logistics Mk.5",
        tier: 7,
        parts: [
          { partId: "alclad-aluminum-sheet", quantity: 200 },
          { partId: "encased-industrial-beam", quantity: 400 },
          { partId: "reinforced-iron-plate", quantity: 600 },
        ],
      },
      {
        id: "hazmat-suit",
        name: "Hazmat Suit",
        tier: 7,
        parts: [
          { partId: "gas-filter", quantity: 50 },
          { partId: "aluminum-casing", quantity: 100 },
          { partId: "quickwire", quantity: 500 },
        ],
      },
      {
        id: "control-system-development",
        name: "Control System Development",
        tier: 7,
        parts: [
          { partId: "alclad-aluminum-sheet", quantity: 200 },
          { partId: "aluminum-casing", quantity: 400 },
          { partId: "computer", quantity: 200 },
          { partId: "plastic", quantity: 1000 },
        ],
      },
    ],
  },
  {
    number: 8,
    name: "Tier 8",
    phase: "Phase 3",
    milestones: [
      {
        id: "aeronautical-engineering",
        name: "Aeronautical Engineering",
        tier: 8,
        parts: [
          { partId: "radio-control-unit", quantity: 50 },
          { partId: "alclad-aluminum-sheet", quantity: 100 },
          { partId: "aluminum-casing", quantity: 200 },
          { partId: "motor", quantity: 300 },
        ],
      },
      {
        id: "nuclear-power",
        name: "Nuclear Power",
        tier: 8,
        parts: [
          { partId: "supercomputer", quantity: 50 },
          { partId: "heavy-modular-frame", quantity: 200 },
          { partId: "cable", quantity: 1000 },
          { partId: "concrete", quantity: 2000 },
        ],
      },
      {
        id: "advanced-aluminum-production",
        name: "Advanced Aluminum Production",
        tier: 8,
        parts: [
          { partId: "radio-control-unit", quantity: 50 },
          { partId: "aluminum-casing", quantity: 200 },
          { partId: "alclad-aluminum-sheet", quantity: 400 },
          { partId: "wire", quantity: 3000 },
        ],
      },
      {
        id: "leading-edge-production",
        name: "Leading-Edge Production",
        tier: 8,
        parts: [
          { partId: "fused-modular-frame", quantity: 50 },
          { partId: "supercomputer", quantity: 100 },
          { partId: "steel-pipe", quantity: 1000 },
        ],
      },
      {
        id: "particle-enrichment",
        name: "Particle Enrichment",
        tier: 8,
        parts: [
          { partId: "turbo-motor", quantity: 50 },
          { partId: "fused-modular-frame", quantity: 100 },
          { partId: "cooling-system", quantity: 200 },
          { partId: "quickwire", quantity: 2500 },
        ],
      },
    ],
  },
  {
    number: 9,
    name: "Tier 9",
    phase: "Phase 4",
    milestones: [
      {
        id: "matter-conversion",
        name: "Matter Conversion",
        tier: 9,
        parts: [
          { partId: "fused-modular-frame", quantity: 100 },
          { partId: "radio-control-unit", quantity: 250 },
          { partId: "cooling-system", quantity: 500 },
        ],
      },
      {
        id: "quantum-encoding",
        name: "Quantum Encoding",
        tier: 9,
        parts: [
          { partId: "time-crystal", quantity: 50 },
          { partId: "ficsite-trigon", quantity: 100 },
          { partId: "turbo-motor", quantity: 200 },
          { partId: "supercomputer", quantity: 400 },
        ],
      },
      {
        id: "ficsit-blueprints-mk3",
        name: "FICSIT Blueprints Mk.3",
        tier: 9,
        parts: [
          { partId: "neural-quantum-processor", quantity: 100 },
          { partId: "time-crystal", quantity: 250 },
          { partId: "ficsite-trigon", quantity: 500 },
          { partId: "fused-modular-frame", quantity: 500 },
        ],
      },
      {
        id: "spatial-energy-regulation",
        name: "Spatial Energy Regulation",
        tier: 9,
        parts: [
          { partId: "superposition-oscillator", quantity: 100 },
          { partId: "turbo-motor", quantity: 250 },
          { partId: "radio-control-unit", quantity: 500 },
          { partId: "sam-fluctuator", quantity: 1000 },
        ],
      },
      {
        id: "peak-efficiency",
        name: "Peak Efficiency",
        tier: 9,
        parts: [
          { partId: "time-crystal", quantity: 250 },
          { partId: "ficsite-trigon", quantity: 250 },
          { partId: "alclad-aluminum-sheet", quantity: 5000 },
          { partId: "iron-plate", quantity: 10000 },
        ],
      },
    ],
  },
]

export default tiers
