const qr = require('qrcode')
const render = require('./render')
const textMask = require('./textMask')
const svg2img = require('svg2img');
const logoBuilder = require('./logoBuilder')
const MemoryStream = require('memory-stream')
const LRU = require("lru-cache")
  , options = {
    max: 500,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
  , cache = LRU(options)

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
  console.log('start makeQRCode');
  console.log({text, logoUrl, logoText, maskTextLine1, maskTextLine2})
  let begin = startTime = Date.now()
  const md5Hash = md5([text, logoUrl, logoText, maskTextLine1, maskTextLine2].join('||'))
  const cachedData = cache.get(md5Hash)
  if (cachedData) {
    console.log(`  ${md5Hash}`, 'hit')
    console.log(`total makeQRCode:\t${Date.now() - begin}`);
    return cachedData.imgBuffer
  }

  console.log(`  ${md5Hash}`, 'missed')
  const options = Object.assign({}, defaultOptions)
  const code = qr.create(text, options)
  console.log(`  qr.create():\t\t${Date.now() - startTime}`); startTime = Date.now()

  const mask = textMask(maskTextLine1, maskTextLine2, code.modules.size)
  console.log(`  textMask():\t\t${Date.now() - startTime}`); startTime = Date.now()
  let logoSvg, isFallbackImage
  if (logoUrl) {
    await logoBuilder.build(logoUrl, logoText)
      .then((ret) => {
        logoSvg = ret.logoSvg
        isFallbackImage = ret.isFallbackImage
      })
  } else {
    isFallbackImage = false
  }

  console.log(`  logoBuilder.build():\t${Date.now() - startTime}`); startTime = Date.now()

  if (mask && code.modules.size > 28) {
    options.mask = mask
  }

  if (logoSvg) {
    options.logoSvg = logoSvg
  }

  const svg = render(code, options)
  console.log(`  render():\t\t${Date.now() - startTime}`); startTime = Date.now()

  const imgBuffer = await svg2imgAsync(svg)
  if (!isFallbackImage) {
    cache.set(md5Hash, {imgBuffer})
  }
  console.log(`  svg2imgAsync():\t${Date.now() - startTime}`);
  console.log(`total makeQRCode:\t${Date.now() - begin}`);
  return imgBuffer
}

module.exports = {
  makeQRCode
}