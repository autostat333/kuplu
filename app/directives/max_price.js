module.exports = function maxPrice()
	{
		
	return {
		require:['^ngModel'],
		link:function($scope,elem,attrs,controllers)
			{
			var ngModel = controllers[0];
			
			var maxValue = parseInt(attrs['maxPrice']);
			
			ngModel.$validators['max-price'] = function(val)
				{
				if (!val) return true;
				if (parseInt(val)>maxValue)
					return false;
				
				return true;
				}
			
			}
		
		
		}
		
	}