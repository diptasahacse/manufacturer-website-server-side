const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {

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


        const verifyAdmin = async (req, res, next) => {
            const requesterEmail = req.decoded.email;
            const requesterInfo = await allUsersCollection.findOne({ email: requesterEmail })
            if (requesterInfo.role === 'admin') {
                next();
            }
            else {
                return res.status(403).send({
                    message: 'Forbidden access'
                })
            }
        }

        // ALL GET Method
        // get all products
        app.get('/products', async (req, res) => {
            const query = {};
            const productsArray = await productsCollection.find(query).toArray()
            res.send(productsArray)

        })
        // get single product by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result)

        })

        // get all user
        app.get('/user', async (req, res) => {
            const query = {};
            const productsArray = await allUsersCollection.find(query).toArray()
            res.send(productsArray)

        })


        // get single user info by email
        app.get('/user/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await allUsersCollection.findOne(query);

            res.send(result)

        })


        // GET admin status
        app.get('/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const user = await allUsersCollection.findOne({ email: email })
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })
        // get All Orders by email - Customer
        app.get('/orders/:email', async (req, res) => {
            const customerEmail = req.params.email;
            const query = { customerEmail };
            const result = await allOrdersCollection.find(query).toArray();
            res.send(result)

        })



        // All Post Method
        // Post a order
        app.post('/orders', async (req, res) => {
            const orderData = req.body;
            // console.log(orderData)
            const result = await allOrdersCollection.insertOne(orderData);
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

        // Create Admin
        app.put('/admin/createadmin/:email', verifyJWT, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            // console.log(email)
            const filter = { email };
            const userDoc = {
                $set: { role: 'admin' },
            };
            const result = await allUsersCollection.updateOne(filter, userDoc);
            return res.send(result)
        })
        // Remove Admin
        app.put('/admin/removeadmin/:email', verifyJWT, verifyAdmin, async (req, res) => {
            const email = req.params.email;
            const filter = { email };
            const userDoc = {
                $unset: { role: '' },
            };
            const result = await allUsersCollection.updateOne(filter, userDoc);
            return res.send(result)
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