const fs = require('fs')
const parse = require('csv-parse')

const convert = (rows, converter) => {
  let header
  return rows.reduce((results, row) => {
    if (!header) {
      header = row
    } else {
      let result = converter(header, row)
      if (result) {
        results.push(result)
      }
    }
    return results
  }, [])
}

module.exports = (filename, converter) => {
  return new Promise((resolve, reject) => {
    parse(fs.readFileSync(filename), { delimiter: ';' }, (error, rows) => {
      if (error) {
        reject(error)
      } else {
        resolve(converter ? convert(rows, converter) : rows)
      }
    })
  })
}
