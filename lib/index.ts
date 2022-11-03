import LruCache from './lrucache'
import { AllowedArgs, AllowedFn } from './types'

/**
 * Practical application of lru cache using a function that accepts any number of primitive arguments.
 * Behaves exactly like debounce, throttle, etc.
 * Cache return value when reused arguments are passed to the wrapped function.
 * @use
 * ```typescript
 * const cacheAdd = lrufn((...nums: number[]) => (nums.reduce((l: number, r: number) => (l + r))))
 * cacheAdd(1, 1) // 2
 * cacheAdd(1, 2) // 3
 * cacheAdd(1, 1) // HIT 2
 * ```
 */
export default function lruasync<Targs extends AllowedArgs, T>(
  fn: AllowedFn<Targs, T>, maxsize: number = Infinity
) {
	const cache = new LruCache<Targs, T>(maxsize)
  const ret = async (...args: Targs) => {
  	let dll = await cache.use(args, fn)
    return dll.result
  }
  ret.getCache = () => cache
  ret.clearCache = () => cache.clear()
	return ret
}
