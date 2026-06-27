import { useState } from 'react'
import { ProgressProvider } from './game/progress'
import { Header } from './components/Header'
import { IslandMap } from './components/IslandMap'
import { LevelView } from './components/LevelView'
import type { Level } from './types'

function Game() {
  const [active, setActive] = useState<Level | null>(null)

  return (
    <div className="min-h-full">
      <Header onHome={() => setActive(null)} />
      {active ? (
        <LevelView
          key={active.id}
          level={active}
          onBack={() => setActive(null)}
          onGoLevel={(l) => {
            setActive(l)
            window.scrollTo({ top: 0 })
          }}
        />
      ) : (
        <IslandMap onPick={setActive} />
      )}
      <footer className="border-t border-edge py-6 text-center text-xs text-muted">
        Tutorial Island · a safe sandbox for learning offensive security ·
        practice only on systems you’re allowed to test
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Game />
    </ProgressProvider>
  )
}
