require('./utils/md5')

module.exports = (config) => {
  let app
  const start = async () => {
    app = await require('./initExpress')(config)

    const routers = require('./routers')()
    app.use('/', routers)

    console.log('server started')
  }

  const stop = () => {
    app.stop()
  }

  return {
    start,
    stop
  }
}