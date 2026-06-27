import { useEffect, useMemo, useRef, useState } from 'react'
import type { Level } from '../types'
import { useProgress } from '../game/progress'
import { checkFlag } from '../game/flag'
import { getLevel, levels } from '../levels'

export function LevelView({
  level,
  onBack,
  onGoLevel,
}: {
  level: Level
  onBack: () => void
  onGoLevel: (level: Level) => void
}) {
  const { isSolved, solve, recordHint, hintsUsed } = useProgress()
  const alreadySolved = isSolved(level.id)

  const [revealed, setRevealed] = useState(0)
  const [attempt, setAttempt] = useState('')
  const [status, setStatus] = useState<'idle' | 'wrong'>('idle')
  const [justSolved, setJustSolved] = useState(false)
  const [discovery, setDiscovery] = useState<string | null>(null)
  const discoveryTimer = useRef<number | undefined>(undefined)

  // Clear any pending toast timer on unmount.
  useEffect(() => () => window.clearTimeout(discoveryTimer.current), [])

  function showDiscovery(note: string) {
    setDiscovery(note)
    window.clearTimeout(discoveryTimer.current)
    discoveryTimer.current = window.setTimeout(() => setDiscovery(null), 2200)
  }

  const solved = alreadySolved || justSolved
  const Sandbox = level.Sandbox

  const next = useMemo(() => {
    const idx = levels.findIndex((l) => l.id === level.id)
    return idx >= 0 ? levels[idx + 1] : undefined
  }, [level.id])

  function submit() {
    if (checkFlag(level, attempt)) {
      const firstTime = solve(level.id, level.xp, level.badge)
      setJustSolved(true)
      setStatus('idle')
      if (firstTime) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      setStatus('wrong')
    }
  }

  function showNextHint() {
    if (revealed < level.hints.length) {
      recordHint(level.id)
      setRevealed((r) => r + 1)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-muted hover:text-neon"
      >
        ← Back to island
      </button>

      {solved && justSolved && (
        <div className="pop-in mb-6 rounded-2xl border border-neon bg-panel p-5 text-center">
          <div className="text-4xl">{level.badge.emoji}</div>
          <h2 className="mt-2 text-xl font-bold text-neon">
            Solved! Badge earned: {level.badge.name}
          </h2>
          <p className="mt-1 font-mono text-sm text-amber">
            +{level.xp} XP
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: the sandbox */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-edge bg-panel-2 font-mono text-sm text-cyan">
              {level.order}
            </span>
            <h1 className="text-xl font-bold">{level.title}</h1>
            {solved && <span className="text-xl">✅</span>}
          </div>

          <div className="relative">
            <Sandbox onDiscover={showDiscovery} />
            {discovery && (
              <div className="float-up pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-neon px-3 py-1 text-xs font-semibold text-bg">
                {discovery}
              </div>
            )}
          </div>
        </div>

        {/* Right: mission control */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-edge bg-panel p-5">
            <div className="text-[11px] uppercase tracking-wide text-muted">
              Mission · teaches {level.concept}
            </div>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#cdd9e5]">
              {level.briefing.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-edge bg-panel-2 p-3 text-sm">
              <span className="font-semibold text-amber">🎯 Objective: </span>
              {level.objective}
            </div>
          </section>

          {!solved && (
            <section className="rounded-2xl border border-edge bg-panel p-5">
              <label className="text-[11px] uppercase tracking-wide text-muted">
                Submit the flag
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submit()
                }}
                className="mt-2 flex gap-2"
              >
                <input
                  value={attempt}
                  onChange={(e) => {
                    setAttempt(e.target.value)
                    setStatus('idle')
                  }}
                  placeholder="FLAG{...}"
                  aria-label="flag input"
                  spellCheck={false}
                  className={`flex-1 rounded-md border bg-bg px-3 py-2 font-mono text-sm outline-none ${
                    status === 'wrong'
                      ? 'border-[#ff6b6b] text-[#ff6b6b]'
                      : 'border-edge text-neon focus:border-neon'
                  }`}
                />
                <button className="rounded-md bg-neon px-4 py-2 text-sm font-semibold text-bg hover:brightness-110">
                  Submit
                </button>
              </form>
              {status === 'wrong' && (
                <p className="mt-2 text-sm text-[#ff6b6b]">
                  Not quite — keep digging. Need a nudge? Open a hint below.
                </p>
              )}
            </section>
          )}

          <section className="rounded-2xl border border-edge bg-panel p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-muted">
                Hints ({revealed}/{level.hints.length})
              </span>
              {hintsUsed(level.id) > 0 && (
                <span className="text-[11px] text-muted">
                  no penalty — learning is the point
                </span>
              )}
            </div>
            <div className="mt-3 space-y-2">
              {level.hints.slice(0, revealed).map((h, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-edge bg-panel-2 p-3 text-sm text-[#cdd9e5]"
                >
                  💡 {h}
                </div>
              ))}
              {revealed < level.hints.length && (
                <button
                  onClick={showNextHint}
                  className="rounded-md border border-edge px-3 py-1.5 text-sm text-cyan hover:border-cyan"
                >
                  {revealed === 0 ? 'Reveal a hint' : 'Reveal another hint'}
                </button>
              )}
            </div>
          </section>

          {solved && (
            <section className="rounded-2xl border border-neon/40 bg-panel p-5">
              <div className="text-[11px] uppercase tracking-wide text-neon">
                What you just learned
              </div>
              <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#cdd9e5]">
                {level.debrief.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {next ? (
                  <button
                    onClick={() => onGoLevel(getLevel(next.id) ?? next)}
                    className="rounded-md bg-neon px-4 py-2 text-sm font-semibold text-bg hover:brightness-110"
                  >
                    Next: {next.title} →
                  </button>
                ) : (
                  <span className="text-sm text-neon">
                    🏆 That was the final challenge — you cleared the island!
                  </span>
                )}
                <button
                  onClick={onBack}
                  className="rounded-md border border-edge px-4 py-2 text-sm text-muted hover:border-cyan hover:text-cyan"
                >
                  Island map
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
