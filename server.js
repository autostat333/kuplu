var async = require('async');
var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var mongo = require('mongodb').MongoClient;
var request = require('request');
var bodyParser = require('body-parser'); //for parsing body and retrieve post data

app.locals.SCRIPT_DIR = __dirname;


var db = '';


var options = {};
options.server = { socketOptions: { keepAlive: 1, connectTimeoutMS: 5000000 } };

var MongoClient = mongo.connect('mongodb://localhost:27017/shop_viseversa',options,function(err,db_)
    {
    db = db_;
    });




//STATIC FILES
app.use('/views', express.static(__dirname+'/app/views'));
app.use('/dist', express.static(__dirname+'/app/dist'));
app.use('/styles', express.static(__dirname+'/app/styles'))
app.use('/non_bower',express.static(__dirname+'/app/non_bower_libs'));


app.use(bodyParser.json());

app.get('/',function(req,resp)
    {
    fs.readFile('./index.html','utf-8',function(err,res)
        {
        if (err){resp.send('Cannot find index.html');return false;};
        resp.send(res);
        })
    });


app.get('/api/sales/get',function(req,resp)
    {
    resp.send([]);
    });





app.post('/api/sales/create',function(req,resp)
    {

    });


app.listen(3008,'localhost',function()
    {
    console.log('App is started','second variable');
    })