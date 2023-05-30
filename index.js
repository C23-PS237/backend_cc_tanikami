const bodyParser = require('body-parser')
const express = require('express')
const port = 3000
const app = express()
const db = require ('./connection.js')
const response = require('./response.js')

app.use(bodyParser.json())

app.get("/user/:id_ktp", (req, res) => {
    const id_ktp = req.params.id_ktp
    const sql = `SELECT * FROM user WHERE id_ktp = ${id_ktp}`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        response(200, fields,"detail user", res)
    })
})

app.post("/user", (req, res) => {
    const {id_ktp, nama, telepon, alamat_regist, alamat_penerima, gender, usia, status} = req.body
    const sql = `INSERT INTO user(id_ktp, nama, telepon, alamat_regist, alamat_penerima, gender, usia, status) 
    VALUES (${id_ktp}, '${nama}','${telepon}','${alamat_regist}','${alamat_penerima}',${gender},${usia},${status})`

    db.query(sql, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                id: fields.insertId
            }
            response(200, data, "data added", res)
        }
    })
})

app.put("/user", (req, res) => {
    const {id_ktp, nama, telepon, alamat_regist, alamat_penerima, gender, usia, status} = req.body
    const sql = `UPDATE user SET nama = '${nama}', telepon = '${telepon}', alamat_regist = '${alamat_regist}',
    alamat_penerima = '${alamat_penerima}', gender = ${gender}, usia = ${usia}, status = ${status} WHERE id_ktp = ${id_ktp}`

    db.query(sql, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "data updated", res)
        } else {
            response(404, "wrong", "error", res)
        }
    })
})

app.post("/product", (req, res) => {
    const {id_produk, id_ktp, nama_produk, besaran_stok, stok, harga, url_gambar, deskripsi_produk, nama_bank, rek_penjual, timestamp} = req.body
    const sql = `INSERT INTO product (id_produk, id_ktp, nama_produk, besaran_stok, stok, harga, url_gambar, deskripsi_produk, nama_bank, rek_penjual, timestamp) 
    VALUES (${id_produk}, ${id_ktp},'${nama_produk}','${besaran_stok}',${stok},${harga},'${url_gambar}','${deskripsi_produk}','${nama_bank}','${rek_penjual}',${timestamp})`

    db.query(sql, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                id: fields.insertId
            }
            response(200, data, "product added", res)
        }
    })
})

app.get("/product", (req, res) => {
    const sql = `SELECT * FROM product`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        response(200, fields,"all product", res)
    })
})

app.get("/product/:id_product", (req, res) => {
    const id_product = req.params.id_product
    const sql = `SELECT * FROM product WHERE id_product = ${id_product}`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        response(200, fields,"detail product", res)
    })
})

app.listen(port, () => {
    console.log(`Server is up and listening on ${port}`);
});