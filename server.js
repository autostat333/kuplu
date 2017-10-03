var async = require('async');
var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var config = require('./config');
var mongo = require('mongodb').MongoClient;
var request = require('request');
var logger = require('logger').createLogger('LOG_ERRORS');
var bodyParser = require('body-parser'); //for parsing body and retrieve post data
var jwt = require('jsonwebtoken');


app.locals.SCRIPT_DIR = __dirname;



var options = {};
options.server = { socketOptions: { keepAlive: 1, connectTimeoutMS: 5000000 } };


var db = '';
var MongoClient = mongo.connect('mongodb://localhost:27017/kuplu',options,function(err,db_)
    {
    db = db_;
    });

	
	

	
//STATIC FILES
app.use('/views', express.static(__dirname+'/app/views'));
app.use('/dist', express.static(__dirname+'/app/dist'));
app.use('/styles', express.static(__dirname+'/app/styles'))
app.use('/non_bower',express.static(__dirname+'/app/non_bower_libs'));

app.use(function (req, res, next) {
  next();
})


app.use(bodyParser.json());



//prototype Object with validators
//add method isValidFor(string name of validator)
//validators possible only for String and Number
require('./server/Validators.js')(regions);

function userError(msg)
	{
	this['Error'] = msg;
	this['data'] = '';
	this['userError'] = true;
	}


app.get('/',function(req,resp)
    {
		
	//when first loading - afetr server restarted - regions may not existed
	//but get/advert raise error (because regions.data is empty)
	if (!regions.data.length)
		commonInfoCntr().getRegions(function(){});
		
    fs.readFile('./index.html','utf-8',function(err,res)
        {
        if (err){next();return false;};
        resp.send(res);
        })
    });

	
	
	

//prepare  regions variable to put here regions
//for make validation within advertsCntr
//pass regions to commonInfo to complete region info and to advertsCntr to use it
var regions = {'data':[]};
/////CONTROLLERS
////////////////
var commonInfoCntr = function(){return require('./server/CommonInfoCntr.js')(async,db,regions)};
var accountCntr = function(){return require('./server/AccountCntr.js')(db,jwt,config,async,userError)};
var advertsCntr = function(){return require('./server/AdvertsCntr.js')(config,db,userError,regions)};
	
	

app.get('/api/regions/get',function(req,resp,next)
    {
	commonInfoCntr().getRegions(function(err,res)
		{
		if (err)
			{
			err.msg = "Возникла проблема на сервере при получении регионов!";
			next(err);
			return false;
			}
		else
			{
			resp.send(res);
			}
		});
		

    });

	

app.post('/api/adverts/get',function(req,resp,next)
	{
	advertsCntr().getAll(req.body,function(err,res)	
		{
		if (err)
			{
			err.msg = "Возникла проблема на сервере при получении списка все намерений!";
			next(err);
			return false;
			}
		resp.send(res);
		})
		
		
	})
	


app.post('/api/adverts/create',function(req,resp,next)
    {
	advertsCntr().createAdvert(req.body,function(err,res)
		{
		if (err)
			{
			err.msg = "Возникла ошибка на сервере при попытке сохранить новое намерение!";
			next(err);
			return false;
			}
		resp.send(res);
		})
    });


app.post('/login',function(req,resp,next)
	{
	accountCntr().login(req['body'],function(err,res)
		{
		if (err)
			{
			err.msg = 'Возникла проблема на сервере при разрешении входа в систему!';
			next(err)
			return false;
			}
		resp.send(res);
		})
	})
	

app.post('/signup',function(req,resp, next)
	{
	accountCntr().signup(req['body'],function(err,res)
		{
		if (err)
			{
			err.msg = 'Возникла проблема на сервере при создании учетной записи!';
			next(err);
			return false;
			}
		
		resp.send(res);
		})
	})


app.use(handleError);

function handleError(err,req,resp,next)
	{

	logger.error(err);
		
	//create error object for frontEnd
	var message = {};	
	message['Error'] = err.msg||"Возникла проблема на сервере, обратитесь в службу поддержки";
	message['data'] = '';
	resp.send(message);		
	}

	
	
	
app.listen(config['PORT'],config['HOST'],function()
    {
    console.log('App is started','second variable');
    })