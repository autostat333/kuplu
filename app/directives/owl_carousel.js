module.exports = function owlCarouse($timeout)
    {
    return {
        link:function(scope,elem,attrs)

            {


            scope.init = init;

            scope.init();


            //INIT CAROUSEL CONFIG
            function init()
                {
                $(elem).owlCarousel({
                    animateOut: 'slideOutDown',
                    animateIn: 'flipInX',
                    items:1,
                    //margin:0,
                    //stagePadding:0,
                    //navSpeed:450,
                    //slideBy:1,
                    //navSpeed:100,
                    //  onResize:function(){console.log('resize')},
                    //  onRefresh:function(){console.log('refresh')},
                    //startPosition:8,
                    /*
                    responsive:
                        {
                        0:{items:2},
                        350:{items:3},
                        500:{items:3},
                        800:{items:4},
                        950:{items:5},
                        1300:{items:7},
                        }
                    */
                    });
                //set callback on change to retrive number of items per slide
                //for calculation number of slide with current day
                //then - listenner will be switched off
                }



            }

        }

    }

module.exports.inject = ['$timeout'];