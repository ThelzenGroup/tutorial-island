import { useState } from 'react'
import type { Level, SandboxProps } from '../types'
import { BrowserFrame } from '../components/ui'

const FLAG = 'FLAG{never_trust_the_client}'
const PASSWORD = 'Summer2024!'

const PAGE_SOURCE = `<form id="login">
  <input id="user" placeholder="username" />
  <input id="pass" type="password" placeholder="password" />
  <button>Sign in</button>
</form>

<script>
  // TODO: move this check to the server before launch
  const SECRET = "${PASSWORD}";
  document.querySelector("#login").onsubmit = (e) => {
    e.preventDefault();
    if (document.querySelector("#pass").value === SECRET) {
      showDashboard("${FLAG}");
    } else {
      alert("Wrong password");
    }
  };
</script>`

function Sandbox({ onDiscover }: SandboxProps) {
  const [pass, setPass] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [showSource, setShowSource] = useState(false)

  function submit() {
    if (pass === PASSWORD) {
      setUnlocked(true)
      setError(false)
      onDiscover?.('You logged in!')
    } else {
      setError(true)
    }
  }

  return (
    <BrowserFrame
      url="https://members.cloudvault.test/login"
      toolbar={
        <button
          onClick={() => {
            setShowSource((s) => !s)
            if (!showSource) onDiscover?.('You opened the page source.')
          }}
          className="rounded-md border border-edge bg-bg px-2 py-1 font-mono text-[11px] text-cyan hover:border-cyan"
        >
          {showSource ? '◀ Back' : '</> View Source'}
        </button>
      }
    >
      {showSource ? (
        <pre className="scroll-thin max-h-80 overflow-auto bg-[#0c1018] p-4 font-mono text-xs leading-relaxed text-[#9fe6b0]">
          {PAGE_SOURCE}
        </pre>
      ) : unlocked ? (
        <div className="p-6 font-sans">
          <h1 className="text-xl font-bold text-emerald-600">
            ✓ Welcome back, admin
          </h1>
          <p className="mt-2 text-gray-600">Your dashboard is ready.</p>
          <code className="mt-4 block rounded bg-slate-900 p-3 font-mono text-sm text-green-400">
            {FLAG}
          </code>
        </div>
      ) : (
        <div className="p-8 font-sans">
          <h1 className="text-lg font-bold text-gray-800">CloudVault Login</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
            className="mt-4 max-w-xs space-y-3"
          >
            <input
              placeholder="username"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="password"
              aria-label="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
              Sign in
            </button>
            {error && (
              <p className="text-sm text-red-600">Wrong password.</p>
            )}
          </form>
        </div>
      )}
    </BrowserFrame>
  )
}

export const weakLock: Level = {
  id: 'weak-lock',
  order: 5,
  title: 'Weak Lock',
  tagline: 'A lock is useless if the key is taped to the door.',
  concept: 'Never trust client-side security',
  difficulty: 3,
  xp: 150,
  badge: { emoji: '🔑', name: 'Lockpick' },
  flag: FLAG,
  briefing: [
    'This login page checks your password right inside your browser — which means the correct password had to be sent to your browser too.',
    'Anything your browser knows, YOU can know. The “lock” is checked on the wrong side of the door.',
    'Get into the members area and grab the flag.',
  ],
  objective:
    'Log in to CloudVault and reveal the flag (you don’t need to guess blindly).',
  hints: [
    'The password check happens in the browser — so the password must be hidden in the page itself.',
    'Use “View Source” and read the <script> block carefully.',
    'There’s a line like const SECRET = "...". Type that exact value into the password box and sign in.',
  ],
  debrief: [
    'You found a hardcoded secret and bypassed a client-side check. If security logic runs in the browser, an attacker can read it, change it, or skip it entirely.',
    'The golden rule: never trust the client. All real authentication and authorization must happen on the server, where the user can’t tamper with it.',
  ],
  Sandbox,
}
