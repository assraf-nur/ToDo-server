const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.POST || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://assraf:assrafnur@cluster0.0wa7u.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const listCollection = client.db("todo").collection("list");

    app.post('/list', async(req, res) =>{
        const newList = req.body;
        const result = await listCollection.insertOne(newList);
        res.send(result);
    });

    app.get('/list', async(req, res) =>{
        const query = {};
        const cursor = listCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    });

  } 
  finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});