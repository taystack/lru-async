require('jest-fetch-mock').enableMocks()
const fetchMock = require('fetch-mock')

afterEach(() => {
  fetchMock.restore()
})
