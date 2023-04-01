import * as vscode from 'vscode'
import { getConfig, getSolutionPathPatterns } from './config.js'

export class Tests {
  constructor(private readonly controller: vscode.TestController) {}

  upsertSolution(uri: vscode.Uri) {
    const existing = this.controller.items.get(uri.toString())
    if (existing) {
      return { file: existing }
    }

    const file = this.controller.createTestItem(
      uri.toString(),
      uri.path.split('/').pop()!,
      uri
    )
    this.controller.items.add(file)

    file.canResolveChildren = false
    return { file }
  }

  async findFiles() {
    const config = await getConfig()
    const solutionPaths = await getSolutionPathPatterns(config)

    for (const solutionPath of solutionPaths) {
      const files = await vscode.workspace.findFiles(
        solutionPath.pathPattern,
        undefined,
        1000
      )
      for (const file of files) this.upsertSolution(file)
    }
  }
}
