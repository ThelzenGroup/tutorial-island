import type { ComponentType } from 'react'

export interface Badge {
  emoji: string
  name: string
}

export interface SandboxProps {
  /** Call when the player performs the "aha" action so the sandbox can hint
   *  that they found something (purely cosmetic feedback). */
  onDiscover?: (note: string) => void
}

export interface Level {
  id: string
  /** 1-based position on the island path */
  order: number
  title: string
  tagline: string
  /** The single transferable skill this level teaches */
  concept: string
  /** 1 (trivial) .. 5 (spicy) */
  difficulty: number
  xp: number
  badge: Badge
  /** Canonical flag plus any accepted variants (compared case-insensitively) */
  flag: string
  acceptedFlags?: string[]
  /** Short story / setup shown before play */
  briefing: string[]
  /** One-line concrete goal */
  objective: string
  /** Progressive hints, revealed one at a time */
  hints: string[]
  /** Real-world explanation shown after solving */
  debrief: string[]
  /** The interactive playground for this challenge */
  Sandbox: ComponentType<SandboxProps>
}

export interface Progress {
  solved: string[]
  xp: number
  badges: Badge[]
  hintsUsed: Record<string, number>
}
