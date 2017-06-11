module.exports = function ReportsCntr($scope)
    {


    $scope.init = init;
    $scope.init();



    function init()
        {
        console.log('Reports Controller');
        }


    }

module.exports.$inject = ['$scope'];