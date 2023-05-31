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
        response(200, fields,"user detail", res)
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
            response(200, data, "user added", res)
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
            response(200, data, "user updated", res)
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
        response(200, fields,"all products", res)
    })
})

app.get("/product/:id_produk", (req, res) => {
    const id_produk = req.params.id_produk
    const sql = `SELECT * FROM product WHERE id_produk = ${id_produk}`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        response(200, fields,"product detail", res)
    })
})

app.put("/product", (req, res) => {
    const {id_produk, nama_produk, besaran_stok, stok, harga, url_gambar, deskripsi_produk, nama_bank, rek_penjual, timestamp} = req.body
    const sql = `UPDATE product SET nama_produk = '${nama_produk}', besaran_stok = '${besaran_stok}', stok = ${stok}, harga = ${harga}, url_gambar = '${url_gambar}', 
    deskripsi_produk = '${deskripsi_produk}', nama_bank = '${nama_bank}', rek_penjual = '${rek_penjual}', timestamp = ${timestamp} WHERE id_produk = ${id_produk}`

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

app.delete("/product", (req, res) => {
    const {id_produk} = req.body
    const sql = `DELETE FROM product WHERE id_produk = ${id_produk}`

    db.query(sql, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "data deleted", res)
        } else {
            response(404, "wrong", "error", res)
        }
    })
})

app.post("/pembelian", (req, res) => {
    const {id_transaksi, id_ktp, id_produk, alamat_penerima, harga, jumlah_dibeli, biaya_pengiriman, pajak, biaya_admin, biaya_total, status_pembayaran, 
        status_pengiriman, bukti_transfer, created_at, updated_at} = req.body
    const sql = `INSERT INTO pembelian(id_transaksi, id_ktp, id_produk, alamat_penerima, harga, jumlah_dibeli, biaya_pengiriman, 
    pajak, biaya_admin, biaya_total, status_pembayaran, status_pengiriman, bukti_transfer, created_at, updated_at) 
    VALUES (${id_transaksi}, ${id_ktp}, ${id_produk}, '${alamat_penerima}', ${harga}, ${jumlah_dibeli}, ${biaya_pengiriman}, ${pajak},${biaya_admin},
    ${biaya_total}, ${status_pembayaran}, ${status_pengiriman}, '${bukti_transfer}', ${created_at}, ${updated_at})`

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

app.put("/pembelian", (req, res) => {
    const {id_transaksi, alamat_penerima, harga, jumlah_dibeli, biaya_pengiriman, pajak, biaya_admin, biaya_total, status_pembayaran, 
        status_pengiriman, bukti_transfer, created_at, updated_at} = req.body
    const sql = `UPDATE pembelian SET alamat_penerima = '${alamat_penerima}' , harga = ${harga}, jumlah_dibeli = ${jumlah_dibeli}, biaya_pengiriman = ${biaya_pengiriman}, 
    pajak = ${pajak}, biaya_admin = ${biaya_admin}, biaya_total = ${biaya_total}, status_pembayaran = ${status_pembayaran}, status_pengiriman = ${status_pengiriman}, 
    bukti_transfer = ${bukti_transfer}, created_at = ${created_at}, updated_at = ${updated_at} WHERE id_transaksi = ${id_transaksi}`

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

app.get("/pembelian/:id_pembelian", (req, res) => {
    const id_pembelian = req.params.id_pembelian
    const sql = `SELECT * FROM pembelian WHERE id_pembelian = ${id_pembelian}`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        response(200, fields,"purchase detail", res)
    })
})

app.delete("/pembelian/:id_pembelian", (req, res) => {
    const {id_pembelian} = req.params.id_pembelian
    const sql = `DELETE FROM product WHERE id_pembelian = ${id_pembelian}`

    db.query(sql, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "data deleted", res)
        } else {
            response(404, "wrong", "error", res)
        }
    })
})

app.get("/artikel", (req, res) => {
    const sql = `SELECT * FROM artikel`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        response(200, fields,"all articles", res)
    })
})

app.get("/artikel/:id_artikel", (req, res) => {
    const id_artikel = req.params.id_artikel
    const sql = `SELECT * FROM artikel WHERE id_artikel = ${id_artikel}`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        response(200, fields,"article detail", res)
    })
})

app.listen(port, () => {
    console.log(`Server is up and listening on ${port}`);
});