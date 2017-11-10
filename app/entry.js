
/*
$('.spinner_container').animate({'opacity':0},1000,'linear',function(el)
    {
    $(this).remove();
    });
*/
setTimeout(function()
	{
	$('html').scrollTop(0);
	},0);

//plug when must be iddle function
function noop(){};



angular.module('app',['ui.router','ngMaterial','ngMessages','angular-jwt','cl.paging'])
	.config(require('./routes.js'))
	
	
	.factory('$models',require('./factory/models.js')) //factory for models for managing datasets
	
	.directive('owlCarousel',require('./directives/owl_carousel.js'))
	.directive('typedJs',require('./directives/typed-js.js'))
	.directive('currencyMask',require('./directives/currency_mask.js'))
	.directive('enterPress',require('./directives/enter_press.js'))
	.directive('myAutofocus',require('./directives/autofocus.js'))
	.directive('phoneMask',require('./directives/phone_mask.js'))
	.directive('minLength',require('./directives/minLength.js'))
	.directive('phoneValidator',require('./directives/phoneValidator.js'))
	.directive('perfectScrollbar',require('./directives/perfect-scrollbar.js'))
	.directive('dynamicChat',require('./directives/dynamic-chat.js'))
	.directive('dynamicChatMessages',require('./directives/dynamic-chat-messages.js'))
	.directive('maxPrice',require('./directives/max_price.js'))
	.directive('minPrice',require('./directives/min_price.js'))
	.directive('chatMessages',require('./directives/chat-messages.js'))
	
	
	//MAIN controller + 2 views (form advert and advert list)
	.controller('mainCntr',require('./controllers/main/mainCntr.js'))
	.controller('advertsWrapCntr',require('./controllers/adverts/advertsWrapCntr.js'))
	.controller('advertMainFormCntr',require('./controllers/adverts/advertMainFormCntr.js'))
	.controller('advertListCntr',require('./controllers/adverts/advertsListCntr.js'))
	.controller('advertModalSendMessCntr',require('./controllers/adverts/advertModalSendMess.js'))
	
	//login cntr (for MODAL)
	.controller('loginCntr',require('./controllers/loginModal/loginModalCntr.js'))
	
	//MODALS
	.controller('advertModalPreviewCntr',require('./controllers/adverts/advertModalPreviewCntr.js'))
	
	//PROFILE SECTION (route + tabs)
	.controller('profileCntr',require('./controllers/profile/profileCntr.js'))
	.controller('profileUserInfoCntr',require('./controllers/profile/profileUserInfoCntr.js'))
	.controller('profileUserIntentionsCntr',require('./controllers/profile/profileUserIntentionsCntr.js'))
	.controller('profileUserMessagesCntr',require('./controllers/profile/profileUserMessagesCntr.js'))
	.controller('profileModalAddAvatar',require('./controllers/profile/ModalAddAvatar.js'))
	.controller('profileModalEditAdvertCntr',require('./controllers/profile/ModalEditAdvertCntr.js'))
	
	
	
	//service/provider to manage account (login, signUP, interceptors),
	//provider - because it contains interceptor which must be pushed to interceptors in config.
	//to config I can pass only providers
	.provider('$account',require('./services/account.js')) 
	
	
	//filter for currency
	.filter('mycurrency',require('./filters/my_currency.js'))
	
	
	.run(require('./run.js'))




	