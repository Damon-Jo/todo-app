const express = require('express');
const app = express();

app.listen(8080, function(){
    console.log('listening on 8080')
});


// when access the '/pet' path, it shows 'hello world' msg
app.get('/pet', function(req,res){
    res.send('hello world');
})

app.get('/beauty', function(req,res){
    res.send('hello beauty');
})

app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html')
})

app.get('/write', function(req,res){
    res.sendFile(__dirname + 'write.html')
})