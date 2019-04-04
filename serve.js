const path = require("path")
const express = require("express")

const docsDir = path.join(__dirname, "docs")
const app = express()
app.use(express.static(docsDir))
app.listen(8080, () => console.log("http://localhost:8080"))
