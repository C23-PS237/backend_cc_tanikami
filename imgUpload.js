'use strict'
const {Storage} = require('@google-cloud/storage')
const dateFormat = require('dateformat')
const fs = require('fs')
const path = require('path');


const pathKey = path.resolve('./serviceaccountkey.json')

// TODO: Sesuaikan konfigurasi Storage
const gcs = new Storage({
    projectId: 'tanikami',
    keyFilename: pathKey
})

// TODO: Tambahkan nama bucket yang digunakan
const bucketName = 'tanikami-storage'
const bucket = gcs.bucket(bucketName)

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let imgUpload = {}

imgUpload.uploadToGcs = (req, res, next) => {
    if (!req.file) return next()

    let gcsname = ""
    import(dateFormat).then(dateFormat => {
        gcsname = dateFormat(new Date(), "yyyymmdd-HHMMss")
      }).catch(error => {
        // Tangani kesalahan impor
      });
      
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