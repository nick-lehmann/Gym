import * as vscode from "vscode"
import { getConfig, IDENTIFIER } from "../config.js"

export function openProblemCommand(
  context: vscode.ExtensionContext
): vscode.Disposable {
  return vscode.commands.registerCommand(
    `${IDENTIFIER}.openProblem`,
    async () => {
      const config = await getConfig()

      const year = await vscode.window.showInputBox()
      if (year === undefined) return

      const day = await vscode.window.showInputBox()
      if (day === undefined) return

      const pathTemplates = [...Object.values(config.paths), config.data]

      for (const template of pathTemplates) {
        const path = getProblemPath(template, year, day)
        const absolute_path = `${vscode.workspace.rootPath}/${path}`

        // vscode.window.showInformationMessage(
        //   `Your file is at ${absolute_path}!`
        // );

        const document = await vscode.workspace.openTextDocument(
          vscode.Uri.file(absolute_path)
        )
        await vscode.window.showTextDocument(document, {
          preview: false,
        })
      }
    }
  )
}

function getProblemPath(template: string, year: string, day: string): string {
  return template.replace("{year}", year).replace("{day}", day)
}
