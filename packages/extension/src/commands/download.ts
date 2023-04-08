import * as vscode from 'vscode'
import { IDENTIFIER } from '../config'

import { Config } from '@gym/core'
import { fetchInput } from '@gym/core/out/providers/adventofcode/fetch'

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
