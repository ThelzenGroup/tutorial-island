import { useState } from 'react'
import type { Level, SandboxProps } from '../types'
import { BrowserFrame } from '../components/ui'

const FLAG = 'FLAG{robots_txt_spilled_the_beans}'
const HOST = 'http://acme-corp.test'
const SECRET_PATH = '/staff-portal-7y3'

function pathOf(url: string): string {
  let u = url.trim()
  u = u.replace(/^https?:\/\//, '')
  const slash = u.indexOf('/')
  const path = slash === -1 ? '/' : u.slice(slash)
  return path === '' ? '/' : path
}

function Sandbox({ onDiscover }: SandboxProps) {
  const [url, setUrl] = useState(`${HOST}/`)
  const path = pathOf(url)

  function render() {
    if (path === '/' || path.toLowerCase() === '/index.html') {
      return (
        <div className="p-6 font-sans">
          <h1 className="text-2xl font-bold text-slate-800">ACME Corp</h1>
          <p className="mt-2 text-slate-600">
            Industrial-grade anvils since 1949.
          </p>
          <div className="mt-6 text-5xl">🏭</div>
        </div>
      )
    }
    if (path.toLowerCase() === '/robots.txt') {
      return (
        <pre className="bg-white p-5 font-mono text-sm text-slate-800">
          {`User-agent: *
Disallow: /cgi-bin/
Disallow: ${SECRET_PATH}
# please don't index the staff portal, it's not ready yet`}
        </pre>
      )
    }
    if (path === SECRET_PATH || path === `${SECRET_PATH}/`) {
      onDiscover?.('You found the hidden staff portal.')
      return (
        <div className="p-6 font-sans">
          <h1 className="text-xl font-bold text-rose-600">
            🔒 Staff Portal (internal)
          </h1>
          <p className="mt-2 text-slate-600">
            Oops, this was never meant to be public.
          </p>
          <code className="mt-4 block rounded bg-slate-900 p-3 font-mono text-sm text-green-400">
            {FLAG}
          </code>
        </div>
      )
    }
    return (
      <div className="p-10 text-center font-sans">
        <div className="text-4xl font-bold text-slate-300">404</div>
        <p className="mt-2 text-slate-500">
          Page not found: <code>{path}</code>
        </p>
      </div>
    )
  }

  return (
    <BrowserFrame url={url} editable onNavigate={setUrl}>
      {render()}
    </BrowserFrame>
  )
}

export const hiddenPath: Level = {
  id: 'hidden-path',
  order: 4,
  title: 'The Forgotten Door',
  tagline: 'Not every page is linked — some are just... there.',
  concept: 'Recon & directory discovery (robots.txt)',
  difficulty: 2,
  xp: 125,
  badge: { emoji: '🚪', name: 'Door Finder' },
  flag: FLAG,
  briefing: [
    'Websites often have pages with no visible link — admin panels, staging areas, leftover files. If you know the address, you can just visit them.',
    'A special file called robots.txt politely asks search engines NOT to index certain pages. Ironically, it ends up advertising exactly where the secret stuff lives.',
    'This anvil company left a door unlocked.',
  ],
  objective:
    'Find a hidden page on acme-corp.test and read the flag. Type addresses into the URL bar.',
  hints: [
    'Almost every site has a file at /robots.txt. Try navigating to it by editing the URL bar.',
    'Type http://acme-corp.test/robots.txt and press Enter.',
    'robots.txt lists a “Disallow” path. Visit that exact path to find the portal.',
  ],
  debrief: [
    'You performed content discovery — finding pages that aren’t linked anywhere. robots.txt, sitemap.xml, and predictable names like /admin are goldmines.',
    'Real pentesters automate this with tools like gobuster or ffuf, brute-forcing thousands of paths. “Hidden” is not a security control — if it’s reachable, assume someone will reach it.',
  ],
  Sandbox,
}
