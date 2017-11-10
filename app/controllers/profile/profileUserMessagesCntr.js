module.exports = function ProfileUserInfoCntr($scope,$timeout,$models,$q)
	{
	
	$scope.init = init;
	$scope.personClick = personClick;
	$scope.advertHistoryClick = advertHistoryClick;
	$scope.personClick_top = personClick_top;
	$scope.createMessage = createMessage;
	$scope.sendMess = sendMess;
	$scope.pickAdvert = pickAdvert;
	$scope.showHistorySplitter = showHistorySplitter;
	
	$scope.init();
	
	function init()
		{
		
		$scope.ADVERTS = $models('adverts');
		$scope.ADVERTS_HISTORY = $models('adverts');
		
		$scope.spinner = true;
		
		
		$q.all([
				$scope.ADVERTS.$get({'filtring':{'relatedToUser':true}}),
				$scope.ADVERTS_HISTORY.$get({'filtring':{'relatedToUser':true,'history':true}})
				]).then(function()
				{
				if ($scope.ADVERTS.data.length)
					$scope.pickAdvert($scope.ADVERTS.data[0]);
				$scope.spinner = false;
				
				//set visibility flag to the history adverts
				$scope.ADVERTS_HISTORY.data.map(function(el)
					{
					el['isVisible'] = false;
					})
				
				})
			
		}
		
		
		
	function pickAdvert(advert)
		{
		$scope.ADVERTS.data.map(function(el){el.isVisible = false})
		advert['isVisible'] = true;
		$scope.createMessage(advert);
		setTimeout(function()
			{
			var elem = $('.chat');
			var scrollHeight = elem[0].scrollHeight;
			elem.animate({'scrollTop':scrollHeight});
			},100);
		}
		
		
	function createMessage(advert)
		{
		$scope.message = advert.$createMessage();
		$scope.message['to'] = advert['Owner'];
		}
		 
		 
		
	function sendMess(advert)
		{
		$scope.messSpinner = true;
		$scope.message.$send().then(function()
			{
			$scope.messSpinner = false;
			$scope.pickAdvert(advert);
			})
		}
		
		
		
	function showHistorySplitter(idx)
		{
		if (!$scope.ADVERTS_HISTORY||!$scope.ADVERTS_HISTORY['data']) return false;
		if (idx===0)
			return true;
			
		if (idx)
			{
			if ($scope.ADVERTS_HISTORY.data[idx]['dateForHistorySplitter']!=$scope.ADVERTS_HISTORY.data[idx-1]['dateForHistorySplitter'])
				return true;
			}
		
		return false;
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
	
module.exports.$inject = ['$scope','$timeout','$models','$q'];
	
