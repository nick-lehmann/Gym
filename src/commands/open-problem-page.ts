import * as vscode from 'vscode'
import { IDENTIFIER } from '../config/index.js'
import { TreeItem, TreeItemType } from '../explorer.js'

export function createOpenProblemPageCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${IDENTIFIER}.openProblemPage`,
    (node: TreeItem) => {
      if (node.type !== TreeItemType.Problem || node.problem === undefined) {
        vscode.window.showErrorMessage('This is not a problem (lol).')
        return
      }

      const link = node.problem.getLink()
      // const link = 'https://adventofcode.com/2022/day/22'
      vscode.env.openExternal(vscode.Uri.parse(link))
    }
  )
}
