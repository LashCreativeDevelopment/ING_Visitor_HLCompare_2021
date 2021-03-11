/*
 * ING Direct Angular App JS
 * Product FAQ + Side FAQ
 */

var enableTracking = true;
var api_url = "/ReverseProxy/";
//var api_url = "/proxy/";


// polyfill the CustomEvent() constructor functionality in Internet Explorer 9 and higher
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();


// Session ID
// ----------------------------------------------
var COOKIE_SESSION_ID = "ING-sessionId";
var COOKIE_UNIQUE_ID  = "ING-uniqueId";
var COOKIE_FAQ_RATES  = "ING-faqRates";

// COOKIE: Session Id
function getSessionId() {
  var sessionId = $.cookie(COOKIE_SESSION_ID);
  if (typeof sessionId === 'undefined') {
    sessionId = '';
  }
  return sessionId;
}
function setSessionId(sessionId) {
  if (typeof sessionId !== 'undefined') {
    $.cookie(COOKIE_SESSION_ID, sessionId, {});
  }
}

// COOKIE: Unique Id
function getUniqueId() {
  var uniqueId = $.cookie(COOKIE_UNIQUE_ID);
  if (typeof uniqueId === 'undefined') {
    uniqueId = '';
  }
  return uniqueId;
}
function setUniqueId(uniqueId) {
  if (typeof uniqueId !== 'undefined') {
    $.cookie(COOKIE_UNIQUE_ID, uniqueId, {});
  }
}

// COOKIE: Faq Rates
function getFaqRate(faqId) {
  var faqRatesStr = $.cookie(COOKIE_FAQ_RATES);
  if (typeof faqRatesStr === 'undefined') {
    return 0;
  }
  var faqRates = JSON.parse(faqRatesStr);
  //console.log(faqRates);
  var rate = faqRates[faqId];
  if (typeof rate === 'undefined') {
    return 0;
  }
  return rate;
}
function setFaqRate(faqId, rating) {
  var faqRatesStr = $.cookie(COOKIE_FAQ_RATES);
  var faqRates = {};
  if (typeof faqRatesStr !== 'undefined') {
    faqRates = JSON.parse(faqRatesStr);
  }
  faqRates[faqId] = rating;
  $.cookie(COOKIE_FAQ_RATES, JSON.stringify(faqRates), {});
}


// Helper methods
// ----------------------------------------------
function arrayToCommaString(array) {
  return array.join(',');
}
function commaStringToarray(commaString) {
  return commaString.split(',');
}
function htmlEncode(str) {
  return $('<div/>').text(str).html();
}
function htmlDecode(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
function htmlToPlainText(text) {
  return text ? String(text).replace(/<[^>]+>/gm, '') : '';
}

// Angular App
// ----------------------------------------------
var appConfig = angular.module('app.config', []);
var app = angular.module("ING-App", ['ngAnimate', 'ui.bootstrap', 'app.config', 'ngSanitize']);




// ANGULAR CONFIG SETTING
// ----------------------------------------------
appConfig.constant('apiInfo', {
  apiSuggestionList: api_url + "KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getsuggestions",
  apiSearchFaqList: api_url + "KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/search",
  apiProductFaqList: api_url + "KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getproductfaqs",
  apiFaqDetail: api_url + "KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getfaq",
  apiFaqRate: api_url + "KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/rate",
  apiFaqList: api_url + "KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getfaqpage",
  apiMarkViewed: api_url + "KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/markviewed"
});

appConfig.constant('productFaqInfo', {
  //maxSuggestionCount: 10,
  maxProductFaqCount: 10,
  maxRelatedItemCount: 10,
  maxFaqLate: 5,
  //minSearchTextLength: 3,
  maxSearchItemCount: 10,
  maxFaqListCount: 100,
  faqTabNames: ["General", "Security", "Orange Everyday", "Savings", "Home Loans", "Insurance", "Superannuation", "Business"],
  keyReferrer: "Web"
  //keyProduct: "Orange Everyday", // testing
  //defaultSearchProduct: "All",
  //defaultSearchFilter: ["All"]
});

appConfig.constant('sideFaqInfo', {
  maxSuggestionCount: 10,
  maxProductFaqCount: 10,
  maxSearchFaqCount: 9999,
  maxRelatedItemCount: 10,
  minKeywordStrLength: 3,
  searchPageUrl: "/search-list.html?term=[KEYWORD]",
  registeredProductKeys: ["General", "Security", "Orange Everyday", "Savings", "Home Loans", "Superannuation", "Business", "Savings Maximiser", "Personal Term Deposit", "Savings Accelerator" ,"Orange Advantage", "Mortgage simplifier", "Home loans Action Equity", "Construction Home Loan", "Commercial Loans", "Fixed Rate Home Loan", "Smart Home Loan", "Living Super", "SMSF Cash", "SMSF Term Deposit", "Business Optimiser", "Business Term Deposit", "SiteTop10"]
});


appConfig.constant('templateInfo', {
  productFaqList: 'product-faq-list',
  faqList: 'faq-list',
  faqDetail: 'faq-detail'
});



/*
 * Filter: Order By
 */
app.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
});




/*
 * Product Faq List Controller
 */
app.controller("ProductFaqListController", ['$scope', '$http', 'productFaqInfo', 'apiInfo', function($scope, $http, productFaqInfo, apiInfo) {
  $scope.loading;
  $scope.faqList;
  $scope.param = {
    product: '',
    count: '',
    referrer: '',
    sessionId: '',
    uniqueId: ''
  };

  $scope.openModal = function (faqId) {
    $('#faqModalSample')
      .data('faqId', faqId)
      .modal('show');
  };

  var _load = function() {
    $scope.loading = true;

    var item = {};
    item['Product'] = $scope.param.product;
    item['Count'] = $scope.param.count;
    item['Referrer'] = $scope.param.referrer;
    // optional infos
    if ($scope.param.sessionId.length !== 0) {
      item['SessionId'] = $scope.param.sessionId;
    }
    if ($scope.param.uniqueId.length !== 0) {
      item['UniqueIdentifier'] = $scope.param.uniqueId;
    }
    var jsonString = JSON.stringify(item);

    $.ajax({
      type: "POST",
      url: apiInfo.apiProductFaqList, //URL_PRODUCT_FAQS,
      data: jsonString,
      contentType: "application/json",
      success: function(data){
        // save sessionId, uniqueId
        if ($scope.param.sessionId.length === 0) {
          setSessionId(data.SessionId);
          $scope.param.sessionId = getSessionId();
        }
        if ($scope.param.uniqueId.length === 0) {
          setUniqueId(data.UniqueIdentifier);
          $scope.param.uniqueId = getUniqueId();
        }

        //console.log(data.Faqs);
        $scope.faqList = data.Faqs;
        $scope.loading = false;
        $scope.$apply();
      },
      error: function(data) {
        console.log('ProductFaqListController: error');

        $scope.loading = false;
        $scope.$apply();
      }
    });
  };

  var _init = function () {
    $scope.param.product = KEY_PRODUCT;
    $scope.param.count = productFaqInfo.maxProductFaqCount; //MAX_PRODUCT_FAQ_COUNT;
    $scope.param.referrer = productFaqInfo.keyReferrer; // KEY_REFERRER;
    $scope.param.sessionId = getSessionId();
    $scope.param.uniqueId = getUniqueId();
    $scope.faqList = [];
    $scope.loading = false;
    _load();
  };


  _init();

}]);


/*
 * Faq Content Controller (Faq Modal, Faq Page both)
 */
app.controller("FaqContentController", ['$scope', '$http', '$sce', 'productFaqInfo', 'apiInfo', function($scope, $http, $sce, productFaqInfo, apiInfo) {
  $scope.loading = false;
  $scope.isRoot = true;
  $scope.historyQueue = [];
  $scope.param = {
    id: '',
    relatedItemsCount: 0,
    referrer: '',
    sessionId: '',
    uniqueId: ''
  };
  $scope.result = '';
  $scope.htmlContent = '';

  // PAGE: faq-result.html
  $scope.initialize = function() {
    $scope.historyQueue = null; // don't use on faq-result page
    $scope.isRoot = null;
    $scope.result = '';
    $scope.htmlContent = '';

    $scope.param.relatedItemsCount = productFaqInfo.maxRelatedItemCount; //MAX_RELATED_ITEM_COUNT;
    $scope.param.referrer = "Unknown";
    $scope.param.sessionId = getSessionId();
    $scope.param.uniqueId = getUniqueId();

    //var parameters = $.deparam.querystring();
    //$scope.param.id = parameters.faqid; // change request (4 Jun 2015)
    // martin
    var faqid = getUrlParameterByName('faqid'); //$.deparam.querystring();
    $scope.param.id = faqid; // change request (4 Jun 2015)  ;

    _load(false);
  };
  // PAGE: product-faq-list.html
  $scope.initModal = function(faqId) {
    //console.log("initModal: " + faqId);
    $scope.historyQueue = [];
    $scope.isRoot = true;
    $scope.result = '';
    $scope.htmlContent = '';

    $scope.param.relatedItemsCount = productFaqInfo.maxRelatedItemCount; // MAX_RELATED_ITEM_COUNT;
    $scope.param.referrer = "Unknown";
    $scope.param.sessionId = getSessionId();

    $scope.param.id = faqId;
    _load(true);
  };
  $scope.nextFaqWithId = function(faqId) {
    $scope.param.id = faqId;
    _load(true);
  };
  $scope.goBack = function () {
    if ($scope.historyQueue.length > 1) {
      $scope.loading = true;
      $scope.historyQueue.pop();
      $scope.result = $scope.historyQueue[$scope.historyQueue.length-1];
      $scope.htmlContent = $sce.trustAsHtml($scope.result.Body);
      $scope.isRoot = $scope.historyQueue.length > 1 ? false : true;
      $scope.loading = false;
    }
    else {
      console.log("You can't go back on root status.");
    }
  };
  $scope.getPreviousHtmlTitle = function() {
    if ($scope.historyQueue.length > 1) {
      return $scope.getHtmlText($scope.historyQueue[$scope.historyQueue.length -2].Title);
    }
  };
  $scope.updateRate = function(rate, isModal) {
    if ($scope.result.needRating) {
      $scope.result.needRating = false;
      $scope.result.rating = rate;
      if (isModal) {
        var currentHistory = $scope.historyQueue[$scope.historyQueue.length-1];
        currentHistory.needRating = false;
        currentHistory.rating = rate;
      }
      setFaqRate($scope.result.Id, rate);
      _postFaqRate($scope.result.Id, $scope.result.rating);
    }
  };
  $scope.getHtmlText = function(rawText) {
    return $sce.trustAsHtml(rawText);
  };

  var _load = function(isModal) {
    $scope.loading = true;

    var item = {};
    item['Id'] = $scope.param.id;
    item['RelatedItemsCount'] = $scope.param.relatedItemsCount;
    item['Referrer'] = $scope.param.referrer;
    // optional infos
    if ($scope.param.sessionId.length !== 0) {
      item['SessionId'] = $scope.param.sessionId;
    }
    if ($scope.param.uniqueId.length !== 0) {
      item['UniqueIdentifier'] = $scope.param.uniqueId;
    }
    var jsonString = JSON.stringify(item);

    $.ajax({
      type: "POST",
      url: apiInfo.apiFaqDetail, //URL_FAQ,
      data: jsonString,
      contentType: "application/json",
      success: function(data){
        // save sessionId, uniqueId
        if ($scope.param.sessionId.length === 0) {
          setSessionId(data.SessionId);
          $scope.param.sessionId = getSessionId();
        }
        if ($scope.param.uniqueId.length === 0) {
          setUniqueId(data.UniqueIdentifier);
          $scope.param.uniqueId = getUniqueId();
        }

        //console.log(data);
        data.rating = getFaqRate(data.Id);
        if (data.rating === 0) {
          data.needRating = true;
        } else {
          data.needRating = false;
        }

        if (isModal) {
          $scope.historyQueue.push(data);
          $scope.result = $scope.historyQueue[$scope.historyQueue.length-1];
          $scope.htmlContent = $sce.trustAsHtml($scope.result.Body);
          $scope.isRoot = $scope.historyQueue.length > 1 ? false : true;
        }
        else {
          $scope.result = data;
          $scope.htmlContent = $sce.trustAsHtml($scope.result.Body);
        }
        $scope.loading = false;
        $scope.$apply();
      },
      error: function(data) {
        console.log("FaqContentController: error");
        $scope.loading = false;
        $scope.$apply();
      }
    });
  };
  var _postFaqRate = function(faqId, rating) {
    //console.log("SENT the rating ["+faqId+"]["+rating+"]");
    var item = {};
    item['Id'] = faqId;
    item['Rate'] = rating;
    item['Scale'] = productFaqInfo.maxFaqLate; // MAX_FAQ_LATE;
    item['SessionId'] = getSessionId();
    var jsonString = JSON.stringify(item);
    $.ajax({
      type: "POST",
      url: apiInfo.apiFaqRate, //URL_FAQ_RATE,
      data: jsonString,
      contentType: "application/json"
    });
  };
}]);

// when you click modal view, start initial loading with faqId
$('#faqModalSample').on('show.bs.modal', function(e) {
  //console.log($(this).data('faqId'));
  angular.element('#faqModalSampleBody').scope().initModal($(this).data('faqId'));
});


/*
 * Faq Landing Controller
 */
app.controller("FaqLandingController", ['$scope', '$http', 'productFaqInfo', 'apiInfo', function($scope, $http, productFaqInfo, apiInfo) {

  $scope.tabNames = productFaqInfo.faqTabNames; //FAQ_TAB_NAMES;
  $scope.param = {
    product: '',
    pageSize: '',
    referrer: '',
    sessionId: '',
    uniqueId: ''
  };

  $scope.loading = false;
  $scope.faqGroups;       // full info

  $scope.load = function() {
    $scope.loading = true;

    var item = {};
    item['Product'] = $scope.param.product;
    item['PageSize'] = $scope.param.pageSize;
    item['Referrer'] = $scope.param.referrer;
    // optional infos
    if ($scope.param.sessionId.length !== 0) {
      item['SessionId'] = $scope.param.sessionId;
    }
    if ($scope.param.uniqueId.length !== 0) {
      item['UniqueIdentifier'] = $scope.param.uniqueId;
    }
    var jsonString = JSON.stringify(item);

    $.ajax({
      type: "POST",
      url: apiInfo.apiFaqList, //URL_FAQ_LIST,
      data: jsonString,
      contentType: "application/json",
      success: function(data){
        // save sessionId, uniqueId
        if ($scope.param.sessionId.length === 0) {
          setSessionId(data.SessionId);
          $scope.param.sessionId = getSessionId();
        }
        if ($scope.param.uniqueId.length === 0) {
          setUniqueId(data.UniqueIdentifier);
          $scope.param.uniqueId = getUniqueId();
        }

        //console.log(data);
        // MARK: remove if faq count === 0 in array
        $scope.faqGroups = [];
        for (var index = 0; index < data.FaqPages.length; index++) {
          if (data.FaqPages[index].Count > 0) {
            $scope.faqGroups.push(data.FaqPages[index]);
          }
        }

        $scope.loading = false;
        $scope.$apply();
      },
      error: function(data) {
        console.log("FaqLandingController: error");

        $scope.loading = false;
        $scope.$apply();
      }
    });
  };

  $scope.moveToPositionWithId = function(targetId) {
    // MARK: same code as main initializeFaqScroll()
    var offset = $(targetId).offset().top - headerBottomHeight;
    if ($('.ING-tab-header').size() === 1) {
      offset = $(target).offset().top - (headerBottomHeight + $('.ING-tab-header .tabs-wrapper').height());
    }
    $('body, html').stop().animate({scrollTop : offset}, 500, "easeOutQuint");
  };

  var _init = function () {

    /*
    var parameters = $.deparam.querystring();

    // term
    if (typeof parameters.product !== 'undefined') {
      $scope.param.product = parameters.product;
    } else {
      $scope.param.product = $scope.tabNames[0]; //FAQ_TAB_NAMES[0];
    }
    // pageSize
    if (typeof parameters.pageSize !== 'undefined') {
      $scope.param.pageSize = parameters.pageSize;
    } else {
      $scope.param.pageSize = productFaqInfo.maxFaqListCount; // MAX_FAQ_LIST_COUNT;
    }
    // referrer
    if (typeof parameters.referrer !== 'undefined') {
      $scope.param.referrer = parameters.referrer;
    } else {
      // MARK: referrer is same as product at the moment.
      $scope.param.referrer = parameters.product;
    }
    // sessionId
    if (typeof parameters.sessionId !== 'undefined') {
      $scope.param.sessionId = parameters.sessionId;
    } else {
      $scope.param.sessionId = getSessionId();
    }
    // sessionId
    if (typeof parameters.uniqueId !== 'undefined') {
      $scope.param.uniqueId = parameters.uniqueId;
    } else {
      $scope.param.uniqueId = getUniqueId();
    }
    */

    var isReady = true;

    var product = getUrlParameterByName('product');
    var pageSize = getUrlParameterByName('pageSize');
    var referrer = getUrlParameterByName('referrer');
    var sessionId = getUrlParameterByName('sessionId');
    var uniqueId = getUrlParameterByName('uniqueId');

    // term
    $scope.param.product = ( product !== undefined ) ? product : $scope.tabNames[0]; //FAQ_TAB_NAMES[0];
    // pageSize
    $scope.param.pageSize = ( pageSize !== undefined ) ? pageSize : productFaqInfo.maxFaqListCount; // MAX_FAQ_LIST_COUNT;
    // referrer
    $scope.param.referrer = ( referrer !== undefined ) ? referrer : product;
    // sessionId
    $scope.param.sessionId = ( sessionId !== undefined ) ? sessionId: getSessionId();
    // sessionId
    $scope.param.uniqueId = ( uniqueId !== undefined ) ? uniqueId : getUniqueId();

    $scope.content = '';

    if (isReady) {
      $scope.load();
    }
  }

  _init();
}]);


/*
 * Search List Controller
 */
app.controller("SearchListController", ['$scope', '$sce', '$http', 'productFaqInfo', 'apiInfo', function($scope, $sce, $http, productFaqInfo, apiInfo) {

  $scope.loading;
  $scope.loadingPartial;
  $scope.content;
  $scope.noContent = false;
  $scope.totalCount = 0;
  $scope.pagenationInfo = {};

  $scope.param = {
    term: '',
    page: '',
    pageSize: '',
    relatedItemCount: '',
    sessionId: '',
    uniqueId: '',
    productInfo: {
      id: '',
      title: '',
      count: ''
    },
    filterInfos: []
  };

  $scope.isAll = function() {
    if (String($scope.param.productInfo.id).length > 0) {
      return false;
    }
    else {
      return true;
    }
  };
  $scope.getCurrentProductName = function() {
    var name = '';
    if ($scope.param.productInfo.title.length > 0) {
      name = $scope.param.productInfo.title;
    }
    else {
      name = "All";
    }
    return name;
  };
  $scope.getProductCount = function(productName) {
    var totalCount = 0;
    if (typeof $scope.content !== 'undefined') {
      if (productName.length > 0) {
        for (var index = 0; index < $scope.content.Products.length; index++) {
          if ($scope.content.Products[index].Title === productName) {
            totalCount = $scope.content.Products[index].Count;
            break;
          }
        }
      }
      else {
        //totalCount = parseInt($scope.content.TotalMatchedRecords, 10);
        totalCount = $scope.totalCount;
      }
    }
    return totalCount;
  };
  $scope.getTotalCount = function() {
    var totalCount = 0;
    if (typeof $scope.content !== 'undefined') {
      //totalCount = parseInt($scope.content.TotalMatchedRecords, 10);
      totalCount = $scope.totalCount;
    }
    return totalCount;
  };
  $scope.resetFilters = function() {
    for (var index = 0; index < $scope.param.filterInfos.length; index++) {
      var filterInfo = $scope.param.filterInfos[index];
      filterInfo.checkbox_status = false;
    }
  };
  $scope.redirectForMarking = function(type, info) {
    //console.log("type: " + type + ", info: " + info);
    var item = {};
    item['Id'] = info;
    item['SessionId'] = getSessionId();
    var jsonString = JSON.stringify(item);
    $.ajax({
      type: "POST",
      url: apiInfo.apiMarkViewed, //URL_MARK_VIEWED,
      data: jsonString,
      contentType: "application/json"
    });
    if (type === "faq") {
      setTimeout(function() {
        window.location = '/faq-result.html?faqid='+info;
      }, 500);
    } else {
      setTimeout(function() {
        window.location = info;
      }, 500);
    }
  };
  $scope.loadWithProductName = function(productName) {
    if (productName !== $scope.param.productInfo.title) {
      _setParamWithProductName(productName);
      _resetFilters();
      _load(true);
    };
  };
  $scope.loadWithFilter = function() {
    $('[href="#collapseSearchFilter"]').addClass('collapsed');
    $('#collapseSearchFilter').collapse( 'hide' );
    $scope.param.page = 1;
    _load(true);
  };
  $scope.loadWithPageIndex = function(pageIndex) {
    if (pageIndex === $scope.pagenationInfo.currentPage) {
      return;
    }
    if (pageIndex < 1) {
      return;
    }
    if (pageIndex > $scope.pagenationInfo.pageList.length) {
      return;
    }
    $scope.param.page = pageIndex;
    _load(true);
  };
  $scope.getHtmlText = function(rawText) {
    return $sce.trustAsHtml(rawText);
  };
  $scope.showPagenation = function() {
    return $scope.totalCount > productFaqInfo.maxSearchItemCount; // MAX_SEARCH_ITEM_COUNT;
  };

  var _load = function(isPartial) {
    if (isPartial) {
      $scope.loadingPartial = true;
    } else {
      $scope.loading = true;
    }

    var item = {};
    item['Term'] = $scope.param.term;
    item['Page'] = $scope.param.page;
    item['PageSize'] = $scope.param.pageSize;
    item['RelatedItemsCount'] = $scope.param.relatedItemCount;
    // optional infos
    if ($scope.param.sessionId.length !== 0) {
      item['SessionId'] = $scope.param.sessionId;
    }
    if ($scope.param.uniqueId.length !== 0) {
      item['UniqueIdentifier'] = $scope.param.uniqueId;
    }
    if (String($scope.param.productInfo.id).length > 0) {
      item['Product'] = {
        Id: $scope.param.productInfo.id,
        Title: $scope.param.productInfo.title,
        Count: $scope.param.productInfo.count
      };
    }
    if ($scope.param.filterInfos.length > 0) {
      var isChecked = false;
      for (var i = 0; i < $scope.param.filterInfos.length; i++) {
        var filter = $scope.param.filterInfos[i];
        if (filter.checkbox_status === true) {
          isChecked = true;
          break;
        }
      }
      if (isChecked) {
        var checkedFilterInfos = [];
        for (i = 0; i < $scope.param.filterInfos.length; i++) {
          filter = $scope.param.filterInfos[i];
          if (filter.checkbox_status) {
            var newFilter = {};
            newFilter.Id = filter.Id;
            newFilter.Title = filter.Title;
            newFilter.Count = filter.Count;
            checkedFilterInfos.push(newFilter);
          }
        }
        item['FilterBy'] = checkedFilterInfos;
      }
    }
    var jsonString = JSON.stringify(item);
    $scope.noResult = false;

    $.ajax({
      type: "POST",
      url: apiInfo.apiSearchFaqList, //URL_SEARCH,
      data: jsonString,
      contentType: "application/json",
      success: function(data){
        // save sessionId, uniqueId
        if ($scope.param.sessionId.length === 0) {
          setSessionId(data.SessionId);
          $scope.param.sessionId = getSessionId();
        }
        if ($scope.param.uniqueId.length === 0) {
          setUniqueId(data.UniqueIdentifier);
          $scope.param.uniqueId = getUniqueId();
        }
        // save total count
        if (String($scope.param.productInfo.id).length === 0) {
          $scope.totalCount = data.TotalMatchedRecords;
        }
        // save data
        $scope.content = data;
        // console.log($scope.content);
        // update filter
        _updateFilterParamWithFilterList(data.FilterBy);
        // update noResult
        if (parseInt($scope.content.TotalMatchedRecords, 10) > 0) {
          $scope.noContent = false;
        } else {
          $scope.noContent = true;
        }

        if (isPartial) {
          $scope.loadingPartial = false;
        } else {
          $scope.loading = false;
        }

        // update pagenation
        _updatePagination();
        $('body, html').stop().animate({ scrollTop: 0 }, '500','swing');
        $scope.$apply();
      },
      error: function(data) {
        console.log("SearchListController: error");
        if (isPartial) {
          $scope.loadingPartial = false;
        } else {
          $scope.loading = false;
        }
        $scope.noContent = true;
        $scope.$apply();
      }
    });
  };
  var _init = function() {
    // basic info
    $scope.param.page = 1;
    $scope.param.pageSize = productFaqInfo.maxSearchItemCount; // MAX_SEARCH_ITEM_COUNT;
    $scope.param.relatedItemCount = productFaqInfo.maxRelatedItemCount; // MAX_RELATED_ITEM_COUNT;
    $scope.param.sessionId = getSessionId();
    $scope.param.uniqueId = getUniqueId();

    // specific info
    // var parameters = $.deparam.querystring();
    // if (typeof parameters.term !== 'undefined') {
    //   $scope.param.term = parameters.term;
    //   _load(false);
    // }
    // else {
    //   $scope.noContent = true;
    // }

    // martin
    var term = getUrlParameterByName('term');
    if (term !== undefined) {
      $scope.param.term = term;
      _load(false);
    }
    else {
      $scope.noContent = true;
    }

  };
  var _setParamWithProductName = function(productName) {
    $scope.param.page = 1;

    var productInfo = null;
    for (var index = 0; index < $scope.content.Products.length; index++) {
      if ($scope.content.Products[index].Title === productName) {
        productInfo = $scope.content.Products[index];
        break;
      }
    }
    if (productInfo !== null) {
      $scope.param.productInfo.id     = productInfo.Id;
      $scope.param.productInfo.title  = productInfo.Title;
      $scope.param.productInfo.count  = productInfo.Count;
    }
    else {
      $scope.param.productInfo.id     = '';
      $scope.param.productInfo.title  = '';
      $scope.param.productInfo.count  = '';
    }
  };
  var _resetFilters = function() {
    $scope.param.filterInfos = [];
  }
  var _updateFilterParamWithFilterList = function(filterList) {
    var currentFilterInfos = $scope.param.filterInfos;
    var newFilterInfos = [];

    for (var i = 0; i < filterList.length; i++) {
      var filter = filterList[i];
      var isExisting = false;
      for (var j = 0; j < currentFilterInfos.length; j++) {
        var oldFilter = currentFilterInfos[j];
        if (oldFilter.Id === filter.Id) {
          newFilterInfos.push(oldFilter);
          isExisting = true;
          break;
        }
      }
      if (!isExisting) {
        var newFilter = filter;
        newFilter.checkbox_status = false;
        newFilterInfos.push(newFilter);
      }
    }
    $scope.param.filterInfos = newFilterInfos;
  };
  var _updatePagination = function() {
    var productName = $scope.getCurrentProductName();
    var totalCount = 0;
    if (productName === 'All') {
      totalCount = $scope.totalCount;
    } else {
      for (var index = 0; index < $scope.content.Products.length; index++) {
        if (productName === $scope.content.Products[index].Title) {
          totalCount = $scope.content.Products[index].Count;
          break;
        }
      }
    }

    var pageCount = Math.ceil(totalCount / productFaqInfo.maxSearchItemCount); // MAX_SEARCH_ITEM_COUNT);
    var pageList = [];
    for (index = 1; index <= pageCount; index++) {
      pageList.push(index);
    }
    $scope.pagenationInfo.currentPage = $scope.param.page;
    $scope.pagenationInfo.pageList = pageList;
    $scope.pagenationInfo.startIndex = (parseInt($scope.pagenationInfo.currentPage, 10) - 1) * parseInt($scope.param.pageSize, 10) + 1;

    var maxNumber = parseInt($scope.pagenationInfo.currentPage, 10) * parseInt($scope.param.pageSize, 10);
    $scope.pagenationInfo.endIndex = maxNumber < totalCount ? maxNumber : totalCount;
  };

  _init();
}]);



// SIDE FAQ CONTROLLER
// ----------------------------------------------
app.controller("SideFaqController", ['$scope', '$http', '$sce', '$timeout', '$q', 'apiInfo', 'sideFaqInfo', 'templateInfo', function($scope, $http, $sce, $timeout, $q, apiInfo, sideFaqInfo, templateInfo) {

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
      if( sideFaqInfo.registeredProductKeys.indexOf(productId) > -1 ) {
        //console.log("This is a Product Key");
        $scope.searchInfo.productId = productId;
        _showProductFaqPage();
      }
      else {
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
  // $scope.getSuggestionList = function (originKeyword) {
  //   var newSuggestionList = $scope.searchInfo.suggestionList.slice();
  //   if (originKeyword/* && newSuggestionList.indexOf(originKeyword) === -1*/) {
  //     var index = newSuggestionList.indexOf(originKeyword);
  //     if (index > -1) {
  //       newSuggestionList.splice(index, 1);
  //     }
  //     newSuggestionList.unshift(originKeyword);
  //   }
  //   return newSuggestionList;
  // };

  // $scope.refreshSuggestionList = function (str) {
  //   if (str.length >= sideFaqInfo.minKeywordStrLength) {
  //     _loadSuggestionList(str, function (data) {
  //       if (data.Suggestions.length > 0) {
  //         $scope.searchInfo.suggestionList = [];
  //         angular.forEach(data.Suggestions, function (keyword, index) {
  //           $scope.searchInfo.suggestionList.push(keyword);
  //         });
  //       }
  //     });
  //   }
  //   else {
  //     $scope.searchInfo.suggestionList = [];
  //   }
  // };

  $scope.refreshSuggestionListEx = function (str) {
    var safeStr = htmlDecode(htmlEncode(str));

    if (str.length >= sideFaqInfo.minKeywordStrLength) {
      var deferred = $q.defer();
      _loadSuggestionList(safeStr, function (data) {
        if (data.Suggestions.length > 0) {
          $scope.searchInfo.suggestionList = [];
          angular.forEach(data.Suggestions, function (keyword, index) {
            $scope.searchInfo.suggestionList.push(keyword);
          });

          var keyword = angular.copy($scope.searchInfo.selected);
          var index = $scope.searchInfo.suggestionList.indexOf(keyword);
          if (index > -1) {
            $scope.searchInfo.suggestionList.splice(index, 1);
          }
          $scope.searchInfo.suggestionList.unshift(keyword);
        }
        else {
          $scope.searchInfo.suggestionList = [htmlToPlainText(str)];//[htmlEncode(str)];
        }

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
      var title = faqListInfo.Results.length +
      " result" + (faqListInfo.Results.length > 1 ? "s" : "") +
      " for " +
      "\"" +
      (faqListInfo.CorrectedTerm === null ? htmlDecode(htmlEncode($scope.searchInfo.selected)) : htmlDecode(faqListInfo.CorrectedTerm)) +
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

  $scope.searchFaqListEx = function () {
    if ($scope.searchInfo.suggestionList[0] != undefined) {
      $scope.searchInfo.selected = $scope.searchInfo.suggestionList[0];
    }
    $scope.searchFaqList();
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

      // Tracking --------------
      if( enableTracking ) {
        //console.log('Search Term:' + $scope.searchInfo.selected);
        var evt_help_support_tracking = new CustomEvent('hs_tab_event', {'detail': {'eventType':'search','searchTerm': $scope.searchInfo.selected} });
        $("button.side-faq-button")[0].dispatchEvent(evt_help_support_tracking);
      }
      //------------------------

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

      // Tracking --------------
      if( enableTracking ) {
        //console.log('FAQ ID:' + faqId);
        var evt_help_support_tracking = new CustomEvent('hs_tab_event', {'detail': {'eventType':'faq_click','faqID': faqId} });
        $("button.side-faq-button")[0].dispatchEvent(evt_help_support_tracking);
      }
      //------------------------

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
    // console.log(error);
    $scope.pageInfo.contentLoading = false;
    $scope.pageInfo.searchLoading = false;
  };


  // HELPERS
  $scope.trustAsHtml = function (value) {
    return $sce.trustAsHtml(value);
  };
}]);


// NEW SEARCH CONTROLLER
// ----------------------------------------------
app.controller("NewSearchController", ['$scope', '$http', '$sce', '$window', '$q', 'apiInfo', 'sideFaqInfo', function($scope, $http, $sce, $window, $q, apiInfo, sideFaqInfo) {

  $scope.searchInfo = {};
  $scope.searchInfo.selected = undefined;
  $scope.searchInfo.suggestionList = [];

  $scope.init = function () {
    var term = getUrlParameterByName('term'); //$.deparam.querystring().term;
    if (term !== undefined) {
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

    if (str.length >= sideFaqInfo.minKeywordStrLength) {
      var deferred = $q.defer();
      var params = {};
      params.Term = encodedStr; //str;
      params.Count = sideFaqInfo.maxSuggestionCount;
      params.Referrer = "Web";
      _loadContent(apiInfo.apiSuggestionList, params, function(data) {
        if (data.Suggestions.length > 0) {
          $scope.searchInfo.suggestionList = [];
          angular.forEach(data.Suggestions, function (keyword, index) {
            $scope.searchInfo.suggestionList.push(keyword);
          });
          var keyword = angular.copy($scope.searchInfo.selected);
          var index = $scope.searchInfo.suggestionList.indexOf(keyword);
          if (index > -1) {
            $scope.searchInfo.suggestionList.splice(index, 1);
          }
          $scope.searchInfo.suggestionList.unshift(keyword);
        }
        else {
          $scope.searchInfo.suggestionList = [encodedStr];
        }
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
    if (document.documentElement.clientWidth > 766) {
      if (document.querySelector(".search-field").offsetWidth < 50){
      document.querySelector(".search-field").style.width = "170px";
      document.querySelector(".search-field").style.position = "absolute";
      document.querySelector(".search-field").style.right = "0";
      document.querySelectorAll(".search-control")[1].focus();
      document.querySelectorAll("input[name=term]")[1].setAttribute("onblur", "focusWatcher()");
      }
      else {
      $scope.searchInfo.selected = htmlDecode($scope.searchInfo.selected);
      var url = sideFaqInfo.searchPageUrl.replace('[KEYWORD]', htmlDecode($scope.searchInfo.selected));
      $window.location = encodeURI(url);
      }
    }
    else {
      $scope.searchInfo.selected = htmlDecode($scope.searchInfo.selected);
      var url = sideFaqInfo.searchPageUrl.replace('[KEYWORD]', htmlDecode($scope.searchInfo.selected));
      $window.location = encodeURI(url);
    }
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
    console.log(error);
  };

  // HELPERS
  $scope.trustAsHtml = function (value) {
    return $sce.trustAsHtml(value);
  };
}]);


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
    // Tracking --------------
    if( enableTracking ) {
      //console.log('SIDE FAQ opened');
      var evt_help_support_tracking = new CustomEvent('hs_tab_event', { 'eventType':'activation', 'detail': {} });
      $("button.side-faq-button")[0].dispatchEvent(evt_help_support_tracking);
    }
    //------------------------

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
//  if ($('body').hasClass('active-side-faq')) {
//    clickSideFaqButton();
//    event.preventDefault();
//  }
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

function focusWatcher() {
  document.querySelector(".search-field").style.width = "38px";
}

// ADDITIONAL JQUERY
// ----------------------------------------------
$(document).ready( function() {
  $('.rating > .star').hover(function() {
    if (!$(this).parent().hasClass('disabled')) {
      $( this ).css( 'color', '#ff6600' );
      $( this ).prevAll().css( 'color', '#ff6600' );
    }
  }, function() {
    if (!$(this).parent().hasClass('disabled')) {
      $( this ).css( 'color', '#bdbdbd' );
      $( this ).prevAll().css( 'color', '#bdbdbd' );
    }
  });
  $('.rating').hover(function() {
  }, function() {
    $(this).find('.star').removeAttr('style');
  });

  // MARK: Defect No.37
  $('.search-form').submit(function(event) {
    if ($(this).find('input.input-search').val().length <= 0) {
      event.preventDefault();
    }
  });
});
