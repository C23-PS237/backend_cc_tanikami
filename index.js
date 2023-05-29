const bodyParser = require('body-parser')
const express = require('express')
const port = 3000
const app = express()
const db = require ('./connection.js')
const response = require('./response.js')

app.use(bodyParser.json())

app.get("/user", (req, res) => {
    const sql = "SELECT * FROM user"
    db.query(sql, (error, result)=>{
        response(200, result,"get all user", res)
    })
})



app.listen(port, () => {
    console.log(`Server is up and listening on ${port}`);
});