import { useState } from 'react'
import type { Level, SandboxProps } from '../types'
import { BrowserFrame } from '../components/ui'

const FLAG = 'FLAG{cookies_are_not_just_for_eating}'

const COOKIES: { name: string; value: string }[] = [
  { name: 'theme', value: 'dark' },
  { name: 'session_id', value: 'b7f3a91c2e' },
  { name: 'remember_me', value: 'true' },
  { name: 'admin_token', value: FLAG },
  { name: 'last_seen', value: '2026-06-27' },
]

const LOCAL_STORAGE: { name: string; value: string }[] = [
  { name: 'cart_count', value: '0' },
  { name: 'tutorial_done', value: 'yes' },
]

function Sandbox({ onDiscover }: SandboxProps) {
  const [devtools, setDevtools] = useState(false)
  const [tab, setTab] = useState<'cookies' | 'storage'>('cookies')

  return (
    <BrowserFrame
      url="https://shop.gizmo-mart.test/account"
      toolbar={
        <button
          onClick={() => {
            setDevtools((d) => !d)
            if (!devtools) onDiscover?.('You opened DevTools.')
          }}
          className="rounded-md border border-edge bg-bg px-2 py-1 font-mono text-[11px] text-cyan hover:border-cyan"
        >
          {devtools ? 'Close DevTools' : '⚙ Open DevTools'}
        </button>
      }
    >
      <div className="p-6 font-sans">
        <h1 className="text-xl font-bold text-gray-800">Gizmo-Mart</h1>
        <p className="mt-2 text-gray-600">Welcome back! You are logged in.</p>
        <button className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">
          My Orders
        </button>
      </div>

      {devtools && (
        <div className="border-t-2 border-gray-300 bg-[#1e1e1e] font-mono text-xs text-gray-200">
          <div className="flex gap-1 border-b border-gray-700 bg-[#252526] px-2 py-1">
            <span className="px-2 py-0.5 text-gray-400">Elements</span>
            <span className="px-2 py-0.5 text-gray-400">Console</span>
            <span className="rounded bg-[#37373d] px-2 py-0.5 text-white">
              Application
            </span>
          </div>
          <div className="flex">
            <div className="w-40 shrink-0 border-r border-gray-700 p-2">
              <div className="mb-1 text-[10px] uppercase tracking-wide text-gray-500">
                Storage
              </div>
              <button
                onClick={() => setTab('cookies')}
                className={`block w-full rounded px-2 py-1 text-left ${
                  tab === 'cookies' ? 'bg-[#094771] text-white' : 'text-gray-300'
                }`}
              >
                🍪 Cookies
              </button>
              <button
                onClick={() => setTab('storage')}
                className={`block w-full rounded px-2 py-1 text-left ${
                  tab === 'storage' ? 'bg-[#094771] text-white' : 'text-gray-300'
                }`}
              >
                📦 Local Storage
              </button>
            </div>
            <div className="scroll-thin max-h-56 flex-1 overflow-auto p-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500">
                    <th className="py-1 pr-4">Name</th>
                    <th className="py-1">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {(tab === 'cookies' ? COOKIES : LOCAL_STORAGE).map((row) => (
                    <tr key={row.name} className="border-t border-gray-800">
                      <td className="py-1 pr-4 text-cyan-400">{row.name}</td>
                      <td className="py-1 break-all text-amber-300">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </BrowserFrame>
  )
}

export const cookies: Level = {
  id: 'cookies',
  order: 2,
  title: 'Whispered Secret',
  tagline: 'Your browser remembers more than you think.',
  concept: 'Inspecting cookies & storage with DevTools',
  difficulty: 1,
  xp: 75,
  badge: { emoji: '🍪', name: 'Cookie Monster' },
  flag: FLAG,
  briefing: [
    'Websites store little notes on your computer called cookies — to remember you’re logged in, your theme, your cart, and more.',
    'You can read every one of them. Browsers have a built-in toolbox called DevTools that lets you peek behind the curtain.',
    'This shop stored something it really shouldn’t have in a cookie.',
  ],
  objective: 'Open DevTools, inspect the cookies, and find the admin token flag.',
  hints: [
    'In a real browser, press F12 (or right-click → Inspect) to open DevTools.',
    'Click “Open DevTools”, then look under the Application tab → Cookies.',
    'One cookie is named admin_token. Sensitive things should never live in a readable cookie!',
  ],
  debrief: [
    'Cookies and localStorage are fully readable (and editable) by anyone using the browser. Storing secrets, tokens, or “admin = true” there is a classic mistake.',
    'Pentesters routinely inspect — and tamper with — cookies to escalate privileges or hijack sessions. Servers must verify everything; never trust a value just because it came from a cookie.',
  ],
  Sandbox,
}
