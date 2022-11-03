export class NonPrimitiveArgument extends Error {
  constructor(arg: any) {
    super(`Must use primitive arguments. You used:\n${arg}`)
  }
}

/**
 * Expects all arguments to be primitives, eg: number, string, boolean
 */
export function validateArguments(...args: any[]) {
  args.forEach((arg: any) => {
    if (arg === Object(arg)) throw new NonPrimitiveArgument(arg)
  })
}
