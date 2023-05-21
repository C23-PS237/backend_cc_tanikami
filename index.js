
const express = require('express')
const app = express()

app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})

let angka = 42;
console.log("Nilai angka:", angka); // Menampilkan teks "Nilai angka: 42"