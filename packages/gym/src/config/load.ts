import { parse as parseYaml } from 'yaml'
// import { CONTEXT } from '../extension'
import { Config } from './index'

export async function getConfig(): Promise<Config> {
  // TODO
  // const configUri = vscode.Uri.joinPath('', CONFIG_NAME)
  const configUri = 'gym.yaml'

  // const content = await vscode.workspace.fs.readFile(configUri)
  const content = ''
  const rawConfig = parseYaml(content.toString())

  return Config.parse(rawConfig)
}
