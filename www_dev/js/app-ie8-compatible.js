/*
 * ING Dynamic Angular App JS
 */


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


// Definitions
// ----------------------------------------------
var URL_SUGGESTIONS = "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getsuggestions";
var URL_PRODUCT_FAQS = "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getproductfaqs";
var URL_SEARCH = "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/search";
var URL_FAQ = "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getfaq";
var URL_FAQ_RATE = "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/rate";
var URL_FAQ_LIST = "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/getfaqpage";
var URL_MARK_VIEWED = "/ReverseProxy/KnowledgeBaseService/V1/KnowledgeBaseService.svc/json/markviewed";

var MAX_SUGGESTION_COUNT = 10;
var MAX_PRODUCT_FAQ_COUNT = 10;
var MAX_RELATED_ITEM_COUNT = 10;
var MAX_FAQ_LATE = 5;
var MIN_SEARCH_TEXT_LENGTH = 3;
var MAX_SEARCH_ITEM_COUNT = 10;
var MAX_FAQ_LIST_COUNT = 100;

var FAQ_TAB_NAMES = [
  "General",
  "Security",
  "Orange Everyday",
  "Savings",
  "Home Loans",
  "Superannuation",
  "Business"
];

// TEST (temporary)
//var KEY_PRODUCT = "Orange Everyday";
var KEY_REFERRER = "Web";
var defaultSearchProduct = "All";
var defaultSearchFilter = ["All"];




// Angular App
// ----------------------------------------------
var app = angular.module("ING-App", ['ngAnimate']);


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
 * Search Suggestion Controller
 */
app.controller("SearchSuggestionController", ['$scope', '$element', '$http', function($scope, $element, $http) {
  $scope.param = {
    term: '',
    count: '',
    referrer: '',
    sessionId: '',
    uniqueId: ''
  };
  $scope.loading = false;
  $scope.suggestions = [];

  var oldEventIndex = 0;
  $scope.getSuggestionSearch = function() {
    oldEventIndex++;
    var eventIndex = oldEventIndex;
    setTimeout(function() {
      if ($scope.param.term.length < MIN_SEARCH_TEXT_LENGTH) {
        $element.find('.dropdown-suggestions').removeClass('active');
        _reset();
        oldEventIndex = 0;
      } else {
        if (eventIndex === oldEventIndex) {
          oldEventIndex = 0;
          _load();
        }
      }
    }, 500);
  };
  $scope.clearSuggestions = function() {
    // MARK: need to redirect before hide when user click link
    setTimeout(function() {
//      $scope.param.term = '';
      $('.dropdown-suggestions').removeClass('active');
      $scope.suggestions = [];
    }, 200);
  }

  var _load = function() {
    $scope.loading = true;

    var item = {};
    item['Term'] = $scope.param.term;
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
      url: URL_SUGGESTIONS,
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

        var rawArray = [];
        if (data.Suggestions.length === 0) {
          // MARK: defect No.26
          // rawArray.push({
          //   "term": 'No suggestions'
          // });
        }
        else {
          for (var index = 0; index < data.Suggestions.length; index++) {
            rawArray.push({"term": data.Suggestions[index]});
          }
        }
        $scope.suggestions = rawArray;
        // need to refresh forcely
        $scope.loading = false;
        $scope.$apply();

        $element.find('.dropdown-suggestions').addClass('active');
      },
      error: function(data) {
        console.log("SearchSuggestionController: error");
        $scope.loading = false;
        $scope.$apply();
      }
    });
  };

  var _reset = function () {
    $scope.suggestions = [];  // stop blinking...
    $scope.loading = false;
  };

  var _init = function () {
    var parameters = $.deparam.querystring();
    if (typeof parameters.term !== 'undefined') {
      $scope.param.term = parameters.term;
    } else {
      $scope.param.term = '';
    }
    $scope.param.count = MAX_SUGGESTION_COUNT;
    $scope.param.referrer = "Unknown";
    $scope.param.sessionId = getSessionId();
    $scope.param.uniqueId = getUniqueId();
    _reset();
  };

  _init();
}]);


/*
 * Product Faq List Controller
 */
app.controller("ProductFaqListController", ['$scope', '$http', function($scope, $http) {
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
      url: URL_PRODUCT_FAQS,
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
    $scope.param.count = MAX_PRODUCT_FAQ_COUNT;
    $scope.param.referrer = KEY_REFERRER;
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
app.controller("FaqContentController", ['$scope', '$http', '$sce', function($scope, $http, $sce) {
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

    $scope.param.relatedItemsCount = MAX_RELATED_ITEM_COUNT;
    $scope.param.referrer = "Unknown";
    $scope.param.sessionId = getSessionId();
    $scope.param.uniqueId = getUniqueId();
    
    var parameters = $.deparam.querystring();
    $scope.param.id = parameters.faqid; // change request (4 Jun 2015)   

    _load(false);
  };
  // PAGE: product-faq-list.html
  $scope.initModal = function(faqId) {
    //console.log("initModal: " + faqId);
    $scope.historyQueue = [];
    $scope.isRoot = true;
    $scope.result = '';
    $scope.htmlContent = '';

    $scope.param.relatedItemsCount = MAX_RELATED_ITEM_COUNT;
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
      url: URL_FAQ,
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
    item['Scale'] = MAX_FAQ_LATE;
    item['SessionId'] = getSessionId();
    var jsonString = JSON.stringify(item);
    $.ajax({
      type: "POST",
      url: URL_FAQ_RATE,
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
app.controller("FaqLandingController", ['$scope', '$http', function($scope, $http) {

  $scope.tabNames = FAQ_TAB_NAMES;
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
      url: URL_FAQ_LIST,
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
    var parameters = $.deparam.querystring();
    var isReady = true;

    // term
    if (typeof parameters.product !== 'undefined') {
      $scope.param.product = parameters.product;
    } else {
      $scope.param.product = FAQ_TAB_NAMES[0];
    }
    // pageSize
    if (typeof parameters.pageSize !== 'undefined') {
      $scope.param.pageSize = parameters.pageSize;
    } else {
      $scope.param.pageSize = MAX_FAQ_LIST_COUNT;
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
app.controller("SearchListController", ['$scope', '$sce', '$http', function($scope, $sce, $http) {
  
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
      url: URL_MARK_VIEWED,
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
    return $scope.totalCount > MAX_SEARCH_ITEM_COUNT;
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
      url: URL_SEARCH,
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
    $scope.param.pageSize = MAX_SEARCH_ITEM_COUNT;
    $scope.param.relatedItemCount = MAX_RELATED_ITEM_COUNT;
    $scope.param.sessionId = getSessionId();
    $scope.param.uniqueId = getUniqueId();

    // specific info
    var parameters = $.deparam.querystring();
    if (typeof parameters.term !== 'undefined') {
      $scope.param.term = parameters.term;
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

    var pageCount = Math.ceil(totalCount / MAX_SEARCH_ITEM_COUNT);
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
