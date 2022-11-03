import Dll from './dll'
import { AllowedArgs, AllowedFn, DllJson } from './types'


/**
 * Least Recently Used Cache controls transformations on Dll<T>
 * @limit number of unique cached function resolutions (defaults to Infinity)
 * @calls number of times LruCache is used
 * @hits number of times LruCache has resolved a cache hit (lte this.calls)
 * @size current size of cached function resolutions (lte this.limit)
 */
export default class LruCache<Targs extends AllowedArgs, T> {
  declare limit: number
  declare calls: number
  declare hits: number
  declare size: number
  head?: Dll<T> = undefined

	constructor(limit = Infinity) {
  	this.limit = limit
    this.calls = 0
    this.hits = 0
    this.size = 0
  }
  
  find(args: string) {
  	if (!this.head) return;
    return this.head.find(args)
  }

  /**
   * Use the async value generated
   */
	async use(args: Targs, fn: AllowedFn<Targs, T>) {
  	this.calls += 1
    const strargs = JSON.stringify(args)
  	let found = this.find(strargs)
    if (found) {
    	this.hits += 1
      this.dereference(found)
      this.setHead(found)
    } else {
      const result = await fn(...args)
    	const dll = new Dll(strargs, result)
      this.setHead(dll)
      found = dll
    }
    return found
  }
  
  /**
   * Dereference the provided `dll`. Updates references around `dll` and adjusts this.size by -1
   * @returns The provided `Dll<T>`
   */
  dereference(dll: Dll<T>) {
  	if (dll.lhs) {
    	const lhs = dll.lhs
    	dll.lhs.rhs = dll.rhs
    	if (dll.rhs) {
        dll.rhs.lhs = lhs
      }
    }
    if (dll.rhs) {
    	const rhs = dll.rhs
      if (dll.lhs) {
      	dll.lhs.rhs = rhs
      }
    }
    dll.rhs = undefined
    dll.lhs = undefined
    this.size -= 1
    return dll
  }
  
  /**
   * Getter for the tail of this.head's Dll
   */
  get tail() {
    if (!this.head) return
  	let ptr: Dll<T> = this.head
    while (ptr.rhs !== undefined) {
    	ptr = ptr.rhs
    }
    return ptr
  }
  
  /**
   * Sets this.head and updates all references related to previous head.
   * @dll `Dll<T>` Node to be the new head
   */
  setHead(dll: Dll<T>) {
  	if (!this.head) {
    	this.head = dll
      this.size += 1
    } else {
    	if (this.size === this.limit) {
      	const tail = this.tail
        if (tail) this.dereference(tail)
      }
      dll.rhs = this.head
      this.head.lhs = dll
      this.head = dll
      this.size += 1
    }
  }

  /**
   * Dereference cache Dll, set all count values to 0, preserve cache limit.
   */
  clear() {
    this.head = undefined
    this.calls = 0
    this.hits = 0
    this.size = 0
  }
  
  /**
   * Returns Array of Dll.toJSON()
   */
  toArray() {
  	let ptr = this.head
    const ret: DllJson<T>[] = []
    while (ptr) {
    	ret.push(ptr.toJSON())
    	ptr = ptr.rhs
    }
    return ret
  }
  
  /**
   * Returns string joining Dll.key with " -> "
   */
  toString() {
    const ret = this.toArray().map((v) => v.key)
    return ret.join(' -> ')
  }
}
