module.exports = function CurrencyMask($filter,$timeout)
	{
	return {
		
		require:['ngModel'],
		link:function(scope,element, attr,ngModel)
			{
				
			ngModel = ngModel[0];
			var SET_CURSOR = false;
			//var CURRENCY_LABEL = ' грн';
			var CURRENCY_LABEL = ' '+attr['currencyLabel'];
			var SELECTION_START = ''; //current cursor position
			
			
			scope.$watch(attr['test'],function(new_val,old_val){console.log(new_val,old_val)});
			
			//runs for setting INPUT value
			ngModel.$formatters.push(function(val)	
				{
				if (!val)return '';
				val = formatter(val);
				var pattern = new RegExp(CURRENCY_LABEL,'g');
				val = val.replace(pattern,'')+CURRENCY_LABEL;
				return val;
				})

				
			//runs for setting NgMODEL
			ngModel.$parsers.push(function(val)	
				{
				SELECTION_START = element[0].selectionStart;

				$timeout((function(){render(val)})(),0);
				return formatter(val);
				})

				
				
			//logic for ng-currency formatting
			function formatter(val)
				{
				val = val.replace(/[^\d,.]*([\d,|.]*)/g,'$1');
				return val;
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
					
				setTimeout(setCursor,0); //!!!WE DONOT NEED APPLY() HERE
				}
				
			function setCursor()
				{
				var pos = ngModel.$viewValue.length - CURRENCY_LABEL.length;
				var cur_pos = element[0].selectionStart;
				if (cur_pos>pos)
					{
					if (SELECTION_START<pos)
						element[0].setSelectionRange(SELECTION_START,SELECTION_START);
					else
						element[0].setSelectionRange(pos,pos);
					}
				
				} 
				
			element.on('focus',function()
				{
				setTimeout(function() //to catch cursor position after focus
					{
					SELECTION_START = element[0].selectionStart;
					setCursor();						
					},0)

				})
				
				
			}
		
		}	
		
	}
	
module.exports.$inject = ['$filter','$timeout'];