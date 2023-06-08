'use strict'
const { Storage } = require('@google-cloud/storage')
const moment = require('moment')
const fs = require('fs')
const path = require('path')

const pathKey = path.resolve('./serviceaccountkey.json')

// TODO: Adjust Storage configuration
const gcs = new Storage({
  projectId: 'tanikami',
  keyFilename: pathKey
})

// TODO: Add the bucket name being used
const bucketName = 'tanikami-storage'
const bucket = gcs.bucket(bucketName)

function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let imgUpload = {}

imgUpload.uploadToGcs = (req, res, next) => {
  if (!req.file) return next()

  let gcsname = moment().format("YYYYMMDD-HHmmss")

  const file = bucket.file(gcsname)

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  })

  stream.on('error', (err) => {
    req.file.cloudStorageError = err
    next(err)
  })

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
    next()
  })

  stream.end(req.file.buffer)
}

module.exports = imgUpload