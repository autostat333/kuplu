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
				
				$timeout(function(){$scope.spinner = false},2000);
				
				}
			
			function stopPropagation(e)
				{
				e.stopPropagation();
				}
			
			
			
			
			
			
				
			},
		restrict:'E',
		template:''+
			''+
			'<div class="chat_container"'+
			'	ng-click="stopPropagation($event)"'+
			'	>'+
			'	<myspinner class="history on" ng-class="{\'on\':spinner,\'off\':!spinner}"></myspinner>'+
			''+
			'	<div class="container_"'+
			'		ng-show="!spinner"'+
			'		>'+
			'		<div class="right">'+
			'			<div class="top"><span>To: <span class="name">Dog Woofson</span></span></div>'+
			'			<div class="chat active-chat" data-chat="person3Q" perfect-scrollbar>'+
			'			'+
			'			'+
			'				<div class="conversation-start">'+
			'					<span>Today, 3:38 AM</span>'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Hey human!'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Umm... Someone took a shit in the hallway.'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					... what.'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					Are you serious?'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					I mean...'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					It’s not that bad...'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					But we’re probably gonna need a new carpet.'+
			'				</div>'+
			'				<div class="conversation-start">'+
			'					<span>Today, 3:38 AM</span>'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Hey human!'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Umm... Someone took a shit in the hallway.'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					... what.'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					Are you serious?'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					I mean...'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					It’s not that bad...'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					But we’re probably gonna need a new carpet.'+
			'				</div>'+
			'				'+
			'				'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'</div>'
		
		
		
		
		}
		
	}