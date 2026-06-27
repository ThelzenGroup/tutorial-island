import { useProgress } from '../game/progress'
import { levels } from '../levels'
import type { Level } from '../types'

function Difficulty({ n }: { n: number }) {
  return (
    <span className="font-mono text-xs text-amber" title={`Difficulty ${n}/5`}>
      {'●'.repeat(n)}
      <span className="text-edge">{'●'.repeat(5 - n)}</span>
    </span>
  )
}

export function IslandMap({ onPick }: { onPick: (level: Level) => void }) {
  const { isSolved, progress } = useProgress()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-2xl border border-edge bg-panel p-6">
        <h1 className="text-2xl font-bold">
          Welcome to <span className="text-neon">Tutorial Island</span> 🏝️
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A safe place to learn real hacking skills from absolute zero. No
          networking knowledge needed. Each challenge teaches one idea, starts
          easy, and explains the real-world skill afterwards. Find the hidden{' '}
          <code className="rounded bg-panel-2 px-1 font-mono text-neon">
            FLAG&#123;...&#125;
          </code>{' '}
          and submit it to advance.
        </p>
        <p className="mt-3 text-xs text-muted">
          ⚖️ Everything here is simulated and self-contained. Only ever test
          real systems you own or have written permission to test.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((level, idx) => {
          const solved = isSolved(level.id)
          // Unlock the next level once the previous is solved (level 1 is open).
          const prev = levels[idx - 1]
          const locked = idx > 0 && !!prev && !isSolved(prev.id)

          return (
            <button
              key={level.id}
              disabled={locked}
              onClick={() => onPick(level)}
              className={`group relative flex flex-col rounded-2xl border p-5 text-left transition ${
                locked
                  ? 'cursor-not-allowed border-edge bg-panel/40 opacity-60'
                  : 'border-edge bg-panel hover:-translate-y-1 hover:border-neon hover:shadow-[0_0_30px_-10px_var(--color-neon)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-panel-2 font-mono text-sm text-cyan">
                  {level.order}
                </span>
                <span className="text-2xl">
                  {locked ? '🔒' : solved ? '✅' : level.badge.emoji}
                </span>
              </div>

              <h2 className="mt-3 text-lg font-bold">{level.title}</h2>
              <p className="mt-1 text-xs italic text-muted">{level.tagline}</p>

              <div className="mt-auto pt-4">
                <div className="text-[11px] uppercase tracking-wide text-muted">
                  Teaches
                </div>
                <div className="text-sm text-cyan">{level.concept}</div>
                <div className="mt-3 flex items-center justify-between">
                  <Difficulty n={level.difficulty} />
                  <span className="font-mono text-xs text-amber">
                    +{level.xp} XP
                  </span>
                </div>
              </div>

              {locked && (
                <div className="absolute inset-0 flex items-end justify-center rounded-2xl pb-4">
                  <span className="rounded-full bg-bg/80 px-3 py-1 text-[11px] text-muted">
                    Solve level {level.order - 1} to unlock
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {progress.solved.length === levels.length && (
        <div className="pop-in mt-8 rounded-2xl border border-neon bg-panel p-6 text-center">
          <div className="text-4xl">🏆</div>
          <h2 className="mt-2 text-xl font-bold text-neon">
            Island cleared! You earned every badge.
          </h2>
          <p className="mt-2 text-sm text-muted">
            You learned recon, browser DevTools, encoding, content discovery,
            and why never to trust the client. Next stop: real practice grounds
            like picoCTF, TryHackMe, or OverTheWire.
          </p>
        </div>
      )}
    </div>
  )
}
