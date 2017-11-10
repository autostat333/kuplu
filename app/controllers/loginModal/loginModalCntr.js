module.exports = function loginModalCntr($scope,$account,$mdDialog)
	{
	$scope.init = init;
	$scope.checkError = checkError;
	$scope.inputChange = inputChange; //from ng-change to hide message error card
	$scope.dropValidity = dropValidity; //called from input changed on passwordConfirm to reset it and hide err msg
	$scope.goToSignUp = goToSignUp;
	$scope.closeModal = closeModal;
	
	$scope.submitBtn = submitBtn;
	$scope.signIn = signIn;
	$scope.signUp = signUp;

	
	$scope.init();
	
	function init()
		{
		$scope.account = $account.createBlankLogin();
		$scope.showError = false;
		
		
		$scope.signState = 'login';
		
		}


	function checkError(fieldName,formName)
		{
		if (formName=='signupForm'&&$scope.signState!='signUp') return false;
		fieldName = fieldName||'all';
		
		
		if (fieldName=='all')
			{
			for (var each in $scope[formName])
				{
				if (each.indexOf('$')!=0)
					{
					if ($scope.checkError(each,formName))
						return true;
					}
				}
			return false;
			}
			
		return !Object.keys($scope[formName][fieldName].$error).length?false:true;
		}
		
		
	//hide error message after continue typing
	function inputChange()
		{
		$scope.showError = false;	
		
		}
		
		
	function dropValidity()
		{
		$scope.signupForm.passwordConfirm.$setValidity('passwordMatched',true);
		}
		
		
	function submitBtn()
		{
		if ($scope.signState=='login')
			$scope.signIn();
		else
			$scope.signUp();
			
		}
		
		
	function signIn()
		{

		if ($scope.checkError('all','lofinForm')||$scope.account.isEmpty()) return false;
		
		
		$scope.spinner = true;
		$account.login($scope.account).then(function(response)
			{
			$scope.spinner = false;
			if (response.Error)
				{
				//for user Errors
				if (response.userError)
					{
					$scope.showError = response.Error;
					return false;
					}
				}
			$mdDialog.hide();
			},function(){$scope.spinner = false;})
			
		}


		
		
	function signUp()
		{
		if ($scope.checkError('all','signupForm')||$scope.newAccount.isEmpty()) return false;
		
		if ($scope.newAccount['password']!=$scope.passwordConfirm)
			{

			$mdDialog.show($mdDialog
				.alert()
				.title('Упс')
				.content('Пароль для подвтверждения не совпадает')
				.multiple(true)
				.ok('Закрыть'));
				
				
			$scope.signupForm.passwordConfirm.$setValidity('passwordMatched',false);
			return false;
			}
			
		
		$scope.spinner = true;
		$account.signup($scope.newAccount).then(function(response)
			{
			if (response.Error)
				{
				//for user Errors
				$scope.spinner = false;

				if (response.userError)
					{
					$scope.showError = response.Error;
					return false;
					}
				return false;
				}
			$scope.spinner = false;
			$mdDialog.hide();
			},function(){$scope.spinner = false;})
			
		
		}
		
		
		
	function goToSignUp()
		{
		$scope.signState = 'signUp';
		$scope.newAccount = $account.createBlankSignUp();
		$scope.showError = false;

		setTimeout(function(){$('.signup_form input[name=visibleName]')[0].focus()},300);
		
		}
		
		
	function closeModal()
		{
		$mdDialog.cancel();
			
		}
		
		
	}
	
module.exports.$inject = ['$scope','$account','$mdDialog'];