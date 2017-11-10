module.exports = function ProfileUserInfoCntr($scope,$account,$rootScope,$mdDialog)
	{
	
	$scope.init = init;
	$scope.openAddAvatar = openAddAvatar;
	$scope.checkError = checkError; //check whether field contain error in privateInfo form
	$scope.isChanged = isChanged; //check whether field has been changed to set special backgr
	$scope.resetInfo = resetInfo; //reset personal information
	$scope.updateProfile = updateProfile;
	$scope.resetPassword = resetPassword;
	$scope.passIsChanged = passIsChanged;
	$scope.updatePassword = updatePassword;
	$scope.keyUp = keyUp;
	
	
	$scope.$on('$destroy',function(){$scope.destroyed = true});
	
	$scope.init();
	
	function init()
		{
		
		$scope.accountOrg = $account.createBlankSignUp();
		$.extend($scope.accountOrg,$rootScope.USER);
		
		
		$scope.pass = {'new':'','confirm':'','current':''};
		$scope.resetInfo();
		$scope.resetPassword();
		
		
		}
		
		
	function updateProfile()
		{
		if ($scope.checkError()) return false;
		
		
		$mdDialog.show($mdDialog
			.confirm()
			.title('Вы желаете сохранить изменения в личные данные?')
			.ok('Сохранить')
			.cancel('Отменить')
			).then(function()
				{
				$scope.spinner = true;
				$scope.account.update().then(function(response)
					{
					if ($scope.destroyed) return false;
					if (response.Error)
						{
						$scope.spinner = false;
						return false;
						}
					$mdDialog.show($mdDialog
						.okPopup()
						.title('Данные успешно изменены!')
						)
					$scope.spinner = false;
					$.extend($scope.accountOrg,response.user);
					$scope.resetInfo();
					})
				
				})
		
		
		}
		


	function updatePassword()
		{	
		if (!$scope.pass['current'])
			{
			$mdDialog.show($mdDialog
				.alert()
				.title('Гоп стоп,')
				.content('Для изменения пароля необходимо ввести действующий пароль!')
				).then(function()
					{
					$scope.passwordChange['current'].$setValidity('error',false);
					$scope.passwordChange['current'].$setTouched();
					})
			return false;
			}
			
			
		if (!$scope.pass['confirm']||$scope.pass['confirm']!=$scope.pass['new'])
			{
			$mdDialog.show($mdDialog
				.alert()
				.title('Гоп стоп,')
				.content('Новый пароль и пароль для подтверждения не совпадают!')
				).then(function()
					{
					$scope.passwordChange['confirm'].$setValidity('error',false);
					$scope.passwordChange['new'].$setValidity('error',false);
					$scope.passwordChange['confirm'].$setTouched();
					$scope.passwordChange['new'].$setTouched();
					})
			return false;	
			}
			
		$mdDialog.show($mdDialog
			.confirm()
			.title("Вы действительно хотите сохранить новый пароль?")
			.ok('Сохранить')
			.cancel('Отменить')
			).then(function()
				{
				$scope.spinner = true;
				$scope.account.updatePassword($scope.pass).then(function(response)
					{
					if (response.Error)
						{
						$scope.spinner = false;
						return false;
						}
						
					$mdDialog.show($mdDialog
						.okPopup()
						.title("Пароль успешно изменен")
						).then(function()
							{
							$scope.spinner = false;
							$scope.resetPassword();
							})
						
					},)
				
				})
			
			
		}
		
	//drop error from password input-field
	function keyUp(field)
		{
		if (field=='new'||field=='confirm')
			{
			$scope.passwordChange['confirm'].$setValidity('error',true);
			$scope.passwordChange['new'].$setValidity('error',true);
			}
		else
			$scope.passwordChange[field].$setValidity('error',true);
		}
		
		
	function openAddAvatar()
		{
		var sc = $scope.$new();
		$mdDialog.show({
			templateUrl:'./views/profile/ModalAddAvatar.html',
			controller:'profileModalAddAvatar',
			$scope:sc,
			multiple:true,
			clickOutsideToClose:false,
			escapeToClose:false,
			})
			
		}
		
	function isChanged(fieldName)
		{
		if (!fieldName||fieldName=='all')
			return !angular.equals($scope.account,$scope.accountOrg);
	
		return !angular.equals($scope.account[fieldName],$scope.accountOrg[fieldName]);

		}
		
	function passIsChanged()
		{
		var p = $scope.pass;
		return p['new']||p['confirm']||p['current'];
		}
		
	function checkError(fieldName)
		{
		
		if (fieldName=='all'||!fieldName)
			{
			//run over all fields
			var fields = Object.keys($scope.privateInfo).filter(function(el){return el.indexOf('$')!=0});

			for (var i=0;el=$scope.privateInfo[fields[i++]];)
				{
				if (Object.keys(el.$error).length!=0)
					return true;
				}
			return false;
			}
			
		return Object.keys($scope.privateInfo[fieldName].$error).length!=0;
			
		}
		
		
	function resetInfo()
		{
		$scope.account = $.extend(true,{},$scope.accountOrg);
		}
		
		
	function resetPassword()
		{
		$scope.pass = {'new':'','confirm':'','current':''};
		//drop validity to true
		for (var each in $scope.passwordChange)
			{
			if (each.indexOf('$')==-1)
				$scope.passwordChange[each].$setValidity('error',true);
			}
		}
		
		
	}
	
module.exports.$inject = ['$scope','$account','$rootScope','$mdDialog'];