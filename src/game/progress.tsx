import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Badge, Progress } from '../types'

const STORAGE_KEY = 'tutorial-island:progress:v1'

const emptyProgress: Progress = {
  solved: [],
  xp: 0,
  badges: [],
  hintsUsed: {},
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      solved: parsed.solved ?? [],
      xp: parsed.xp ?? 0,
      badges: parsed.badges ?? [],
      hintsUsed: parsed.hintsUsed ?? {},
    }
  } catch {
    return emptyProgress
  }
}

interface ProgressContextValue {
  progress: Progress
  isSolved: (levelId: string) => boolean
  solve: (levelId: string, xp: number, badge: Badge) => boolean
  recordHint: (levelId: string) => void
  hintsUsed: (levelId: string) => number
  reset: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const isSolved = useCallback(
    (levelId: string) => progress.solved.includes(levelId),
    [progress.solved],
  )

  // Returns true if this was a newly solved level (so callers can celebrate).
  const solve = useCallback(
    (levelId: string, xp: number, badge: Badge) => {
      let firstTime = false
      setProgress((prev) => {
        if (prev.solved.includes(levelId)) return prev
        firstTime = true
        return {
          ...prev,
          solved: [...prev.solved, levelId],
          xp: prev.xp + xp,
          badges: [...prev.badges, badge],
        }
      })
      return firstTime
    },
    [],
  )

  const recordHint = useCallback((levelId: string) => {
    setProgress((prev) => ({
      ...prev,
      hintsUsed: {
        ...prev.hintsUsed,
        [levelId]: (prev.hintsUsed[levelId] ?? 0) + 1,
      },
    }))
  }, [])

  const hintsUsed = useCallback(
    (levelId: string) => progress.hintsUsed[levelId] ?? 0,
    [progress.hintsUsed],
  )

  const reset = useCallback(() => setProgress(emptyProgress), [])

  const value = useMemo<ProgressContextValue>(
    () => ({ progress, isSolved, solve, recordHint, hintsUsed, reset }),
    [progress, isSolved, solve, recordHint, hintsUsed, reset],
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
