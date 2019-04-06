import * as fs from "fs"
import { renderToString } from "hyperapp-render"
import * as path from "path"
import { promisify } from "util"
import indexPage from "../src/pages/index"

const DIST_DIR = path.resolve(__dirname, "../dist")

const FILES: [string, JSX.Element][] = [
  ["", indexPage],
]

export const main = async () => {
  await Promise.all(
    FILES.map(async ([relativePath, page]) => {
      const filePath = path.join(DIST_DIR, relativePath, "index.html")
      const html = renderToString(page)
      await promisify(fs.mkdir)(path.dirname(filePath), { recursive: true })
      return await promisify(fs.writeFile)(filePath, html)
    }))
}

main()
