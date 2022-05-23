const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Manufacture server is ready')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})