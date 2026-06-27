import type { Level } from '../types'

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '')
}

/** Lenient flag check: trims, lowercases, ignores whitespace, and also accepts
 *  the bare inner text (without the FLAG{...} wrapper) to be newbie-friendly. */
export function checkFlag(level: Level, attempt: string): boolean {
  const candidates = [level.flag, ...(level.acceptedFlags ?? [])]
  const a = normalize(attempt)
  if (!a) return false
  for (const c of candidates) {
    const n = normalize(c)
    if (a === n) return true
    const inner = n.match(/^flag\{(.*)\}$/)?.[1]
    if (inner && a === inner) return true
  }
  return false
}
