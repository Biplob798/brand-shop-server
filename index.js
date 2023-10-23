const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware

app.use(cors())
app.use(express.json())





// database from mongodb 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsymadz.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // product collection for database  

        const productCollection = client.db('productDB').collection('product')
        const brandCollection = client.db('productDB').collection('brand')
        const cartCollection = client.db('cartDB').collection('cart')










        // get all data from database  to show home page
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
            console.log(result)
        })



        // get data for dynamic brand route to show brand product

        app.get("/product/:brand", async (req, res) => {
            const brand = req.params.brand;
            console.log(brand)
            const query = { brand: brand }
            const cursor = productCollection.find(query);
            const result = await cursor.toArray(cursor);
            console.log(result)
            res.send(result)
        })


        //  get data for dynamic id route to show brand product

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
            console.log(result)
        })


        // create/post data in server side

        app.post('/product', async (req, res) => {
            const newProduct = req.body
            console.log(newProduct)
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })


        // updateProduct in server 

        app.put("/product/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = req.body;
            const product = {
                $set: {
                    name: updateProduct.name,
                    brand: updateProduct.brand,
                    type: updateProduct.type,
                    price: updateProduct.price,
                    description: updateProduct.description,
                    rating: updateProduct.rating,
                    photo: updateProduct.photo,
                },
            };
            const result = await productCollection.updateOne(
                filter,
                product,
                options
            );
            res.send(result);
        });



        // app.put('/product/:id', async (req, res) => {
        //     const id = req.params.id
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true }

        //     const updateProduct = req.body
        //     const updateProductAfter = {

        //         $set: {
        //             name: updateProduct.name,
        //             price: updateProduct.price,
        //             description: updateProduct.description,
        //             brand: updateProduct.brand,
        //             type: updateProduct.type,
        //             rating: updateProduct.rating,
        //             photo: updateProduct.photo

        //         }
        //     }
        //     const result = await productCollection.updateOne(filter, updateProductAfter, options)
        //     res.send(result)
        // })



        // brands data 
        // app.post('/brand', async (req, res) => {
        //     const newBrand = req.body
        //     console.log(newBrand)
        //     const result = await brandCollection.insertOne(newBrand)
        //     res.send(result)
        // })



        // get data for cart 




        // get/read data  for my cart

        app.get("/cart", async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // get/read data for update my cart 

        app.get('/card/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.findOne(query)
            res.send(result)
        })

        // post data 

        app.post("/cart", async (req, res) => {
            const newCart = req.body;
            console.log(newCart);
            const result = await cartCollection.insertOne(newCart);
            res.send(result);
        });


        // update data korar jonno aga get data korte hobe 










        // delete data 

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Brand Shop making server is running')
})

app.listen(port, () => {
    console.log(`Brand Shop server is running on port: ${port}`)
})