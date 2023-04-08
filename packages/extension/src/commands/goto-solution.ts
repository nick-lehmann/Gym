import { TreeItemType } from '@gym/core'
import * as vscode from 'vscode'
// import { IDENTIFIER } from '../config/index'
import { IDENTIFIER } from '../config'
import { TreeItem } from '../explorer'

export function createGotoSolutionCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  // TODO: Make node optional. Ask user for identifier in this case?
  return vscode.commands.registerCommand(
    `${IDENTIFIER}.gotoSolution`,
    async (node: TreeItem) => {
      if (node.type !== TreeItemType.Solution || node.solution === undefined) {
        vscode.window.showErrorMessage('Not a solution')
        return
      }

      // TODO
      // await openSolution(node.solution)
    }
  )
}
