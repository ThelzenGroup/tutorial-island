import { useProgress } from '../game/progress'
import { levels } from '../levels'

export function Header({ onHome }: { onHome: () => void }) {
  const { progress, reset } = useProgress()
  const total = levels.length
  const done = progress.solved.length
  const pct = Math.round((done / total) * 100)

  return (
    <header className="sticky top-0 z-20 border-b border-edge bg-panel/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <button
          onClick={onHome}
          className="flex items-center gap-2 text-left"
          aria-label="home"
        >
          <span className="text-2xl">🏝️</span>
          <div className="leading-tight">
            <div className="font-mono text-sm font-bold text-neon">
              TUTORIAL ISLAND
            </div>
            <div className="text-[11px] text-muted">Learn to hack, safely</div>
          </div>
        </button>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:block">
            <div className="mb-1 flex justify-between gap-3 text-[11px] text-muted">
              <span>
                {done}/{total} solved
              </span>
              <span>{progress.xp} XP</span>
            </div>
            <div className="h-2 w-40 overflow-hidden rounded-full bg-panel-2">
              <div
                className="h-full rounded-full bg-neon transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1" title="Badges earned">
            {progress.badges.length === 0 ? (
              <span className="text-xs text-muted">no badges yet</span>
            ) : (
              progress.badges.map((b, i) => (
                <span key={i} title={b.name} className="text-xl">
                  {b.emoji}
                </span>
              ))
            )}
          </div>

          {done > 0 && (
            <button
              onClick={() => {
                if (confirm('Reset all progress? This cannot be undone.')) reset()
              }}
              className="rounded-md border border-edge px-2 py-1 text-[11px] text-muted hover:border-[#ff6b6b] hover:text-[#ff6b6b]"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
