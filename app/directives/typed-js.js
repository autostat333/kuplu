module.exports = function($timeout)
	{
	return {
		
	link:function($scope,element, attr)
		{
		$timeout(init,0);
		function init()
			{
			Typed.new('#'+element[0].id,{
				'strings':['Test','Buy ^200some goods'],
				'loop':true,
				'fadeOut':false,
				
				})
			}
			
		}
		
	}
		
		
		
	}
	
module.exports.$inject = ['$timeout'];
	
