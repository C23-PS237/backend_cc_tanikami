const bodyParser = require('body-parser')
const express = require('express')
const port = 3000
const app = express()
const db = require ('./connection.js')
const response = require('./response.js')

app.use(bodyParser.json())

app.get("/userId", (req, res) => {
    console.log('User berdasarkan ID', req.query.id_ktp)

    const sql = `SELECT * FROM user WHERE id_ktp = ${req.query.id_ktp}`
    db.query(sql, (error, result)=>{
        response(200, result,"UserById", res)
    })
})

app.listen(port, () => {
    console.log(`Server is up and listening on ${port}`);
});