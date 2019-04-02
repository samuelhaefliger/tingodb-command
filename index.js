const fs = require('fs')
const path = require('path')
const os = require('os')
const parse = require('csv-parse')
const connect = require('./connect')

if (process.argv.length < 3) {
  throw Error('Database path missing.')
}
if (process.argv.length < 4) {
  throw Error('Input file path missing.')
}
let inputFile = process.argv[3]
if (!path.isAbsolute(inputFile)) {
  inputFile = path.resolve(inputFile)
}
if (!fs.existsSync(inputFile)) {
  const message = `File not found '${inputFile}'.`
  throw Error(message)
}

const { find, findAndModify, insert, save } = connect(process.argv[2])

const createStatements = rows => {
  let header
  const statements = []
  rows.forEach(row => {
    if (!header) {
      header = row
    } else {
      let query = {}
      let document = {}
      row.forEach((value, index) => {
        let [name, format] = header[index].split(':')
        if (format === 'int') {
          value = parseInt(value)
        } else if (format === 'float') {
          value = parseFloat(value)
        }
        if (name[0] === '#') {
          query[name.substr(1)] = value
        } else {
          document[name] = value
        }
      })
      if (Object.keys(query).length > 0) {
        statements.push({ query, document : { $set: document } })
      }
    }
  })
  return statements
}

parse(fs.readFileSync(inputFile), { delimiter: ';' }, (error, rows) => {
  if (error) {
    throw Error(error)
  }
  const results = []
  createStatements(rows).reduce((promise, statement) => {
      return promise.then(() => {
        const { query, document } = statement
        console.log('execute', statement)
        return findAndModify('contacts', query, document)
          .then(result => results.push(result))
      })
    }, Promise.resolve())
  .then(() => {
    console.log(os.EOL)
    console.log('Results:')
    results.forEach(result => {
      console.log(JSON.stringify(result))
    })
    console.log(os.EOL)
    console.log('Contacts:')
    return find('contacts', {})
      .then(contacts => {
        contacts.forEach(contact => {
          console.log(JSON.stringify(contact))
        })
      })
  })
  .catch(error => {
    console.error(error)
  })
})
