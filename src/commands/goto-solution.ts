import * as vscode from 'vscode'
import { IDENTIFIER } from '../config.js'
import { TreeItem, TreeItemType } from '../problem-tree.js'
import { openSolution } from '../solution.js'

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

      await openSolution(node.solution)
    }
  )
}
