const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');


var db;

MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.rfmec.mongodb.net/?retryWrites=true&w=majority', function(error, client){
    if(error) return console.log(error);

    db = client.db('todoapp'); //connect to database called 'todoapp'

    // db.collection('post').insertOne({name:'John', age:20}, function(err,result){
    //     console.log('saved!');
    // });

    app.listen(8080, function(){
            console.log('listening on 8080')
        });
    
})



app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html')
})

app.get('/write', function(req,res){
    res.sendFile(__dirname + '/write.html')
})

app.post('/add', function(req,res){
    res.send('Message Send');
    console.log(req.body.title);

    db.collection('post').insertOne({title: `${req.body.title}`, date: `${req.body.date}`}, function(err,resutl){
        console.log('saved')
    })
})

// if user access to list, show the html made data from db
app.get('/list', function(req, res){
    // Read the all data from database called 'post' in collection, first.
    db.collection('post').find().toArray(function(err,result){
        console.log(result)
        res.render('list.ejs', {posts : result});
    });

});