/**
 * ING Direct Side FAQ Angular JS
 */


// ANGULAR CONFIG SETTING
// ----------------------------------------------
appConfig.constant('apiInfo', {
    apiSuggestionList: "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getsuggestions",
    apiSearchFaqList: "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/search",
    apiProductFaqList: "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getproductfaqs",
    apiFaqDetail: "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getfaq"
});

appConfig.constant('sideFaqInfo', {
	maxSuggestionCount: 10,
	maxProductFaqCount: 10,
	maxSearchFaqCount: 9999,
	maxRelatedItemCount: 10,
	maxKeywordStrLength: 3,
	searchPageUrl: "/search-list.html?term=[KEYWORD]",
	registeredProductKeys: ["General", "Security", "Orange Everyday", "Savings", "Home Loans", "Superannuation", "Business", "Savings Maximiser", "Personal Term Deposit", "Savings Accelerator" ,"Orange Advantage", "Mortgage simplifier", "Home loans Action Equity", "Construction Home Loan", "Commercial Loans", "Fixed Rate Home Loan", "Smart Home Loan", "Living Super", "SMSF Cash", "SMSF Term Deposit", "Business Optimiser", "Business Term Deposit", "SiteTop10"]
});

appConfig.constant('templateInfo', {
	productFaqList: '/templates/side-faq/product-faq-list.html',
	faqList: 				'/templates/side-faq/faq-list.html',
	faqDetail: 			'/templates/side-faq/faq-detail.html'
});


function htmlEncode(str) {
	return $('<div/>').text(str).html();
}


// SIDE FAQ CONTROLLER
// ----------------------------------------------
app.controller("SideFaqController", function ($scope, $http, $sce, $timeout, $q, apiInfo, sideFaqInfo, templateInfo) {

	$scope.searchInfo = {};
	$scope.searchInfo.selected = undefined;
	$scope.searchInfo.productId = undefined;
	$scope.searchInfo.searchTerm = undefined;
	$scope.searchInfo.suggestionList = [];
	$scope.searchInfo.faqListInfo = undefined;
	$scope.searchInfo.productFaqListInfo = undefined;
	$scope.searchInfo.faqDetailInfo = undefined;

	$scope.pageInfo = {};
	$scope.pageInfo.contentLoading = false;
	$scope.pageInfo.searchLoading = false;
	$scope.pageInfo.lastTemplate = undefined;
	$scope.pageInfo.template = undefined;
	$scope.pageInfo.animation = undefined;

	$scope.templateInfo = templateInfo;


	$scope.init = function (productId) {
		//console.log("KEY: " + productId );
		if (angular.isDefined(productId)) {
			if( sideFaqInfo.registeredProductKeys.indexOf(productId) > -1 ) { // product key found
				//console.log("This is a Product Key");
				$scope.searchInfo.productId = productId;
				_showProductFaqPage();
			}
			else { // otherwise this is a search term key
				//console.log("This is a Search Term");
				$scope.searchInfo.searchTerm = productId;
				_showTopTenSearchResultFaqPage();
			}
		}
	};

	$scope.closeSideFaq = function () {
		clickSideFaqButton();
	};

	// SEARCH
	$scope.getSuggestionList = function (originKeyword) {
		var newSuggestionList = $scope.searchInfo.suggestionList.slice();
		if (originKeyword/* && newSuggestionList.indexOf(originKeyword) === -1*/) {
			var index = newSuggestionList.indexOf(originKeyword);
			if (index > -1) {
				newSuggestionList.splice(index, 1);
			}
			newSuggestionList.unshift(originKeyword);
		}
		return newSuggestionList;
	};

	$scope.refreshSuggestionList = function (str) {
		if (str.length >= sideFaqInfo.maxKeywordStrLength) {
			_loadSuggestionList(str, function (data) {
				if (data.Suggestions.length > 0) {
					$scope.searchInfo.suggestionList = [];
					angular.forEach(data.Suggestions, function (keyword, index) {
						$scope.searchInfo.suggestionList.push(keyword);
					});
				}
			});
		}
		else {
			$scope.searchInfo.suggestionList = [];
		}
	};

	$scope.refreshSuggestionListEx = function (str) {
		var encodedStr = htmlEncode(str);
//		console.log('encodedStr: ' + encodedStr);

		if (encodedStr.length >= sideFaqInfo.maxKeywordStrLength) {
			var deferred = $q.defer();
			_loadSuggestionList(str, function (data) {
				if (data.Suggestions.length > 0) {
					$scope.searchInfo.suggestionList = [];
					angular.forEach(data.Suggestions, function (keyword, index) {
						$scope.searchInfo.suggestionList.push(keyword);
					});
				}
				var keyword = htmlEncode(angular.copy($scope.searchInfo.selected));
				var index = $scope.searchInfo.suggestionList.indexOf(keyword);
				if (index > -1) {
					$scope.searchInfo.suggestionList.splice(index, 1);
				}
				$scope.searchInfo.suggestionList.unshift(keyword);				
				deferred.resolve($scope.searchInfo.suggestionList);
			});
			return deferred.promise;
		}
		else {
			$scope.searchInfo.suggestionList = [];
			return $scope.searchInfo.suggestionList;
		}
	};

	$scope.getSearchTitle = function () {
		if (angular.isDefined($scope.searchInfo.faqListInfo)) {
			var faqListInfo = $scope.searchInfo.faqListInfo;
			//console.log(faqListInfo);
			var title = faqListInfo.Results.length +
			" result" + (faqListInfo.Results.length > 1 ? "s" : "") +
			" for " + 
			"\"" + 
			(faqListInfo.CorrectedTerm === null ? $scope.searchInfo.selected : faqListInfo.CorrectedTerm) + 
			"\"";

			return title;
		}
	};

	$scope.searchFaqList = function () {
		_showFaqListPage();
		$timeout(function() {
			$("input").blur();
		}, 100);
	};

	$scope.gotoFaqDetailFromProductFaq = function (faqId) {
		$scope.pageInfo.lastTemplate = templateInfo.productFaqList;
		$scope.gotoFaqDetail(faqId);
	};

	$scope.gotoFaqDetailFromFaq = function (faqId) {
		$scope.pageInfo.lastTemplate = templateInfo.faqList;
		$scope.gotoFaqDetail(faqId);
	};

	$scope.gotoFaqDetail = function (faqId) {
		_showFaqDetailPage(faqId);
	};

	$scope.gobackFaqList = function () {
		_changeView($scope.pageInfo.lastTemplate, 'animation-slide-right');
	};


	// VIEW CONTROL
	var _showProductFaqPage = function () {
		if (angular.isUndefined($scope.searchInfo.productFaqList)) {
			$scope.pageInfo.contentLoading = true;
			_loadProductFaqList($scope.searchInfo.productId, function (data) {
				$scope.searchInfo.productFaqListInfo = angular.copy(data);
				_changeView(templateInfo.productFaqList, 'animation-fade');
				$scope.pageInfo.contentLoading = false;
			});
		}
	};

	var _showTopTenSearchResultFaqPage = function() {
		if (angular.isUndefined($scope.searchInfo.productFaqList)) {
			$scope.pageInfo.contentLoading = true;
			_loadTopTenSearchResultFaqList($scope.searchInfo.searchTerm, function (data) {
				$scope.searchInfo.productFaqListInfo = angular.copy(data);
				_changeView(templateInfo.productFaqList, 'animation-fade');
				$scope.pageInfo.contentLoading = false;
			});
		}
	};

	var _showFaqListPage = function () {
		if (angular.isDefined($scope.searchInfo.selected)) {
			$scope.pageInfo.contentLoading = true;
			_loadSearchFaqList($scope.searchInfo.selected, function (data) {
				$scope.searchInfo.faqListInfo = angular.copy(data);
				_changeView(templateInfo.faqList, 'animation-fade');
				$scope.pageInfo.contentLoading = false;
			});
		}
	};

	var _showFaqDetailPage = function (faqId) {
		if (angular.isDefined(faqId)) {
			$scope.pageInfo.contentLoading = true;
			_loadFaqDetail(faqId, function (data) {
				//console.log(data);
				$scope.searchInfo.faqDetailInfo = angular.copy(data);
				_changeView(templateInfo.faqDetail, 'animation-slide-left');
				$scope.pageInfo.contentLoading = false;
			});
		}
	};

	var _changeView = function (template, animation) {
		$scope.pageInfo.animation = '';
		$timeout(function () {
			$scope.pageInfo.animation = animation;
			$timeout(function () {
				$scope.pageInfo.template = template;
			}, 100);
		}, 100);
	};


	// LOCAL METHODS
	var _loadSuggestionList = function (keyword, completion) {
		var params = {};
		params.Term = keyword;
		params.Count = sideFaqInfo.maxSuggestionCount;
		params.Referrer = "Web";
		_loadContent(apiInfo.apiSuggestionList, params, completion);
	};

	var _loadSearchFaqList = function (keyword, completion) {
		var params = {};
		params.Term = keyword;
		params.Page = 1;
		params.PageSize = sideFaqInfo.maxSearchFaqCount;
		params.RelatedItemsCount = sideFaqInfo.maxRelatedItemCount;
		params.Referrer = "Web";
		_loadContent(apiInfo.apiSearchFaqList, params, completion);
	};

	var _loadProductFaqList = function (productId, completion) {
		var params = {};
		params.Product = productId;
		params.Count = sideFaqInfo.maxProductFaqCount;
		params.Referrer = "Web";
		_loadContent(apiInfo.apiProductFaqList, params, completion);
	};

	var _loadTopTenSearchResultFaqList = function(keyword, completion) {
		var params = {};
		params.Term = keyword;
		params.Page = 1;
		params.PageSize = sideFaqInfo.maxProductFaqCount;
		params.RelatedItemsCount = sideFaqInfo.maxRelatedItemCount;
		params.Referrer = "Web";
		_loadContent(apiInfo.apiSearchFaqList, params, completion);
	};

	var _loadFaqDetail = function (faqId, completion) {
		var params = {};
		params.Id = faqId;
		params.RelatedItemsCount = sideFaqInfo.maxRelatedItemCount;
		params.Referrer = "Web";
		_loadContent(apiInfo.apiFaqDetail, params, completion);
	};

	var _loadContent = function (apiUrl, params, completion) {
		if (getSessionId().length > 0) {
			params.SessionId = getSessionId();
		}
		if (getUniqueId().length > 0) {
			params.UniqueIdentifier = getUniqueId();
		}
		//console.log('API: '+ apiUrl);
		$http.post(apiUrl, params)
		.then(function (response) {
			// save session id
			if (getSessionId().length === 0 && angular.isDefined(response.data.SessionId)) {
				setSessionId(response.data.SessionId);
			}
			// save unique id
			if (getUniqueId().length === 0 && angular.isDefined(response.data.UniqueIdentifier)) {
				setUniqueId(response.data.UniqueIdentifier);
			}
			//console.log('API return');
			//console.log(response.data);
			if (angular.isDefined(response.data.Result)) {
				response.data.Results = [];
				response.data.CorrectedTerm = null;
			}
			completion(response.data);
		}, function (error) {
			_handleError(error);
		})
		.finally(function () {
		});
	};

	var _handleError = function (error) {
//		console.log(error);
		$scope.pageInfo.contentLoading = false;
		$scope.pageInfo.searchLoading = false;
	};


	// HELPERS
	$scope.trustAsHtml = function (value) {
		return $sce.trustAsHtml(value);
	};
});


// NEW SEARCH CONTROLLER
// ----------------------------------------------
app.controller("NewSearchController", function ($scope, $http, $sce, $window, $q, apiInfo, sideFaqInfo) {

	$scope.searchInfo = {};
	$scope.searchInfo.selected = undefined;
	$scope.searchInfo.suggestionList = [];

	$scope.init = function () {
		var term = $.deparam.querystring().term;
		if (term !== undefined) {
			//console.log(term);
			$scope.searchInfo.suggestionList.push(term);
			$scope.searchInfo.selected = $scope.searchInfo.suggestionList[0];
		}
	};

	$scope.getSuggestionList = function (originKeyword) {
		var newSuggestionList = $scope.searchInfo.suggestionList.slice();
		if (originKeyword/* && newSuggestionList.indexOf(originKeyword) === -1*/) {
			var index = newSuggestionList.indexOf(originKeyword);
			if (index > -1) {
				newSuggestionList.splice(index, 1);
			}
			newSuggestionList.unshift(originKeyword);
		}
		return newSuggestionList;
	};

	$scope.refreshSuggestionListEx = function (str) {
		var encodedStr = htmlEncode(str);
//		console.log('Search encodedStr: ' + encodedStr);

		if (encodedStr.length >= sideFaqInfo.maxKeywordStrLength) {			
			var deferred = $q.defer();
			var params = {};
			params.Term = str;
			params.Count = sideFaqInfo.maxSuggestionCount;
			params.Referrer = "Web";
			_loadContent(apiInfo.apiSuggestionList, params, function(data) {
				if (data.Suggestions.length > 0) {
					$scope.searchInfo.suggestionList = [];
					angular.forEach(data.Suggestions, function (keyword, index) {
						$scope.searchInfo.suggestionList.push(keyword);
					});
				}
				var keyword = htmlEncode(angular.copy($scope.searchInfo.selected));
				var index = $scope.searchInfo.suggestionList.indexOf(keyword);
				if (index > -1) {
					$scope.searchInfo.suggestionList.splice(index, 1);
				}
				$scope.searchInfo.suggestionList.unshift(keyword);				
				deferred.resolve($scope.searchInfo.suggestionList);				
			});
			return deferred.promise;
		}
		else {
			$scope.searchInfo.suggestionList = [];
			return $scope.searchInfo.suggestionList;
		}
	};

	$scope.gotoSearchPage = function () {
		var url = sideFaqInfo.searchPageUrl.replace('[KEYWORD]', $scope.searchInfo.selected);
		$window.location = encodeURI(url);
	};

	var _loadContent = function (apiUrl, params, completion) {
		if (getSessionId().length > 0) {
			params.SessionId = getSessionId();
		}
		if (getUniqueId().length > 0) {
			params.UniqueIdentifier = getUniqueId();
		}
		$http.post(apiUrl, params)
		.then(function (response) {
			// save session id
			if (getSessionId().length === 0 && angular.isDefined(response.data.SessionId)) {
				setSessionId(response.data.SessionId);
			}
			// save unique id
			if (getUniqueId().length === 0 && angular.isDefined(response.data.UniqueIdentifier)) {
				setUniqueId(response.data.UniqueIdentifier);
			}
			//console.log(response.data);
			completion(response.data);
		}, function (error) {
			_handleError(error);
		})
		.finally(function () {
		});
	};

	var _handleError = function (error) {
//		console.log(error);
	};

	// HELPERS
	$scope.trustAsHtml = function (value) {
		return $sce.trustAsHtml(value);
	};
});


// GENERAL FUNCTIONS
// ----------------------------------------------
function clickSideFaqButton () {
  if ($('body').hasClass('active-side-faq')) {
    $('body').removeClass('active-side-faq');
    setTimeout(function () {
    	$('.side-faq').css('visibility', 'hidden');
	    $('.side-faq-button .normal').addClass('active');
	    $('.side-faq-button .close').removeClass('active');
    }, 400);

    var os = getMobileOperatingSystem();
	  if (os === 'iOS' || os === 'Android') {
	    $('.mobile-side-slider')
	    	.css('height', 'auto')
	    	.css('overflow', 'auto');

	    $('.ING-body > .tab-height-manager').css('transform', 'none');
	    $('.ING-body > .content-hero').css('transform', 'none');
	    $('.ING-body > .ING-home-slider').css('transform', 'none');
	    $('.ING-body > .ING-people').css('transform', 'none');
	    $('.ING-body > .ING-content').css('transform', 'none');
	    if (!$('.ING-body .ING-tab-header').hasClass('sticky')) {
		    $('.ING-body .ING-tab-header').css('transform', 'none');
		  }
	    $('.ING-body .ING-tab-body').css('transform', 'none');
	    $('.ING-footer').css('transform', 'none');
	    if (!$('.side-faq-button').hasClass('sticky')) {
		    $('.side-faq-button').css('transform', 'none');
	    }

	    $('body').scrollTop(_scrollTop);
    }
  } 
  else {
    $('.side-faq').css('visibility', 'visible');
    $('body').addClass('active-side-faq');
    setTimeout(function () {
	    $('.side-faq-button .normal').removeClass('active');
	    $('.side-faq-button .close').addClass('active');
    }, 400);

    var os = getMobileOperatingSystem();
	  if (os === 'iOS' || os === 'Android') {
	    _scrollTop = ($('body').scrollTop());

	    $('.mobile-side-slider')
	    	.css('height', $(window).innerHeight()+'px')
	    	.css('overflow', 'hidden');

	    $('.ING-body > .tab-height-manager').css('transform', 'translateY(-'+_scrollTop+'px)');
	    $('.ING-body > .content-hero').css('transform', 'translateY(-'+_scrollTop+'px)');
	    $('.ING-body > .ING-home-slider').css('transform', 'translateY(-'+_scrollTop+'px)');
	    $('.ING-body > .ING-people').css('transform', 'translateY(-'+_scrollTop+'px)');
	    $('.ING-body > .ING-content').css('transform', 'translateY(-'+_scrollTop+'px)');
	    $('.ING-body .ING-tab-body').css('transform', 'translateY(-'+_scrollTop+'px)');
	    if (!$('.ING-body .ING-tab-header').hasClass('sticky')) {
		    $('.ING-body .ING-tab-header').css('transform', 'translateY(-'+_scrollTop+'px)');
	    }
	    $('.ING-footer').css('transform', 'translateY(-'+_scrollTop+'px)');
	    if (!$('.side-faq-button').hasClass('sticky')) {
				$('.side-faq-button').css('transform', 'translateY(-'+_scrollTop+'px)');
			}
	  }
  }
};
var _ScrollTop;

// $('.mobile-side-slider').on('click', function(event) {
// 	if ($('body').hasClass('active-side-faq')) {
// 		clickSideFaqButton();
// 		event.preventDefault();
// 	}
// });

$(window).scroll(function (e) {
	var side_faq_btn_sticky_pos = 360;
	// normal
	if (!$('body').hasClass('active-side-faq')) {
		//console.log('A: ' + $('.side-faq-button').css('top'));
		if( $(window).scrollTop() > side_faq_btn_sticky_pos ) {
			$('.side-faq-button').addClass('sticky');
		}
		else {
			$('.side-faq-button').removeClass('sticky');
		}
	}
	/*
	if ($('.ING-header').hasClass('sticky')) {
		$('.side-faq-button').addClass('active');
	} else {
		$('.side-faq-button').removeClass('active');
	}
	*/
});


//http://stackoverflow.com/questions/21741841/detecting-ios-android-operating-system
/**
 * Determine the mobile operating system.
 * This function either returns 'iOS', 'Android' or 'unknown'
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
  {
    return 'iOS';
  }
  else if( userAgent.match( /Android/i ) )
  {
    return 'Android';
  }
  else
  {
    return 'unknown';
  }
}
/*
$('input[type="text"][name="go"]').keypress(function(e) {
	if (key === 13) {
		if ($('body').hasClass('ie9') && $(this).siblings('.dropdown-menu').length < 1) {
			e.preventDefault();
			alert('ie9 and pressed enter key!!');
		}
	}
});
*/