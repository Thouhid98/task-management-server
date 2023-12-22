const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
// User Name and Password 
// taskuser
// iNkK2I3kGnx9LaYg


// middleware 
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.28tvm1z.mongodb.net/?retryWrites=true&w=majority`;

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

        const taskCollection = client.db('TaskMS').collection('tasks')
        const userCollection = client.db('TaskMS').collection('users')

        app.get('/manage-tasks', async (req, res) => {
            const result = await taskCollection.find().toArray()
            res.send(result)
        })

        app.post('/addtask', async (req, res) => {
            const task = req.body;
            console.log(task)
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })

        // User delete tasks 
        app.delete('/delete-task/:id', async (req, res) => {
            const id = req.params.id
            console.log('Cancel task Id', id);

            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/users', async(req, res)=>{
            const userinfo = req.body
            console.log(userinfo); 
            const result = await userCollection.insertOne(userinfo)
            res.send(result)
        })

         // User Profile 
         app.get('/userprofile/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email: email }
            const result = await userCollection.findOne(query)
            res.send(result)
        })

         // Find User Registered Camps 
         app.get('/registered-task/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await taskCollection.find(query).toArray()
            res.send(result)
        })















        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Task Server is running')
})

app.listen(port, () => {
    console.log(`Task management Port ${port}`);
})