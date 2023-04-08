import fetch from 'node-fetch'
import { AdventOfCodeConfig } from './config'

export const PROBLEM_URL = 'https://adventofcode.com/{year}/day/{day}'

export async function fetchInput(
  config: AdventOfCodeConfig,
  year: string,
  day: string
): Promise<string> {
  const url = getInputUrl(year, day)

  const response = await fetch(url, {
    headers: {
      Cookie: `session=${config.session}`,
    },
  })

  console.log(response)

  return await response.text()
}

export function getProblemUrl(year: string, day: string): string {
  return PROBLEM_URL.replace('{year}', year).replace('{day}', day)
}

function getInputUrl(year: string, day: string): string {
  return `${getProblemUrl(year, day)}/input`
}
