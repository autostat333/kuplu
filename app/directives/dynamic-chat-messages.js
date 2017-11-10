module.exports.$inject = ['$timeout'];
module.exports = function dynamicChat($timeout)
	{
	return {
		link:function($scope,elem,attrs)
			{
				
			$scope.init = init;
			$scope.resizeAdvert = resizeAdvert;
			$scope.scrollToBottom = scrollToBottom;
			
			$scope.$on('$destroy',function ()
				{
				$scope.advertElem.attr('style','');
				})
			
			
			$scope.init();
			
			function init()
				{
				$scope.spinner = true;
				$scope.advertElem = $(elem).parent();
				$scope.resizeAdvert();
				
				$scope.advert.$completeWithMessages().then(function()
					{
					$timeout(function(){$scope.spinner = false;},200)
					$scope.scrollToBottom();
					})
				
				
				}
			
			
			
							
			function scrollToBottom()
				{
				
				setTimeout(function()
					{
					var elem_ = $(elem).find('.chat');
					var scrollHeight = elem_[0].scrollHeight;
					elem_.scrollTop(scrollHeight);
					},0);
					
					 
				}



			function resizeAdvert()
				{
				$timeout(function()
					{
					var heightAdvertHead = $scope.advertElem.find('.for_flex')[0].scrollHeight;
					var height = heightAdvertHead+$(elem).height();
					$scope.advertElem.css({'height':height});
					},0)										
				}

			
			
			
				
			},
		restrict:'E',
		template:''+
			''+
			'<div class="chat_container"'+
			'	>'+
			'	<myspinner class="history on" ng-class="{\'on\':spinner,\'off\':!spinner}"></myspinner>'+
			''+
			'	<div class="container_">'+
			'		<div class="right">'+
			'			<div class="top"><span>To: <span class="name">{{advert[\'OwnerObj\'][\'visibleName\']}}</span></span></div>'+
			'			<div class="chat active-chat" perfect-scrollbar>'+
			'			'+
			'				<div class="conversation-start">'+
			'					<span>Today, 3:38 AM</span>'+
			'				</div>'+
			'				<div class="bubble"'+
			'					ng-class="{\'you\':message[\'from\']==$root.USER._id,\'me\':message[\'from\']!=$root.USER._id}"'+
			'					ng-repeat="message in advert[\'Messages\'][$root.USER._id]"'+
			'					>'+
			'					{{message[\'text\']}}'+
			'				</div>'+
			'		</div>'+
			'	</div>'+
			'</div>'
		
		
		
		
		}
		
	}