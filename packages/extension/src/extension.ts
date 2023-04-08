import { discover, getConfig } from '@gym/core'
import * as vscode from 'vscode'
import { downloadProblemInputCommand } from './commands/download'
import { createGotoSolutionCommand } from './commands/goto-solution'
import { createHelloWorldCommand } from './commands/helloworld'
import { createListCommand } from './commands/list'
import { openProblemCommand } from './commands/open-problem'
import { createOpenProblemPageCommand } from './commands/open-problem-page'
import { createOpenSolutionsForProblemCommand } from './commands/open-solutions-for-problem'
// import { Context } from './config/context'
import { ProblemTreeProvider } from './explorer'
import { Tests } from './testing/test-provider'

function mustGetRootPath(): string {
  const path =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined

  return path!
}

// export const CONTEXT: Context = {
//   root: vscode.Uri.file(mustGetRootPath()),
// }

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
