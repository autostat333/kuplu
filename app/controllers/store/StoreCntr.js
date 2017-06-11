module.exports = function StoreCntr($scope)
    {


    $scope.init = init;
    $scope.init();



    function init()
        {
        console.log('Store Controller');
        }


    }

module.exports.$inject = ['$scope'];