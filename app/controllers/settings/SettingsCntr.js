module.exports = function SettingsCntr($scope)
    {


    $scope.init = init;
    $scope.init();



    function init()
        {
        console.log('Settings Controller');
        }

    }

module.exports.$inject = ['$scope'];