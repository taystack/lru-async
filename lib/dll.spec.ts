import Dll from './dll'


describe('Double-Linked-List', () => {
  let a: Dll<number>
  let b: Dll<number>
  let c: Dll<number>
  beforeEach(() => {
    a = new Dll('a', 1)
    b = new Dll('b', 2)
    c = new Dll('c', 2)
  })
  
  it('should append another dll', () => {
    a.append(b)
    expect(a.rhs).toBe(b)
    expect(b.lhs).toBe(a)
  })

  it('should be able to find other Dll', () => {
    a.append(b)
    a.append(c)
    expect(a.find('a')).toBe(a)
    expect(a.find('b')).toBe(b)
    expect(a.find('c')).toBe(c)
    expect(a.find('d')).toBe(undefined)
  })

  it('should represent a JSON format', () => {
    expect(a.toJSON()).toEqual({
      key: 'a',
      result: 1,
      lhs: undefined,
      rhs: undefined,
    })
    expect(b.toJSON()).toEqual({
      key: 'b',
      result: 2,
      lhs: undefined,
      rhs: undefined,
    })
    expect(c.toJSON()).toEqual({
      key: 'c',
      result: 2,
      lhs: undefined,
      rhs: undefined,
    })

    a.append(b)
    a.append(c)

    expect(a.toJSON()).toEqual({
      key: 'a',
      result: 1,
      lhs: undefined,
      rhs: 'b',
    })
    expect(b.toJSON()).toEqual({
      key: 'b',
      result: 2,
      lhs: 'a',
      rhs: 'c',
    })
    expect(c.toJSON()).toEqual({
      key: 'c',
      result: 2,
      lhs: 'b',
      rhs: undefined,
    })
  })
})