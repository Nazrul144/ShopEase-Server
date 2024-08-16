const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

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
    const mobileCollection = client.db('shopEase').collection('mobiles');

    // Combined Sorting and Pagination Route
    app.get('/mobiles', async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 8;
      const sort = req.query.sort || 'asc';
      const sortOrder = sort === 'asc' ? 1 : -1;
      const search = req.query.search || '';

      const brand = req.query.brand || '';
      const category = req.query.category || '';
      const minPrice = parseInt(req.query.minPrice) || 0;
      const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

      
      const query = {
        productName: { $regex: search, $options: 'i' }, // Case-insensitive search

        // productName: { $regex: brand, $options: 'i' }, // Filter by brand name
        category: { $regex: category, $options: 'i' }, // Filter by category name
        price: { $gte: minPrice, $lte: maxPrice } // Filter by price range

      };

      // Sorting and Pagination
      const result = await mobileCollection.find(query)
        .sort({ price: sortOrder })
        .skip(page * size)
        .limit(size)
        .toArray();

      res.send(result);
    });

    // Mobile Count Route
    app.get('/mobileCount', async (req, res) => {
      const count = await mobileCollection.estimatedDocumentCount();
      res.send({ count });
    });

    // Specific Mobile Data
    app.get('/mobiles/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await mobileCollection.findOne(query);
      res.send(result);
    });

    // Ping to confirm successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensure the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Connecting API
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
