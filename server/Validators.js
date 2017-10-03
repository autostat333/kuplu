module.exports = function ObjectPrototype(regions)
	{


    ///////////////////////////////////////////////////////
    //for check VALUE for SAFE QUERIES TO DB

	
    //kind is equal to specific logic, if no - return true
    //define property is using to make possible set params (like enumerable to disable take part within loop)
    Object.defineProperty(Object.prototype,'isValidFor',{
        'enumerable':false,
        'value':function(kind)
            {
			//commented below because Region property - it is object and should verified acc to regions
            if (this.constructor.name!='Number'&&this.constructor.name!='String')
                return 'Not Valid: Must be String or Number';

            if (kind===undefined)
                return true;

            var fns = {};

			

			//'YYYY-MM-DD'
            fns['date'] = function()
                {

                var res = /\d{4,4}-\d{1,2}-\d{1,2}/.test(this.valueOf());
                return res?true:'Неверный формат даты (ожидаемый YYYY-MM-DD)';
                }.bind(this); //bind neccessary to set context of Object, but not fns object

				
				
            fns['numbers'] = function(val)
                {
				val = val||this.valueOf();
					
                var r = /\d/.test(val);
                return r?true:'Must be integers';
                }.bind(this);

				
			
			//VALIDATOR FOR USERNAME in users collection
			//name must have not less 5 characters to provide good visibility]
			fns['userName'] = function(val)
				{
				var val = val||this.valueOf();
				
				if (!val||
					typeof val!='string'||
					val.length<5)
					{
					return "Длина имени пользователя не может быть меньше 5 символов!";
					}
				return true;
				}.bind(this);
				
				

			fns['email'] = function()
				{
				var val = this.valueOf();
				
				if (!val||
					typeof val!='string'||
					!/^[^@!\/]+@[^@!\/]+$/.test(val))
					{
					return "Неверный формат почтового адреса!";
					}
				return true;
				}.bind(this);
				
				
			fns['phone'] = function()
				{
				var val = this.valueOf();
				
				if (!val||
					typeof val!='string'||
					!/^\+380\d{9}$/.test(val))
					{
					return "Возможно неверный формат телефона, проверте пжл правильность!";
					}
				return true;
				
				
				}.bind(this);
				
			fns['password'] = function()
				{
				var val = this.valueOf();
				
				if (!val||
					typeof val!='string'||
					val.length<6)
					{
					return "Длина пароля не может быть меньше 6 символов";
					}
				return true;
				
				}.bind(this);
				
				
			
			fns['advert/Title'] = function()	
				{
				var errMess = "Длина заголовка слишком мала или более 70 символов, опишите детальней, не менее 10 символов и не более 70 символов!";
				var txt = this.valueOf();
				if (!txt) return errMess;
				var l;
				if ((l=txt.toString().length)<11||l>70) return errMess;
				
				return true;
				}.bind(this);
			
			fns['advert/Price'] = function(val)	
				{

				var errMess = "Слишком большая сумма для намерения или она осутствует! Сумма не может превышать 10 знаков с дробными и не может быть 0";
				
				var val = val||this.valueOf();
				if (!val) return errMess;
				var l,msg;
				
				if ((msg=fns['numbers'](val))!=true) return msg;
				if (val.toString().length>10) return errMess;
				
				return true;
				
				}.bind(this);
			
			fns['advert/Currency'] = function(val)
				{
				var errMess = "Вид валюты доступен только гривна (.грн) или доллар США ($)";
				val = val||this.valueOf();
				if (typeof val !='string') return errMess;
				if (val.indexOf('грн')==-1&&val.indexOf('$')==-1) return errMess;
					
				return true;
				}.bind(this);

				
			fns['advert/Description'] = function(val)
				{
				var errMess = "Для лучшей информативности детальное описание не может быть меньше 20 символов и более 200 символов"
				var val = val||this.valueOf();
				
				//it is not required field
				if (val=='')
					return true;
				
				if (!val||
					typeof val!='string'||
					val.length<20||
					val.length>200)
					{
					return errMess
					}
					
				return true;
				}.bind(this);
				


			fns['advert/Street'] = function(val)
				{
				var errMess = "Для лучшей информативности название улицы не может быть менее 5 символов и более 30 символов";
				var val = val||this.valueOf();
				
				//it is not required field
				if (val=='')
					return true;
				
				if (!val||
					typeof val!='string'||
					val.length<5||
					val.length>30)
					{
					return errMess
					}
					
				return true;
				}.bind(this);
				
			fns['advert/date'] = function(val)
				{
				var errMess = "Неверный формат данных для фильтрации по дате!";
				val = val||this.valueOf();
				
				if (!val) return errMess;
				if (val instanceof Date) return true;

				var dt = new Date(val);
				if (dt=='Invalid Date') return errMess;
				if (fns['numbers'](val)==true) return true;
				
				return false;
					
				}.bind(this)
				
				
				
				
				
			fns['objectId'] = function(val)
				{
				var errMess = "Неверный ИД документа!";
				val = val||this.valueOf();
				
				var regPattern = new RegExp("^[0-9a-fA-F]{24}$");
				
				if (!val) return errMess;
				
				if (!regPattern.test(val.toString())) return errMess;
				
				return true;
				
					
				}.bind(this);
				
				
				
				
				
				
            return fns[kind]();        
            }
			
			
			
			
			


    })



	}