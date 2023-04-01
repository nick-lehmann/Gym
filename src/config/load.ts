import * as vscode from 'vscode'
import { parse as parseYaml } from 'yaml'
import { Config, CONFIG_NAME } from './index.js'

export async function getConfig(): Promise<Config> {
  const path = `${vscode.workspace.rootPath}/${CONFIG_NAME}`
  const content = await vscode.workspace.fs.readFile(vscode.Uri.file(path))
  const rawConfig = parseYaml(content.toString())

  return Config.parse(rawConfig)
}
