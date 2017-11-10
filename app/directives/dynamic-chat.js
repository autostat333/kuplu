module.exports.$inject = ['$timeout'];
module.exports = function dynamicChat($timeout)
	{
	return {
		link:function($scope,elem,attrs)
			{
				
			$scope.init = init;
			$scope.stopPropagation = stopPropagation;
			
			
			$scope.init();
			
			function init()
				{
				$scope.spinner = true;
				$scope.messagesClass='';
				
				//$timeout(function(){$scope.spinner = false},2000);
				$scope.advert.$completeWithMessages().then(function(response)
					{
					$scope.spinner = false;
					if ($scope.advert['Users']&&$scope.advert['Users'].length)
						{
						$scope.pickUser($scope.advert['Users'][0]);	
						$scope.resizeAdvert('messages');
						$scope.messagesClass='messages';

						}
						
					})
				
				}
			
			function stopPropagation(e)
				{
				e.stopPropagation();
				}
			
			
			
			
			
			
				
			},
		restrict:'E',
		template:''+
			''+
			'<div class="chat_container {{messagesClass}}"'+
			'	ng-click="stopPropagation($event)"'+
			'	>'+
			'	<myspinner class="history on" ng-class="{\'on\':spinner,\'off\':!spinner}"></myspinner>'+
			''+
			'	<div'+
			'		ng-show="!spinner&&!advert.Users.length"'+		
			'		>'+
			'		<span class="no_messages">Нет сообщений по даному намерению!'+
			'	</div>'+
			''+
			'	<div class="container_"'+
			'		ng-show="!spinner&&advert[\'Users\'].length"'+
			'		>'+
			'		<div class="left" perfect-scrollbar>'+
			'			<ul class="people">'+
			'				<li class="person"'+
			'					ng-repeat="user in advert[\'Users\']"'+
			'					ng-click="pickUser(user)"'+
			'					ng-class="{\'active\':user[\'messagesVisible\']}"'+
			'					>'+
			'					<img ng-src="{{user[\'avatarUrl\']}}" alt="" />'+
			'					<span class="name">{{user[\'visibleName\']}}</span>'+
			'				</li>'+
			'				'+
			'			</ul>'+
			'		</div>'+
			'		<div class="right">'+
			'			<div class="top"><span>To: <span class="name">{{getActiveUser(advert)[\'visibleName\']}}</span></span></div>'+
			'			<div class="chat active-chat" perfect-scrollbar'+ 
			'				ng-repeat="user in advert[\'Users\']"'+
			'				user-id={{user[\'_id\']}}'+
			'				ng-if="user[\'messagesVisible\']"'+
			'				>'+
			'			'+
			'			'+
			'				<div class="conversation-start">'+
			'					<span>Today, 6:48 AM</span>'+
			'				</div>'+
			'				<div class="bubble"'+
			'					ng-class="{\'you\':message[\'from\']==$root.USER._id,\'me\':message[\'from\']!=$root.USER._id}"'+
			'					ng-repeat="message in user.messages"'+
			'					>'+
			'					{{message[\'text\']}}'+
			'				</div>'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'</div>'
		
		
		
		
		}
		
	}