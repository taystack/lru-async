import lruasync from '.'


function add(...nums: number[]): Promise<number> {
  return new Promise((resolve) => {
    resolve(nums.length > 0 ? nums.reduce((l, r) => (l + r)) : 0)
  })
}

describe('lruasync', () => {
  it('should maintain cache access to async methods', () => {
    const asyncAdd = lruasync(add, 3)
    asyncAdd(1)
    asyncAdd(1, 2)
    asyncAdd(1, 2, 3)
    asyncAdd(1)
  })
})
