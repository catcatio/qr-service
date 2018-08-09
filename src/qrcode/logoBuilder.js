const btoa = require('btoa')
const request = require('request')
const MemoryStream = require('memory-stream')

const defaultLog = require('./defaultLogo')
const logoTemplate = require('./logoTemplate')

const doRequest = (url) => new Promise((resolve, reject) => {
  let contentType
  const ms = new MemoryStream()
  ms.on('finish', () => resolve({ contentType: contentType, data: ms.get()}))

  request
    .get(url)
    .on('response', (response) => {
      contentType = response.headers['content-type']
    })
    .on('error', err => reject(err))
    .pipe(ms)
})

const loadImageFromUrl = (url) => {
  return doRequest(url).then((response) => {
    const data = response.data
    const imageBase64 = (Buffer.isBuffer(data)) ? data.toString('base64') : btoa(data);
    return `data:${response.contentType};base64,${imageBase64}`;
  }).catch(err => {
    console.log(err)
    return defaultLog.dataUri
  })
}

const build = async (logoUrl, logoText) => {
  const logoDataUri = await loadImageFromUrl(logoUrl)
  return logoTemplate(logoText, logoDataUri)
}

module.exports = {
  build
}