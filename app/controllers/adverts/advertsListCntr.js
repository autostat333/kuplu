module.exports = function AdvertsCntr($scope,$models, $mdDialog)
    {

    $scope.init = init;
	$scope.initFiltringParams = initFiltringParams;
	$scope.initSortingParams = initSortingParams;
	$scope.applyParams = applyParams;
	$scope.paramsIsEqual = paramsIsEqual;
	
	$scope.initPaginationParams = initPaginationParams;
	//pagination initializing in advertsWrapCntr 
	//because first request for adverts should be with pagination params already
	
	//comes from advertsWrapCntr, because first request should be with pagination params already
	var PAGINATION_LIMIT = 5; 

	
	
    $scope.init();
	
	
	$scope.$watch('sortingId',watcherSorting);
	$scope.$watch('pageCurrent',watcherPagination);
	

    function init()
        {

		$scope.initFiltringParams();
		$scope.initPaginationParams();
		$scope.initSortingParams();
		
        }
		
		
	function initFiltringParams()
		{
		$scope.PARAMS['filtring'] = {}
		$scope.PARAMS['filtring']['date'] = {'from':'','to':''};
		$scope.PARAMS['filtring']['onlyUserAdverts'] = false;
		
		$scope.PARAMS['filtring']['region'] = '';
		//$scope.PARAMS['filter']['city'] = ''; !!!right now FORBIDDEN, should be Id in city to search over collection
		$scope.PARAMS_ORG = $.extend(true,{},$scope.PARAMS);
		}
		
		
	function initSortingParams()
		{
		$scope.sortingId = '';
		$scope.PARAMS['sorting'] = {};
		
		$scope.sortingOptions = [];
		$scope.sortingOptions.push({'id':1,'label':'Сначала НОВЫЕ','fieldName':'Created','order':-1});
		$scope.sortingOptions.push({'id':2,'label':'Сначала СТАРЫЕ','fieldName':'Created','order':1});
		$scope.sortingOptions.push({'id':3,'label':'Цена ПО ВОЗР','fieldName':'Price','order':1});
		$scope.sortingOptions.push({'id':4,'label':'Цена ПО УБЫВ','fieldName':'Price','order':-1});
			
		}
		
	function initPaginationParams()
		{
		$scope.pageCurrent = 1;
		$scope.PARAMS['pagination'] = {};
		$scope.PARAMS['pagination']['limit'] = PAGINATION_LIMIT;
		$scope.PARAMS['pagination']['skip'] = PAGINATION_LIMIT*($scope.pageCurrent-1);
		
		}
		
		
	function applyParams()
		{
		$scope.spinner = true;
		
		if ($scope.pageCurrent!=1)
			$scope.pageCurrent = 1;
		else
			watcherPagination('force');

			
		}
	

	function watcherSorting(newVal,oldVal)
		{
		if (!newVal)
			{
			$scope.PARAMS['sorting'] = {}; 
			return false;
			}
		var opt  = $scope.sortingOptions.filter(function(el){return el['id']==newVal})[0];
		var f_name = opt['fieldName'];
		var order_ = opt['order'];
		$scope.PARAMS['sorting'] = {};
		$scope.PARAMS['sorting'][f_name] = order_;
		}

	
	
	function watcherPagination(newVal,oldVal)
		{
		if (newVal==undefined&&newVal!='force') return false;
		 
		//for allow scrolling to the bottom after changing the page
		$scope.disableScroll = newVal==oldVal?true:false;
		
		$scope.PARAMS['pagination']['skip'] = PAGINATION_LIMIT*($scope.pageCurrent-1);
		$scope.PARAMS['pagination']['limit'] = PAGINATION_LIMIT;

		$scope.ADVERTS.$get($scope.PARAMS).then(function(response)
			{
			$scope.spinner = false;
			if (!response.Error&&!response.userError)
				{
				$scope.PARAMS_ORG = $.extend(true, {},$scope.PARAMS);
				$scope.pages = Math.ceil($scope.ADVERTS.count/PAGINATION_LIMIT);
				//setTimeout(function(){$('html').animate({'scrollTop':0})},0);
				if (!$scope.disableScroll)
					{
					setTimeout(function()
						{
						var dist = $('.params')[0].getBoundingClientRect()['top']+window.scrollY-30;
						$('html').animate({'scrollTop':dist});
						})
					$scope.disableScroll = true;						
					}
				}
			})
		
			
		}
	
	function paramsIsEqual()
		{
		return angular.equals($scope.PARAMS, $scope.PARAMS_ORG);
		}
	
    }

module.exports.$inject = ['$scope','$models','$mdDialog'];