import * as vscode from 'vscode'

/**
 * These are config values not present in the `gym.yaml`.
 *
 * We compute these values upon startup.
 */
export type Context = {
  root: vscode.Uri
}
