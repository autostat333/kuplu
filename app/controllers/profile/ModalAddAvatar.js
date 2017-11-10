module.exports = function ModalAddAvatar($scope,$mdDialog,$account,$rootScope)
	{
	
	
	
	$scope.init = init;
	$scope.closeModal = closeModal;
	$scope.saveAvatar = saveAvatar;
	$scope.loadFile = loadFile;
	$scope.onDrop = onDrop;
	$scope.onDragOver = onDragOver;
	
	$scope.init();
	
	
	function init()
		{
		$scope.fileName = '';
		$scope.imgSource = false;
				
		}
		
		
	function loadFile(e,file)
		{	
		var readFile = new FileReader();
		
		readFile.onload = function(data)
			{
			//destroy if exists element
			if ($scope.imgSource)
				{
				$scope.imgSource = data; 
				$scope.img.croppie('destroy');
				$scope.img.attr('src','');
				}

			$scope.imgSource = data.target.result; //imgSource - src for img, data is the base64 format
			$scope.$apply();
			setTimeout(function()
				{
				$scope.img = $('.img_croppie img');
				$scope.img.attr('src',$scope.imgSource);
				$scope.img.croppie({
					enableExif:true,
					viewport:{
						width:200,
						height:200,
						type:'circle'
					},
					boundary:
						{
						height:300,
						width:300
						}
						
					});
				})
			}
			
			
		if (!e) //because I can pass file directly
			readFile.readAsDataURL(file);
		else
			readFile.readAsDataURL(e.target.files[0]);
		
		}
		
		
	function onDrop(e)
		{
		e.preventDefault(); //to prevent open img as link byitself
		if (e
			&&e.dataTransfer
			&&e.dataTransfer.files
			&&e.dataTransfer.files.length
			)
			{
			$scope.loadFile(false, e.dataTransfer.files[0]); 
			}
		}


	function onDragOver(e)
		{
		console.log(e);
		e.preventDefault(); //by default you can not dragover on elements, we should prevent it
		}
	
		
	function saveAvatar()
		{
		if (!$scope.imgSource) return false;
		$scope.spinner = true;
		$scope.img.croppie('result','base64').then(function(base64)
			{
			$account.saveAvatar(base64).then(function(response)
				{
				$scope.spinner = false;
				if (response.Error) return false;
				//refresh url, because then name stays the same, but img has been changed
				$rootScope.USER['avatarUrl']+='?'+(new Date()); 
				$scope.closeModal();
				})
				
			})
		
			
		}
		
	function closeModal()
		{
		$mdDialog.hide();
		}
		
		
	
	}
	
module.exports.$inject = ['$scope','$mdDialog','$account','$rootScope'];