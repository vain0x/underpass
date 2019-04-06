import express from "express"
import * as path from "path"

const DIST_DIR = path.resolve(__dirname, "../dist")

const main = () => {
  const app = express()
  app.use(express.static(DIST_DIR))
  app.listen(5000, () => {
    console.error(`Listening at http://localhost:5000`)
  })
}

main()
