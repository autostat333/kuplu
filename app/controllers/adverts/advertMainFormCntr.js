//MAIN controller
//responsible for:
//  - determining current day (CURRENT_DAY gloabal object)
//    it is also runs callback every minute for refresh current time
//  - all handlers for clicking on toolbar
//
module.exports.$inject = ['$scope','$filter','$timeout','$models','$mdDialog','$templateCache','$account','$rootScope'];
module.exports = function AdvertMainFormCntr($scope,$filter,$timeout,$models,$mdDialog,$templateCache,$account,$rootScope)
	{

	$scope.init = init;
	$scope.check_error = check_error;
	$scope.selectInputText = selectInputText;
	$scope.submitAdvert = submitAdvert;
	$scope.openPreview = openPreview;
	$scope.createAdvert = createAdvert;


	
	//watch whether price toogled to per unit
	//to fire autofocus
	$scope.$watch('newAdvert["IsPricePerUnit"]',watcherIsPricePerUnit); 
	$scope.$watchGroup(['selectedRegion','selectedCity'],watcherGeo);

	$scope.init();


	function init()
		{
		
		$scope.onceFocused = false; //to control focused input field and show toggle for total price or per unit		
		$scope.newAdvert = $scope.ADVERTS.$createBlank();
		
		
		$scope.selectedRegion = '';
		$scope.selectedCity = '';
		}

		

	function check_error(name)
		{
		
		if (name=='all')
			{
			//run over all fields
			var fields = Object.keys($scope.advert_form).filter(function(el){return el.indexOf('$')!=0});

			for (var i=0;el=$scope.advert_form[fields[i++]];)
				{
				if (Object.keys(el.$error).length!=0)
					return true;
				}
			return false;
			}
			
		return Object.keys($scope.advert_form[name].$error).length!=0;
		}
	
	
	function selectInputText(name)
		{
		if (!name)return false;
		$('input[name='+name+']').select();
		}
	
	
	
	function watcherIsPricePerUnit(new_val,old_val)
		{
		if (new_val&&new_val!=old_val)
			$timeout(function()
				{
				$('input[name=priceUnit]')[0].focus();
				$scope.selectInputText('priceUnit'); 
				},500);
		}
	

	function submitAdvert() 
		{
		if ($scope.check_error('all'))
			return false;
		
		if ($scope.newAdvert.isEmpty())
			return false;

		if (!$rootScope.USER)
			$scope.login().then($scope.createAdvert);
		else
			$scope.createAdvert();
		}
	
	
	function createAdvert()
		{
		$scope.openPreview().then(function()
			{
			$scope.spinner = 'global';
			$scope.newAdvert.$add().then(function(response)
				{
				if (response.Error=='')
					{
					//timeout - to give some ms for hiding spinner
					$timeout(function()
						{
						$scope.spinner = false;
						$mdDialog.show($mdDialog
							.okPopup()
							.title('Ваше намерение сохранено успешно!')
							);
						$scope.init();
						$scope.newAdvert.$restartOnceCompleted();
						$scope.advert_form.$setUntouched();
						$scope.ADVERTS.$get($scope.PARAMS);
						},500);
					}
				else
					$scope.spinner = false;
											
				});
			})		
		}
	
	
	function openPreview()
		{
		return $mdDialog.show({
			templateUrl:'./views/adverts/advertModalPreview.html',
			controller:'advertModalPreviewCntr',
			scope:$scope.$new(),
			clickOutsideToClose:true,
			scapeToClose:true,
			multiple:true,
			})
			
		}
	
	
	
	function watcherGeo(newVal,oldVal)
		{		
		if (!newVal[0])
			$scope.newAdvert['Region'] = '';
		else
			{	
			var region = {};
			region['name'] = $scope.selectedRegion['name']
			region['_id'] = $scope.selectedRegion['_id'];
			$scope.newAdvert['Region'] = region;
			}
	
		if (!newVal[0])
			$scope.newAdvert['City'] = '';	
		else
			$scope.newAdvert['City'] = newVal[1];
			
		}
	
	
	}


