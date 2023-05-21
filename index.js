const express = require('express')
const app = express()

app.get("/", (req, res) => {
    console.log("Response Berhasil")
    res.send("Response Berasil yaw!")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})