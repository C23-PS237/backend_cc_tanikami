const bodyParser = require('body-parser')
const express = require('express')
const port = process.env.PORT || 3000
const app = express()
const db = require ('./connection.js')
const response = require('./response.js')

//app.use(bodyParser.json())
app.use(
    express.urlencoded({
      extended: true,
    })
  )

app.get("/user/:id_ktp", (req, res) => {
    const {id_ktp} = req.params

    const sql = `SELECT * FROM user WHERE id_ktp = ?`

    db.query(sql, id_ktp, (error, fields)=>{
        if(error) throw error
        response(200, fields,"user detail", res)
    })
})

app.post("/user", (req, res) => {
    const {
        id_ktp, 
        nama, 
        telepon, 
        alamat_regist, 
        alamat_penerima, 
        gender, 
        usia, 
        status
    } = req.body;

    const sql = `INSERT INTO user(id_ktp, nama, telepon, alamat_regist, alamat_penerima, gender, usia, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [
        id_ktp, 
        nama, 
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

app.put("/user/:id_ktp", (req, res) => {
    const id_ktp = req.params.id_ktp
    const {
        nama, 
        telepon, 
        alamat_regist, 
        alamat_penerima, 
        gender, 
        usia, 
        status
    } = req.body;

    const sql = `UPDATE user SET nama = ?, telepon = ?, alamat_regist = ?, alamat_penerima = ?, 
    gender = ?, usia = ?, status = ? WHERE id_ktp = ?`

    const values = [
        nama, 
        telepon, 
        alamat_regist, 
        alamat_penerima, 
        gender, 
        usia, 
        status,
        id_ktp
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

app.post("/produk/:id_ktp", (req, res) => {
    const id_ktp = req.params.id_ktp;
    const {
        nama_produk,
        besaran_stok,
        stok,
        harga,
        url_gambar,
        deskripsi_produk,
        nama_bank,
        rek_penjual,
        timestamp
    } = req.body;

    const sql = `INSERT INTO produk (id_ktp, nama_produk, besaran_stok, stok, harga, url_gambar, deskripsi_produk, 
        nama_bank, rek_penjual, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        id_ktp,
        nama_produk,
        besaran_stok,
        stok,
        harga,
        url_gambar,
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
        response(200, fields,"all products", res)
    })
})

app.get("/produk/:id_produk", (req, res) => {
    const {id_produk} = req.params
    const sql = `SELECT * FROM produk WHERE id_produk = ?`

    db.query(sql, id_produk, (error, fields)=>{
        if(error) throw error
        response(200, fields,"product detail", res)
    })
})

app.put("/produk/:id_produk", (req, res) => {
    const id_produk = req.params.id_produk
    const {
        nama_produk, 
        besaran_stok, 
        stok, 
        harga, 
        url_gambar, 
        deskripsi_produk, 
        nama_bank, 
        rek_penjual, 
        timestamp
    } = req.body

    const sql = `UPDATE produk SET nama_produk = ?, besaran_stok = ?, stok = ?, harga = ?, url_gambar = ?, 
    deskripsi_produk = ?, nama_bank = ?, rek_penjual = ?, timestamp = ? WHERE id_produk = ?`
    
    const values = [
        nama_produk, 
        besaran_stok, 
        stok, 
        harga, 
        url_gambar, 
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
            response(200, data, "data updated", res)
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
            response(200, data, "data deleted", res)
        } else {
            response(404, "wrong", "error", res)
        }
    })
})

app.post("/pembelian/:id_ktp/:id_produk", (req, res) => {
    const id_ktp = req.params.id_ktp;
    const id_produk = req.params.id_produk;
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
        bukti_transfer,
        created_at,
        updated_at
    } = req.body;

    const sql = `INSERT INTO pembelian(id_ktp, id_produk, alamat_penerima, harga, jumlah_dibeli, biaya_pengiriman, 
        pajak, biaya_admin, biaya_total, status_pembayaran, status_pengiriman, bukti_transfer, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
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
        bukti_transfer,
        created_at,
        updated_at
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


app.put("/pembelian/:id_transaksi", (req, res) => {
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
        bukti_transfer, 
        updated_at
    } = req.body

    const sql = `UPDATE pembelian SET alamat_penerima = ? , harga = ?, jumlah_dibeli = ?, biaya_pengiriman = ?, 
    pajak = ?, biaya_admin = ?, biaya_total = ?, status_pembayaran = ?, status_pengiriman = ?, 
    bukti_transfer = ?, updated_at = ? WHERE id_transaksi = ?`

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
        id_transaksi
    ]

    db.query(sql, values, (error, fields)=>{
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

app.get("/pembelian/:id_transaksi", (req, res) => {
    const {id_transaksi} = req.params
    const sql = `SELECT * FROM pembelian WHERE id_transaksi = ?`

    db.query(sql, id_transaksi, (error, fields)=>{
        if(error) throw error
        response(200, fields,"purchase detail", res)
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
    const {id_artikel} = req.params
    const sql = `SELECT * FROM artikel WHERE id_artikel = ?`

    db.query(sql, id_artikel, (error, fields)=>{
        if(error) throw error
        response(200, fields,"article detail", res)
    })
})

app.listen(port, () => {
    console.log(`Server is up and listening on ${port}`);
});
