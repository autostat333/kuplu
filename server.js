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
var path = require('path');

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
app.use('/'+config['AVATAR_FOLDER'].replace('./',''),express.static(path.join(__dirname,config['AVATAR_FOLDER'])));


app.use('/',function (req, res, next) 
	{
	if (!req.headers['authorization'])
		req.USER = false;	
	else
		{
		try
			{
			req.USER = jwt.verify(req.headers['authorization'].replace('Bearer ',''),config['SECRET']);		
			}
		catch(err)
			{
			//for the case if token expires - send a exact message "Token is expired" to prevent showing
			//error popup, only logout
			if (err.message=='jwt expired')
				err.msg = 'Token is expired';
			else
				err.msg = "Неверный токен!";
			next(err);
			return false;
			};
		}
		
	
	next();
	})

app.use(bodyParser({limit:'50mb'}));
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
	advertsCntr().getAll(req.body,req.USER,function(err,res)	
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

//by flag 'withUsers' to show adverts with users
app.post('/api/adverts/get/private',function(req,resp,next)
	{
	if (!req.USER)
		{
		var err = new Error();
		err.msg = "Вы не авторизированы! Пожалуйста, войдите в систему!";
		next(err);
		return false;
		}
		
	
	advertsCntr().getAllWithUsers(req.body,req,function(err,res)	
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
	
//by flag 'withUsers' to show adverts with users
app.post('/api/adverts/get/related',function(req,resp,next)
	{
	if (!req.USER)
		{
		var err = new Error();
		err.msg = "Вы не авторизированы! Пожалуйста, войдите в систему!";
		next(err);
		return false;
		}
		
	//it is basically the same as get all but completed with owner object to show avatars
	advertsCntr().getAllRelatedToUser(req.body,req.USER,function(err,res)	
		{
		if (err)
			{
			err.msg = "Возникла проблема на сервере при получении списка всечх намерений на которые откликнулся пользователь!";
			next(err);
			return false;
			}
			
		resp.send(res);
		})
		
	})	
	
	
//to complete messages of advert
app.post('/api/adverts/get/:id',function(req,resp,next)
	{
	if (!req.USER)
		{
		var err = new Error("Вы не авторизированы! Пожалуйста, войдите в систему!");
		err.msg = err.message;
		next(err);
		return false;
		}
		
	advertsCntr().getAdvertById(req,function(err,res)
		{
		if (err) 
			{
			err.msg = "Возникли проблемы при получении advert по ИД!";
			next(err);
			return false;
			}
		resp.send(res);
		})
		
		
	})


app.post('/api/adverts/create',function(req,resp,next)
    {
	if (!req.USER)
		{
		var err = new Error();
		err.msg = "Вы не авторизированы! Пожалуйста, войдите в систему!'";
		next(err);
		return false;
		}
		
	advertsCntr().createAdvert(req.body,req.USER,function(err,res)
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


app.post('/api/adverts/close',function(req,resp,next)
    {
	if (!req.USER)
		{
		var err = new Error();
		err.msg = "Вы не авторизированы! Пожалуйста, войдите в систему!'";
		next(err);
		return false;
		}
		
	advertsCntr().closeAdvert(req.body,req.USER,function(err,res)
		{
		if (err)
			{
			err.msg = "Возникла ошибка на сервере при попытке удалить намерение!";
			next(err);
			return false;
			}
		resp.send(res);
		})
    });

	
app.post('/api/adverts/update',function(req,resp,next)
    {
	if (!req.USER)
		{
		var err = new Error();
		err.msg = "Вы не авторизированы! Пожалуйста, войдите в систему!'";
		next(err);
		return false;
		}
		
	advertsCntr().updateAdvert(req.body,req.USER,function(err,res)
		{
		if (err)
			{
			err.msg = "Возникла ошибка на сервере при попытке изменить намерение!";
			next(err);
			return false;
			}
		resp.send(res);
		})
    });

	
	
app.post('/api/adverts/messages/add',function(req,resp,next)
	{
	if (!req.USER)
		{
		var err = new Error();
		err.msg = "Вы не авторизированы! Пожалуйста, войдите в систему!'";
		next(err);
		return false;
		}
		
	advertsCntr().addMessage(req,function(err,res)
		{
		if (err)
			{
			err.msg = "Возникли проблемы при отправке сообщения автору намерения!";
			next(err);
			return false;
			}
		resp.send(res);
		})
		
	})

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

	
	
app.post('/avatar/update',function(req,resp,next)
	{
	if (!req.USER)
		{
		var err = {};
		err.msg = 'Вы не авторизированы! Пожалуйста, войдите в систему!';
		next(err);
		return false;
		}
		
	accountCntr().updateAvatar(req,function(err,res)
		{
		if (err)
			{
			err.msg = 'Возникла проблема при сохранении аватарки!';
			next(err);
			return false;
			}
		resp.send(res); //as a result - new avatarUrl
		})
		
	})
	

	
app.post('/api/profile/update',function(req,resp,next)
	{
	if (!req.USER)
		{
		var err = {};
		err.msg = 'Вы не авторизированы! Пожалуйста, войдите в систему!';
		next(err);
		return false;
		}
		
	accountCntr().updateProfile(req, function(err,res)
		{
		if (err)
			{
			err.msg = "Возникли проблемы при сохранении новых данных профиля!";
			next(err);
			return false;
			}
		resp.send(res);
		})
		
		
	})


app.post('/api/password/update',function(req,resp,next)
	{
	if (!req.USER)
		{
		var err = {};
		err.msg = 'Вы не авторизированы! Пожалуйста, войдите в систему!';
		next(err);
		return false;
		}
		
	accountCntr().updatePassword(req, function(err,res)
		{
		if (err)
			{
			err.msg = "Возникли проблемы при изменении пароля!";
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