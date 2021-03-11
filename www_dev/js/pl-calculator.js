/*
** ING Personal Loan Calculators - Borrowing Power & Repayment
** Author: LASH
** Version 1.3 - 7 year Loan Term
** Last updated: 04 Feb 2021
*/


var fixedRate;
var remotePostcodes = [];
var postcodeEntries = [];

// v1.3
var maxBorrow = 60000; // 30000 
var loanAmountThreshhold = 30000;
var borrowingLoanTermErrorMessageObj = $('#BorrowLoanTermDropdownError');
var repaymentLoanTermErrorMessageObj = $('#RepaymentLoanTermDropdownError');
var borrowingPowerAmountObj = $('#BorrowingPower');
var borrowingPowerErrorMessageObj = $('#BorrowingPowerErrorMessage');
var monthlyRepaymentAmountObj = $('#MonthlyRepayment');
var monthlyRepaymentErrorMessageObj = $('#MonthlyRepaymentErrorMessage');
var showLoanTermErrorMessage = 0;
var showLoanTermErrorMessage2 = 0;
var repaymentLoanAmountErrorMessageObj = $('#RepaymentCalcLoanAmountError');

// load HEM API
var apiError = false;
$.ajax({
  method: 'POST',
  
  url: 'https://campaigns.staging.ing.com.au/Resource/api/PersonalLoan/GetHemData', // STAGING
  //url: '/api/HemExpensesReference/Service/HemExpensesReferenceService.svc/json/HemExpensesReference/GetHemExpensesReference',
  
  beforeSend: function() {
    $('#BorrowingPowerCalc .api-loader').removeClass('hide');
  },
  success: function(json) {
    //console.log(json);
    remotePostcodes = json.RemotePostcodes;
    postcodeEntries = json.PostcodeEntries;
  },
  error: function(e) {
    apiError = true;
    console.log(e);
    $('#BorrowingPowerCalc .api-loader').find('.loader-spinner').remove();

    var errMessage = '<div class="error"><strong>ERROR:</strong> Something went wrong. Please reload the page to try again.</div>';
    $('#BorrowingPowerCalc .api-loader').append(errMessage);
  },
  complete: function() {
    // check if the rate data is loaded and active    
    var checkRate = setInterval(function() { 
      fixedRate = getNewRate();
      if( !apiError && fixedRate ) {        
        clearInterval(checkRate);
        $('#BorrowingPowerCalc .api-loader').remove();
      }
    }, 500);
  }
});

// $(".dropdown").each(function() {
//   var $selectBox = $(this).children(".dropdown-toggle");
//   $(this)
//     .find(".dropdown-option")
//     .click('.dropdown', function() {
//       var selected = $(this).text();
//       var value = $(this).data("value");
//       $selectBox.text(selected);
//       $(this)
//         .closest(".dropdown-menu")
//         .data("value", value)
//         .trigger("change");
//     });
// });

// v1.3 replacing above function
$(".dropdown").on('click', '.dropdown-option', function() {
  var selected = $(this).text();
  var value = $(this).data("value");
  // console.log('Selected: '+selected);
  $(this).closest(".dropdown").find(".dropdown-toggle").text(selected);
  $(this).closest(".dropdown-menu").data("value", value).trigger("change");
});


$(".currency-validate").on("input", function(e) {
  var amount = getSanitised($(e.target).val(), 9);
  // var cursorPos = $(e.target)[0].selectionStart;
  $(e.target).val("$" + amount.toString().replace(/\d(?=(\d{3})+$)/g, "$&,"));
  // $(e.target)[0].selectionStart = $(e.target)[0].selectionEnd = cursorPos;
});

$(".number-validate").on("input", function(e) {
  var numDigits = $(this).data("digits");
  var amount = getSanitised($(e.target).val(), numDigits);
  $(e.target).val(amount.toString().replace(/\d(?=(\d{3})+$)/g, "$&,"));
});

$(".postcode-validate").on("input", function(e) {
  var code = checkNumberLen($(e.target).val(), 4);
  $(e.target).val(code);
});


function roundTo(n, digits) {
  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }
  if( n < 0) {
    negative = true;
    n = n * -1;
  }
  var multiplicator = Math.pow(10, digits);
  n = parseFloat((n * multiplicator).toFixed(11));
  n = (Math.round(n) / multiplicator).toFixed(digits);
  if( negative ) {    
    n = (n * -1).toFixed(digits);
  }
  return n;
}



function getNewRate() {
  var rate = $(".rate_FIXED_PERSONAL_LOAN_InterestRate").first().text();
  if( rate === "" || rate === 0 || rate === null || typeof(rate) === undefined ) rate = false;

  return rate;
}

// v1.3
function drawLoanTermDropdown(id, max) {
  var obj = $('#'+id);
  if(!obj.length) return;

  var html = '';
  for(var i = 2; i<=max; i++) {
    html += '<li><a href="javascript:;" class="dropdown-option" data-value="'+i+'">'+i+' years</a></li>';
  }

  obj.html(html);
}
function resetLoanTermDropdown(id, year) {
  var txt = year + ' year';
  if(year > 1) txt += 's';

  if( !year ) {
    txt = 'Please select';
  }

  $('#'+id).closest(".dropdown").find(".dropdown-toggle").text(txt);
  $('#'+id).data("value", year); //.trigger("change");
}



//
// Borrowing Power Calculator
//

(function borrowingPowerCalculator(e) {
  if (! $("#BorrowingPowerCalc").length ) return;

  var relationship = "s";
  var dependents = 0;
  var postcode = "";
  var grossSalary = 0;
  var otherIncome = 0;
  var livingExpenses = 0;
  var rentMortgage = 0; //910; // new way of calculating the threshhold, CalculateRentMortgage()
  var rentMortgageFinal = 0;
  var otherLoans = 0;
  var creditLimit = 0;
  var loanLimitConsol = 0;
  var cardLimitConsol = 0;
  var loanTerm = 0;


  $("#BorrowingPowerCalc").on("input change", function(e) {
    switch ($(e.target).attr("name")) {
      // case "relationship-status":
      //   relationship = $(e.target).data("value");
      //   break;
      case "dependents":
        var value = getSanitised($(e.target).val(), 2);
        dependents = parseInt(value) || 0;
        break;
      case "postcode":
        var value = getSanitised($(e.target).val(), 4);
        postcode = value.toString() || '';
        break;
      case "gross-salary":
        var amount = getSanitised($(e.target).val(), 9);
        grossSalary = parseInt(amount) || 0;
        break;
      case "other-income":
        var amount = getSanitised($(e.target).val(), 9);
        otherIncome = parseInt(amount) || 0;
        break;
      case "living-expenses":
        var amount = getSanitised($(e.target).val(), 9);
        livingExpenses = parseInt(amount) || 0;
        break;
      case "rent-mortgage":
        var amount = getSanitised($(e.target).val(), 9);
        rentMortgage = parseInt(amount) || 0;
        //rentMortgage = Math.max(val, 910);
        break;
      case "other-loans":
        var amount = getSanitised($(e.target).val(), 9);
        otherLoans = parseInt(amount) || 0;
        break;
      case "credit-limit":
        var amount = getSanitised($(e.target).val(), 9);
        creditLimit = parseInt(amount) || 0;
        break;

      case "loan-limit-consol":
        var amount = getSanitised($(e.target).val(), 9);
        loanLimitConsol = parseInt(amount) || 0;
        break;
      case "card-limit-consol":
        var amount = getSanitised($(e.target).val(), 9);
        cardLimitConsol = parseInt(amount) || 0;
        break;

      case "loan-term":
        loanTerm = parseInt($(e.target).data("value")) || 0;
        break;
    }

    var medicare = 0;
    var totalTaxableIncome = 0;
    var totalIncomeTax = 0;
    var postTaxIncome = 0;
    var expenseOtherLoan = 0;
    var expenseMortgage = 0;
    var expenseCreditCardLimit = 0;
    var applicatantDependenntFee = 0;
    var finalLivingExpense = 0;
    var totalCommitmentExpense = 0;
    var totalConsolidation = 0;

    //var topBand = 534000;
    //var repayment = 0;
    var income = grossSalary * 12 + (otherIncome * 12 * 65) / 100;


    CalculateTax();
    CalculateRentMortgage();
    //CalculateDeclaredLivingExpense(); // old
    CalculateHemLivingExpense(); // new
    CalculateOtherExpense();
    CalculateConsolidateBenefit(); //191125


    var surplus = postTaxIncome - totalCommitmentExpense + totalConsolidation;
    //console.log(surplus +'='+ postTaxIncome+'-'+totalCommitmentExpense+'+'+totalConsolidation);


    // v1.3 - Borrowing Power Test to decide the Loan Term 
    // if borrowing power is greater than loanAmountThreshhold (30000) loan term can be 2 to 7 years
    var borrowCap1Test = (totalTaxableIncome / 12) * 6;
    var borrowCap2Test = 60000 - expenseCreditCardLimit;
    var borrowCap3Test = pv(fixedRate / 100, 5 * 12, -surplus / 12, 0);
    var borrowPowerTest = 0;
    if( grossSalary >= 3000 ) borrowPowerTest = Math.min(maxBorrow, borrowCap1Test, borrowCap2Test, borrowCap3Test);
    borrowPowerTest = Math.floor(borrowPowerTest/500) * 500;
    //console.log('[v1.3] borrowPowerTest:' + borrowPowerTest);
    if( borrowPowerTest > loanAmountThreshhold ) {
      // loan term will be 2 .. 7
      drawLoanTermDropdown('BorrowLoanTermDropdown', 7);
      //console.log('up to 7 years - ' + borrowPowerTest);
    }
    else {
      // loan term will be 2 .. 5
      drawLoanTermDropdown('BorrowLoanTermDropdown', 5);
      //console.log('up to 5 years - ' + borrowPowerTest);
    }


    // CALCULATE BORROWING POWER
    var borrowCap1 = (totalTaxableIncome / 12) * 6;
    var borrowCap2 = 60000 - expenseCreditCardLimit;
    var borrowCap3 = pv(fixedRate / 100, loanTerm * 12, -surplus / 12, 0); //Math.floor(pvResult / 500) * 500; // only this value was rounded down, moved rounded down to below
    var borrowPower = 0; // cap borrow power to 0 if gross salary is less than 3000
    if( grossSalary >= 3000 ) borrowPower = Math.min(maxBorrow, borrowCap1, borrowCap2, borrowCap3);
    // v1.2(fix) round down to nearest 500
    borrowPower = Math.floor(borrowPower/500) * 500;


    // v1.3 always show 7 year options but if borrowing is lower than 30K force change the loan term from 7 or 6 to 5'
    if( loanTerm > 5 && borrowPower <= loanAmountThreshhold ) {
      // update loan term to 5
      resetLoanTermDropdown('BorrowLoanTermDropdown', 5);
      loanTerm = 5;

      borrowingLoanTermErrorMessageObj.addClass('in');
      showLoanTermErrorMessage = 1;
    }
    else {
      if( showLoanTermErrorMessage > 1) {
        borrowingLoanTermErrorMessageObj.removeClass('in');
        showLoanTermErrorMessage = 0;
      }
      else {
        showLoanTermErrorMessage++;
      }
    }


    var repayment = PMT(fixedRate / 100 / 12, loanTerm * 12, borrowPower).toFixed(2) * -1;
    //console.log(borrowPower, repayment);


    borrowingPowerErrorMessageObj.addClass('hide'); // v1.3
    monthlyRepaymentErrorMessageObj.addClass('hide'); // v.13
    borrowingPowerAmountObj.removeClass('hide'); // v.13
    monthlyRepaymentAmountObj.removeClass('hide'); // v.13

    // validate the result
    if (borrowPower <= 0 || repayment <= 0 || !postcode) {
      $("#borrowing-power").text('-');
      $("#monthly-repayments").text('-');

      // v1.3
      if(grossSalary > 0 && loanTerm > 0) {
        borrowingPowerErrorMessageObj.removeClass('hide');
        monthlyRepaymentErrorMessageObj.removeClass('hide');
        borrowingPowerAmountObj.addClass('hide');
        monthlyRepaymentAmountObj.addClass('hide');
      }
    } else {
      $("#borrowing-power").text( Math.round(borrowPower).toString().replace(/\d(?=(\d{3})+$)/g, "$&,") );
      $("#monthly-repayments").text( Math.round(repayment) );
    }



    function CalculateTax() {
      var taxableIncome1 = 0;
      var taxableIncome2 = 0; 
      var taxableIncome3 = 0; 
      var taxableIncome4 = 0;
      var taxableIncome5 = 0;

      var incomeTax1 = 0; 
      var incomeTax2 = 0; 
      var incomeTax3 = 0; 
      var incomeTax4 = 0; 
      var incomeTax5 = 0;

      if (income < 18200) {
        taxableIncome1 = income;
      } else {
        taxableIncome1 = 18200;
        if (income < 37000) {
          taxableIncome2 = income - taxableIncome1;
        } else {
          taxableIncome2 = 37000 - 18201 + 1;

          if (income < 87000) {
            taxableIncome3 = income - taxableIncome1 - taxableIncome2;
          } else {
            taxableIncome3 = 87000 - 37001 + 1;

            if (income < 180000) {
              taxableIncome4 =
                income - taxableIncome1 - taxableIncome2 - taxableIncome3;
            } else {
              taxableIncome4 = 180000 - 87001 + 1;
              taxableIncome5 = income - taxableIncome1 - taxableIncome2 - taxableIncome3 - taxableIncome4;
            }
          }
        }
      }

      incomeTax1 = taxableIncome1 * 0;
      incomeTax2 = taxableIncome2 * 0.19;
      incomeTax3 = taxableIncome3 * 0.325;
      incomeTax4 = taxableIncome4 * 0.37;
      incomeTax5 = taxableIncome5 * 0.45;

      medicare = income * 0.02;

      totalTaxableIncome = taxableIncome1 + taxableIncome2 + taxableIncome3 + taxableIncome4 + taxableIncome5;
      totalIncomeTax = incomeTax1 + incomeTax2 + incomeTax3 + incomeTax4 + incomeTax5;

      if (totalTaxableIncome != income) console.log("Error!");

      postTaxIncome = income - (totalIncomeTax + medicare);
    }

    function CalculateRentMortgage() {
      var threshhold = ( dependents === 0 ) ? (175 * 52 / 12) : (250 * 52 / 12);
      rentMortgageFinal = ( rentMortgage < threshhold ) ?  threshhold : rentMortgage;
    }

    function getHem() {
      var isCouple = (relationship === 's') ? false : true;
      var preceedingValue = 0; // required for exceeding case (income > Top Band)
      var value = 0;
      var midPoint = 0;

      var exceedingTopBand = true; // check if the income exceed top band

      // find remote or not
      var isRemotePostcode = (remotePostcodes.indexOf(postcode) !== -1) ? true : false;
     // console.log('Is remote ('+postcode+'): ' + isRemotePostcode);

      for(i=0; i<postcodeEntries.length; i++){
        var entry = postcodeEntries[i];
        // find remote vs no remote
        if( entry.IsRemote === isRemotePostcode ) {
          //console.log('IsRemote: '+isRemotePostcode);

          for(j=0; j<entry.Categories.length; j++ ) {
            var category = entry.Categories[j];
            // match household income band - test for income greater than equal to topBand here as well
            if( income >= category.From && income < category.To ) {
              exceedingTopBand = false; // match FOUND
              midPoint = (category.From + category.To) / 2;
              //console.log('Income Band:'); console.log(category);

              for(k=0; k<category.MaritalEntries.length; k++) {
                var maritalEntry = category.MaritalEntries[k];
                // match marital status
                if( maritalEntry.IsCouple === isCouple ) {
                  //console.log('IsCouple: ' + isCouple);

                  for(l=0; l<maritalEntry.Dependents.length; l++ ) {
                    var dependent = maritalEntry.Dependents[l];
                    // match num of dependents
                    if( dependent.No <= dependents ) {
                      value = dependent.Value;
                    }
                  }
                }
              }
            }


            // if second last && exceeding - find preceeding value
            if( j == (entry.Categories.length - 2) && exceedingTopBand ) {
              for(k=0; k<category.MaritalEntries.length; k++) {
                var maritalEntry = category.MaritalEntries[k];
                // match marital status
                if( maritalEntry.IsCouple === isCouple ) {
                  for(l=0; l<maritalEntry.Dependents.length; l++ ) {
                    var dependent = maritalEntry.Dependents[l];
                    // match num of dependents
                    if( dependent.No <= dependents ) {
                      preceedingValue = dependent.Value; 
                    }
                  }
                }
              }
            }


            // if last && exceeding
            if( (j == (entry.Categories.length - 1)) && exceedingTopBand ) {
              midPoint = Math.ceil( (category.From + category.To) / 2 );

              for(k=0; k<category.MaritalEntries.length; k++) {
                var maritalEntry = category.MaritalEntries[k];
                // match marital status
                if( maritalEntry.IsCouple === isCouple ) {
                  for(l=0; l<maritalEntry.Dependents.length; l++ ) {
                    var dependent = maritalEntry.Dependents[l];
                    // match num of dependents
                    if( dependent.No <= dependents ) {
                      value = dependent.Value;
                    }
                  }
                }
              }
            }
          }
        }
      }; 

      // Formula if exceeding top band ($534,000): Total Household Income / Mid-Point of Band x (Current Band - Preceeding Band) + Preceeding Band
      if( exceedingTopBand ) value = income / midPoint * (value - preceedingValue) + preceedingValue;
      value = roundTo(value, 2);


      //console.log(income +' / '+ midPoint +' * ('+ value +' - '+ preceedingValue +' + '+ preceedingValue +')');
      //console.log('Final: ' + value);


      return value;  
    }


    // new Living Expense Calculation
    function CalculateHemLivingExpense() {
      var hemValue = getHem();
      var threshhold = hemValue * 52; // is HEM weekly value?

      if (livingExpenses * 12 > threshhold)
        finalLivingExpense = livingExpenses * 12;
      else finalLivingExpense = threshhold;
    }



    // old Living Expense Calculation
    /*
    function CalculateDeclaredLivingExpense() {
      // Gross Household income figures
      // v1.2 base figures last updated: 16 Apr 2020
      var baseExpenseSingle = 19101.16; //18532.04; //18368;
      var baseExpenseCouple = 27769.56; //26942.72; //26705;
      var baseChildren = 6749.60; //6547.57; //6490;

      var livingExpenseRate = 0;
      var baseExpense =
        relationship == "s" ? baseExpenseSingle : baseExpenseCouple;
      var childRate = 0;

      if (income < 100000) {
        //console.log('less than 100000');
        livingExpenseRate = baseExpense + baseExpense * (3 / 100);
        if (dependents) childRate = baseChildren + baseChildren * (3 / 100);
      } else if (income >= 100000 && income < 150000) {
        //console.log('more than 100000 and less than 150000');
        livingExpenseRate = baseExpense + baseExpense * (4 / 100);
        if (dependents) childRate = baseChildren + baseChildren * (4 / 100);
      } else if (income >= 150000 && income < 200000) {
        //console.log('more than 150000 and less than 200000');
        livingExpenseRate = baseExpense + baseExpense * (6 / 100);
        if (dependents) childRate = baseChildren + baseChildren * (6 / 100);
      } else {
        livingExpenseRate = baseExpense + baseExpense * (8 / 100);
        if (dependents) childRate = baseChildren + baseChildren * (8 / 100);
      }

      if (dependents) {
        applicatantDependenntFee = childRate * dependents;
      } else {
        applicatantDependenntFee = 0;
      }

      if (livingExpenses * 12 > livingExpenseRate + applicatantDependenntFee)
        finalLivingExpense = livingExpenses * 12;
      else finalLivingExpense = livingExpenseRate + applicatantDependenntFee;
    }
    */

    function CalculateConsolidateBenefit() {
      var rate = 10;
      var personalLoan = PMT(rate / 100 / 12, 7 * 12, loanLimitConsol);
      var creditCard = cardLimitConsol * 0.038 * -1;

      var total = Math.abs((personalLoan * 12) + (creditCard * 12)).toFixed(2) * 1;
      totalConsolidation = (total > 0) ? total : 0;

      //console.log(personalLoan,creditCard);
      //console.log(totalConsolidation);
    }

    function CalculateOtherExpense() {
      expenseOtherLoan = otherLoans * 12;
      expenseMortgage = rentMortgageFinal * 12;
      expenseCreditCardLimit = creditLimit * 0.038 * 12; // 0.038
      //console.log(`-- ${expenseOtherLoan}, ${expenseMortgage}, ${expenseCreditCardLimit}, ${finalLivingExpense}`)

      totalCommitmentExpense = expenseOtherLoan + expenseMortgage + expenseCreditCardLimit + finalLivingExpense;

      //console.log('total commitment expense is ' + totalCommitmentExpense);
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

    function pv(rate, nper, pmt, fv) {
      nper = parseFloat(nper);
      pmt = parseFloat(pmt);
      fv = parseFloat(fv);
      rate = rate / 12;

      if (pmt === 0 || nper === 0) {
        //console.log("Why do you want to test me with zeros?");
        return 0;
      }

      if (rate == 0) {
        // Interest rate is 0
        pv_value = -(fv + pmt * nper);
      } else {
        x = Math.pow(1 + rate, -nper);
        y = Math.pow(1 + rate, nper);
        pv_value = -(x * (fv * rate - pmt + y * pmt)) / rate;
      }

      pv_value = conv_number(pv_value, 2);
      return pv_value;
    }
  });
})();




//
// Repayment Calculator
//

(function repaymentsCalculator() {
  if (! $("#repayments-calc").length ) return;
  var loanAmount = 0;
  var loanTerm = 0; // 5;
  var monthValue = '-'; //0;
  var fortnightValue = '-'; //0;
  var monthlyRepayment = $("#monthly-repayment");
  var fortnightRepayment = $("#fortnight-repayment");

  $("#repayments-calc").on("input change", function(e) {
    switch ($(e.target).attr("name")) {
      case "loan-amount":
        var amount = getSanitised($(e.target).val(), 9);
        loanAmount = parseInt(amount) || 0;
        break;
      case "loan-term":
        loanTerm = parseInt($(e.target).data("value")) || 0;
        //if( loanTerm > 0 ) $("#repayments-calc input[name='loan-amount']").prop('disabled', false);
        break;
    }


    // validate loan amount
    if (loanAmount < 5000 || loanAmount > maxBorrow) {
      // INVALID AMOUNT!!!

      // show amount error message
      repaymentLoanAmountErrorMessageObj.removeClass('hide');
      
      // disable loan term dropdown
      $('#drop3').addClass('disabled');
      // reset loan term
      resetLoanTermDropdown('RepaymentLoanTermDropdown', null);
      
      // remove loan term error
      repaymentLoanTermErrorMessageObj.removeClass('in');
      loanTerm = 0;
    }
    else {
      // VALID AMOUNT!!

      // hide amount error message
      repaymentLoanAmountErrorMessageObj.addClass('hide');
      
      // check for valid loan term
      if( loanAmount > loanAmountThreshhold ) {
        // 7 years
        drawLoanTermDropdown('RepaymentLoanTermDropdown', 7);

        //if( showLoanTermErrorMessage > 1) {
          repaymentLoanTermErrorMessageObj.removeClass('in');
          showLoanTermErrorMessage2 = 0;
        //}
      }
      else {
        // 5 years
        drawLoanTermDropdown('RepaymentLoanTermDropdown', 5);

        if( loanTerm > 5 ) {
          resetLoanTermDropdown('RepaymentLoanTermDropdown', 5);
          loanTerm = 5;

          repaymentLoanTermErrorMessageObj.addClass('in');
          showLoanTermErrorMessage2 = 1;
        }
        else {
          if( showLoanTermErrorMessage2 > 1) {
            repaymentLoanTermErrorMessageObj.removeClass('in');
            showLoanTermErrorMessage2 = 0;
          }
          else {
            showLoanTermErrorMessage2++;
            
          }
        }      
      }

      console.log('Loan Term Error Num: ' +showLoanTermErrorMessage2);

      // reset dropdown - resetLoanTermDropdown('RepaymentLoanTermDropdown');
      // enable loan term dropdown
      $('#drop3').removeClass('disabled');
    }


    // calculate
    if (loanTerm == 0) {
      monthValue = '-'; //0;
      fortnightValue = '-'; //0;
    }
    else if (loanAmount >= 5000 && loanAmount <= maxBorrow) {
      // validate laon term
      if (loanAmount <= loanAmountThreshhold && loanTerm > 5) {
        // error!
        console.log('ERROR: 6 and 7 year repayment terms are only available for loans over $30,000');

        monthValue = '-'; //0;
        fortnightValue = '-'; //0;
      }
      else {
        // calculate repayment
        monthValue = Math.round(PMT(fixedRate / 100 / 12, loanTerm * 12, loanAmount)) * -1;
        fortnightValue = Math.round(PMT(fixedRate / 100 / 26, loanTerm * 26, loanAmount)) * -1;
      }
    } 
    else {
      monthValue = '-'; //0;
      fortnightValue = '-'; //0;
    }


    // show results
    monthlyRepayment.text(monthValue);
    fortnightRepayment.text(fortnightValue);

  });
})();




function PMT(ir, np, pv, fv, type) {
  /*
   * ir   - interest rate per month
   * np   - number of periods (months)
   * pv   - present value
   * fv   - future value
   * type - when the payments are due:
   *        0: end of the period, e.g. end of month (default)
   *        1: beginning of period
   */
  var pmt, pvif;

  fv || (fv = 0);
  type || (type = 0);

  if (ir === 0) return -(pv + fv) / np;

  pvif = Math.pow(1 + ir, np);
  pmt = (-ir * pv * (pvif + fv)) / (pvif - 1);

  if (type === 1) pmt /= 1 + ir;

  return pmt;
}

function getSanitised(input, digits) {
  var sanitised = input.replace(/[^\d]/g, "").substring(0, digits);
  // allows any number incl. 0 for input, catch NaN with ""
  // returns "", "0" or Number(sanitised)
  return (parseInt(sanitised) === 0 ? "0" : parseInt(sanitised)) || "";
}

function checkNumberLen(input, len) {
  var sanitised = input.replace(/[^\d]/g, "").substring(0, len);
  return sanitised;
}
