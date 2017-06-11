
module.exports = function(async,fs, app)  //do not forget add dependency to server.js
    {
    
 
    var $scope = {};
 
   $scope.init = init;
   $scope.run_robot = run_robot;

   $scope.stack = function(req,resp,next)
        {
        async.series([
            $scope.init,
            $scope.run_robot,
            ],
            function(err,res)
                {
                resp.send('Everything is working! '+app.locals.CONFIG.HOST);
                }
            )
        
        };

    return $scope;



    function init(callback)
        {
        callback();
        }


    function run_robot(callback)
        {
        callback();

        }


    };

