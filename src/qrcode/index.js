const qr = require('qrcode')
const render = require('./render')
const textMask = require('./textMask')
const svg2img = require('svg2img');
const fs = require('fs');
const logoBuilder = require('./logoBuilder')

const options = {
  errorCorrectionLevel: 'H',
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

const makeQRCode = async (text, {logoUrl, logoText = '', maskTextLine1 = '', maskTextLine2 = ''} = {}) => {
  let startTime = Date.now()
  const logoSvg = logoUrl && await logoBuilder.build(logoUrl, logoText)
  const code = qr.create(text, options)
  const mask = textMask(maskTextLine1, maskTextLine2, code.modules.size)
  console.log(`qr.create(): ${Date.now() - startTime}`); startTime = Date.now()

  if (mask && code.modules.size > 28) {
    options.mask = mask
  }

  if (logoSvg) {
    options.logoSvg = logoSvg
  }

  const svg = render(code, options)
  fs.writeFileSync('out.svg', svg)
  console.log(`render(): ${Date.now() - startTime}`);
  return svg2imgAsync(svg)
}

module.exports = {
  makeQRCode
}