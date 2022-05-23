const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@cluster0.8dwzm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const productsCollection = client.db('manufacturerWebsite').collection('products');



        // ALL GET Method
        app.get('/products', async (req, res) => {
            const query = {};
            const productsArray = await productsCollection.find(query).toArray()
            res.send(productsArray)

        })

    }
    finally {
        // await client.close();

    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Manufacture server is ready')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})