require('dotenv/config')

const config = require('./config')
const server = require('./server')

server(config).start()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
