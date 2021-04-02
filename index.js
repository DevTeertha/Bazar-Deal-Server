const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const port = 5000;
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gqnhb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
    const productCollection = client.db('bazarDeal').collection("product");
    const placedOrder = client.db('bazarDeal').collection("orders");

    app.post('/placeOrder', (req, res) => {
        const newOrder = req.body;

        placedOrder.insertOne(newOrder)
        .then(result=> {
            res.send(result.insertedCount>0);
        })
    })

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.get('/order',(req,res)=>{
        const currentEmail = req.query.email
        placedOrder.find({email:currentEmail})
        .toArray((err,orders)=>{
            res.send(orders)
        })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);

        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })


    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        productCollection.findOneAndDelete({ _id: id })
            .then(result => {
                res.send(result.value);
            })
    })

});












app.get('/', (req, res) => {
    console.log('hello from console log');
    res.send('Hello World');
})

app.listen(process.env.PORT || port);