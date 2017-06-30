module.exports = function($timeout)
	{
	return {
		
	link:function($scope,element, attr)
		{
		$timeout(init,0);
		function init()
			{
			Typed.new('#'+element[0].id,{
				'strings':attr['text'].split(';'),
				'loop':true,
				'fadeOut':false,
				
				})
			}
			
		}
		
	}
		
		
		
	}
	
module.exports.$inject = ['$timeout'];
	
