import * as vscode from 'vscode'
import { downloadProblemInputCommand } from './commands/download.js'
import { createGotoSolutionCommand } from './commands/goto-solution.js'
import { createHelloWorldCommand } from './commands/helloworld.js'
import { createListCommand } from './commands/list.js'
import { createOpenProblemPageCommand } from './commands/open-problem-page.js'
import { openProblemCommand } from './commands/open-problem.js'
import { createOpenSolutionsForProblemCommand } from './commands/open-solutions-for-problem.js'
import { Context } from './config/context.js'
import { getConfig } from './config/load.js'
import { discover } from './discovery.js'
import { ProblemTreeProvider } from './problem-tree.js'
import { Tests } from './test-provider.js'

function mustGetRootPath(): string {
  const path =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined

  return path!
}

export const CONTEXT: Context = {
  root: vscode.Uri.file(mustGetRootPath()),
}

export async function activate(extension: vscode.ExtensionContext) {
  const config = await getConfig()

  const gym = await discover(config)

  const fileChangedEmitter = new vscode.EventEmitter<vscode.Uri>()
  const problemProvider = new ProblemTreeProvider(gym)
  vscode.window.registerTreeDataProvider('problems', problemProvider)

  // TODO: Try to figure out why adding a button for this command results in an error of a dependency of `glob`?
  vscode.commands.registerCommand('problems.refreshEntry', () =>
    problemProvider.refresh()
  )

  const tests = new Tests(extension, gym)
  // await tests.()
  // tests.populate()
  tests.createProfiles()

  extension.subscriptions.push(createOpenSolutionsForProblemCommand(extension))
  extension.subscriptions.push(createOpenProblemPageCommand(extension))
  extension.subscriptions.push(createGotoSolutionCommand(extension))
  extension.subscriptions.push(createHelloWorldCommand(extension))
  extension.subscriptions.push(openProblemCommand(extension, config))
  extension.subscriptions.push(downloadProblemInputCommand(extension, config))
  extension.subscriptions.push(createListCommand(extension))
}
