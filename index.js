require('@google-cloud/debug-agent').start()

const bodyParser = require('body-parser')
const express = require('express')
const port = process.env.PORT || 8080
const app = express()
const Multer = require('multer')
const moment = require('moment')
require('moment-timezone')
const db = require ('./connection.js')
const response = require('./response.js')
const profilupload = require('./profilupload.js')
const produkupload = require('./produkupload.js')
const transaksiupload = require('./transaksiupload.js')

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

app.use(bodyParser.urlencoded({extended: true}))

app.get("/user/:id_ktp", (req, res) => {
    const {id_ktp} = req.params

    const sql = `SELECT * FROM user WHERE id_ktp = ?`

    db.query(sql, id_ktp, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields[0], "user detail", res);
        } else {
            response(404, null, "user not found", res);
        }
    })
})

app.post("/user", multer.single('profil'), profilupload.uploadToGcs, (req, res) => {

    const {
        id_ktp, 
        nama, 
        email,
        password,
        telepon, 
        alamat_regist, 
        alamat_penerima, 
        gender, 
        usia, 
        status
    } = req.body;

    var profil = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        profil = req.file.cloudStoragePublicUrl
    }

    const sql = `INSERT INTO user(id_ktp, profil, nama, email, password, telepon, alamat_regist, alamat_penerima, gender, usia, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [
        id_ktp, 
        profil,
        nama, 
        email,
        password,
        telepon, 
        alamat_regist, 
        alamat_penerima, 
        gender, 
        usia, 
        status
    ];

    db.query(sql, values, (error, fields)=>{
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

app.put("/user/:id_ktp_lama", multer.single('profil'), profilupload.uploadToGcs, (req, res) => {
    const id_ktp_lama = req.params.id_ktp_lama
    const {
        id_ktp, 
        nama, 
        email,
        password,
        telepon, 
        alamat_regist, 
        alamat_penerima, 
        gender, 
        usia, 
        status
    } = req.body;

    var profil = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        profil = req.file.cloudStoragePublicUrl
    }

    const sql = `UPDATE user SET id_ktp = ?, profil = ?, nama = ?, email = ?, password = ?,telepon = ?, alamat_regist = ?, alamat_penerima = ?, 
    gender = ?, usia = ?, status = ? WHERE id_ktp = ?`

    const values = [
        id_ktp, 
        profil,
        nama,
        email,
        password, 
        telepon, 
        alamat_regist, 
        alamat_penerima, 
        gender, 
        usia, 
        status,
        id_ktp_lama
    ];

    db.query(sql, values, (error, fields)=>{
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

app.post("/produk", multer.single('gambar_produk'), produkupload.uploadToGcs, (req, res) => {
    const {
        id_ktp,
        nama_produk,
        besaran_stok,
        stok,
        harga,
        deskripsi_produk,
        nama_bank,
        rek_penjual,
    } = req.body;

    let timestamp = moment().tz('Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")

    var gambar_produk = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        gambar_produk = req.file.cloudStoragePublicUrl
    }

    const sql = `INSERT INTO produk (id_ktp, nama_produk, besaran_stok, stok, harga, gambar_produk, deskripsi_produk, 
        nama_bank, rek_penjual, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        id_ktp,
        nama_produk,
        besaran_stok,
        stok,
        harga,
        gambar_produk,
        deskripsi_produk,
        nama_bank,
        rek_penjual,
        timestamp
    ];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ error: "Failed to insert product" });
        } else {
            const data = {
                isSuccess: results.affectedRows > 0,
                id: results.insertId
            };
            res.status(200).json({ data: data, message: "Product added" });
        }
    });
});

app.get("/produk", (req, res) => {
    const sql = `SELECT * FROM produk`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields, "all product", res);
        } else {
            response(404, null, "product empty", res);
        }
    })
})

app.get("/produk/:id_produk", (req, res) => {
    const {id_produk} = req.params
    const sql = `SELECT * FROM produk WHERE id_produk = ?`

    db.query(sql, id_produk, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields[0], "product detail", res);
        } else {
            response(404, null, "product not found", res);
        }
    })
})

app.get("/produk/ktp/:id_ktp", (req, res) => {
    const {id_ktp} = req.params
    const sql = `SELECT * FROM produk WHERE id_ktp = ?`

    db.query(sql, id_ktp, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields, "user's product", res);
        } else {
            response(404, null, "product empty", res);
        }
    })
})

app.put("/produk/:id_produk", multer.single('gambar_produk'), produkupload.uploadToGcs, (req, res) => {
    const id_produk = req.params.id_produk
    const {
        nama_produk, 
        besaran_stok, 
        stok, 
        harga, 
        deskripsi_produk, 
        nama_bank, 
        rek_penjual,
    } = req.body

    let timestamp = moment().tz('Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")

    var gambar_produk = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        gambar_produk = req.file.cloudStoragePublicUrl
    }

    const sql = `UPDATE produk SET nama_produk = ?, besaran_stok = ?, stok = ?, harga = ?, gambar_produk = ?, 
    deskripsi_produk = ?, nama_bank = ?, rek_penjual = ?, timestamp = ? WHERE id_produk = ?`
    
    const values = [
        nama_produk, 
        besaran_stok, 
        stok, 
        harga, 
        gambar_produk, 
        deskripsi_produk, 
        nama_bank, 
        rek_penjual, 
        timestamp,
        id_produk
    ]

    db.query(sql, values, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "product updated", res)
        } else {
            response(404, "wrong", "error", res)
        }
    })
})

app.delete("/produk/:id_produk", (req, res) => {
    const {id_produk} = req.params
    const sql = `DELETE FROM produk WHERE id_produk = ?`

    db.query(sql, id_produk, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "product deleted", res)
        } else {
            response(404, "wrong", "error", res)
        }
    })
})

app.post("/pembelian", multer.single('bukti_transfer'), transaksiupload.uploadToGcs, (req, res) => {
    const {
        id_ktp,
        id_produk,
        alamat_penerima,
        harga,
        jumlah_dibeli,
        biaya_pengiriman,
        pajak,
        biaya_admin,
        biaya_total,
        status_pembayaran,
        status_pengiriman,
        id_penjual
    } = req.body;

    let created_at = moment().tz('Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")

    var bukti_transfer = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        bukti_transfer = req.file.cloudStoragePublicUrl
    }

    let val_pengiriman
    let val_pajak
    let val_admin

    if (!biaya_pengiriman){
        val_pengiriman = 0
    } else {
        val_pengiriman = biaya_pengiriman
    }

    if (!pajak){
        val_pajak = 0
    } else {
        val_pajak = pajak
    }

    if (!biaya_admin){
        val_admin = 0
    } else {
        val_admin = biaya_admin
    }

    const sql = `INSERT INTO pembelian(id_ktp, id_produk, alamat_penerima, harga, jumlah_dibeli, biaya_pengiriman, 
        pajak, biaya_admin, biaya_total, status_pembayaran, status_pengiriman, bukti_transfer, created_at, id_penjual) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        id_ktp,
        id_produk,
        alamat_penerima,
        harga,
        jumlah_dibeli,
        val_pengiriman,
        val_pajak,
        val_admin,
        biaya_total,
        status_pembayaran,
        status_pengiriman,
        bukti_transfer,
        created_at,
        id_penjual
    ];

    db.query(sql, values, (error, results) => {
        if (error) {
            res.status(500).json({ error: "failed to insert transaction" });
        } else {
            const data = {
                isSuccess: results.affectedRows > 0,
                id: results.insertId
            };
            res.status(200).json({ data: data, message: "purchased" });
        }
    });
});


app.put("/pembelian/:id_transaksi", multer.single('bukti_transfer'), transaksiupload.uploadToGcs, (req, res) => {
    const id_transaksi = req.params.id_transaksi
    const {
        alamat_penerima, 
        harga, 
        jumlah_dibeli, 
        biaya_pengiriman, 
        pajak, 
        biaya_admin, 
        biaya_total, 
        status_pembayaran, 
        status_pengiriman, 
        id_penjual
    } = req.body

    let updated_at = moment().tz('Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")

    var bukti_transfer = ''

    if (req.file && req.file.cloudStoragePublicUrl) {
        bukti_transfer = req.file.cloudStoragePublicUrl
    }

    const sql = `UPDATE pembelian SET alamat_penerima = ? , harga = ?, jumlah_dibeli = ?, biaya_pengiriman = ?, 
    pajak = ?, biaya_admin = ?, biaya_total = ?, status_pembayaran = ?, status_pengiriman = ?, 
    bukti_transfer = ?, updated_at = ?, id_penjual = ? WHERE id_transaksi = ?`

    const values = [
        alamat_penerima, 
        harga, 
        jumlah_dibeli, 
        biaya_pengiriman, 
        pajak, 
        biaya_admin, 
        biaya_total, 
        status_pembayaran, 
        status_pengiriman, 
        bukti_transfer, 
        updated_at,
        id_penjual,
        id_transaksi
    ]

    db.query(sql, values, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                id: fields.insertId
            }
            response(200, data, "transaction updated", res)
        }
    })
})


app.get("/pembelian/:id_transaksi", (req, res) => {
    const {id_transaksi} = req.params
    const sql = `SELECT * FROM pembelian WHERE id_transaksi = ?`

    db.query(sql, id_transaksi, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields[0], "transaction detail", res);
        } else {
            response(404, null, "transaction not found", res);
        }
    })
})

app.get("/pembelian/ktp/:id_ktp", (req, res) => {
    const {id_ktp} = req.params
    const sql = `SELECT * FROM pembelian WHERE id_ktp = ?`

    db.query(sql, id_ktp, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields, "user's transactions", res);
        } else {
            response(404, null, "user's transactions not found", res);
        }
    })
})

app.get("/pembelian/penjual/:id_penjual", (req, res) => {
    const {id_penjual} = req.params
    const sql = `SELECT * FROM pembelian WHERE id_penjual = ?`

    db.query(sql, id_penjual, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields, "seller's transactions", res);
        } else {
            response(404, null, "transaction not found", res);
        }
    })
})

app.get("/pembelian/produk/:id_produk", (req, res) => {
    const {id_produk} = req.params
    const sql = `SELECT * FROM pembelian WHERE id_produk = ?`

    db.query(sql, id_produk, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields, "item's transactions", res);
        } else {
            response(404, null, "transaction not found", res);
        }
    })
})

app.delete("/pembelian/:id_transaksi", (req, res) => {
    const {id_transaksi} = req.params
    const sql = `DELETE FROM pembelian WHERE id_transaksi = ?`

    db.query(sql, id_transaksi, (error, fields)=>{
        if(error) response(500, "invalid", "error", res)
        if (fields?.affectedRows){
            const data = {
                isSuccess: fields.affectedRows,
                message: fields.message,
            }
            response(200, data, "transaction deleted", res)
        } else {
            response(404, "wrong", "error", res)
        }
    })
})

app.get("/artikel", (req, res) => {
    const sql = `SELECT * FROM artikel`

    db.query(sql, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields, "all articles", res);
        } else {
            response(404, null, "article empty", res);
        }
    })
})

app.get("/artikel/:id_artikel", (req, res) => {
    const {id_artikel} = req.params
    const sql = `SELECT * FROM artikel WHERE id_artikel = ?`

    db.query(sql, id_artikel, (error, fields)=>{
        if(error) throw error
        if (fields.length > 0) {
            response(200, fields[0], "article detail", res);
        } else {
            response(404, null, "article not found", res);
        }
    })
})

app.listen(port, () => {
    console.log(`Server is up and listening on ${port}`);
});