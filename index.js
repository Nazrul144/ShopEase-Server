const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//Middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvedd86.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    
    const mobileCollection = client.db('shopEase').collection('mobiles')

    //Write necessary api here:
    //Getting mobiles data from database:
    app.get('/mobiles', async(req, res) =>{
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log("pagination query", page, size);
      const result = await mobileCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray()
      res.send(result)
    })

    app.get('/mobileCount', async(req, res)=>{
      const count = await mobileCollection.estimatedDocumentCount();
      res.send({count})
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




//Connecting api:
app.get('/', (req, res)=>{
    res.send("Server is running!")
})
app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`);
})