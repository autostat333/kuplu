module.exports = function PerfectScrollbar($timeout, $filter)
    {
    return {
        link:function(scope,elem,attr)
            {
            $timeout(function(){Ps.initialize(elem[0],
				{
				'suppressScrollX':true
				});},0);
            }
        }

    }

module.exports.$inject = ['$timeout','$filter'];