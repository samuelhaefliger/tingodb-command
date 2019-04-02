const find = (database) => {
  return (name, query) => {
    const collection = database.collection(name)
    return new Promise((resolve, reject) => {
      collection.find(query).toArray((error, array) => {
        if (error === null) {
            resolve(array)
        } else {
            reject(error)
        }
      })
    })
  }
}

const findAndModify = (database) => {
  return (name, query, document, options = { new: true }) => {
    const collection = database.collection(name)
    return new Promise((resolve, reject) => {
        collection.findAndModify(query, [], document, options, (error, result) => {
            if (error === null) {
                resolve(result.value ? result.value : result)
            } else {
                reject(error)
            }
        })
    })
  }
}

const insert = (database) => {
  return (name, documents) => {
    const collection = database.collection(name)
    return new Promise((resolve, reject) => {
      collection.insert(documents, { w: 1 }, (error, result) => {
          if (error === null) {
              resolve(result)
          } else {
              reject(error)
          }
      })
    })
  }
}

const save = (database) => {
  return (name, document) => {
    const collection = database.collection(name)
    return new Promise((resolve, reject) => {
      collection.save(document, { w: 1 }, (error, result) => {
          if (error === null) {
              resolve(result.ops instanceof Array ? result.ops : result)
          } else {
              reject(error)
          }
      })
    })
  }
}

module.exports = { find, findAndModify, insert, save }
