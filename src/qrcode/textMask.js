const getFonts = require('./font')

const newArray = (size, value = 0) => {
  return Array.from(Array(size), () => value)
}

const joinLineCodes = (lineCode) => {
  return lineCode.reduce((prev, current) => {
    for (i = 0; i < 7; i++) {
      prev[i] = prev[i] ? prev[i].concat(current[i]) : current[i]
    }
    return prev
  }, [])
}

const getCharCode = (line, matrixSize) => {
  const lineCode = getFonts(line)
  const joinedLine = joinLineCodes(lineCode)
  const len = line.length * 6
  const padding = matrixSize - len
  const paddingLeft = Math.ceil(padding/2)
  const paddingRight = Math.floor(padding/2)

  return joinedLine.map(line => newArray(paddingLeft).concat(line).concat(newArray(paddingRight)))
}

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

const textMask = (line1Text, line2Text, matrixSize ) => {
const lineCodeSize = 7

const paddingTop = newArray(lineCodeSize, newArray(matrixSize))
const line1 = getCharCode(line1Text.substr(0,6), matrixSize)
const paddingMiddle = newArray((matrixSize - (lineCodeSize * 4)), newArray(matrixSize))
const line2 = getCharCode(line2Text.substr(0,6), matrixSize)
const paddingBottom = newArray(lineCodeSize, newArray(matrixSize))

return [].concat(...paddingTop, ...line1, ...paddingMiddle, ...line2, ...paddingBottom)
}

module.exports = textMask
