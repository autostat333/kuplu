module.exports.$inject = ['$http','$templateCache','$templateRequest','$timeout','$rootScope','$state']
module.exports = function runBlock($http,$templateCache,$templateRequest,$timeout,$rootScope,$state)
	{
		
	$rootScope.$on('$stateChangeStart',function(event,toState)
		{
		if (!window.localStorage.getItem('token')&&toState.name.indexOf('main.profile')==0)
			{
			$state.go('main');
			event.preventDefault();	
			}
			
			
		})
		
	//fetch requests for small templates (to complete templateCache)
	//templateCache used in ui-router (???I believe) and in mdModal.show()
	$templateRequest('./views/loginModal/loginModal.html');
	$templateRequest('./views/profile/profileUserInfo.html');
	$templateRequest('./views/profile/profileUserIntentions.html');
	$templateRequest('./views/profile/profileUserMessages.html');
	$templateRequest('./views/adverts/advertModalPreview.html');


	}

