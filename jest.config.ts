import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest-setup.js'],
}

export default jestConfig
