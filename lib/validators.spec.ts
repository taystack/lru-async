import { NonPrimitiveArgument, validateArguments } from './validators'

class Foo {}

describe('validateArguments', () => {
  it.each([
    [1, 2, 3],
    [1, 'a', false],
  ])
  ('should ignore all primitive args %p', (...args) => {
    expect(() => {
      validateArguments(...args)
    }).not.toThrowError()
  })

  it.each([
    [1,'a', function foo() {}],
    [1,'a',() => {}],
    [1,'a', Object],
    [1,'a', new Foo()],
  ])
  ('should raise when args are not all primitive %p', (...args) => {
    expect(() => {
      validateArguments(...args)
    }).toThrowError(NonPrimitiveArgument)
  })
})
