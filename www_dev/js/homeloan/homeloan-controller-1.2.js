/*
 * ING Homeloan Controllers
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
				{ name: '&lt; $150K', nameXs: '&lt; $150K', value: '100000', threshold: 150000 },
				{ name: '$150K - <br/>$500K', nameXs: '$150K - $500K', value: '300000', threshold: 500000, doubleline: true },
				{ name: '&gt; $500K', nameXs: '$500K - $1Million', value: '500000', threshold: 1000000, doubleline: true },
				{ name: '&gt; $1Million', nameXs: '&gt; $1Million', value: '1000000', threshold: Number.MAX_VALUE },
			],
			selected: 2,
			value: '0',
			isFromInput: false,
			isFromRadio: true,
		},
		optionDeposit: {
			title: 'Deposit:',
			menus: [
				{ name: '&lt; 10%', value: undefined },
				{ name: '&geq; 10% - <br/>&lt; 20%', value: undefined, doubleline: true },
				{ name: '&geq; 20%', value: undefined },
			],
			selected: 2,
			value: undefined,
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
				content: 'You could save $59,612.37 and pay off your loan 4 years and 4 months quicker',
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
				content: 'You could save $59,612.37 and pay off your loan 4 years and 4 months quicker',
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
			specialOffer: 4,
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
				content: 'You could save $59,612.37 and pay off your loan 4 years and 4 months quicker',
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


	// 070421 - Noticed this has been updated by Digital
	// tablesInfos[0] was added recently with hardcoded rates
	// specialOffer added to show different special offer information popup
	// TOOLTIP, POPOVER, MODAL
	$scope.fixedRateTableInfo = {
		selected: {
			tableIndex: 0,
			selectedRowIndex: 0,
		},
		tableInfos: [],
		updateFixedInterestRates: function (tableIndex, rowIndex) {
			// live in
			if ($scope.calcOptions.optionPurpose.selected == 0) {
				// LVR is 80% or less <=
				if ($scope.calcOptions.optionDeposit.selected == 2) {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'When combined with a variable <span class="color-orange bold">Orange Advantage</span> home loan and LVR is 80% or less',
							rateInfos: [
								{
									year: 1,
									fixed: 2.04,
									comparison: 3.94,
									combined: true,
									specialOffer: 3,
								},
								{
									year: 2,
									fixed: 1.84,
									comparison: 3.73,
									combined: true,
									specialOffer: 3,
								},
								{
									year: 3,
									fixed: 1.89,
									comparison: 3.56,
									combined: true,
									specialOffer: 3,
								},
								{
									year: 4,
									fixed: 2.34,
									comparison: 3.54,
									combined: true,
									specialOffer: 3,
								},
								{
									year: 5,
									fixed: 2.49,
									comparison: 3.48,
									combined: true,
									specialOffer: 3,
								}
							],
						},
						{
							titleHtml: 'When <strong>not</strong> combined with a variable <span class="color-orange bold">Orange Advantage</span> home loan and LVR is 80% or less',
							rateInfos: [
								{
									year: 1,
									fixed: 2.14,
									comparison: 3.94,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 2,
									fixed: 1.94,
									comparison: 3.74,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 3,
									fixed: 1.99,
									comparison: 3.59,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 4,
									fixed: 2.44,
									comparison: 3.58,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 5,
									fixed: 2.59,
									comparison: 3.52,
									combined: false,
									specialOffer: 4,
								}
							],
						}
					];
				}
				// LVR is above 80% and less than or equal to 90%
				else if ($scope.calcOptions.optionDeposit.selected == 1) {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'When combined with a variable <span class="color-orange bold">Orange Advantage</span> home loan and LVR is above 80% and less than or equal to 90%',
							rateInfos: [
								{
									year: 1,
									fixed: 2.14,
									comparison: 3.94,
									combined: true,
									specialOffer: 2,
								},
								{
									year: 2,
									fixed: 1.94,
									comparison: 3.74,
									combined: true,
									specialOffer: 2,
								},
								{
									year: 3,
									fixed: 1.99,
									comparison: 3.59,
									combined: true,
									specialOffer: 2,
								},
								{
									year: 4,
									fixed: 2.44,
									comparison: 3.58,
									combined: true,
									specialOffer: 2,
								},
								{
									year: 5,
									fixed: 2.59,
									comparison: 3.52,
									combined: true,
									specialOffer: 2,
								}
								
							],
						},
						{
							titleHtml: 'When <strong>not</strong> combined with a variable <span class="color-orange bold">Orange Advantage</span> home loan and LVR is above 80% and less than or equal to 90%',
							rateInfos: [
								{
									year: 1,
									fixed: 2.24,
									comparison: 3.95,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 2,
									fixed: 2.04,
									comparison: 3.76,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 3,
									fixed: 2.09,
									comparison: 3.61,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 4,
									fixed: 2.54,
									comparison: 3.61,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 5,
									fixed: 2.69,
									comparison: 3.56,
									combined: false,
									specialOffer: 4,
								}
							],
						}
					];
				}
				// LVR is more than 90%
				else {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'When combined with a variable <span class="color-orange bold">Orange Advantage</span> home loan and LVR is more than 90%',
							rateInfos: [
								{
									year: 1,
									fixed: 2.59,
									comparison: 4.11,
									combined: true,
									specialOffer: 1,
								},
								{
									year: 2,
									fixed: 2.39,
									comparison: 3.82,
									combined: true,
									specialOffer: 1,
								},
								{
									year: 3,
									fixed: 2.44,
									comparison: 3.70,
									combined: true,
									specialOffer: 1,
								},
								{
									year: 4,
									fixed: 2.89,
									comparison: 3.72,
									combined: true,
									specialOffer: 1,
								},
								{
									year: 5,
									fixed: 3.04,
									comparison: 3.70,
									combined: true,
									specialOffer: 1,
								}
							],
						},
						{
							titleHtml: 'When <strong>not</strong> combined with a variable <span class="color-orange bold">Orange Advantage</span> home loan and LVR is more than 90%',
							rateInfos: [
								{
									year: 1,
									fixed: 2.69,
									comparison: 3.99,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 2,
									fixed: 2.49,
									comparison: 3.84,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 3,
									fixed: 2.54,
									comparison: 3.72,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 4,
									fixed: 2.99,
									comparison: 3.76,
									combined: false,
									specialOffer: 4,
								},
								{
									year: 5,
									fixed: 3.14,
									comparison: 3.74,
									combined: false,
									specialOffer: 4,
								}
							],
						}
					];
				}

				var lowestRateInfo = getLowestRateInfo($scope.fixedRateTableInfo.tableInfos);
				$scope.fixedRateTableInfo.updateFixedRateCardInfo(lowestRateInfo.tableIndex, lowestRateInfo.rateIndex);
			}
			// invest
			else if ($scope.calcOptions.optionPurpose.selected == 1) {
				// P&I
				if( $scope.calcOptions.optionRepayment.selected == 0 ) {
					$scope.fixedRateTableInfo.tableInfos = [
						{
							titleHtml: 'Investor',
							rateInfos: [
								{
									year: 1,
									fixed: _getIR('FRL_INV_1_YEAR'),
									comparison: _getIR('COMP_FRL_INV_1_YEAR'),
								},
								{
									year: 2,
									fixed: _getIR('FRL_INV_2_YEARS'),
									comparison: _getIR('COMP_FRL_INV_2_YEARS'),
								},
								{
									year: 3,
									fixed: _getIR('FRL_INV_3_YEARS'),
									comparison: _getIR('COMP_FRL_INV_3_YEARS'),
								},
								{
									year: 4,
									fixed: _getIR('FRL_INV_4_YEARS'),
									comparison: _getIR('COMP_FRL_INV_4_YEARS'),
								},
								{
									year: 5,
									fixed: _getIR('FRL_INV_5_YEARS'),
									comparison: _getIR('COMP_FRL_INV_5_YEARS'),
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
									fixed: _getIR('FRL_INV_1_YEAR_IO'),
									comparison: _getIR('COMP_FRL_INV_1_YEAR_IO'),
								},
								{
									year: 2,
									fixed: _getIR('FRL_INV_2_YEARS_IO'),
									comparison: _getIR('COMP_FRL_INV_2_YEARS_IO'),
								},
								{
									year: 3,
									fixed: _getIR('FRL_INV_3_YEARS_IO'),
									comparison: _getIR('COMP_FRL_INV_3_YEARS_IO'),
								},
								{
									year: 4,
									fixed: _getIR('FRL_INV_4_YEARS_IO'),
									comparison: _getIR('COMP_FRL_INV_4_YEARS_IO'),
								},
								{
									year: 5,
									fixed: _getIR('FRL_INV_5_YEARS_IO'),
									comparison: _getIR('COMP_FRL_INV_5_YEARS_IO'),
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

	var _update_MS_CardInterestRates = function () {
		var cardInfo = $scope.cardInfos[0];
		var interestInfo1 = cardInfo.interestInfo1;
		var interestInfo2 = cardInfo.interestInfo2;
		var purpose = $scope.calcOptions.optionPurpose.selected;
		var borrowing = $scope.calcOptions.optionBorrowing.selected;
		var deposit = $scope.calcOptions.optionDeposit.selected;
		var repayType = $scope.calcOptions.optionRepayment.selected;

		//$150k or less
		if (borrowing == 0) {
			if (purpose == 0) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MAX150');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MAX150');
				}
			}
			if (purpose == 1) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_INV_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_INV_MAX150');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_PI_INV_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_PI_INV_MAX150');
				}
			}
		}
		//>$150k <$500k
		else if (borrowing == 1) {
			if (deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_150_500_OO_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_150_500_OO_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS150_500_LVR80');
				}
			}
			if (deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_LVR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS150_500_LR80_90');
			}
			if (deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_LVR90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS150_500_LVR90');
			}
			if (purpose == 1 && deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_INVLR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CPMS150_500_INV80_90');
			}
			if (purpose == 1 && deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_INVLR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CPMS150_500_INV80_90');
			}
			if (purpose == 1 && deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_150_500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_150_500_INV_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS150_500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS150_500_INVLR80');
				}
			}
		}
		//>$500k <$1MIL
		else if (borrowing == 2) {
			if (deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MIN500_OO_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MIN500_OO_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN500_LR80');
				}
			}
			if (deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_LVR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN500_LR80_90');
			}
			if (deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_LVR90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN500_LVR90');
			}
			if (purpose == 1 && deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MSMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MSMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MSMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MSMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MIN500_INV_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MSMIN500_INV_LR80');
				}
			}
		}
		//>$1MIL
		else if (borrowing == 3) {
			if (deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS1M_OO_IO_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS1M_OO_IO_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS1M_OO_PI_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS1M_OO_PI_LVR80');
				}
			}
			if (deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_LVR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN500_LR80_90');
			}
			if (deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_LVR90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_MIN500_LVR90');
			}
			if (purpose == 1 && deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MSMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MSMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MSMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MSMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_IO_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MS_IO_MIN500_INV_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('MS_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_MSMIN500_INV_LR80');
				}
			}
		}
	};
	var _update_OA_CardInterestRates = function () {
		var cardInfo = $scope.cardInfos[1];
		var interestInfo1 = cardInfo.interestInfo1;
		var interestInfo2 = cardInfo.interestInfo2;
		var purpose = $scope.calcOptions.optionPurpose.selected;
		var borrowing = $scope.calcOptions.optionBorrowing.selected;
		var deposit = $scope.calcOptions.optionDeposit.selected;
		var repayType = $scope.calcOptions.optionRepayment.selected;

		//$150k or less
		if (borrowing == 0) {
			if (purpose == 0) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MAX150');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MAX150');
				}
			}
			if (purpose == 1) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_INV_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_INV_MAX150');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_PI_INV_MAX150');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_PI_INV_MAX150');
				}
			}
		}
		//>$150k <$500k
		else if (borrowing == 1) {
			if (deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_150_500_OO_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_150_500_OO_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA150_500_LVR80');
				}
			}
			if (deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_LVR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA150_500_LR80_90');
			}
			if (deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_LVR90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA150_500_LVR90');
			}
			if (purpose == 1 && deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_INVLR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CPOA150_500_INV80_90');
			}
			if (purpose == 1 && deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_INVLR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CPOA150_500_INV80_90');
			}
			if (purpose == 1 && deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_150_500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_150_500_INV_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA150_500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA150_500_INVLR80');
				}
			}
		}
		//>$500k <$1MIL
		else if (borrowing == 2) {
			if (deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MIN500_OO_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MIN500_OO_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MIN500_LR80');
				}
			}
			if (deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_LVR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MIN500_LR80_90');
			}
			if (deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_LVR90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MIN500_LVR90');
			}
			if (purpose == 1 && deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OAMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OAMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OAMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OAMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MIN500_INV_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OAMIN500_INV_LR80');
				}
			}
		}
		//>$1MIL
		else if( borrowing == 3) {
			if (deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA1M_OO_IO_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA1M_OO_IO_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA1M_OO_PI_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA1M_OO_PI_LVR80');
				}
			}
			if (deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_LVR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MIN500_LR80_90');
			}
			if (deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_LVR90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_MIN500_LVR90');
			}
			if (purpose == 1 && deposit == 0) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OAMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OAMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 1) {
				interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OAMIN500_INV_LR80_90');
				interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OAMIN500_INV80_90');
			}
			if (purpose == 1 && deposit == 2) {
				if (repayType == 1) {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_IO_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OA_IO_MIN500_INV_LVR80');
				}
				else {
					interestInfo1.rate = $scope.mainInfo.getInterestRateByCode('OA_MIN500_INV_LVR80');
					interestInfo2.rate = $scope.mainInfo.getInterestRateByCode('CP_OAMIN500_INV_LR80');
				}
			}
		}
	};
	var _update_FRL_CardInterestRatesEx = function (rateInfo) {
		var cardInfo = $scope.cardInfos[2];
		cardInfo.interestInfo1.rate = rateInfo.fixed;
		cardInfo.interestInfo1.name = rateInfo.year + ' YR fixed rate <span class="icon-font icon-arrow-down"></span>';
		cardInfo.interestInfo2.rate = rateInfo.comparison;
		if (rateInfo.combined == false) {
			cardInfo.specialOffer = 4; // Nothing
		}
		else {
			cardInfo.specialOffer = rateInfo.specialOffer; // 1 OR 2 OR 3
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
		_updateCalculatorWithPurpose();
		var menus = $scope.calcOptions.optionDeposit.menus;
		if ($scope.calcOptions.optionPurpose.selected == 1){
			if (menus.length == 3) {
				$scope.calcOptions.optionDeposit.selected = 2;
				$scope.calcOptions.optionDeposit.menus.splice(0,2);
			}
		}
		else if ($scope.calcOptions.optionPurpose.selected == 0) {
			if ($scope.calcOptions.optionRepayment.selected == 1 && menus.length < 3) { }
			else if ($scope.calcOptions.optionRepayment.selected == 1 && menus.length == 3) {
				$scope.calcOptions.optionDeposit.selected = 2;
				$scope.calcOptions.optionDeposit.menus.splice(0, 2);
			}
			else if (menus.length < 3) {
				$scope.calcOptions.optionDeposit.menus.unshift({ name: '&lt; 10%', value: undefined }, { name: '&geq; 10% - <br/>&lt; 20%', value: undefined, doubleline: true });
				$scope.calcOptions.optionDeposit.selected = 2;
			}
		}
		else if (menus.length < 3) {
		   $scope.calcOptions.optionDeposit.menus.unshift({ name: '&lt; 10%', value: undefined }, { name: '&geq; 10% - <br/>&lt; 20%', value: undefined, doubleline: true });
		   $scope.calcOptions.optionDeposit.selected = 2;
		}
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
		var menus = $scope.calcOptions.optionDeposit.menus;
		if ($scope.calcOptions.optionPurpose.selected == 0){
			if ($scope.calcOptions.optionRepayment.selected == 1 && menus.length == 3) {
				$scope.calcOptions.optionDeposit.selected = 2;
				$scope.calcOptions.optionDeposit.menus.splice(0,2);
				
			}
			else if (menus.length < 3) {
				$scope.calcOptions.optionDeposit.menus.unshift({ name: '&lt; 10%', value: undefined }, { name: '&geq; 10% - <br/>&lt; 20%', value: undefined, doubleline: true });
				$scope.calcOptions.optionDeposit.selected = 2;
	 
			 }
		}
		
		_updateCalculator();
	});
	$scope.$watch('calcOptions.optionFrequency.selected', function () {
		_updateCalculator();
	});
	$scope.$watch('calcOptions.optionLoanTerm.selected', function () {
		_updateCalculator();
	});
	// MARK: this watch only for mobile modal view
	$scope.$watch('calcOptions.optionFrequency.selectedIndex', function () {
		$scope.calcOptions.optionFrequency.selected = $scope.calcOptions.optionFrequency.menus[$scope.calcOptions.optionFrequency.selectedIndex];
	});
	
	// 191001 LASH - this doesn't do anything, commented this part out for now
	//$scope.$watch('calcOptions.optionPurpose.selected', function () {
	//
	//});
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
