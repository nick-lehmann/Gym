import * as vscode from 'vscode'
import { Config, IDENTIFIER } from '../config/index.js'
import { fetchInput } from '../providers/adventofcode/fetch.js'

export function downloadProblemInputCommand(
  context: vscode.ExtensionContext,
  config: Config
): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${IDENTIFIER}.downloadProblemInput`,
    async () => {
      const input = await fetchInput(config.providers.adventofcode, '2020', '1')
      console.log(input)
    }
  )
}
