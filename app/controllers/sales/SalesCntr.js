module.exports = function SalesCntr($scope,$models, $mdDialog)
    {

    $scope.submit = submit;
    $scope.init = init;
    //$scope.init();


    function init()
        {
			
        $scope.SALES = $models()
        $scope.SALES.$get().then(function()
            {
            console.log('Finish');
            });

        $scope.sales_obj = $scope.SALES.$create_blank();
        }

    function submit()
        {

        if ($scope.sales_obj.isEmpty())return false;

        $scope.SALES.$add($scope.sales_obj).then(function()
            {
            $scope.sales_obj = $scope.SALES.$create_blank();
            });

        }


    }

module.exports.$inject = ['$scope','$models','$mdDialog'];