// const express = require('express')
// const app = express()
// const cors = require('cors');
// require('dotenv').config()
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const port = process.env.PORT || 5000;


// // middel ware

// app.use(cors())
// app.use(express.json())



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqiq2nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri)


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // connect to database

//     const coffeeCollection = client.db("coffeeDB").collection('coffee')

// // connect to client
//   app.post('/coffee', async(req, res)=>{
//     const addCoffee = req.body;
//     console.log(addCoffee);
//     // connect to database
//     const result = await coffeeCollection.insertOne(addCoffee);
//     res.send(result);
//   })

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



// app.get('/', (req, res) => {
//   res.send('Server is start naw')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqiq2nz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to server");

    // Connect to database
    const coffeeCollection = client.db("coffeeDB").collection('coffee');
      // show data database to clint
      app.get('/coffee', async(req, res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })
      // Update 
      app.put('/coffee/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateCoffee = req.body;

        const coffee = {
          $set: {
            name: updateCoffee.name, 
            chof: updateCoffee.chof, 
            supplier: updateCoffee.supplier,
            taste: updateCoffee.taste, 
            chatagory: updateCoffee.chatagory,
            details: updateCoffee.details,
            url: updateCoffee.url
          }
        }
        const result = await coffeeCollection.updateOne(filter, coffee, options);
        res.send(result);
      })

      app.get('/coffee/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(query);
        res.send(result);
      })
    // Define the POST route
    app.post('/coffee', async (req, res) => {
      const addCoffee = req.body;
      console.log(addCoffee);
      // Insert the coffee document into the database
      const result = await coffeeCollection.insertOne(addCoffee);
      res.send(result);
    });

    // delete
    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is start now');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});