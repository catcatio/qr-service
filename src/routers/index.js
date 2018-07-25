const routers = (stellarEngine, qrGenerator) => {
  const router = require('express').Router()

  const { makeQRCode } = require('../qrcode')

  router.post('/qr', (req, res) => {
    const text = req.body.payload
    return makeQRCode(text).then(imgBuffer => {
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length
      });
      res.end(imgBuffer);
    })
  })

  router.use('/', (req, res) => {
    res.status(200).send('OK')
  })

  return router
}

module.exports = routers
