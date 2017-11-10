module.exports = function maxValue()
	{
		
	return {
		require:['^ngModel'],
		link:function($scope,elem,attrs,controllers)
			{
			var ngModel = controllers[0];
			
			var maxValue = parseInt(attrs['maxValue']);
			
			ngModel.$validators['max-value'] = function(val)
				{
				if (!val) return true;
				if (parseInt(val)>maxValue) 
					return false;
				
				return true;
				}
			
			}
		
		
		}
		
	}