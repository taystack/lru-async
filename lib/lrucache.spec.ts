import fetchMock from 'fetch-mock'

import LruCache from './lrucache'

interface PersonJSON {
  name: string
  age: number
}

class Person implements PersonJSON {
  name: string
  age: number
  constructor({ name, age }: PersonJSON) {
    this.name = name
    this.age = age
  }

  toString() {
    return this.name
  }
}

const makePersonJSON = (name: string) => ({ name, age: name.charCodeAt(0) })
const makePerson = (name: string) => new Person(makePersonJSON(name))

function fetchPerson(name: string) {
  return fetch(`/person/${name}`)
    .then((res) => res.json() as Promise<PersonJSON>)
    .then((json) => (new Person(json)))
}

describe('Least Recently Used Cache async', () => {
  beforeEach(() => {
    ;(['a', 'b', 'c', 'd']).forEach((name) => {
      fetchMock.getOnce(`/person/${name}`, makePersonJSON(name))
    })
  })
  
  afterEach(() => {
    fetchMock.restore()
  })
  
  async function performCacheUse(cache: LruCache<string[], Person>) {
    for (var name of ['a', 'd', 'a', 'c', 'b', 'a']) {
      await cache.use([name], fetchPerson)
    }
  }

  it('should cache LIMIT items', async () => {
    const cache = new LruCache<string[], Person>(3)
    await performCacheUse(cache)
    // Person(a) -> Person(b) -> Person(c)

    expect(cache.limit).toEqual(3)
    expect(cache.size).toEqual(3)
    expect(cache.calls).toEqual(6)
    expect(cache.hits).toEqual(2)

    // Representations
    expect(`${cache}`).toEqual('["a"] -> ["b"] -> ["c"]')
    expect(cache.toArray()).toHaveLength(cache.size)

    // Find
    expect(cache.find('["a"]')?.result).toEqual(makePerson('a'))
    expect(cache.find('["b"]')?.result).toEqual(makePerson('b'))
    expect(cache.find('["c"]')?.result).toEqual(makePerson('c'))

    // Cache hit
    const used = await cache.use(['b'], fetchPerson)
    expect(cache.hits).toEqual(3)
    expect(used.result).toEqual(makePerson('b'))
    expect(cache.head?.key).toEqual('["b"]')
    expect(cache.head?.result).toEqual(makePerson('b'))

    // Cache clear
    cache.clear()
    expect(cache.size).toEqual(0)
    expect(cache.calls).toEqual(0)
    expect(cache.hits).toEqual(0)
    expect(cache.head).toBeUndefined()
    expect(cache.tail).toBeUndefined()
  })

  it('should handle Infinite number of cached return values', async () => {
    const cache = new LruCache<string[], Person>()
    await performCacheUse(cache)
    // Person(a) -> Person(b) -> Person(c) -> Person(d)

    expect(cache.limit).toEqual(Infinity)
    expect(cache.size).toEqual(4)
    expect(cache.calls).toEqual(6)
    expect(cache.hits).toEqual(2)

    // Representations
    expect(`${cache}`).toEqual('["a"] -> ["b"] -> ["c"] -> ["d"]')
    expect(cache.toArray()).toHaveLength(cache.size)
  })
})
