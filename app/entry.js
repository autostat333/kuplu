
/*
$('.spinner_container').animate({'opacity':0},1000,'linear',function(el)
    {
    $(this).remove();
    });
*/


//plug when must be iddle function
function noop(){};



angular.module('app',['ui.router','ngMaterial'])
	.config(require('./routes.js'))
	.factory('$models',require('./factory/models.js')) //factory for models for managing datasets



