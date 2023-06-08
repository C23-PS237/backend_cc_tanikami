const mysql = require('mysql')
const db = mysql.createConnection({
    host: "34.101.178.246", user:"root", password:"732sp", database:"tanikami"
})
module.exports= db
