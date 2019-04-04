const fs = require('fs')
const path = require('path')
const os = require('os')
const connect = require('./connect')
const parse = require('./parse')
const converter = require('./converter')

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

const { findAndModify } = connect(process.argv[2])

parse(inputFile, converter)
  .then(statements => {
    const results = []
    const errors = []
    return statements.reduce((promise, statement) => {
      return promise.then(() => {
        const { query, document } = statement
        console.log('execute statement:', JSON.stringify(statement))
        return findAndModify('contacts', query, document)
          .then(result => results.push(result))
          .catch(error => errors.push({ statement, error }))
      })
    }, Promise.resolve())
    .then(() => ({ results, errors }))
  })
  .then(({ results, errors }) => {
    console.log(os.EOL)
    console.log('Results:')
    results.forEach(result => {
      console.log(JSON.stringify(result || ''))
    })
    console.log('Errors:')
    errors.forEach(({ error, statement }) => {
      console.log(error || 'Statement executed with errors:', JSON.stringify(statement))
    })
  })
  .catch(error => {
    console.error('Error occurred:', error)
  })
