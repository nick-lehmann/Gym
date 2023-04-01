import * as vscode from 'vscode'
import { IDENTIFIER } from '../config/index.js'
import { TreeItem, TreeItemType } from '../problem-tree.js'

export function createOpenSolutionsForProblemCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${IDENTIFIER}.openAllSolutionForProblem`,
    async (node: TreeItem) => {
      if (node.type !== TreeItemType.Problem || node.problem === undefined) {
        vscode.window.showErrorMessage(
          'This command can only be used on a problem node.'
        )
        return
      }

      // const solutions = await findSolutionsByProblem(node.problem)
      // await Promise.all(solutions.map((s) => openSolution(s)))
    }
  )
}
