import type { Level } from '../types'
import { viewSource } from './viewSource'
import { cookies } from './cookies'
import { encoding } from './encoding'
import { hiddenPath } from './hiddenPath'
import { weakLock } from './weakLock'

export const levels: Level[] = [
  viewSource,
  cookies,
  encoding,
  hiddenPath,
  weakLock,
].sort((a, b) => a.order - b.order)

export function getLevel(id: string): Level | undefined {
  return levels.find((l) => l.id === id)
}
