import { DllJson } from './types'


/**
 * GENERIC Double Linked List Node that stores a key and a result.
 * @key string key of the Double Linked List Node
 * @result T Generic type referenced via constructor.
 */
export default class Dll<T> {
  declare key: string
  declare result: T
  lhs?: Dll<T> = undefined
  rhs?: Dll<T> = undefined

  constructor(key: string, result: T) {
    this.key = key
  	this.result = result
  }

	find(key: string): Dll<T> | undefined {
  	if (this.key === key) return this
    if (this.rhs) return this.rhs.find(key)
    return
  }

  append(dll: Dll<T>) {
    if (this.rhs) this.rhs.append(dll)
    else {
      this.rhs = dll
      dll.lhs = this
    }
  }

  toJSON(): DllJson<T> {
  	const rhs = this.rhs ? this.rhs.key : undefined
    const lhs = this.lhs ? this.lhs.key : undefined
  	return { key: this.key, result: this.result, lhs, rhs }
  }
}
