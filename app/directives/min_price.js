module.exports = function minPrice()
	{
		
	return {
		require:['^ngModel'],
		link:function($scope,elem,attrs,controllers)
			{
			var ngModel = controllers[0];
			
			var minValue = parseInt(attrs['minPrice']);
			
			ngModel.$validators['min-price'] = function(val)
				{
				if (val==0) return false;
				if (!val) return true;
				if (parseInt(val)<minValue)
					return false;
				
				return true;
				}
			
			}
		
		
		}
		
	}