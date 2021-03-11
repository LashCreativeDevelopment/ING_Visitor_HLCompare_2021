/**
 * ING HL Segmentation Angular APP
 * GET blog articles
 * v1.0
 */

// CONFIG SETTING
// ----------------------------------------------
appConfig.constant('blogApiInfo', {
	baseSegmentApi: "https://blog.ing.com.au/wp-json/ing/v1/segment/",
	//mainPostsApi: "https://blog.ing.com.au/wp-json/ing/v1/mainposts/",
	defaultErrorMessage: "Oops, something went wrong. Please try again later."
});


/*
.config(["$locationProvider", function($locationProvider) {
    // hack for html5Mode customization
    $('a').each( function(){
        $a = $(this);
        if( $a.is('[target]') || $a.is('[ng-href]') ) {
			//
        } 
        else {
            $a.attr('target', '_self');
        }
    });

    $locationProvider.html5Mode(true);
}])
*/


// LEVEL 2 controller - ARTICLE CAROUSEL
angular.module("HL-Segment-App", ['ING-App', 'slickCarousel', 'app.config']).config(function($locationProvider) { $locationProvider.html5Mode({enabled:true, requireBase:false}); });
angular.module("HL-Segment-App").controller("HLSegmentLevel2Controller", ['$scope', '$http', 'blogApiInfo', function($scope, $http, blogApiInfo) {
	$scope.data = {
		loading: true,
		segment: '',
		error: '',
		articles: [],
        slickConfig: {
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"><span class="icon-font icon-arrow-left"></span></button>',
            nextArrow: '<button type="button" class="slick-next"><span class="icon-font icon-arrow-right"></span></button>',
            mobileFirst: true,
            responsive: [
            	{breakpoint: 1200, settings: {slidesToShow: 4}},
            	{breakpoint: 980,  settings: {slidesToShow: 4}},
            	{breakpoint: 768,  settings: {slidesToShow: 3}},
            ]
        }
	};

	$scope.init = function( $slug ) {
		$scope.data.segment = $slug;
		$scope.data.loading = true;

		$http({
			method: 'GET',
			url: blogApiInfo.baseSegmentApi + $scope.data.segment,
			dataType: "json",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		})
		.success( function(response) {
			$scope.data.articles = response;
			if( response.length < 1 ) {
				$scope.data.error = blogApiInfo.defaultErrorMessage; //"Sorry, there are no helpful articles at the moment.";
			}
		})
		.error( function(error) {
			console.log(error);
			$scope.data.error = blogApiInfo.defaultErrorMessage; //"Sorry, please try again.";
		})
		.finally( function(response) {
			$scope.data.loading = false;
		});
	};

}]);

// LEVEL 3 controller - ARTICLE PAGE
angular.module("HL-Segment-App3", ['ING-App', 'slickCarousel', 'app.config']).config(function($locationProvider) { $locationProvider.html5Mode({enabled:true, requireBase:false, rewriteLinks:false}); });
angular.module("HL-Segment-App3").controller("HLSegmentLevel3Controller", ['$scope', '$location', '$http', '$sce', 'blogApiInfo', function($scope, $location, $http, $sce, blogApiInfo) {
	$scope.data = {
		loading: true,
		segment: '',
		article: '',
		error: '',
		article: '',
        slickConfig: {
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"><span class="icon-font icon-arrow-left"></span></button>',
            nextArrow: '<button type="button" class="slick-next"><span class="icon-font icon-arrow-right"></span></button>',
            mobileFirst: true,
            responsive: [
            	{breakpoint: 1200, settings: {slidesToShow: 3}},
            	{breakpoint: 980,  settings: {slidesToShow: 3}},
            	{breakpoint: 768,  settings: {slidesToShow: 3}},
            ]
        }
	};

	var _init = function() {
		$scope.data.segment = $location.search().segment;
		$scope.data.article = $location.search().article;
		$scope.data.loading = true;
		
		$http({
			method: 'GET',
			url: blogApiInfo.baseSegmentApi + $scope.data.segment + '/' + $scope.data.article,
			dataType: "json",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		})
		.success( function(response) {
			console.log();
			$scope.data.article = response;
			if( !response || response.post === null ) {
				$scope.data.error = blogApiInfo.defaultErrorMessage; //"Sorry, the article does not exist.";
			}
		})
		.error( function(error) {
			console.log(error);
			$scope.data.error = blogApiInfo.defaultErrorMessage; //"Sorry, please try again.";
		})
		.finally( function(response) {
			$scope.data.loading = false;
		});
	};

	// initialise controller
	_init();
}]);
