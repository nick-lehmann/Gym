import { globSync } from 'glob'
import { default as Mocha } from 'mocha'
import * as path from 'path'

export async function run(): Promise<void> {
  console.info('Running tests...')

  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  })

  const testsRoot = path.resolve(__dirname, '..')

  const files = globSync('**/**.test.js', { cwd: testsRoot })

  for (const f of files) mocha.addFile(path.resolve(testsRoot, f))

  try {
    mocha.run((failures) => {
      if (failures > 0) throw new Error(`${failures} tests failed.`)
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}
