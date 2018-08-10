const qr = require('qrcode')
const render = require('./render')
const textMask = require('./textMask')
const svg2img = require('svg2img');
const logoBuilder = require('./logoBuilder')

const defaultOptions = {
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
  console.log({logoUrl, logoText, maskTextLine1, maskTextLine2})
  console.log('start makeQRCode');
  let begin = startTime = Date.now()

  const options = Object.assign({}, defaultOptions)
  const code = qr.create(text, options)
  console.log(`  qr.create():\t\t${Date.now() - startTime}`); startTime = Date.now()

  const mask = textMask(maskTextLine1, maskTextLine2, code.modules.size)
  console.log(`  textMask():\t\t${Date.now() - startTime}`); startTime = Date.now()
  const logoSvg = logoUrl && await logoBuilder.build(logoUrl, logoText)
  console.log(`  logoBuilder.build():\t${Date.now() - startTime}`); startTime = Date.now()

  if (mask && code.modules.size > 28) {
    options.mask = mask
  }

  if (logoSvg) {
    options.logoSvg = logoSvg
  }

  const svg = render(code, options)
  console.log(`  render():\t\t${Date.now() - startTime}`); startTime = Date.now()

  const img = await svg2imgAsync(svg)
  console.log(`  svg2imgAsync():\t${Date.now() - startTime}`);
  console.log(`total makeQRCode:\t${Date.now() - begin}`);
  return img
}

module.exports = {
  makeQRCode
}