import * as vscode from 'vscode'
import { downloadProblemInputCommand } from './commands/download.js'
import { createGotoSolutionCommand } from './commands/goto-solution.js'
import { createHelloWorldCommand } from './commands/helloworld.js'
import { createListCommand } from './commands/list.js'
import { createOpenProblemPageCommand } from './commands/open-problem-page.js'
import { openProblemCommand } from './commands/open-problem.js'
import { createOpenSolutionsForProblemCommand } from './commands/open-solutions-for-problem.js'
import { getConfig } from './config/load.js'
import { discover } from './discovery.js'
import { ProblemTreeProvider } from './problem-tree.js'
import { Tests } from './test-provider.js'

export const ROOT_PATH =
  vscode.workspace.workspaceFolders &&
  vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : undefined

export async function activate(context: vscode.ExtensionContext) {
  const config = await getConfig()

  const gym = await discover(config)

  const fileChangedEmitter = new vscode.EventEmitter<vscode.Uri>()
  const problemProvider = new ProblemTreeProvider(gym)
  vscode.window.registerTreeDataProvider('problems', problemProvider)

  // TODO: Try to figure out why adding a button for this command results in an error of a dependency of `glob`?
  vscode.commands.registerCommand('problems.refreshEntry', () =>
    problemProvider.refresh()
  )

  const tests = new Tests(context, gym)
  // await tests.()
  // tests.populate()
  tests.createProfiles()

  context.subscriptions.push(createOpenSolutionsForProblemCommand(context))
  context.subscriptions.push(createOpenProblemPageCommand(context))
  context.subscriptions.push(createGotoSolutionCommand(context))
  context.subscriptions.push(createHelloWorldCommand(context))
  context.subscriptions.push(openProblemCommand(context, config))
  context.subscriptions.push(downloadProblemInputCommand(context, config))
  context.subscriptions.push(createListCommand(context))
}
