
function getSanitised(input, digits) {
	var sanitised = input.replace(/[^\d]/g, "").substring(0, digits);
	// allows any number incl. 0 for input, catch NaN with ""
	// returns "", "0" or Number(sanitised)
	return (parseInt(sanitised) === 0 ? "0" : parseInt(sanitised)) || "";
}


$(".dropdown").each(function() {
	var $selectBox = $(this).children(".dropdown-toggle");
	$(this)
		.find(".dropdown-option")
		.click(function() {
			var selected = $(this).text();
			var value = $(this).data("value");
			$selectBox.text(selected);
			$(this)
				.closest(".dropdown-menu")
				.data("value", value)
				.trigger("change");
		});
});


// on the fly input validation / format
$(".currency-validate").on("input change", function(e) {
	var amount = getSanitised($(e.target).val(), 9);
	if(amount=='') amount = 0;
	// var cursorPos = $(e.target)[0].selectionStart;
	$(e.target).val("$" + amount.toString().replace(/\d(?=(\d{3})+$)/g, "$&,"));
	// $(e.target)[0].selectionStart = $(e.target)[0].selectionEnd = cursorPos;
});

$(".rate-validate").on("change", function(e) {
	var rate = $(e.target).val();
	var sanitised = rate.replace(/[^\d\.]/g,"");
	var val = ( parseFloat(sanitised) === 0 ? "0" : parseFloat(sanitised)) || "";

	$(e.target).val( val.toFixed(2) + "%"); //  + "%"
});

$(".rate2-validate").on("change", function(e) {
	var rate = $(e.target).val();
	var sanitised = rate.replace(/[^\d\.]/g,"");
	var val = ( parseFloat(sanitised) === 0 ? "0" : parseFloat(sanitised)) || "";

	$(e.target).val( val.toFixed(2) + "% p.a."); //  + "%"
});

$(".rate3-validate").on("change", function(e) {
	var rate = $(e.target).val();
	var sanitised = rate.replace(/[^\d\.]/g,"");
	var val = ( parseFloat(sanitised) === 0 ? "0" : parseFloat(sanitised)) || "";

	$(e.target).val( val.toFixed(2) + "% p.a. (variable)"); //  + "%"
});

// $(".number-validate").on("input", function(e) {
// 	var numDigits = $(this).data("digits");
// 	var amount = getSanitised($(e.target).val(), numDigits);
// 	$(e.target).val(amount.toString().replace(/\d(?=(\d{3})+$)/g, "$&,"));
// });

$(".year-validate").on("input change", function(e) {
	var minYear = parseInt($(this).attr("min")) || 0;
	var maxYear = parseInt($(this).attr("max")) || 50;

	var sanitised = getSanitised( $(e.target).val(), 2);
	var year = parseInt(sanitised) || 0;
	//if( year < minYear ) year = minYear;
	if( year > maxYear ) year = maxYear;
	$(e.target).val(year.toString());
});



//var hlSwichingCalculatorRateUpdated = false;

var ing_rates = {
	'cate1': {
		'OOMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'INVMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'OOOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		},
		'INVOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		}
	},
	'cate2': {
		'OOMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'INVMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'OOOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		},
		'INVOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		}
	},
	'cate3': {
		'OOMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'INVMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'OOOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		},
		'INVOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		}
	},
	'cate4': {
		'OOMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'INVMS': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 0
		},
		'OOOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		},
		'INVOA': {
			'rate': null,
			'settlementFee': 299,
			'annualFee': 299
		}
	}  
};


$('#ResultBlock').on('show.bs.collapse', function() {
	// remove button
	$('#BtnCalculate').addClass('hide');
});
$('#ResultBlock').on('shown.bs.collapse', function() {
	// scroll to
	//console.log('Scroll to result block!');
	var offset = $('#ResultCollapseAnchorPoint').offset().top - 60;
	$('html, body').animate({
		scrollTop: offset
	}, 500);
});


function switchingCalculator() {
	if( ! $("#SwitchingCalc").length ) return;

	// old
	var balance = parseInt(getSanitised($('input[name="hl-switching-loan-balance"]').val(), 9)) || 0;
	var term = parseInt(getSanitised($('input[name="hl-switching-term-remaining"]').val(), 9)) || 0;
	var oldRate = parseFloat($('input[name="hl-switching-interest-rate"]').val()) || 0;
	var frequency = $('input[name="hl-switching-repayment-frequency"]:checked').val() || 'F';
	updateFrequencyLabel();
	// new
	var purpose = $('input[name="hl-switching-purpose"]:checked').val() || 'OO';
	var product = '';
	var newRate = 0;
	// result
	var newRepayment = 0;

	// on any input update
	$("#SwitchingCalc").on("input change", function(e) {
		// if result block not closed, close it
		// if( $('#ResultBlock').hasClass('in') ) $('#ResultBlock').collapse('hide');
		
		switch ($(e.target).attr("name")) {
			case "hl-switching-loan-balance":
				var val = getSanitised($(e.target).val(), 9);
				balance = parseInt(val) || 0;
				getNewRate();
				break;
			case "hl-switching-term-remaining":
				var val = getSanitised($(e.target).val(), 9);
				term = parseInt(val) || 0;
				break;
			case "hl-switching-interest-rate":
				var val = $(e.target).val();
				oldRate = parseFloat(val) || 0;
				break;
			case "hl-switching-repayment-frequency":
				frequency = $(e.target).val();
				updateFrequencyLabel();
				break;
			case "hl-switching-purpose":
				purpose = $(e.target).val();
				getNewRate();
				break;
			case "hl-switching-product":
				product = $(e.target).data("value");
				getNewRate();
				break;
		}

		calculate();
	});


	function calculate() {
		// current repayment
		var currentRepaymentMonthly = calculateMonthlyRepayment(balance, oldRate, term); //.toFixed(2);
		var currentRepaymentFortnightly = (currentRepaymentMonthly * 12) / 26;
		// new loan repayment
		var newRepaymentMonthly = calculateMonthlyRepayment(balance, newRate, term); //.toFixed(2);
		var newRepaymentFortnightly = (newRepaymentMonthly * 12) / 26;

		//console.log('Current repayment monthly: '+currentRepaymentMonthly);
		//console.log('New repayment monthly:' + newRepaymentMonthly);

		// remaining cost of current loan
		var currentTotalRepayment = currentRepaymentMonthly * 12 * term; 
		var currentTotalRemainingCost = currentTotalRepayment;

		// total cost of new loan
		var newTotalRepayment = newRepaymentMonthly * 12 * term;
		var newTotalNewCost = newTotalRepayment;

		// saving
		var savingMonthly = currentRepaymentMonthly - newRepaymentMonthly;
		var savingFortnightly = currentRepaymentFortnightly - newRepaymentFortnightly;


		// keeping the payment higher
		var numberOfPayments = calculateNumberOfPayment(newRate, currentRepaymentMonthly, balance, 0);

		var reducedTotalRepayments = numberOfPayments * currentRepaymentMonthly;

		// total cost of new loan
		//var keepTotalRepayment = Math.round((numberOfPayments*currentRepaymentMonthly)*100)/100;
		var keepTotalSaving = currentTotalRepayment - reducedTotalRepayments;
		var keepTermSaving = (term*12)-numberOfPayments;
		
		// result
		newRepayment = (frequency == 'M') ? savingMonthly : savingFortnightly;

		var notEnough = false;
		// reset result if not enough data
		if( isNaN(keepTermSaving) || keepTermSaving < 0 ) keepTermSaving = 0;
		//if( newRate === 0 ) feeSaving = 0;

		if( balance== 0 || term==0 || oldRate==0 || product.length==0 ) notEnough = true

		// if not enough data, disable calculate button 
		if( notEnough ) $('#BtnCalculate').attr("disabled", true);
		else $('#BtnCalculate').attr("disabled", false);
		//$('#BtnCalculate').removeClass('hide');

		var keepTermSavingHtml = Math.round(keepTermSaving);

		//console.log('The Result: ' + newRepayment +', '+ keepTotalSaving +','+ keepTermSaving);

		if( newRepayment < 0 ) {
			$('#RefiTypeA').removeClass('in');
			setTimeout(function() {
				$('#RefiTypeA').addClass('hide');

				$('#RefiTypeB').removeClass('hide');
				$('#RefiTypeB').addClass('in');
			},150);
		}
		else {
			$('#RefiTypeB').removeClass('in');	
			setTimeout(function() {
				$('#RefiTypeB').addClass('hide');
				
				$('#RefiTypeA').removeClass('hide');
				$('#RefiTypeA').addClass('in');
			},150);
		}
		
		$('#HLSCRepayments').html( formatMoney(newRepayment,2,'.',',') );
		$('#HLSCSavingAmount').html( formatMoney(keepTotalSaving,2,'.',',') );
		$('#HLSCSavingTerm').html( keepTermSavingHtml );
	}

	function getNewRate() {
		var category = '';
		if( balance >= 0 && balance < 150000 ) category = 'cate1';
		else if ( balance >= 150000 && balance < 500000 ) category = 'cate2';
		else if ( balance >= 500000 && balance < 1000000 ) category = 'cate3';
		else if ( balance >= 1000000 ) category = 'cate4';

		if( purpose!='' && product!='' ) {
			var code = purpose + product;
			var code2 = (category+purpose+product).toUpperCase();
			//newRate = ing_rates[category][code]['rate'] || false;
			newRate = $('#'+code2 + ' > .rate').text() || false;
			var compRate = $('#'+code2 + ' > .comparison_rate').text() || false;

			// update new rate field
			if( newRate === false ) {
				newRate = '';
			}

			var compRateHtml = '';
			if( compRate !== false ) {
				compRateHtml = '<p style="margin-top:-10px;">Comparison rate: '+compRate+'% p.a.</p>'
			}

			$('input[name="hl-switching-new-rate"]').val( newRate ).trigger('change');
			//$('#CompRate').html( compRateHtml );
			$('input[name="hl-switching-comp-rate"]').val( compRate ).trigger('change');
		}
	}

	function updateFrequencyLabel() {
		var val;
		if( frequency == 'M' ) val = 'month';
		else if( frequency == 'F' ) val = 'fortnight';
		else val = '';

		$('.frequency-label').text(val);
	}

	function calculateMonthlyRepayment(pv, r, n) {
		// pv - present loan amount
		// r - interest rate (%)
		// n - term remaining (month)

		return (pv*(r/100/12)) / (1 - Math.pow((1+(r/100/12)), (-1*n*12)));
	}

	function calculateNumberOfPayment(rate,payment,pv,fv) {
		// rate - interest rate (%)
		// r - monthly interest rate (float)
		// payment - monthly payment
		// pmt - monthly payment
		// pv - present loan amount
		// fv - future value = 0, default

		var r = rate / 100 / 12; //monthly interest rate
		var pmt = payment * -1;  //current repayment
		fv || (fv = 0);

		return (Math.log((pmt-fv*r)/(pmt+pv*r)))/(Math.log(1+r));
	}

	function formatMoney(number, decPlaces, decSep, thouSep) {
		var start = '',
		    end = '';

		if( isNaN(number) || number < 0) return '$0';

		if( number < 0 ) {
			start = '<span class="text-red">';
			end = '</span>';
		}

		return start + number.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) + end;
	}

	function conv_number(expr, decplaces) {
		// This function is from David Goodman's Javascript Bible.
		var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));

		while (str.length <= decplaces) {
			str = "0" + str;
		}
		var decpoint = str.length - decplaces;

		return (
			str.substring(0, decpoint) + "." + str.substring(decpoint, str.length)
		);
	}
}


//window.onload = function() {
$(window).load(function() {
	switchingCalculator();
});	

