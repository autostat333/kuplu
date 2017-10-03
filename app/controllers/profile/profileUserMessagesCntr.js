module.exports.$inject = ['$scope','$timeout'];
module.exports = function ProfileUserInfoCntr($scope,$timeout)
	{
	
	$scope.init = init;
	$scope.personClick = personClick;
	$scope.advertHistoryClick = advertHistoryClick;
	$scope.personClick_top = personClick_top;
	
	$scope.init();
	
	function init()
		{
		console.log('User Info');
			
		}
		
		
		
	function personClick_top(findChat,personName,e)
		{
		if (e) e.stopPropagation();

        $('.right .top .name').html(personName);
        $('.chat').removeClass('active-chat');
		
        $('.left .person').removeClass('active');
		
        $($('li[data-chat='+findChat+']')[0]).addClass('active');
		
		
		var elem = $($('.chat[data-chat = '+findChat+']')[0]);
		
		elem.addClass('active-chat');

		setTimeout(function()
			{
			var scrollHeight = elem[0].scrollHeight;
			elem.scrollTop(scrollHeight);
			},0);
		
			
		}
		
		
			
	function personClick(idx, findChat,personName,e)
		{
		if (e) e.stopPropagation();
			
        $('.right .top .name').html(personName);
        $('.chat').removeClass('active-chat');
		
        $('.left .person').removeClass('active');
		
        $($('li[data-chat='+findChat+']')[idx]).addClass('active');
		
		
		var elem = $($('.chat[data-chat = '+findChat+']')[idx]);
		
		elem.addClass('active-chat');

		setTimeout(function()
			{
			var scrollHeight = elem[0].scrollHeight;
			elem.scrollTop(scrollHeight);
			},0);
		
			
		}
		
		
	
		
	function advertHistoryClick(idx,active)
		{
		
		var elem = $('.month_container .advert')[idx];
		elem = $(elem);
		if (active)
			{
			$timeout(function()
				{
				var height = elem[0].scrollHeight;
				//elem.animate({'height':height},100);
				elem.css({'height':height});
				},0)				
			}
		else
			{
			//elem.animate({'height':45});
			elem.css({'height':55});
				
			}
			
		}		
		
		
	}
	
