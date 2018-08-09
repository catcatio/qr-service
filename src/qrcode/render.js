const Utils = require('./utils')
const fs = require('fs')

const getProtectedRegionDetector = (size, margin, logoProtected = false) => {
  const eyeSize = 7
  const center = Math.ceil(size / 2) + margin
  const logoSize = Math.ceil(0.3 * size)
  const logoMargin = Math.floor(logoSize / 2)

  const eyeTopRight = [size-eyeSize+margin, margin, size + margin, eyeSize + margin]
  const eyeTopLeft = [margin, margin, margin + eyeSize, margin + eyeSize]
  const eyeBottomLeft = [margin, size - eyeSize + margin, margin + eyeSize, size + margin]
  const logo = [center - logoMargin, center - logoMargin, center + logoMargin, center + logoMargin]

  const regions = [eyeTopRight, eyeTopLeft, eyeBottomLeft]

  if (logoProtected) {
    regions.push(logo)
  }

  return (x, y) => {
    return regions.find(region =>
      region[0] <= x && region[2] >= x
      && region[1] <= y && region[3] >= y ) != null
  }
}

const eyeFrameOuterTemplate = '<path xmlns="http://www.w3.org/2000/svg" d="M100,66.221V33.75C100,15.141,84.68,0,65.859,0H34.14C15.32,0,0,15.141,0,33.75V100l65.859-0.02   C84.68,99.98,100,84.84,100,66.221z M85,66.221c0,10.344-8.586,18.76-19.145,18.76L15,84.996V33.75C15,23.411,23.586,15,34.14,15   h31.719C76.414,15,85,23.411,85,33.75V66.221z"/>'
const eyeFrameInnerTemplate = '<path xmlns="http://www.w3.org/2000/svg" style="fill:none;" d="M85,66.221V33.75C85,23.411,76.414,15,65.859,15H34.14C23.586,15,15,23.411,15,33.75v51.246   l50.855-0.016C76.414,84.98,85,76.564,85,66.221z"/>'
const eyeBallTemplate = '<path xmlns="http://www.w3.org/2000/svg" d="M100,72.779V27.195C100,12.203,87.604,0,72.37,0H27.63C12.397,0,0,12.203,0,27.195V100l72.37-0.042  C87.604,99.958,100,87.771,100,72.779z"/>'

// try {
//   logoSvg = fs.readFileSync('logo.svg', {encoding: 'utf8'})
// } catch(error) {
//   console.log(error)
// }

// const eyeBall = '<path xmlns="http://www.w3.org/2000/svg" style="fill:none;" d="M.85,.66221V.3375C.85,.23411,.76414,.15,.65859,.15H.3414C.23586,.15,.15,.23411,.15,.3375v.51246   l.50855-0.016C.76414,.8498,.85,.76564,.85,.66221z"/>'

const makeEyeFrame = (eyeFrameOuter, eyeFrameInner, x, y, scaleX, scaleY) => {
  return `<g transform="translate(${x}, ${y}) scale(${scaleX},${scaleY})"><g>${eyeFrameInner}${eyeFrameOuter}</g></g>`
}

const makeEyeBall = (eyeBall, x, y, scaleX, scaleY) => {
  return `<g transform="translate(${x}, ${y}) scale(${scaleX},${scaleY})"><g>${eyeBall}</g></g>`
}

const makeLogo = (logo, x, y, scaleX, scaleY) => {
  return `<g transform="translate(${x}, ${y}) scale(${scaleX},${scaleY})"><g>${logo}</g></g>`
}

const renderSvg = (qrData, options) => {

  const opts = Utils.getOptions(options)
  const size = qrData.modules.size
  const data = qrData.modules.data
  const mask = options.mask
  const qrcodesize = size + opts.margin * 2
  const targetWidth = opts.width || 512
  const unitSize = targetWidth / qrcodesize
  const logoSvg = options.logoSvg

  const offset = opts.margin || 0

  const eyeFrames = [makeEyeFrame(eyeFrameOuterTemplate, eyeFrameInnerTemplate, size - 7 + offset, 0 + offset, 0.07, 0.07),
    makeEyeFrame(eyeFrameOuterTemplate, eyeFrameInnerTemplate, 0 + offset + 7, 0 + offset, -0.07, 0.07),
    makeEyeFrame(eyeFrameOuterTemplate, eyeFrameInnerTemplate, 0 + offset + 7, size - 7 + offset + 7, -0.07, -0.07),
  ].join('')

  const eyeBalls = [makeEyeBall(eyeBallTemplate, size - 5 + offset, 0 + offset + 2, 0.03, 0.03),
    makeEyeBall(eyeBallTemplate, 0 + offset + 5, 0 + offset + 2, -0.03, 0.03),
    makeEyeBall(eyeBallTemplate, 0 + offset + 5, size - 7 + offset + 7 - 2, -0.03, -0.03),
  ].join('')


  const logoSize = Math.ceil(0.3 * size) // 30 % of QR size
  const center = Math.ceil(size / 2) + offset - 1
  const logoMargin = Math.floor(logoSize / 2)
  const logoScale = (logoSize * unitSize) / 512 // assume current logo size is 512

  const logo = !logoSvg ? '' : makeLogo(logoSvg, center - logoMargin, center - logoMargin, logoScale, logoScale)
  const isInProtectedRegion = getProtectedRegionDetector(size, offset)

  const rects = [...data].map((d, i) => {
    const col = Math.floor(i % size) + 0.5 + offset
    const row = Math.floor(i / size) + 0.5 + offset
    return `<circle cx="${col}" cy="${row}" r="${(mask && mask[i] ? 0.3 : 0.3)}" fill="${d ? (mask && mask[i] ? 'red' : 'black'): (mask && mask[i] ? 'pink' : 'transparent') }" />`
  }).filter((d, i) => {
    const col = Math.floor(i % size) + 0.5 + offset
    const row = Math.floor(i / size) + 0.5 + offset
    return !isInProtectedRegion(row, col)
  }).join('\n')

  const x = `<g>${rects}${eyeFrames}${eyeBalls}${logo}</g>`

  const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"'

  const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" '

  const background = `<g><rect ${width} style="fill: #FFF"></rect></g>`

  const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' >' + background + x + '</svg>'

  return svgTag
}

const render = (qrData, options) => {
  const svgTag = renderSvg(qrData, options)
  const xmlStr = '<?xml version="1.0" encoding="utf-8"?>' +
  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
  svgTag

  return xmlStr
}

module.exports = render

