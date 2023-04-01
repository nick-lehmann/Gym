import fetch from "node-fetch"
import { AdventOfCodeConfig } from "./config.js"

const INPUT_URL = "https://adventofcode.com/{year}/day/{day}/input"

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

function getInputUrl(year: string, day: string): string {
  return INPUT_URL.replace("{year}", year).replace("{day}", day)
}
