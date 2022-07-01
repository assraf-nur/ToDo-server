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

    app.get('/list/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await listCollection.findOne(query);
        res.send(result);
    });

    app.put('/list/task/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const updateDoc = {
        $set: {role: 'done'},
      };
      const result = await listCollection.findOneAndUpdate(filter, updateDoc);
      res.send(result);
  })

  app.delete('/list/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await listCollection.deleteOne(query);
    res.send(result);
  })

    app.put('/list/:id', async(req, res) =>{
        const id = req.params.id;
        const updateText = req.body;
        const filter = {_id: ObjectId(id)};
        const option = {upsert: true};
        const updateDoc = {
          $set:{
            text: updateText.text,
          }
        };
        const result = await listCollection.findOneAndUpdate(filter, updateDoc, option);
        res.send(result);
    })

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
