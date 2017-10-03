module.exports = function($stateProvider, $urlRouterProvider,$httpProvider,$accountProvider,$mdDialogProvider)
	{

	//set interceptor for auth
	$httpProvider.interceptors.push($accountProvider.interceptor);
	
	
	
	
	//common OK modal preset
	$mdDialogProvider.addPreset('okPopup', {
		methods:['title'],
		
		options: function() {
			
			function confirmModalCntr($mdDialog)
					{
					this.hide = function(){$mdDialog.hide();}
					};
					
			confirmModalCntr.$inject = ['$mdDialog'];
			
			return { 
				template:
					'<md-dialog'+
					'	class="_md md-default-theme md-transition-in confirmdialog"'+
					'	tabindex="-1"'+
					'	role="alertdialog"'+
					'	>'+
					'	<md-dialog-content '+
					'		class="md-dialog-content" '+
					'		tabindex="-1" '+
					'		>'+
					'	<h2 class="md-title ng-binding">{{dialog.title}}</h2>'+
					'	</md-dialog-content>'+
					'	'+
					'	<md-dialog-actions>'+
					'	<button '+
					'		class="md-primary md-confirm-button md-button md-autofocus md-ink-ripple md-default-theme"'+
					'		type="button"'+
					'		ng-click="dialog.hide()" '+
					'		>'+
					'		<span>ОК</span>'+
					'	</button>	'+
					'	</md-dialog-actions>'+
					''+
					'</md-dialog>',

				controllerAs: 'dialog',
				clickOutsideToClose: true,
				escapeToClose: true,
				controller:confirmModalCntr,
				bindToController:true,
				multiple:true
				};
			}
		});
	
	
	
	
    $urlRouterProvider
    	.otherwise('/main/adverts')
		.when('/main','/main/adverts')
		.when('/','/main/adverts')
		.when('','/main/adverts')


    $stateProvider
    .state('main',
        {
        templateUrl:'./views/main/main.html',
        controller:'mainCntr',
        url:'/main'
        })


        //CHILDS
        .state('main.adverts',
            {
			url:'',
			controller:'advertsWrapCntr',
			templateUrl:'./views/adverts/advertsWrap.html'
            })
			
		//CHILDS
        .state('main.adverts.views',
            {
			url:'/adverts',
			views:{
				advertMainForm:{
					templateUrl:'./views/adverts/advertMainForm.html',
					controller:'advertMainFormCntr'
					},
				advertsList:{
					templateUrl:'./views/adverts/advertsList.html',
					controller:'advertListCntr',
					}
					
				}
            })
			

			
	.state('main.profile',
		{
		url:'/profile',
		controller:'profileCntr',
		templateUrl:'./views/profile/profile.html'  
		})
		
		.state('main.profile.userInfo',
			{
			templateUrl:'./views/profile/profileUserInfo.html',	
			controller:'profileUserInfoCntr',
			url:'/info'
			})

		.state('main.profile.userIntentions',
			{
			templateUrl:'./views/profile/profileUserIntentions.html',	
			controller:'profileUserIntentionsCntr',
			url:'/intetions'
			})
		.state('main.profile.userMessages',
			{
			templateUrl:'./views/profile/profileUserMessages.html',	
			controller:'profileUserMessagesCntr',
			url:'/messages'
			})

		
    }

module.exports.$inject = ['$stateProvider', '$urlRouterProvider','$httpProvider','$accountProvider','$mdDialogProvider'];