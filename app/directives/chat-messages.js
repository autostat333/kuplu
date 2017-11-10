module.exports = function chatMessages($rootScope,$timeout,$filter)
	{

	return {
		priority:100,
		compile:function()
			{
			
			return {
				pre:function($scope,elem,attrs)
					{
					
					$scope.initMessage = initMessage;
					$scope.sendMess = sendMess;
					$scope.getActiveUser = getActiveUser;
					$scope.pickUser = pickUser;
					$scope.scrollToBottom = scrollToBottom;
					$scope.advertHistoryClick = advertHistoryClick;
					$scope.resizeAdvert = resizeAdvert;
					$scope.showHistorySplitter = showHistorySplitter;
					
									
					$scope.init = init;
					
					$scope.init();
					
					function init()
						{
						$scope.messSpinner = false;
						
						if ($scope.advert['Users']&&$scope.advert['Users'].length)
							$scope.pickUser($scope.advert['Users'][0]);
						
						}
									
					function initMessage()
						{
						$scope.message = $scope.advert.$createMessage();
						$scope.message.to = $rootScope.USER._id==$scope.advert.Owner?$scope.getActiveUser($scope.advert)['_id']:$scope.advert['Owner'];
						}
						
						
					function getActiveUser(advert)
						{
						var user;
						advert = advert||$scope.advert;
						if (!advert['Users']) return {'visibleName':''};
						for (var i=0;user = advert['Users'][i++];)
							{
							if (user['messagesVisible'])
								return user;
							}
							
						}
		

					function pickUser(user)
						{
						$scope.advert['Users'].map(function(user_)
							{
							if (user_['_id']==user['_id'])
								user_['messagesVisible'] = true;
							else
								user_['messagesVisible'] = false;
							})
						
						$scope.scrollToBottom(user);
						$scope.initMessage();
						}

						
					function scrollToBottom(user)
						{
						
						setTimeout(function()
							{
							var elem_ = $(elem).find('[user-id='+user['_id']+']');
							var scrollHeight = elem_[0].scrollHeight;
							elem_.scrollTop(scrollHeight);
							},0);
							
							 
						}


		
						
					function sendMess(advert,user)
						{
						if (!$scope.message['text'])
							return false;
						
						$scope.messSpinner = true;
						
						$scope.message.$send().then(function(response)
							{
							$timeout(function(){$scope.messSpinner = false},700);

							if ($scope.destroyed) return false;
								
							if (response.Error) return false;
							
							$scope.initMessage();
							$scope.scrollToBottom($scope.getActiveUser(advert));
							})
						}

						
					function advertHistoryClick()
						{
						if (!$scope.elem) $scope.elem = $(elem).find('.advert');
						
						if ($scope.showAdvert)
							$scope.resizeAdvert();
						else
							{
							//elem.animate({'height':45});
							$scope.elem.css({'height':45});
							}
							
						}
						
					function resizeAdvert(messages)
						{
						$timeout(function()
							{
							var height = $scope.elem[0].scrollHeight;
							if (messages)
								height+=200;
							//elem.animate({'height':height},100);
							$scope.elem.css({'height':height});
							},0)										
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
			
				
					}
				
				
				}
				
			}
			
		}
		
		
	}
	
module.exports.$inject = ['$rootScope','$timeout','$filter'];