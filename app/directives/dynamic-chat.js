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
			'		<div class="left" perfect-scrollbar>'+
			'			<ul class="people">'+
			'				<li class="person" data-chat="person1Q"'+
			'					ng-click="personClick($index,\'person1Q\',\'Thomas Bangalter\',$event)"'+
			'					>'+
			'					<img src="https://s13.postimg.org/ih41k9tqr/img1.jpg" alt="" />'+
			'					<span class="name">Thomas Bangalter</span>'+
			'				</li>'+
			'				<li class="person" data-chat="person2Q"'+
			'					ng-click="personClick($index,\'person2Q\',\'Dog Woofson\',$event)"'+
			'					>'+
			'					<img src="https://s3.postimg.org/yf86x7z1r/img2.jpg" alt="" />'+
			'					<span class="name">Dog Woofson</span>'+
			'				</li>'+
			'				<li class="person" data-chat="person3Q"'+
			'					ng-click="personClick($index,\'person3Q\',\'Louis CK\',$event)"'+
			'					>'+
			'					<img src="https://s3.postimg.org/h9q4sm433/img3.jpg" alt="" />'+
			'					<span class="name">Louis CK</span>'+
			'				</li>'+
			'				<li class="person" data-chat="person4Q"'+
			'					ng-click="personClick($index,\'person4Q\',\'Bo Jackson\',$event)"'+
			'					>'+
			'					<img src="https://s3.postimg.org/quect8isv/img4.jpg" alt="" />'+
			'					<span class="name">Bo Jackson</span>'+
			'				</li>'+
			'				<li class="person" data-chat="person5Q"'+
			'					ng-click="personClick(\'person5Q\',\'Michael Jordan\',$event)"'+
			'					>'+
			'					<img src="https://s16.postimg.org/ete1l89z5/img5.jpg" alt="" />'+
			'					<span class="name">Michael Jordan</span>'+
			'				</li>'+
			'				<li class="person" data-chat="person6Q"'+
			'					ng-click="personClick($index,\'person6Q\',\'Drake\',$event)"'+
			'					>'+
			'					<img src="https://s30.postimg.org/kwi7e42rh/img6.jpg" alt="" />'+
			'					<span class="name">Drake</span>'+
			'				</li>'+
			'				'+
			'			</ul>'+
			'		</div>'+
			'		<div class="right">'+
			'			<div class="top"><span>To: <span class="name">Dog Woofson</span></span></div>'+
			'			<div class="chat" data-chat="person1Q" perfect-scrollbar>'+
			'			'+
			'			'+
			'				<div class="conversation-start">'+
			'					<span>Today, 6:48 AM</span>'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Hello,'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					its me.'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					I was wondering...'+
			'				</div>'+
			'				'+
			'			</div>'+
			'			<div class="chat" data-chat="person2Q" perfect-scrollbar>'+
			'				<div class="conversation-start">'+
			'					<span>Today, 5:38 PM</span>'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Hello, can you hear me?'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Im in California dreaming'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					... about who we used to be.'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					Are you serious?'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					When we were younger and free...'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Ive forgotten how it felt before'+
			'				</div>'+
			'			</div>'+
			'			'+
			'			'+
			'			'+
			'			<div class="chat" data-chat="person3Q" perfect-scrollbar>'+
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
			'			<div class="chat" data-chat="person4Q" perfect-scrollbar>'+
			'				<div class="conversation-start">'+
			'					<span>Yesterday, 4:20 PM</span>'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					Hey human!'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					Umm... Someone took a shit in the hallway.'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					... what.'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Are you serious?'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					I mean...'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					It’s not that bad...'+
			'				</div>'+
			'			</div>'+
			'			<div class="chat" data-chat="person5Q">'+
			'				<div class="conversation-start">'+
			'					<span>Today, 6:28 AM</span>'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Wasup'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Wasup'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					Wasup for the third time like is <br />you blind bitch'+
			'				</div>'+
			''+
			'			</div>'+
			'			<div class="chat" data-chat="person6Q" perfect-scrollbar>'+
			'				<div class="conversation-start">'+
			'					<span>Monday, 1:27 PM</span>'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					So, hows your new phone?'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					You finally have a smartphone :D'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					Drake?'+
			'				</div>'+
			'				<div class="bubble me">'+
			'					Why arent you answering?'+
			'				</div>'+
			'				<div class="bubble you">'+
			'					howdoyoudoaspace'+
			'				</div>'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'</div>'
		
		
		
		
		}
		
	}