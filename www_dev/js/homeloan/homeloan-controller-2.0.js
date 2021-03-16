/*
 * ING Homeloan Controllers
 * 11 Mar 2021: Lash
 * Version 2.0
 *
 * Q: $150K to $500K, INV, P&I, All borrowings, MS150_500_INV_ALL, CP_MS150_500_INV_ALL ???
 *
 */

$(document).ready(function () {
	var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
	if (isIOS) {
		$('html').addClass('iOS');
	}
});

// Inject Homeloan-App into ING-App
angular.module("Homeloan-App", ['ING-App', 'slickCarousel', 'dynamicNumber']);

angular.module('Homeloan-App').controller('HomeloanController', ["$scope", "$timeout", function ($scope, $timeout) {
	$scope.mainInfo = {
		readyToStart: false,
		activePage: 0,  // only using initializing
		tabInfos: [
			{ title: 'Compare home loans', icon: '/svgs/homeloan-symbols.svg#homeloan-svg-home' },
			{ title: 'Tools & calculators', icon: '/svgs/homeloan-symbols.svg#homeloan-svg-calculator' },
			{ title: 'How-to guides, hints & tips', icon: '/svgs/homeloan-symbols.svg#homeloan-svg-question' }
		],
		getInterestRateByCode: function (code) {
			return _getInterestRate(code);
		},
		startCompare: function () {
			$('[data-toggle="tab"][href="#main-tab-0"]').trigger('click');
			$timeout(function () {
				$scope.mainInfo.refineRepayment();
			});
		},
		getIRString: function (number) {
			return Number(number).formatMoney(2, '.', ',');
		},
		isTableOpen: false,
		goToComparison: function() {
			$scope.mainInfo.updateActivePage(0);
			$scope.mainInfo._scrollUp();
		},
		updateActivePage: function(newPageIndex) {
			$scope.mainInfo.activePage = newPageIndex;
		},
		_scrollUp: function() {
			var homeloanContent = document.querySelector('.homeloan-content'),
				homeloanContentRect = homeloanContent.getBoundingClientRect(),
				topMargin = 100, // 60 for the sticky header + 40 extra
				targetScrollPosition = homeloanContentRect.top + window.scrollY - topMargin;

			window.scrollTo(0, targetScrollPosition);
		}
	};

	var _interestRateInfo = undefined;

	$scope.init = function () {
		//console.log('HomeloanController initialized.');
		var info = $('#HomeloanController').data('interestRateInfo');
		if (typeof info !== 'undefined') {
			_saveInterestRates(info);
		}
	};

	// communicate with InterestRateManager.js
	$scope.notifyInterestRateInfo = function (info) {
		_saveInterestRates(info);
	};

	var _saveInterestRates = function (info) {
		_interestRateInfo = info;
		//console.log('Ready to use InterestRateInfo');
		_startApp();
	};

	var _getInterestRate = function (code) {
		var rate = null;
		if (angular.isDefined(_interestRateInfo)) {
			angular.forEach(_interestRateInfo.InterestRates, function (info, index) {
				if (info.RateCode === code) {
					rate = info.Rate;
				}
			});
		}
		return rate;
	};

	var _startApp = function () {
		$timeout(function () {
			$scope.mainInfo.updateCalculator();
			$scope.mainInfo.readyToStart = true;

			// for tab header svgs on IE
			svg4everybody();
		});
	};
}]);


// FIRST TAB CONTROLLER
// ----------------------------------------------
angular.module('Homeloan-App').controller('HomeloanCompareController', ["$scope", "$timeout", "$uibModal", "$sce", function ($scope, $timeout, $uibModal, $sce) {
	// PAGE INFO
	$scope.pageInfo = {
		title: 'Add your basics to compare home loans:',
		repaymentOptionsCollapsed: true,
		borrowingInputShown: false,
		toggleRepaymentOptions: function () {
			$scope.pageInfo.repaymentOptionsCollapsed = !$scope.pageInfo.repaymentOptionsCollapsed;
			$timeout(function () {
				$scope.pageInfo.borrowingInputShown = !$scope.pageInfo.borrowingInputShown;
			}, 500);

			// animation for refine repayment options
			var offset = $('.module-tab-content').offset().top - 60.0;
			$('body, html').animate({ 'scrollTop': offset + 'px' }, 500);
		},
		refineRepayment: function () {
			if (mediaQuery == media_xs) {
				$scope.pageInfo.openModalMobileCalculator();
			}
			else {
				if ($scope.pageInfo.repaymentOptionsCollapsed) {
					$scope.pageInfo.repaymentOptionsCollapsed = !$scope.pageInfo.repaymentOptionsCollapsed;
					$timeout(function () {
						$scope.pageInfo.borrowingInputShown = !$scope.pageInfo.borrowingInputShown;
					}, 500);
				}
				// animation for refine repayment options
				var offset = $('.module-tab-content').offset().top - 60.0;
				$('body, html').animate({ 'scrollTop': offset + 'px' }, 500);
			}
		},
		// MOBILE MODAL CALCULATOR
		openModalMobileCalculator: function () {
			var modal = $uibModal.open({
				animation: true,
				templateUrl: 'modalMobileCalculatorTemplate.html',
				controller: 'ModalMobileCalculatorController',
				windowClass: 'homeloan-modal-style',
				resolve: {
					calcOptions: function () {
						return $scope.calcOptions;
					}
				}
			});
			modal.result.then(function (calcOptions) {
				$scope.calcOptions = calcOptions;
			}, function () {
				//console.log('Modal dismissed at: ' + new Date());
			});
		},
		// MOBILE MODAL TABLE
		openModalMobileFixedRateTable: function () {
			var modal = $uibModal.open({
				animation: true,
				templateUrl: 'modalMobileFixedRateTableTemplate.html',
				controller: 'ModalMobileFixedRateTableController',
				windowClass: 'homeloan-modal-style',
				resolve: {
					fixedRateTableInfo: function () {
						return $scope.fixedRateTableInfo;
					},
					mainInfo: function () {
						return $scope.mainInfo;
					},
				}
			});
		},
		// MODAL GENERIC INFORMATION
		openModalGenericInformation: function (index) {
			var templateUrl = undefined;
			var title = $scope.cardInfos[index].title;
			if (title === 'Mortgage Simplifier') {
				templateUrl = 'modalMortgageSimplifierInformationTemplate.html';
			} else if (title === 'Orange Advantage') {
				templateUrl = 'modalOrangeAdvantageInformationTemplate.html';
			} else if (title === 'Fixed Rate Loan') {
				if ($scope.calcOptions.optionPurpose.selected == 0) {
					templateUrl = 'modalFixedRateLiveInInformationTemplate.html';
				}
				else if ($scope.calcOptions.optionPurpose.selected == 1) {
					templateUrl = 'modalFixedRateInvestInInformationTemplate.html';
				}
			}

			if (angular.isDefined(templateUrl)) {
				$uibModal.open({
					animation: true,
					templateUrl: templateUrl,
					controller: 'ModalGenericController',
					windowClass: 'blue-modal-style',
				});
			}
		},
		// SLICK CAROUSEL
		slickConfig: {
			infinite: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: true,
			prevArrow: '<button type="button" class="slick-prev"><span class="icon-font icon-arrow-left"></span></button>',
			nextArrow: '<button type="button" class="slick-next"><span class="icon-font icon-arrow-right"></span></button>',
			// event: {
			//   init: function(event, slick) {
			//     //console.log('slick initialized...');
			//   }
			// }
		}
	};
	// register refineRepayment method on root controller in order to call it from outside of this controller
	$scope.mainInfo.refineRepayment = function () {
		$scope.pageInfo.refineRepayment();
	};
	$scope.mainInfo.selectFixedRate = function (tableIndex, rowIndex) {
		//console.log(tableIndex + ', ' + rowIndex);
		$scope.fixedRateTableInfo.updateFixedRateCardInfo(tableIndex, rowIndex);
		$scope.mainInfo.isTableOpen = false;
	};

	// v2.0 - _rateCode[0].code == LVR90
	var _rateCode = [
		{ code: 'LVR90' },
		{ code: 'LVR80_90' },
		{ code: 'LVR70_80' },
		{ code: 'LVR60_70' },
		{ code: 'LVR50_60' },
		{ code: 'LVR50' },
	];

	// v2.0 - default options
	var _depositMenus = [
		{ name: '< 10%', value: 0 },
		{ name: '10% - 20%', value: 1 },
		{ name: '20% - 30%', value: 2 },
		{ name: '30% - 40%', value: 3 },
		{ name: '40% - 50%', value: 4 },
		{ name: '> 50%', value: 5 },
	];

	// CALCULATOR OPTIONS
	$scope.calcOptions = {
		optionPurpose: {
			title: 'Purpose:',
			menus: [
			  { name: 'To live in', value: undefined },
			  { name: 'To invest in', value: undefined },
			],
			selected: 0,
		},
		optionBorrowing: {
			title: 'Borrowing:',
			menus: [
				{ name: '< $150K', nameXs: '< $150K', value: '100000', threshold: 150000 },
				{ name: '$150K - <br/>$500K', nameXs: '$150K - $500K', value: '300000', threshold: 500000, doubleline: true },
				{ name: '> $500K', nameXs: '$500K - $1Million', value: '500000', threshold: 1000000, doubleline: true },
				{ name: '> $1Million', nameXs: '> $1Million', value: '1000000', threshold: Number.MAX_VALUE },
			],
			selected: 2,
			value: '0',
			isFromInput: false,
			isFromRadio: true,
		},
		optionDeposit: {
			title: 'Deposit:',
			// v2.0
			menus: _depositMenus,
			selected: _depositMenus[2],
		},
		optionRepayment: {
			title: 'Repayment type:',
			menus: [
				{ name: 'Principal & <br/>interest', value: '', doubleline: true },
				{ name: 'Interest only', value: 'interest' },
			],
			selected: 0,
		},
		optionFrequency: {
			title: 'Frequency:',
			menus: [
				{ name: 'Fortnightly', value: 26 },
				{ name: 'Monthly', value: 12 },
			],
			selected: { name: 'Monthly', value: 12 },
			selectedIndex: 1, // MARK: only for mobile!!
		},
		optionLoanTerm: {
			title: 'Loan term:',
			menus: [
				{ name: '5 years', value: 5 },
				{ name: '10 years', value: 10 },
				{ name: '15 years', value: 15 },
				{ name: '20 years', value: 20 },
				{ name: '25 years', value: 25 },
				{ name: '30 years', value: 30 },
			],
			selected: { name: '30 years', value: 30 },
		},
		forCard: {
			frequency: '[FREQUENCY]',
			description: '[DESCRIPTION]',
			descriptionFixedRate: '[DESCRIPTION-FIXEDRATE]',
		},
	};

	// CARD INFO
	$scope.cardInfos = [
		{
			title: 'Mortgage Simplifier',
			linkedUrl: '/home-loans/mortgage-simplifier.html',
			description: 'Pay no ongoing fees',
			interestInfo1: {
				name: 'Variable rate',
			},
			interestInfo2: {
				name: 'Comparison rate',
			},
			repaymentValue: undefined,
			features: [
				{
					icon: '',
					content: 'Unlimited additional repayments'
				},
				{
					icon: '',
					content: 'No interest offset'
				},
				{
					icon: '',
					content: 'Redraw facility'
				},
				{
					icon: '',
					content: 'Free ATMs everywhere in Australia (when you open an Orange Everyday)'
				},
				{
					icon: '',
					content: 'Ditch international transaction fees (when you open an Orange Everyday)'
				},
				{
					icon: '',
					content: 'Pay as you go servicing fees for switches or variations'
				},
				{
					icon: '',
					content: 'No ongoing monthly or annual account-keeping fees'
				},
				{
					icon: '',
					content: 'Interest rate discounts for new owner occupiers borrowings of $150,000+ with LVR of 90% or less'
				},
				{
					icon: '',
					content: 'Pay down on your home loan while you spend with <a href="/everyday-banking/everyday-round-up.html?pid=vis:hlpp:table:hleru">everyday round up</a>'
				}
			],
			alertInfo: {
				collapsed: true,
				content: '', //'You could save $59,612.37 and pay off your loan 4 years and 4 months quicker', // v2.0 - not being used and better not display this at all even though this is hidden in the page
			},
		},
		{
			title: 'Orange Advantage',
			linkedUrl: '/home-loans/orange-advantage.html',
			description: '100% Offset facility',
			interestInfo1: {
				name: 'Variable rate',
			},
			interestInfo2: {
				name: 'Comparison rate',
			},
			repaymentValue: undefined,
			features: [
				{
					icon: '',
					content: 'Unlimited additional repayments'
				},
				{
					icon: '',
					content: '100% interest offset'
				},
				{
					icon: '',
					content: 'Redraw facility'
				},
				{
					icon: '',
					content: 'Free ATMs everywhere in Australia (when you open an Orange Everyday)'
				},
				{
					icon: '',
					content: 'Ditch international transaction fees (when you open an Orange Everyday)'
				},
				{
					icon: '',
					content: 'No switch fees or variations fees. <br><i>Discharge and other fees may still apply</i>'
				},
				{
					icon: '',
					content: 'No monthly fees'
				},
				{
					icon: '',
					content: 'Low $299 annual fee'
				},
				{
					icon: '',
					content: 'Pay down on your home loan while you spend with <a href="/everyday-banking/everyday-round-up.html?pid=vis:hlpp:table:hleru">everyday round up</a>'
				}
			],
			alertInfo: {
				collapsed: true,
				content: '', //'You could save $59,612.37 and pay off your loan 4 years and 4 months quicker', // v2.0 - not being used and better not display this at all even though this is hidden in the page
			},
		},
		{
			title: 'Fixed Rate Loan',
			linkedUrl: '/home-loans/fixed-rate-home-loan.html',
			description: 'Repayment & rate certainty',
			interestInfo1: {
				name: '',
				showTable: true,
			},
			interestInfo2: {
				name: 'Comparison rate',
			},
			specialOffer: true,
			repaymentValue: undefined,
			features: [
				{
					icon: '',
					content: 'Additional repayments of up to $10K per fixed year'
				},
				{
					icon: '',
					content: 'No interest offset'
				},
				{
					icon: '',
					content: 'No redraw facility'
				},
				{
					icon: '',
					content: 'Free ATMs everywhere in Australia (when you open an Orange Everyday)'
				},
				{
					icon: '',
					content: 'Ditch international transaction fees (when you open an Orange Everyday)'
				},
				{
					icon: '',
					content: 'No ongoing monthly or annual account keeping fees'
				},
				{
					icon: '',
					content: 'Interest rate discounts available'
				},
				{
					icon: '',
					content: 'Waiver of $499 application fee when combined with an Orange Advantage'
				},
				{
					icon: '',
					content: 'Rate and repayment certainty'
				},
			],
			alertInfo: {
				collapsed: true,
				content: '', //'You could save $59,612.37 and pay off your loan 4 years and 4 months quicker', // v2.0 - not being used and better not display this at all even though this is hidden in the page
			},
		}
	];

	// CARD OPTIONS
	$scope.cardOptions = {
		featuresCollapsed: true,
		toggleFeatures: function () {
			$scope.cardOptions.featuresCollapsed = !$scope.cardOptions.featuresCollapsed;
		},
		alignFeatureListHeight: function () {
			if (mediaQuery == media_xs) {
				return;
			}
			else {
				$timeout(function () {
					// LIST CONTAINER HEIGHT CHANGING WAY
					// get lists in all cards
					var listArray = $('[uib-collapse="cardOptions.featuresCollapsed"] .feature-list');
					var maxHeight = 0;
					var i;
					for (i = 0; i < listArray.length; i++) {
						var list = listArray[i];
						var height = $(list).height();
						if (height > maxHeight) {
							maxHeight = height;
						}
					}
					for (i = 0; i < listArray.length; i++) {
						var list = listArray[i];
						$(list).height(maxHeight);
					}

					// CELL HEIGHT CHANGING WAY
					// // get lists in all cards
					// var listArray = $('[uib-collapse="cardOptions.featuresCollapsed"] .feature-list');

					// // find minimum count for same height cells
					// var minCellCount = 999999;
					// var i, j;
					// for (i = 0; i < listArray.length; i++) {
					//   var count = $(listArray[i]).children('li').length;
					//   if (minCellCount > count) {
					//     minCellCount = count;
					//   }
					// }

					// // set maximum height with all same level cell of list
					// for (i = 0; i < minCellCount; i++) {
					//   var maxHeight = 0;
					//   for (j = 0; j < listArray.length; j++) {
					//     var height = $($(listArray[j]).children('li')[i]).height();
					//     if (maxHeight < height) {
					//       maxHeight = height;
					//     }
					//   }
					//   for (j = 0; j < listArray.length; j++) {
					//     $($(listArray[j]).children('li')[i]).height(maxHeight);
					//   }
					// }
				});
			}
		},
		// MARK: need scenario
		toggleAlert: function ($event, cardInfo) {
			cardInfo.alertCollapsed = !cardInfo.alertCollapsed;
			var element = $event.target;
			if (cardInfo.alertCollapsed) {
				$timeout(function () {
					$(element).parents('.homeloan-card').removeClass('alert-mode');
					$(element).parents('.card-slider').removeClass('alert-mode');
				}, $scope.animationInfo.collapseDuration);
			}
			else {
				$(element).parents('.card-slider').find('.homeloan-card').removeClass('alert-mode');
				$(element).parents('.homeloan-card').addClass('alert-mode');
				$(element).parents('.card-slider').addClass('alert-mode');
			}
		}
	};

	// TOOLTIP, POPOVER, MODAL
	$scope.fixedRateTableInfo = {
		selected: {
			tableIndex: 0,
			selectedRowIndex: 0,
		},
		tableInfos: [],
		updateFixedInterestRates: function (tableIndex, rowIndex) {
			// v2.0
			var deposit = $scope.calcOptions.optionDeposit.selected.value;
			var rateCode = _rateCode[deposit].code;

			// OO
			if ($scope.calcOptions.optionPurpose.selected == 0) {
				// P&I
				if( $scope.calcOptions.optionRepayment.selected == 0 ) {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'When combined with an <span class="color-orange bold">Orange Advantage</span>',
							rateInfos: [
								{
									year: 1,
									fixed: _getIR('FRL_OA_1_YEAR' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_OA_1_YEAR' + '_' + rateCode),
									combined: true
								},
								{
									year: 2,
									fixed: _getIR('FRL_OA_2_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_OA_2_YEARS' + '_' + rateCode),
									combined: true
								},
								{
									year: 3,
									fixed: _getIR('FRL_OA_3_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_OA_3_YEARS' + '_' + rateCode),
									combined: true
								},
								{
									year: 4,
									fixed: _getIR('FRL_OA_4_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_OA_4_YEARS' + '_' + rateCode),
									combined: true
								},
								{
									year: 5,
									fixed: _getIR('FRL_OA_5_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_OA_5_YEARS' + '_' + rateCode),
									combined: true
								}
							],
						},
						{
							titleHtml: 'When not combined with an <span class="color-orange bold">Orange Advantage</span>',
							rateInfos: [
								{
									year: 1,
									fixed: _getIR('FRL_1_YEAR' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_1_YEAR' + '_' + rateCode),
									combined: false
								},
								{
									year: 2,
									fixed: _getIR('FRL_2_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_2_YEARS' + '_' + rateCode),
									combined: false
								},
								{
									year: 3,
									fixed: _getIR('FRL_3_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_3_YEARS' + '_' + rateCode),
									combined: false
								},
								{
									year: 4,
									fixed: _getIR('FRL_4_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_4_YEARS' + '_' + rateCode),
									combined: false
								},
								{
									year: 5,
									fixed: _getIR('FRL_5_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_5_YEARS' + '_' + rateCode),
									combined: false
								}
							],
						}
					];
				}
				// IO
				else if ( $scope.calcOptions.optionRepayment.selected == 1 ) {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'When combined with an <span class="color-orange bold">Orange Advantage</span>',
							rateInfos: [
								{
									year: 1,
									fixed: _getIR('FRL_OA_1_YEAR_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_OA_1_YEAR_IO' + '_' + rateCode),
									combined: true
								},
								{
									year: 2,
									fixed: _getIR('FRL_OA_2_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_OA_2_YEARS_IO' + '_' + rateCode),
									combined: true
								},
								{
									year: 3,
									fixed: _getIR('FRL_OA_3_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_OA_3_YEARS_IO' + '_' + rateCode),
									combined: true
								},
								{
									year: 4,
									fixed: _getIR('FRL_OA_4_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_OA_4_YEARS_IO' + '_' + rateCode),
									combined: true
								},
								{
									year: 5,
									fixed: _getIR('FRL_OA_5_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_OA_5_YEARS_IO' + '_' + rateCode),
									combined: true
								}
							],
						},
						{
							titleHtml: 'When not combined with an <span class="color-orange bold">Orange Advantage</span>',
							rateInfos: [
								{
									year: 1,
									fixed: _getIR('FRL_1_YEAR_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_1_YEAR_IO' + '_' + rateCode),
									combined: false
								},
								{
									year: 2,
									fixed: _getIR('FRL_2_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_2_YEARS_IO' + '_' + rateCode),
									combined: false
								},
								{
									year: 3,
									fixed: _getIR('FRL_3_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_3_YEARS_IO' + '_' + rateCode),
									combined: false
								},
								{
									year: 4,
									fixed: _getIR('FRL_4_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_4_YEARS_IO' + '_' + rateCode),
									combined: false
								},
								{
									year: 5,
									fixed: _getIR('FRL_5_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_5_YEARS_IO' + '_' + rateCode),
									combined: false
								}
							],
						}
					];
				}
				else {
					return;
				}

				var lowestRateInfo = getLowestRateInfo($scope.fixedRateTableInfo.tableInfos);
				$scope.fixedRateTableInfo.updateFixedRateCardInfo(lowestRateInfo.tableIndex, lowestRateInfo.rateIndex);
			}
			// INV
			else if ($scope.calcOptions.optionPurpose.selected == 1) {
				// P&I
				if( $scope.calcOptions.optionRepayment.selected == 0 ) {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'Investor',
							rateInfos: [
								{
									year: 1,
									fixed: _getIR('FRL_INV_1_YEAR' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_INV_1_YEAR' + '_' + rateCode),
								},
								{
									year: 2,
									fixed: _getIR('FRL_INV_2_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_INV_2_YEARS' + '_' + rateCode),
								},
								{
									year: 3,
									fixed: _getIR('FRL_INV_3_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_INV_3_YEARS' + '_' + rateCode),
								},
								{
									year: 4,
									fixed: _getIR('FRL_INV_4_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_INV_4_YEARS' + '_' + rateCode),
								},
								{
									year: 5,
									fixed: _getIR('FRL_INV_5_YEARS' + '_' + rateCode),
									comparison: _getIR('COMP_FRL_INV_5_YEARS' + '_' + rateCode),
								}
							]
						},
					];
				}
				// IO
				else if ( $scope.calcOptions.optionRepayment.selected == 1 ) {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'Investor',
							rateInfos: [
								{
									year: 1,
									fixed: _getIR('FRL_INV_1_YEAR_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_INV_1_YEAR_IO' + '_' + rateCode),
								},
								{
									year: 2,
									fixed: _getIR('FRL_INV_2_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_INV_2_YEARS_IO' + '_' + rateCode),
								},
								{
									year: 3,
									fixed: _getIR('FRL_INV_3_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_INV_3_YEARS_IO' + '_' + rateCode),
								},
								{
									year: 4,
									fixed: _getIR('FRL_INV_4_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_INV_4_YEARS_IO' + '_' + rateCode),
								},
								{
									year: 5,
									fixed: _getIR('FRL_INV_5_YEARS_IO' + '_' + rateCode),
									comparison: _getIR('CP_FRL_INV_5_YEARS_IO' + '_' + rateCode),
								}
							]
						},
					];
				}
				else {
					return;
				}

				var lowestRateInfo = getLowestRateInfo($scope.fixedRateTableInfo.tableInfos);
				$scope.fixedRateTableInfo.updateFixedRateCardInfo(lowestRateInfo.tableIndex, lowestRateInfo.rateIndex);
			}
			else {
				//console.log('unknown [purpose] option: ' + $scope.calcOptions.optionPurpose.selected);
				return;
			}

			function getLowestRateInfo(tableInfos) {
				var tableIndex = 0;
				var rateIndex = 0;
				var lowestInterestRate = Number.MAX_VALUE;

				var tableCount = tableInfos.length;
				for (var i = 0; i < tableCount; i++) {
					var table = tableInfos[i];
					var rateCount = table.rateInfos.length;
					for (var j = 0; j < rateCount; j++) {
						var rate = table.rateInfos[j];
						if (rate.fixed <= lowestInterestRate) {
							lowestInterestRate = rate.fixed
							tableIndex = i;
							rateIndex = j;
						}
					}
				}
				var lowestRateInfo = {
					tableIndex: tableIndex,
					rateIndex: rateIndex
				};
				return lowestRateInfo;
			}
		},
		updateFixedRateCardInfo: function (tableIndex, rowIndex) {
			$scope.fixedRateTableInfo.selected.tableIndex = tableIndex;
			$scope.fixedRateTableInfo.selected.rowIndex = rowIndex;

			//
			var rateInfo = $scope.fixedRateTableInfo.tableInfos[tableIndex].rateInfos[rowIndex];

			_update_FRL_CardInterestRatesEx(rateInfo);
			_updateRepayment();
		},
	};

	// ANIMATION
	$scope.animationInfo = {
		addFeatureAnimation: function () {
			$timeout(function () {
				$('.feature-list-transition').addClass('active');
			});
		},
		removeFeatureAnimation: function () {
			$timeout(function () {
				$('.feature-list-transition').removeClass('active');
			});
		},
		collapseDuration: 500,
	};

	// MAIN INFO ADDONS (when the InterestManager is ready, fire this function once in order to update visual area)
	$scope.mainInfo.updateCalculator = function () {
		_updateCalculatorWithPurpose();
	};
	var _updateCalculator = function () {
		_updateCardBaseInfo();
		_updateInterestRate();
		_updateRepayment();
	};
	var _updateCalculatorWithPurpose = function () {
		_updateCardBaseInfo();
		_updateInterestRate();
		_updateFixedRateTableInfoEx();
		_updateRepayment();
	};
	var _updateCardBaseInfo = function () {
		// save frequency for card
		$scope.calcOptions.forCard.frequency = $scope.calcOptions.optionFrequency.selected.name;
		// save description for card
		var option = $scope.calcOptions.optionRepayment.selected == 0 ? 'P&I' : 'interest only';
		$scope.calcOptions.forCard.description =
			'Based on a ' +
			$scope.calcOptions.optionLoanTerm.selected.value +
			' year $' +
			Number($scope.calcOptions.optionBorrowing.value).formatMoney(0, '.', ',') +
			' loan paying ' +
			option +
			'.';
		$scope.calcOptions.forCard.descriptionFixedRate =
			'For the fixed interest period on a ' +
			$scope.calcOptions.optionLoanTerm.selected.value +
			' year $' +
			Number($scope.calcOptions.optionBorrowing.value).formatMoney(0, '.', ',') +
			' loan paying ' +
			($scope.calcOptions.optionRepayment.selected == 0 ? 'P&I' : 'interest only') +
			'.';
	}
	var _updateFixedRateTableInfoEx = function () {
		$scope.fixedRateTableInfo.updateFixedInterestRates();
	};
	var _updateInterestRate = function () {
		_update_MS_CardInterestRates();
		_update_OA_CardInterestRates();
		//_update_FRL_CardInterestRates();

		// 191001 LASH: for FRL update
		_updateFixedRateTableInfoEx();
	};

	// v2.0
	// MS
	var _update_MS_CardInterestRates = function () {
		var cardInfo = $scope.cardInfos[0];
		var interestInfo1 = cardInfo.interestInfo1;
		var interestInfo2 = cardInfo.interestInfo2;
		var purpose = $scope.calcOptions.optionPurpose.selected;
		var borrowing = $scope.calcOptions.optionBorrowing.selected;
		var deposit = $scope.calcOptions.optionDeposit.selected.value; // v2.0
		var repayType = $scope.calcOptions.optionRepayment.selected;
		var rateCode = _rateCode[deposit].code; // v2.0
		var interestRateCode1 = ''; // v2.0
		var interestRateCode2 = ''; // v2.0

		// v2.0
		//$150k or less
		if (borrowing == 0) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MAX150_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MAX150_OO_'+rateCode);
					interestRateCode1 = 'MS_IO_MAX150_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MAX150_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MAX150_'+rateCode);
					interestRateCode1 = 'MS_MAX150';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MAX150_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MAX150_INV_'+rateCode);
					interestRateCode1 = 'MS_IO_MAX150_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MAX150_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MAX150_INV_'+rateCode);
					interestRateCode1 = 'MS_MAX150_INV';
				}
			}
		}
		//>$150k <$500k
		else if (borrowing == 1) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_150_500_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_150_500_OO_'+rateCode);
					interestRateCode1 = 'MS_IO_150_500_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS150_500_'+rateCode);
					interestRateCode1 = 'MS150_500';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_150_500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_150_500_INV_'+rateCode);
					interestRateCode1 = 'MS_IO_150_500_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS150_500_INV_'+rateCode);
					interestRateCode1 = 'MS150_500_INV';
				}
			}
		}
		//>$500k <$1MIL
		else if (borrowing == 2) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MIN500_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MIN500_OO_'+rateCode);
					interestRateCode1 = 'MS_IO_MIN500_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN500_'+rateCode);
					interestRateCode1 = 'MS_MIN500';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MIN500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MIN500_INV_'+rateCode);
					interestRateCode1 = 'MS_IO_MIN500_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN500_INV_'+rateCode);
					interestRateCode1 = 'MS_MIN500_INV';
				}
			}
		}
		//>$1MIL
		else if (borrowing == 3) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MIN1_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MIN1_OO_'+rateCode);
					interestRateCode1 = 'MS_IO_MIN1_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN1_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN1_'+rateCode);
					interestRateCode1 = 'MS_MIN1';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MIN1_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MIN1_INV_'+rateCode);
					interestRateCode1 = 'MS_IO_MIN1_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN1_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN1_INV_'+rateCode);
					interestRateCode1 = 'MS_MIN1_INV';
				}
			}
		}

		// add rate code (LVR50, LVR50_60 ... LVR90)
		interestRateCode1 += '_' + rateCode;
		interestRateCode2 = 'CP_' + interestRateCode1; // adding 'CP_' for comparison rate

		// console.log('[MS] Rate code: ' + interestRateCode1 + ', Comparison rate code: ' + interestRateCode2);

		interestInfo1.rate = $scope.mainInfo.getInterestRateByCode(interestRateCode1);
		interestInfo2.rate = $scope.mainInfo.getInterestRateByCode(interestRateCode2);
	};

	// v2.0
	// OA
	var _update_OA_CardInterestRates = function () {
		var cardInfo = $scope.cardInfos[1];
		var interestInfo1 = cardInfo.interestInfo1;
		var interestInfo2 = cardInfo.interestInfo2;
		var purpose = $scope.calcOptions.optionPurpose.selected;
		var borrowing = $scope.calcOptions.optionBorrowing.selected;
		var deposit = $scope.calcOptions.optionDeposit.selected.value; // v2.0
		var repayType = $scope.calcOptions.optionRepayment.selected;
		var rateCode = _rateCode[deposit].code; // v2.0

		//$150k or less
		if (borrowing == 0) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MAX150_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MAX150_OO_'+rateCode);
					interestRateCode1 = 'OA_IO_MAX150_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MAX150_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MAX150_'+rateCode);
					interestRateCode1 = 'OA_MAX150';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MAX150_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MAX150_INV_'+rateCode);
					interestRateCode1 = 'OA_IO_MAX150_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MAX150_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MAX150_INV_'+rateCode);
					interestRateCode1 = 'OA_MAX150_INV';
				}
			}
		}
		//>$150k <$500k
		else if (borrowing == 1) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_150_500_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_150_500_OO_'+rateCode);
					interestRateCode1 = 'OA_IO_150_500_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA150_500_'+rateCode);
					interestRateCode1 = 'OA150_500';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_150_500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_150_500_INV_'+rateCode);
					interestRateCode1 = 'OA_IO_150_500_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA150_500_INV_'+rateCode);
					interestRateCode1 = 'OA150_500_INV';
				}
			}
		}
		//>$500k <$1MIL
		else if (borrowing == 2) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MIN500_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MIN500_OO_'+rateCode);
					interestRateCode1 = 'OA_IO_MIN500_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MIN500_'+rateCode);
					interestRateCode1 = 'OA_MIN500';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MIN500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MIN500_INV_'+rateCode);
					interestRateCode1 = 'OA_IO_MIN500_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MIN500_INV_'+rateCode);
					interestRateCode1 = 'OA_MIN500_INV';
				}
			}
		}
		//>$1MIL
		else if( borrowing == 3) {
			if (purpose == 0) { // OO
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_1M_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_1M_OO_'+rateCode);
					interestRateCode1 = 'OA_IO_1M_OO';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_PI_1M_OO_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_PI_1M_OO_'+rateCode);
					interestRateCode1 = 'OA_PI_1M_OO';
				}
			}
			if (purpose == 1) { // INV
				if (repayType == 1) { // IO
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_1M_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_1M_INV_'+rateCode);
					interestRateCode1 = 'OA_IO_1M_INV';
				}
				else { // P&I
					// interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_PI_1M_INV_'+rateCode);
					// interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_PI_1M_INV_'+rateCode);
					interestRateCode1 = 'OA_PI_1M_INV';
				}
			}
		}

		// add rate code (LVR50, LVR50_60 ... LVR90)
		interestRateCode1 += '_' + rateCode;
		interestRateCode2 = 'CP_' + interestRateCode1; // adding 'CP_' for comparison rate

		// console.log('[OA] Rate code: ' + interestRateCode1 + ', Comparison rate code: ' + interestRateCode2);

		interestInfo1.rate = $scope.mainInfo.getInterestRateByCode(interestRateCode1);
		interestInfo2.rate = $scope.mainInfo.getInterestRateByCode(interestRateCode2);
	};

	// FRL
	var _update_FRL_CardInterestRatesEx = function (rateInfo) {
		var cardInfo = $scope.cardInfos[2];
		cardInfo.interestInfo1.rate = rateInfo.fixed;
		cardInfo.interestInfo1.name = rateInfo.year + ' YR fixed rate <span class="icon-font icon-arrow-down"></span>';
		cardInfo.interestInfo2.rate = rateInfo.comparison;
		if (rateInfo.combined == false) {
			cardInfo.specialOffer = false;
		}
		else {
			cardInfo.specialOffer = true;
		}
	}

	var _getIR = function (code) {
		return $scope.mainInfo.getInterestRateByCode(code);
	};

	var _updateRepayment = function () {
		var repaymentType = $scope.calcOptions.optionRepayment.selected;
		angular.forEach($scope.cardInfos, function (cardInfo) {
			if (repaymentType == 0) {
				cardInfo.repaymentValue = _calculatePrincipalInterest(cardInfo.interestInfo1.rate);
			} else if (repaymentType == 1) {
				cardInfo.repaymentValue = _calculateInterestOnly(cardInfo.interestInfo1.rate);
			}
		});
	};
	var _calculatePrincipalInterest = function (rate) {
		var i = rate * 0.01;
		var R = Number($scope.calcOptions.optionFrequency.selected.value);
		var P = Number($scope.calcOptions.optionBorrowing.value).toFixed(2);
		var N = Number($scope.calcOptions.optionLoanTerm.selected.value);
		// TEST
		// i = 0.05;
		// R = 12;
		// P = 500000;
		// N = 30;
		var x = ((i / R) * P) / (1 - (Math.pow(1 + (i / R), -N * R)));
		return Number(x).formatMoney(0, '.', ',');
	};
	var _calculateInterestOnly = function (rate) {
		var i = rate * 0.01;
		var R = Number($scope.calcOptions.optionFrequency.selected.value);
		var P = Number($scope.calcOptions.optionBorrowing.value).toFixed(2);
		// TEST
		// i = 0.05;
		// R = 12;
		// P = 500000;
		var x = P * (i / R);
		return Number(x).formatMoney(0, '.', ',');
	};


	// WATCH CALCULATOR OPTIONS
	$scope.$watch('calcOptions.optionPurpose.selected', function () {
		var menus = $scope.calcOptions.optionDeposit.menus;

		// v2.0 - check what the selected deposit would be with these conditions
		// set deposit to 20-30% (default) and hide the rest if INV
		if ($scope.calcOptions.optionPurpose.selected == 1) { // INV - allow >20%
			if (menus.length == 6) {
				$scope.calcOptions.optionDeposit.menus = [_depositMenus[2]];
				$scope.calcOptions.optionDeposit.selected = _depositMenus[2];
			}
		}
		else if ($scope.calcOptions.optionPurpose.selected == 0) { // OO
			if ($scope.calcOptions.optionRepayment.selected == 1 && menus.length < 6) { 
				// do nothing
			}
			else if ($scope.calcOptions.optionRepayment.selected == 1 && menus.length == 6) { // IO
				$scope.calcOptions.optionDeposit.selected = _depositMenus[2];
				$scope.calcOptions.optionDeposit.menus = [_depositMenus[2]];
			}
			else if (menus.length < 6) {
				$scope.calcOptions.optionDeposit.menus = _depositMenus;
				$scope.calcOptions.optionDeposit.selected = _depositMenus[2];
			}
		}
		else if (menus.length < 6) {
		   $scope.calcOptions.optionDeposit.menus = _depositMenus;
		   $scope.calcOptions.optionDeposit.selected = _depositMenus[2];
		}

		_updateCalculatorWithPurpose();
	});
	$scope.$watch('calcOptions.optionBorrowing.selected', function () {
		if ($scope.calcOptions.optionBorrowing.isFromInput) {
			$scope.calcOptions.optionBorrowing.isFromInput = false;
			return;
		}

		var selected = $scope.calcOptions.optionBorrowing.selected;
		var value = $scope.calcOptions.optionBorrowing.menus[selected].value;
		if ($scope.calcOptions.optionBorrowing.value !== value) {
			$scope.calcOptions.optionBorrowing.isFromRadio = true;
			$scope.calcOptions.optionBorrowing.value = value;
		}
		_updateCalculator();
	});
	$scope.$watch('calcOptions.optionBorrowing.value', function () {
		// avoid recursive loop
		if ($scope.calcOptions.optionBorrowing.isFromRadio) {
			$scope.calcOptions.optionBorrowing.isFromRadio = false;
			return;
		}

		var value = Number($scope.calcOptions.optionBorrowing.value);
		var menus = $scope.calcOptions.optionBorrowing.menus;
		for (var index = 0; index < menus.length; index++) {
			if (value < menus[index].threshold) {
				if ($scope.calcOptions.optionBorrowing.selected !== index) {
					$scope.calcOptions.optionBorrowing.isFromInput = true;
					$scope.calcOptions.optionBorrowing.selected = index;
					break;
				}
				break;
			}
		}
		_updateCalculator();
	});
	$scope.$watch('calcOptions.optionDeposit.selected', function () {
		_updateCalculator();
	});
	$scope.$watch('calcOptions.optionRepayment.selected', function () {
		// v2.0
		// set deposit to 20-30% (default) and hide the rest if OO & IO
		var menus = $scope.calcOptions.optionDeposit.menus;

		if ($scope.calcOptions.optionPurpose.selected == 0) { // OO
			if ($scope.calcOptions.optionRepayment.selected == 1 && menus.length == 6) { // IO
				$scope.calcOptions.optionDeposit.selected = _depositMenus[2];
				$scope.calcOptions.optionDeposit.menus = [_depositMenus[2]];
			}
			else if (menus.length < 6) {
				$scope.calcOptions.optionDeposit.menus = _depositMenus;
				$scope.calcOptions.optionDeposit.selected = _depositMenus[2];
			 }
		}
		
		_updateCalculator();
	});
	$scope.$watch('calcOptions.optionFrequency.selected', function () {
		_updateCalculator();
	});
	// MARK: this watch only for mobile modal view
	$scope.$watch('calcOptions.optionFrequency.selectedIndex', function () {
		$scope.calcOptions.optionFrequency.selected = $scope.calcOptions.optionFrequency.menus[$scope.calcOptions.optionFrequency.selectedIndex];
	});
	$scope.$watch('calcOptions.optionLoanTerm.selected', function () {
		_updateCalculator();
	});
}]);


// SECOND TAB CONTROLLER
// ----------------------------------------------
angular.module('Homeloan-App').controller('HomeloanToolsController', ["$scope", "$timeout", "$sce", function ($scope, $timeout, $sce) {

	$scope.pageInfo = {
		title: 'In planning mode? Use these calculators to help you:',
	};

	$scope.dom = {
	  borrowingPowerCalculatorBox: $('.content-container.borrowing-power-calculator-box'),
	  calculator: $('#ic-calculator'),
	  calculatorBox: $('.content-container.calculator-box'),
	  calculatorScript: $('#calculator-script')
	};

	$scope.calculatorOptions = {};
	$scope.calculatorOptions.infos = [
		{
			name: 'Borrowing power calculator'
		},
		{
			name: 'Repayments calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=b9d47181-d8f1-46b4-bed8-e0cec1946c77&target="></script>'
		},
		{
			name: 'Offset calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=b598c0b5-3b5d-4276-a1f6-714289a3d346&target="></script>'
		},
		{
			name: 'Extra repayments calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=59b5b184-2b6e-43f6-ac20-8c9974705d32&target="></script>'
		},
		{
			name: 'Stamp duty calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=edc16223-6f4e-4adb-8174-35f518e62b57&target="></script>'
		},
		{
			name: 'Buying costs calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript/?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=c4c62878-b57f-4ec1-87fe-dbbfa41b4872&target="></script>'
		},
		{
			name: 'Lump sum calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=b5c83c8c-da8f-40df-be7f-b7438bd5d196&target="></script>'
		},
		{
			name: 'Split loan calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=c5823a35-9b9a-44ff-b1fc-0ee05b504fdf&target="></script>'
		},
		{
			name: 'Where can I buy calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=71f2649a-1213-421e-9aa9-07bf30e11390&target="></script>'
		},
		{
			name: 'Loan comparison calculator',
			script: '<script type="text/javascript" src="https://calculators.infochoice.com.au/Ui/GetScript/?clientId=5dedeeb5-c900-42ab-ae01-5e74dda01085&calcId=da4caadb-7397-4224-b33c-9fd667393d05&target="></script>'
		},
	];
	$scope.calculatorOptions.selectedIndex = 0;
	$scope.calculatorOptions.selectedInfo = undefined;
	$scope.calculatorOptions.selectCalculator = function (index) {
		$scope.calculatorOptions.selectedIndex = index;

		if (index === 0) {
			$scope.dom.calculatorBox.hide();
			$scope.dom.borrowingPowerCalculatorBox.show();
		} else {
			$scope.dom.borrowingPowerCalculatorBox.hide();
			$scope.dom.calculatorBox.show();

			$scope.dom.calculator.html('');
			$scope.dom.calculatorScript.html($scope.calculatorOptions.infos[index].script);
		}
	};
	$scope.calculatorOptions.changeInfo = function (info) {
		var index = undefined;
		angular.forEach($scope.calculatorOptions.infos, function (object, i) {
			if (object.name === info.name) {
				index = i;
				return;
			}
		});
		if (angular.isDefined(index)) {
			$scope.calculatorOptions.selectCalculator(index);
		}
	};

	$scope.calculatorOptions.moreCalculatorCollapsed = true;
	$scope.calculatorOptions.toggleMoreCalculator = function () {
		$scope.calculatorOptions.moreCalculatorCollapsed = !$scope.calculatorOptions.moreCalculatorCollapsed;
	};
}]);


// THIRD TAB CONTROLLER
// ----------------------------------------------
angular.module('Homeloan-App').controller('HomeloanTipsController', ["$scope", "$timeout", "$sce", function ($scope, $timeout, $sce) {
	$scope.pageInfo = {
		title: 'Tools and resources to help with your home loan:',
	};

	$scope.linkOptions = {};
	$scope.linkOptions.selectedIndex = 0;
	$scope.linkOptions.selectLinkGroupButton = function (index) {
		$scope.linkOptions.selectedIndex = index;
	};
	$scope.linkOptions.infos = [
		{
			name: 'Buy a home',
			links: [
				{
					name: 'First home buyers guide',
					url: 'https://www.ing.com.au/pdf/homeloans/FHB-Guide-DIRECT-1-WEB-SEC.pdf',
					target: '_blank'
				},
				{  
					name: 'ING Property Reports',
					url: 'https://www.propertyvalue.com.au/ing?utm_source=howtoguides&utm_medium=VisitorSite',
					target: '_blank'
				},
				{
					name: 'First home buyers grant',
					url: '/home-loans/tips-hints-guides/first-home-owners-grant.html'
				},
				{
					name: 'Property buyer checklist',
					url: '/pdf/property_buyers_guide.pdf',
					target: '_blank'
				},
				{
					name: 'What\'s the right home loan for me?',
					url: '/home-loans/tips-hints-guides/whats-the-right-home-loan-for-me.html'
				},
				{
					name: 'First home buyers FAQ',
					url: '/home-loans/tips-hints-guides/first-home-buyers-faq.html'
				},
				{
					name: 'Finding the home you want',
					url: '/home-loans/tips-hints-guides/finding-the-home-you-want.html'
				},
				{
					name: 'Home loan pre-approval benefits',
					url: '/home-loans/tips-hints-guides/home-loan-pre-approval-benefits.html'
				},
				{
					name: 'How much do I need to borrow?',
					url: '/home-loans/tips-hints-guides/first-home-buyers-guide.html'
				},
				{
					name: 'Compare types of mortgages',
					url: '/home-loans/tips-hints-guides/compare-mortgage-types.html'
				},
				{
					name: 'Deposit and upfront costs for your home loan',
					url: '/home-loans/tips-hints-guides/deposit-and-upfront-costs.html'
				},
				{
					name: 'First Home Buyer Case Study',
					url: '/home-loans/tips-hints-guides/first-home-buyers-case-study.html'
				},
				{
					name: 'Tips for buying at auction',
					url: '/home-loans/tips-hints-guides/tips-for-buying-a-house-at-auction.html'
				},
				{
					name: 'Interest Only payments',
					url: '/pdf/Interest Only Payments - Fact Sheet.pdf'
				},
			]
		},
		{
			name: 'Invest in<br/> property',
			doubleline: true,
			links: [
				{
					name: 'Reasons for investing in property',
					url: '/home-loans/tips-hints-guides/reasons-for-investing-in-property.html'
				},
				{
					name: 'Compare types of mortgages',
					url: '/home-loans/tips-hints-guides/compare-mortgage-types.html'
				},
				{
					name: 'A handy guide to property investment',
					url: '/assets/pdf/handy_guide_to_property_investment.pdf',
					target: '_blank'
				},
				{
					name: '4 easy steps to invest',
					url: '/home-loans/tips-hints-guides/four-easy-steps-to-invest.html'
				},
				{
					name: 'More tips for investors',
					url: '/home-loans/tips-hints-guides/tips-for-investors.html'
				},
				{
					name: 'Investor FAQs',
					url: '/home-loans/tips-hints-guides/investors-faq.html'
				},
				{
					name: 'Investment case study',
					url: '/home-loans/tips-hints-guides/investment-case-study.html'
				},
				{
					name: 'Property buyer checklist',
					url: '/pdf/property_buyers_guide.pdf',
					target: '_blank'
				},
				{
					name: 'Deposit and upfront costs for your home loan',
					url: '/home-loans/tips-hints-guides/deposit-and-upfront-costs.html'
				},
				{
					name: 'Tips for buying at auction',
					url: '/home-loans/tips-hints-guides/tips-for-buying-a-house-at-auction.html'
				},
				{
					name: 'Interest Only payments',
					url: '/pdf/Interest Only Payments - Fact Sheet.pdf'
				},
			]
		},
		{
			name: 'Refinance',
			links: [
				{
					name: 'Reasons to look at home loan refinancing',
					url: '/home-loans/tips-hints-guides/tips-for-mortgage-refinancing.html'
				},
				{
					name: '4 easy steps to refinance',
					url: '/home-loans/tips-hints-guides/four-easy-steps-to-refinance.html'
				},
				{
					name: 'Tips to get the most out of your refinancing efforts',
					url: '/home-loans/tips-hints-guides/tips-for-mortgage-refinancing.html'
				},
				{
					name: 'What will it cost me to refinance?',
					url: '/home-loans/tips-hints-guides/how-much-will-it-cost-me-to-refinance.html'
				},
				{
					name: 'What to consider before you refinance',
					url: '/home-loans/tips-hints-guides/refinancing-what-to-consider.html'
				},
			]
		},
	];
	$timeout(function () {
		$('[data-toggle="tab"][data-target="#link-tab-0"]').trigger('click');
	});
}]);


// MOBILE: MODAL CALCULATOR OPTION CONTROLLER
// ----------------------------------------------
angular.module('Homeloan-App').controller('ModalMobileCalculatorController', ["$scope", "$timeout", "$uibModalInstance", "calcOptions", function ($scope, $timeout, $uibModalInstance, calcOptions) {

	$scope.calcOptions = calcOptions;

	$scope.ok = function () {
		$uibModalInstance.close($scope.calcOptions);
	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.clickPopover = function () {
		$('#testPopover').popover({
			content: 'test',
			placement: 'top',
			title: 'test',
			trigger: 'click'
		});
	};
}]);


// MOBILE: MODAL FIXED RATE TABLE CONTROLLER
// ----------------------------------------------
angular.module('Homeloan-App').controller('ModalMobileFixedRateTableController', ["$scope", "$uibModalInstance", "fixedRateTableInfo", "mainInfo", function ($scope, $uibModalInstance, fixedRateTableInfo, mainInfo) {
	$scope.fixedRateTableInfo = fixedRateTableInfo;
	$scope.mainInfo = mainInfo;

	$scope.ok = function () {
		$uibModalInstance.close();
	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);


// MODAL GENERIC CONTROLLER
// ----------------------------------------------
angular.module('Homeloan-App').controller('ModalGenericController', ["$scope", "$uibModalInstance", function ($scope, $uibModalInstance) {
	$scope.ok = function () {
		$uibModalInstance.close();
	};
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
}]);


// ANGULAR DYNAMIC NUMBER CONFIG
// ----------------------------------------------
angular.module('Homeloan-App').config(['dynamicNumberStrategyProvider', function (dynamicNumberStrategyProvider) {
	dynamicNumberStrategyProvider.addStrategy('au-dollar', {
		numInt: 12,
		numFract: 2,
		numPos: true,
		numNeg: false,
		numThousand: true,
		numRound: 'round'
	});
}]);


// DROPDOWN SELECTOR (modified by Andy Chin)
// http://jsfiddle.net/cojahmetov/3DS49/
// ----------------------------------------------
angular.module('Homeloan-App').directive('bsDropdown', ["$compile", function ($compile) {
	return {
		restrict: 'E',
		scope: {
			items: '=dropdownData',
			doSelect: '&selectVal',
			selectedItem: '=preselectedItem'
		},
		link: function (scope, element, attrs) {
			var html = '';

			switch (attrs.menuType) {
				case "button":
					html += '<div class="btn-group btn-block"><button class="btn btn-dropdown-orange btn-block dropdown-toggle symbol-right text-left" data-toggle="dropdown">Action</button><span class="button-symbol"><span class="caret"></span></span>';
					break;
				default:
					html += '<div class="dropdown"><a class="dropdown-toggle" role="button" data-toggle="dropdown"  href="javascript:;">Dropdown<b class="caret"></b></a>';
					break;
			}
			html += '<ul class="dropdown-menu"><li ng-repeat="item in items"><a tabindex="-1" data-ng-click="selectVal(item)" href="javascript:;">{{rawText(item.name)}}</a></li></ul></div>';
			
			element.append($compile(html)(scope));
			
			for (var i = 0; i < scope.items.length; i++) {
				if (scope.items[i].name === scope.selectedItem.name) {
					scope.bSelectedItem = scope.items[i];
					break;
				}
			}
			
			scope.selectVal = function (item) {
				switch (attrs.menuType) {
					case "button":
						$('button.dropdown-toggle', element).html(item.name);
						break;
					default:
						$('a.dropdown-toggle', element).html('<b class="caret"></b> ' + item.name);
						break;
				}
				scope.doSelect({
					selectedVal: item
				});
			};
			
			scope.rawText = function (text) {
				return $('<div>').html(text).text();
			},

			scope.$watch('items', function () {
				// console.log('dropdown items changed');
				scope.selectVal( scope.bSelectedItem );
			}),

			scope.selectVal(scope.bSelectedItem);
		}
	};
}]);


// INTEREST RATE DIRECTIVE
// ----------------------------------------------
angular.module('Homeloan-App').directive('lcInterestRate', ["$compile", "$timeout", function ($compile, $timeout) {
	return {
		restrict: 'A',
		scope: {
			interestRate: '=interestRate'
		},
		link: function (scope, element) {
			scope.$watch('interestRate', function (newVal) {
				if (angular.isDefined(newVal) && newVal !== null) {
					var oldView = element[0].querySelector('.active');
					var newView = element[0].querySelector('.under');
					$(newView).text(Number(newVal).toFixed(2)).addClass('active');
					$timeout(function () {
						$(newView).removeClass('under');
					});
					$(oldView).addClass('over');
					$timeout(function () {
						$(oldView).removeClass('active').removeClass('over').addClass('under').text('');
					}, 500);
				}
			});
		},
		template: '<div class="rate-box"><span class="active"></span><span class="under"></span></div>'
	};
}]);


// ANGULAR BIND HTML COMPILE
// ----------------------------------------------
angular.module('Homeloan-App').directive('bindHtmlCompile', ['$compile', function ($compile) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$watch(function () {
				return scope.$eval(attrs.bindHtmlCompile);
			}, function (value) {
				// Incase value is a TrustedValueHolderType, sometimes it
				// needs to be explicitly called into a string in order to
				// get the HTML string.
				element.html(value && value.toString());
				// If scope is provided use it, otherwise use parent scope
				var compileScope = scope;
				if (attrs.bindHtmlScope) {
					compileScope = scope.$eval(attrs.bindHtmlScope);
				}
				$compile(element.contents())(compileScope);
			});
		}
	};
}]);


// FORMAT MONEY FUNCTION
// ----------------------------------------------
Number.prototype.formatMoney = function (c, d, t) {
	var n = this,
		c = isNaN(c = Math.abs(c)) ? 2 : c,
		d = d == undefined ? "." : d,
		t = t == undefined ? "," : t,
		s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
