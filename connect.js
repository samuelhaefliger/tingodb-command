const fs = require('fs')
const path = require('path')
const Database = require('./database')
const commands = require('./commands')

module.exports = (dataPath) => {
  dataPath = path.isAbsolute(dataPath) ? dataPath : path.resolve(dataPath)
  if (!fs.existsSync(dataPath)) {
    throw new Error(`Datenpfad nicht vorhanden ${dataPath}.`)
  }
  console.log('connect to', dataPath)
  const database = new Database(dataPath, {})
  return {
    find: commands.find(database),
    findAndModify: commands.findAndModify(database),
    insert: commands.insert(database),
    save: commands.save(database)
  }
}
