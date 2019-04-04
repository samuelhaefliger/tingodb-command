module.exports = (header, row) => {
  let query = {}
  let document = {}
  row.forEach((value, index) => {
    let [name, format] = header[index].split(':')
    if (format === 'int') {
      value = parseInt(value)
    } else if (format === 'float') {
      value = parseFloat(value)
    } else if (format === 'date') {
      value = new Date(value).toISOString()
    }
    if (name[0] === '#') {
      query[name.substr(1)] = value
    } else {
      document[name] = value
    }
  })
  if (Object.keys(query).length > 0) {
    return { query, document : { $set: document } }
  }
}
