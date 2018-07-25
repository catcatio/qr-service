module.exports = (config) => new Promise((resolve, reject) => {
  const express = require('express')
  const bodyParser = require('body-parser')
  const responseTime = require('response-time')
  const cors = require('cors')

  const app = express()

  // setup middlewares
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(responseTime())

  let server = app.listen(config.port, (err) => {
    if (err) {
      console.error('failed to start app on port.', config.port)
      reject(err)
    } else {
      console.log('app running on port.', config.port)
      app.stop = () => {
        server.close()
      }
      resolve(app)
    }
  })
})
