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
					var padding = $(element.parent('md-input-container')[0]).find('.currency_label').width();
					element.css('padding-right',padding);
					})
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
				
				$timeout(function(){render(val)},0);
				return formatToModel(val);
				})

				
				
			//logic for ng-currency formatting
			function formatToModel(val)
				{
				//debugger;
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
					
				return val;
				}
			
			function formatToInput(val)
				{
				var val_org = val;
				val = formatToModel(val);
				if (!val)return val;
				val = val/100;
				val = val.toString().replace('.',',');
				if (val.indexOf(',')!=-1)
					val = val.replace(/(\d)(?=(\d\d\d)+,)|(,\d{0,2}).*/g,'$1$3 ');
				else
					val = val.replace(/(\d)(?=(\d\d\d)+$)/g,'$1 ');
				
				//check whether end of typied value equal contains ',', to render values like '1,'
				//where after comma no any digits
				if (val_org.indexOf(',')!=-1&&val.indexOf(',')==-1)
					val = val+',';
					
				if (val_org=='0,0') return '0,0'; //only hardcode for value 0,0
				
				return val.trim();
				}
			
			
			//render nesseccary (taken from ngModelWatch source code)
			function render(modelValue)
				{
				var formatters = ngModel.$formatters,
				idx = formatters.length;

				var viewValue = modelValue;
				while (idx--) 
					{
					viewValue = formatters[idx](viewValue);
					}
					
				if (ngModel.$viewValue !== viewValue) //after replacing all symbols - not equal to current val of input
					{
					ngModel.$$updateEmptyClasses(viewValue);
					ngModel.$viewValue = ngModel.$$lastCommittedViewValue = viewValue;
					ngModel.$render();
					//set new cursor position (equal to previous)

					// It is possible that model and view value have been updated during render
					ngModel.$$runValidators(ngModel.$modelValue, ngModel.$viewValue, function(){});
					}
					

				setCursor();
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
						SELECTION_PART = val.substr(pos-1,);
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