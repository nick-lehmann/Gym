import * as vscode from 'vscode'
import { ProgrammingLanguage } from './config/language.js'
import { Problem } from './problem.js'

export class Solution {
  constructor(
    public readonly problem: Problem,
    public readonly path: string,
    public readonly language: ProgrammingLanguage
  ) {}

  //   static find(
  //     paths: ProblemPaths,
  //     problem: Problem,
  //     language: ProgrammingLanguage
  //   ): Solution | undefined {
  //     const pathTemplate = paths[language]
  //     if (!pathTemplate) return undefined

  //     const { identifier } = problem

  //     const path = getProblemPath(
  //       pathTemplate,
  //       identifier.year.toString(),
  //       identifier.day.toString()
  //     )

  //     if (!fs.existsSync(`${ROOT_PATH}/${path}`)) return undefined

  //     return new Solution(problem, path, language)
  //   }

  // TODO: Do not use `rootPath`
  absolutePath() {
    return `${vscode.workspace.rootPath}/${this.path}`
  }
}

export async function openSolution(solution: Solution) {
  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(solution.absolutePath())
  )
  await vscode.window.showTextDocument(document, {
    preview: false,
  })
}

function getProblemPath(template: string, year: string, day: string): string {
  return template
    .replace('{year}', year)
    .replace('{day}', day.toString().padStart(2, '0'))
}
