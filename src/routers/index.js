const routers = (stellarEngine, qrGenerator) => {
  const router = require('express').Router()

  const { makeQRCode } = require('../qrcode')

  router.post('/qr', (req, res) => {
    const text = req.body.text

    return makeQRCode(text, req.body).then(imgBuffer => {
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length
      });
      res.end(imgBuffer);
    })
  })

  router.get('/qr', (req, res) => {
    const text = req.query.d
    return text ? makeQRCode(text, req.query).then(imgBuffer => {
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imgBuffer.length
      });
      res.end(imgBuffer);
    }).catch(err => res.status(400).send(err.message))
    : res.status(400).send('No Data')
  })

  router.use('/', (req, res) => {
    res.status(200).send('OK')
  })

  return router
}

module.exports = routers
