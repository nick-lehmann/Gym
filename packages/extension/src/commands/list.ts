import * as vscode from 'vscode'
import { IDENTIFIER } from '../config'

export function createListCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand(`${IDENTIFIER}.list`, async () => {
    console.debug('Listing all problems')

    // await findSolutions()
  })
}
