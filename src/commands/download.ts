import * as vscode from "vscode"
import { getConfig, IDENTIFIER } from "../config.js"
import { fetchInput } from "../providers/adventofcode/fetch.js"

export function downloadProblemInputCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${IDENTIFIER}.downloadProblemInput`,
    async () => {
      const config = await getConfig()

      const input = await fetchInput(
        config.providers.adventofcode,
        "2020",
        "1"
      )
      console.log(input)
    }
  )
}
