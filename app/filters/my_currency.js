module.exports.$inject = [];
module.exports = function myCurrencyFilter()
	{
	return function(val)
		{
			
		if (!val) return '0';
		
		val = val.toString();
		var reminder = (val=val.split('')).splice(-2).join('');
		val = val.join('');
		
		val = val.replace(/(\d)(?=(\d{3})+$)/g,'$1 ');
		val = (val==''?'0':val)+','+reminder;
		
		
		return val;
		}
		
		
	}