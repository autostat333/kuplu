module.exports = function minLengthDirective()
	{
	return {
		require:['ngModel'],
		link:function($scope,elem,attrs,cntr)
			{
			var ngModel = cntr[0];
			//bellow param to control whether "0" length is allowed
			//when user input smth - i should control length
			//but I can allow nohting for input
			var notRequired = attrs['minLengthNotRequired']; 
			
			
			ngModel.$validators['min-length'] = function(val)
				{	
				if (typeof val=='string'&&val.length<attrs['minLength'])
					if ((notRequired==''||notRequired==true)&&val.length==0)
						return true;
					else
						return false;
					
				return true;
				}
				
			}
		
		
		
	}
		
		
		
	}