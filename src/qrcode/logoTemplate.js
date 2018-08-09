const fs = require('fs')

const imgDataUriPlaceHolder = '%%logoImage%%'
const logoTextPlaceHolder = '%%logoText%%'
let logoTemplate

module.exports = (logoText, logoDataUri) => {
  if (!logoTemplate) {
    logoTemplate = fs.readFileSync('logo.template.svg', {encoding: 'utf8'})
  }

  return logoTemplate.replace(logoTextPlaceHolder, logoText)
    .replace(imgDataUriPlaceHolder, logoDataUri)
}