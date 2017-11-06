const express = require('express')
const port = process.argv[2] || 3000
const app = express()


const server = app.listen(port, () => {
  const {port, address} = server.address()
  console.log(`Server started on ${address}:${port}`)
})