const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const password = 'Volunteer-Network';
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
console.log(process.env.DB_USER)
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//test get methods
app.get('/', (req, res) => {
  res.send("Hello I am here!");
})

//DB Connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.19f5u.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("volunteer-network").collection("volunteerActivity");

  //new register
  app.post('/newRegistration', (req, res) => {
    const newRegistration = req.body;
    // console.log(newRegistration);
    collection.insertOne(newRegistration)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  //display register data to UI
  app.get('/allRegistration', (req, res) => {
    collection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  //Delete an activity
  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id)
    collection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log("Delete one successfully")
        res.send(result.deletedCount > 0)
      })
  })

  //display all volunteer sarvicees
  app.get('/allSarvice', (req, res) => {
    collection.find({ name: req.query.name })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  // add data to admin panel
  app.post('/addEvent', (req, res) => {
    const addEvent = req.body;
    collection.insertOne(addEvent)
      .then(result => {
        console.log("One Event Added");
      })
  })

  //show all register users
  app.get('/registerUser', (req, res) => {
    collection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

})

console.log("\nYEAA...Database Connected !!\n")
//   client.close();

app.listen(process.env.PORT || port);