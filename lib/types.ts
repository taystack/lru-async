export type AllowedArgs = (number | string | boolean)[]
export type AllowedFn<Targs extends AllowedArgs, T> = (...args: Targs) => Promise<T>
export interface DllJson<T> {
  key: string
  result: T
  lhs?: string
  rhs?: string
}
