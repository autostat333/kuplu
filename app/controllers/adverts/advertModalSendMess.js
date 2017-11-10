module.exports = function advertModalSendMessage($scope,$mdDialog,advert,$rootScope,$models)
	{
	
	$scope.init = init;
	$scope.closeModal = closeModal;
	$scope.send = send;

	$scope.init();
	
	
	$scope.$on('$destroy',function()
		{
		$scope.destroyed = true;
		})
	
	
	function init()
		{

		$scope.advert = advert;
		$scope.message = $scope.advert.$createMessage();
		$scope.message.to = $scope.advert['Owner'];
		
		}
	  
		
		
	function send()
		{
		if ($scope.formMess.$invalid) return false;

		$scope.spinner = true;
		
		$scope.message.$send().then(function(response)
			{
			if ($scope.destroyed) return false;
			
			$scope.spinner = false;
			if (response.userError) 
				{
				$mdDialog.show($mdDialog
					.alert()
					.title('Гоп стоп,')
					.content(response.Error)
					.ok('Закрыть')
					).then(function(){$mdDialog.hide()})
				return false;
				}
				
			if (response.Error) 
				{
				$mdDialog.hide();
				return false;	
				}
			//success message
			$mdDialog.hide();
			$mdDialog.show($mdDialog
				.okPopup()
				.title('Ваше сообщение отправлено успешно!')
				)
			
			})
			
		}
		
		
	function closeModal()
		{
		$mdDialog.cancel();
			
		}
		
	}
	
	
module.exports.$inject = ['$scope','$mdDialog','advert','$rootScope','$models'];