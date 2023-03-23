const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;

//install method-override to use the 'PUT / DELETE request'
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

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
    // res.sendFile(__dirname + '/index.html')
    res.render('index.ejs');
})

app.get('/write', function(req,res){
    // res.sendFile(__dirname + '/write.html')
    res.render('write.ejs');
})

app.post('/add', function(req,res){
    res.send('Message Send');
    console.log(req.body.title); // req.body == data from input form

    // search data which name is 'theNumberOfPosts' in 'counter collection 
    db.collection('counter').findOne({name : 'theNumberOfPosts'}, function(err, result){
        var totalPosting = result.totalPost; // assigned the totalPost to totlPosting variable

        db.collection('post').insertOne({_id : totalPosting +1, title: req.body.title, date: req.body.date}, function(err,resutl){
            console.log('saved')

            // and then increse the totalPost
            db.collection('counter').updateOne({name:'theNumberOfPosts'},{$inc: {totalPost:1} },function(err, result){
                if(err){return console.log(error)}
            })
        })
    });


})

// if user access to list, show the html made data from db
app.get('/list', function(req, res){
    // Read the all data from database called 'post' in collection, first.
    db.collection('post').find().toArray(function(err,result){
        console.log(result)
        res.render('list.ejs', {posts : result});
    });

});

app.delete('/delete', function(req, res){
    console.log(req.body) // but the data type is string { _id : '18'} --> need to change
    req.body._id = parseInt(req.body._id);
    console.log(req.body)
    db.collection('post').deleteOne(req.body, function(err,result){
        console.log('removed!');
        res.status(200).send({message:'success'});
    })
})

app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result){
        if(result == null){
            console.log("error")
            // res.render('error', {errorMsg: "Can't find the data in database"})
        } else {
            res.render('detail.ejs', {data : result})
        }
    })
})

app.get('/edit/:id', function(req, res){
    db.collection('post').findOne({_id: parseInt(req.params.id)}, function(err, result){
        console.log(result)
        res.render('edit.ejs', {post : result})
    })
    
})

app.put('/edit', function(req, res){
    db.collection('post').updateOne({_id: parseInt(req.body.id)},{$set :{title: req.body.title, date: req.body.date}},function(err, result){
        console.log('edited')
        res.redirect('/list')
    })
});