import { vi } from 'vitest'
import type { NavigationResult } from '../src/data-loaders/navigation-guard'
import {
  type DefineDataLoaderOptions,
  defineBasicLoader,
} from '../src/data-loaders/defineLoader'

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function mockPromise<Resolved, Err>(resolved: Resolved, rejected?: Err) {
  let _resolve: null | ((resolvedValue: Resolved) => void) = null
  let _reject: null | ((rejectedValue?: Err) => void) = null
  function resolve(resolvedValue?: Resolved) {
    if (!_resolve || !promise)
      throw new Error('Resolve called with no active promise')
    _resolve(resolvedValue ?? resolved)
    _resolve = null
    _reject = null
    promise = null
  }
  function reject(rejectedValue?: Err) {
    if (!_reject || !promise)
      throw new Error('Reject called with no active promise')
    _reject(rejectedValue ?? rejected)
    _resolve = null
    _reject = null
    promise = null
  }

  let promise: Promise<Resolved> | null = null
  const spy = vi.fn<unknown[], Promise<Resolved>>().mockImplementation(() => {
    return (promise = new Promise<Resolved>((res, rej) => {
      _resolve = res
      _reject = rej
    }))
  })

  return [spy, resolve, reject] as const
}