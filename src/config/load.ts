import * as vscode from 'vscode'
import { parse as parseYaml } from 'yaml'
import { CONTEXT } from '../extension.js'
import { Config, CONFIG_NAME } from './index.js'

export async function getConfig(): Promise<Config> {
  const configUri = vscode.Uri.joinPath(CONTEXT.root, CONFIG_NAME)

  const content = await vscode.workspace.fs.readFile(configUri)
  const rawConfig = parseYaml(content.toString())

  return Config.parse(rawConfig)
}
