import * as vscode from 'vscode'
import { downloadProblemInputCommand } from './commands/download.js'
import { createGotoSolutionCommand } from './commands/goto-solution.js'
import { createHelloWorldCommand } from './commands/helloworld.js'
import { createListCommand } from './commands/list.js'
import { createOpenProblemPageCommand } from './commands/open-problem-page.js'
import { openProblemCommand } from './commands/open-problem.js'
import { ProblemTreeProvider } from './problem-tree.js'

export const ROOT_PATH =
  vscode.workspace.workspaceFolders &&
  vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined

export function activate(context: vscode.ExtensionContext) {
  const problemProvider = new ProblemTreeProvider()
  vscode.window.registerTreeDataProvider('problems', problemProvider)

  // TODO: Try to figure out why adding a button for this command results in an error of a dependency of `glob`?
  vscode.commands.registerCommand('problems.refreshEntry', () =>
    problemProvider.refresh()
  )

  context.subscriptions.push(createOpenProblemPageCommand(context))
  context.subscriptions.push(createGotoSolutionCommand(context))
  context.subscriptions.push(createHelloWorldCommand(context))
  context.subscriptions.push(openProblemCommand(context))
  context.subscriptions.push(downloadProblemInputCommand(context))
  context.subscriptions.push(createListCommand(context))
}
