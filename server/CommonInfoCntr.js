module.exports = function(async,db,regions)  //do not forget add dependency to server.js
    {
    
 
    var $scope = {};
	$scope.getRegions = getRegions;
 

 

    return $scope;


	
	function getRegions(callback)
		{
		
		var cursor = db.collection('regions').find({});
		
		cursor.count(function(err,count)
			{
			if (err||!count)
				{	
				err.message+='; Problem to get count of regions (error or it is equal to 0)!';
				callback(err);
				return false;
				}
			var stop = false;
			var res = [];
			cursor.each(function(err,doc)
				{
				try
					{
					if (err) throw err;
					if (stop) return false;
					
					if (!doc)
						{	
						regions.data = res; //refresh regions;
						callback(null,{'data':res,'Error':''});
						}
						
					else
						res.push(doc);
						
					}
				catch(err){err.message+=";Some error happened when cursor.each for regions!",callbac(err);stop = true;return false}
				})


			})
	
		}
	

	
	
	
    };

