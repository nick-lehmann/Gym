import * as vscode from "vscode"
import { IDENTIFIER } from "../config.js"

export function createHelloWorldCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand(`${IDENTIFIER}.helloWorld`, () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage(`Hello World from ${IDENTIFIER}!`)
  })
}
