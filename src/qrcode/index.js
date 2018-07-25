const qr = require('qrcode')
const render = require('./render')
const svg2img = require('svg2img');

const options = {
  errorCorrectionLevel: 'M',
  margin: 1,
  width: 512
}

const svg2imgAsync = (svg) => new Promise((resolve, reject) => {
  svg2img(svg, function (error, buffer) {
    if (error) {
      reject(error)
    } else {
      resolve(buffer)
    }
  })
})

const makeQRCode = async (text) => {
  let startTime = Date.now()

  const code = qr.create(text, options)
  console.log(`qr.create(): ${Date.now() - startTime}`); startTime = Date.now()

  const svg = render(code, options)
  console.log(`render(): ${Date.now() - startTime}`);
  return svg2imgAsync(svg)
}

module.exports = {
  makeQRCode
}