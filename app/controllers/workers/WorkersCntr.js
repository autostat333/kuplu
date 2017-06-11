module.exports = function WorkersCntr($scope)
    {


    $scope.init = init;
    $scope.init();



    function init()
        {
        console.log('Workers Controller');
        }


    }

module.exports.$inject = ['$scope'];