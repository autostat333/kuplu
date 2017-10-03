module.exports.$inject = ['$scope','$mdDialog'];
module.exports = function advertModalPreviewCntr($scope,$mdDialog)
	{
		
	$scope.init = init;
	$scope.closeModal = closeModal;
	$scope.submit = submit;
	
	$scope.init();
	
	$scope.$on('$destroy',function()
		{
		
		})
	
	function init()
		{
		$scope.created = (new Date())*1;
			
		}
		
	function submit()
		{
		$mdDialog.hide();
		}
	
		
	function closeModal()
		{
		$mdDialog.cancel();
		}
	
		
	}