const express = require('express')
const jwt = require('jsonwebtoken');
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

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // If Token is undefined or not ok
    if (!authHeader) {
        return res.status(401).send({
            message: 'Unauthorized access'
        })
    }
    // Have a token but check if it is right or not
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {

        // if error is occur means token is right but dont have permission to access 
        if (err) {
            return res.status(403).send({
                message: 'Forbidden access'
            })

        }
        req.decoded = decoded;
        next();

    });
}





const run = async () => {
    try {
        await client.connect();
        const productsCollection = client.db('manufacturerWebsite').collection('products');
        const allUsersCollection = client.db('manufacturerWebsite').collection('users');
        const allOrdersCollection = client.db('manufacturerWebsite').collection('orders');



        // ALL GET Method
        // get all products
        app.get('/products', async (req, res) => {
            const query = {};
            const productsArray = await productsCollection.find(query).toArray()
            res.send(productsArray)

        })


        // get single user info by email
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await allUsersCollection.findOne(query);

            res.send(result)

        })





        // ALL PUT Method
        // PUT - USER
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email };
            const options = { upsert: true };
            const userDoc = {
                $set: user,
            };
            const result = await allUsersCollection.updateOne(filter, userDoc, options);
            // JWT - Token
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
            res.send({ result, token })

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