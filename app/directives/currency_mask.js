module.exports = function CurrencyMask($filter,$timeout,$compile)
	{
	return {
		
		require:['ngModel'],
		link:function(scope,element, attr,ngModel)
			{

			ngModel = ngModel[0];
			var SELECTION_PART = ''; //current cursor position (before which symbol cursor, inception = 0)
			var BACKSPACE_SPACE = false; //to controle whether cursor near space and button "BACKSPACE"
			var SELECTION_START = ''; //start position number
			var modelName = attr['ngModel'];
			scope._CURRENCY_LABEL = attr['currencyMask']||' грн';
			var template = ''+
			''+
			'<style>'+
			''+
			'.currency_label'+
			'	{'+
			'	position: absolute;'+
			'	top: 0px;'+
			'	right: 0px;'+
			'	color: white;'+
			'	top: 9px;'+
			'	}'+
			''+
			'md-input-container.md-input-focused .currency_label'+
			'	{'+
			'	visibility:visible !important;'+
			'	}'+
			'</style>'+
			''+
			'<div class="currency_label" ng-class="{\'not_visible\':!'+modelName+'}">{{_CURRENCY_LABEL}}</div>';

			
			attr.$observe('currencyMask',function(val)
				{
				if (!val) return false;
				scope._CURRENCY_LABEL = val;
				//debugger;
				setTimeout(function()
					{
					var currencyLabel = $(element.parent('md-input-container')[0]).find('.currency_label');
					var contentLength = currencyLabel.html();
					contentLength = contentLength.length||0;
					padding = contentLength*6+4;
					//var padding = currencyLabel.width();
					element.css('padding-right',padding);
					},0)
				});
			
			(function init()
				{
				element = $(element);
				var label = $compile(template)(scope);
				element.after(label);
				element.css({'padding-right':'30px'});
				})()
			
			//runs for setting INPUT value
			ngModel.$formatters.push(function(val)	
				{
				if (!val)return '';
				return formatToInput(val);
				})

				
			//runs for setting NgMODEL
			ngModel.$parsers.push(function(val)	
				{

				keyUp(); //to catch SELECTION_PART
				
				var valModel = formatToModel(val);
				
				var newVal; 
				if ((newVal=validateInput(val))!=val)
					$timeout(function()
						{
						ngModel.$viewValue = ngModel.$$lastCommittedViewValue = newVal;
						ngModel.$render();
						setCursor();
						},0)
						
				return valModel;
				})

				 
				
			//logic for ng-currency formatting
			function formatToModel(val)
				{

				val = val.replace(/[^\d,]*([\d,]*)/g,'$1'); 
				//convert to absolute value, not float 
				val = val.toString();
				val = val.split(',');
				if (val.length!=1)
					{
					var cents = val[1].substr(0,2);
					cents = cents.length==1?cents+'0':(cents==''?'00':cents);
					val = val[0]+cents;
					}
				else
					val = val[0]+'00';
					
				
				val = val.replace(/^0+(?=\d)/g,''); //because if value is equal to 0045,45 - it remains in model as 04545
					
				return parseInt(val);
				}
			
			function formatToInput(val)
				{
				if (!val) return val;
				val = val/100;
				val = val.toString();
				val = val.replace('.',',');
				if (val.indexOf(',')==-1)
					val+=',00';
				
				val = validateInput(val); //put spaces between digits
				return val;
				}
			

			function validateInput(valFromInput)
				{
				if (!valFromInput)return valFromInput;
				valFromInput = valFromInput.replace(/[^\d,]*([\d,]*)/g,'$1'); 
				//trim extra 00056,55
				valFromInput = valFromInput.replace(/^0*(\d.*)|(0,.*)/,'$1'); 
				
				if (valFromInput.indexOf(',')!=-1)
					newVal = valFromInput.replace(/(\d)(?=(\d\d\d)+,)|(,\d{0,2}).*/g,'$1$3 ');
				else
					newVal = valFromInput.replace(/(\d)(?=(\d\d\d)+$)/g,'$1 ');
				
				//check whether end of typied value equal contains ',', to render values like '1,'
				//where after comma no any digits
				if (valFromInput.indexOf(',')!=-1&&newVal.indexOf(',')==-1)
					newVal = newVal+',';
					
				//check whether start of typied value equal contains ',', to render values like ',1' to '0,1'
				if (newVal.indexOf(',')==0)
					newVal = '0'+newVal;
					
				if (valFromInput=='0,0') return '0,0'; //only hardcode for value 0,0
				
				
				return newVal.trim();
				}


				
			function setCursor()
				{
				
				var val = ngModel.$viewValue;
				
				var pos = val.lastIndexOf(SELECTION_PART);
				
				//check whether SELECTION_PART is the end of string
				//because after coma maybe cases
				// ,656  - it remember 6, 
				//than expression transforms it to ,65 and indexOf 6 will be some digit
				//what is wrong
				if (val.length!=SELECTION_PART.length+pos)
					pos = SELECTION_START;
				else
					pos = pos<0?SELECTION_START:pos;
				
				if (SELECTION_PART)
					element[0].setSelectionRange(pos,pos);
				BACKSPACE_SPACE = false;

				}
				
			element.on('keydown',function(e)
				{
				var pos = element[0].selectionStart;
				var val = element[0].value;

				if (e.keyCode==8)
					{	
				
					if (pos>0&&(val[pos-1]==' '))
						{
						SELECTION_PART = val.substr(pos-1);
						BACKSPACE_SPACE = true;						
						}
						
					
					}
				
				})


			function keyUp()
				{
				if (BACKSPACE_SPACE)
					return false;
				var pos = element[0].selectionStart;
				var val = element[0].value;
				SELECTION_PART = val.substr(pos,);

				//to catch selection if pos will be <0 and after comma
				SELECTION_START = element[0].selectionStart; 
					
				}
			
			
		
			element.on('blur',function()
				{
				var new_val = formatToInput(ngModel.$modelValue);
				ngModel.$viewValue = new_val;
				ngModel.$render();
					/*
				var val = ;
				if (!val) return false
				debugger;
				val_ = val.replace(/^[^1-9,]*(?:(?:(,\d{0,2}).*)|(?:([1-9][0-9]*)(,\d{0,2})*.*))*$/,'$1$2$3');

				
				ngModel.$viewValue = val_;
				ngModel.$commitViewValue();
				ngModel.$viewValue = val;
				render(val_);
					*/
				})
			
			
			//on blur should be to final checking
			//because if value is equal to 045,45 - it remains in model as 04545
			/*
			element.on('blur',function()
				{
				var val = ngModel.$modelValue;
				if (!val) return false
				debugger;
				val_ = val.replace(/^[^1-9,]*(?:(?:(,\d{0,2}).*)|(?:([1-9][0-9]*)(,\d{0,2})*.*))*$/,'$1$2$3');

				
				ngModel.$viewValue = val_;
				ngModel.$commitViewValue();
				ngModel.$viewValue = val;
				render(val_);
				
				})
			*/
				
			} 
		
		}	
		
	}
	
module.exports.$inject = ['$filter','$timeout','$compile'];