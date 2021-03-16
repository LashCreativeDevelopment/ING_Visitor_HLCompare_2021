
function InterestRateManager() {
	// document.origin is not by ie
	// this.serviceUrl = location.protocol + '//' + location.host + "/ReverseProxy/ProductService/V1/productservice.svc/json/interestrates/currenteffective";
    this.serviceUrl = location.protocol + '//' + location.host + "/js/homeloan/mtg-rafiki2-interest_rates_core_db_15Mar2021.json"; // TEST
	this.enableCount = false;
	this.responseObj;

	// LASH - notify to angular homeloan controller
	this.NotifyAngular = function () {
		var controllerElement = document.querySelector('[ng-controller="HomeloanController"]');
		var controllerScope = angular.element(controllerElement).scope();
		// angular ready
		if (typeof controllerScope !== 'undefined') {
			controllerScope.notifyInterestRateInfo(this.responseObj);
		}
		// angular not ready
		else {
			$('#HomeloanController').data('interestRateInfo', this.responseObj);
		}
	};

	this.CallService = function (callBackSuccessful, callBackFail) {
		//$.support.cors = true;
		$.get(this.serviceUrl, callBackSuccessful);
	};

	this.ListAll = function () {
		var that = this;
		var table = $('<table id="InterestRateTable" />').appendTo('body');
		$.each(this.responseObj.InterestRates, function (index, value) {

			var ul = $('<tr />').appendTo(table);
			var rate = that.Find(value["RateCode"]);

			$('<td />').html(rate["RateCode"]).appendTo(ul);
			$('<td />').html(parseFloat(rate["Rate"]).toFixed(2)).appendTo(ul);
			$('<td />').html(rate["Other"]).appendTo(ul);
			if (rate["Count"] > 1) {
				$('<td />').html("<span style='color: red;'><b>Warning:</b> found " + rate["Count"] + " entry on this type in the web service").appendTo(ul);
			} else {
				$('<td />').html("<span style='color: green;'>Unique</span>").appendTo(ul);
			}
		});
	};

	this.Find = function (key) {
		var returnValue = "";
		$.each(this.responseObj.InterestRates, function (index, value) {
			if (value["RateCode"] == key) {
				returnValue = value;
				return false;
			}
		});

		if (this.enableCount) {
			var counter = 0;
			$.each(this.responseObj.InterestRates, function (index, value) {
				if (value["RateCode"] == key) {
					counter++;
				}
			});
			returnValue["Count"] = counter;
		}
		return returnValue;
	};



    //Effective Dates

	this.getPTD_LOYALTYBONUS = function () { return this.Find("PTD_LOYALTYBONUS"); };
	this.getBTD_LOYALTYBONUS = function () { return this.Find("BTD_LOYALTYBONUS"); };

	this.getSMARTPACK_MS = function () { return this.Find("getSMARTPACK_MS"); };

	//Personal Term Deposit
	this.getPTD_30_DAYS = function () { return this.Find("PTD_30_DAYS"); };
	this.getPTD_90_DAYS = function () { return this.Find("PTD_90_DAYS"); };
	this.getPTD_120_DAYS = function () { return this.Find("PTD_120_DAYS"); };
	this.getPTD_180_DAYS = function () { return this.Find("PTD_180_DAYS"); };
	this.getPTD_210_DAYS = function () { return this.Find("PTD_210_DAYS"); };
	this.getPTD_270_DAYS = function () { return this.Find("PTD_270_DAYS"); };
	this.getPTD_330_DAYS = function () { return this.Find("PTD_330_DAYS"); };
	this.getPTD_1_YEAR = function () { return this.Find("PTD_1_YEAR"); };
	this.getPTD_2_YEARS = function () { return this.Find("PTD_2_YEARS"); };

	//Saving Maximiser
	this.getSM_BASE = function () { return this.Find("SM_BASE"); };                     //Savings Maximiser
	this.getSM_WELCOME = function () { return this.Find("SM_WELCOME"); };
	this.getSM_PBB_BONUS = function () { return this.Find("PBB_BONUS"); };     //Savings Maximiser Loyalty

	this.getSA_TIER_1_MIN0 = function () { return this.Find("SA_TIER_1_MIN0"); };       //Savings Accelerator Tier 1 Min 0
	this.getSA_TIER_2_MIN50K = function () { return this.Find("SA_TIER_2_MIN50K"); };   //Savings Accelerator Tier 2 Min 50k
	this.getSA_TIER_3_MIN150K = function () { return this.Find("SA_TIER_3_MIN150K"); }; //Savings Accelerator Tier 3 Min 150k

	//Business Term Deposit
	this.getBTD_30_DAYS = function () { return this.Find("BTD_30_DAYS"); };
	this.getBTD_90_DAYS = function () { return this.Find("BTD_90_DAYS"); };
	this.getBTD_120_DAYS = function () { return this.Find("BTD_120_DAYS"); };
	this.getBTD_180_DAYS = function () { return this.Find("BTD_180_DAYS"); };
	this.getBTD_210_DAYS = function () { return this.Find("BTD_210_DAYS"); };
	this.getBTD_270_DAYS = function () { return this.Find("BTD_270_DAYS"); };
	this.getBTD_330_DAYS = function () { return this.Find("BTD_330_DAYS"); };
	this.getBTD_1_YEAR = function () { return this.Find("BTD_1_YEAR"); };
	this.getBTD_2_YEARS = function () { return this.Find("BTD_2_YEARS"); };

	//Business Optimiser
	this.getBO_BASE = function () { return this.Find("BO_BASE"); };
	this.getBO_WELCOME = function () { return this.Find("BO_WELCOME"); };



    //Loan Product
    //Orange Advantage
    //$150k or less

    //Old segment
    //PI
	this.getOA_MAX150 = function () { return this.Find("OA_MAX150"); }; //rate
	this.getCOMP_OA_MAX150 = function () { return this.Find("CP_OA_MAX150"); }; //comparison rate
    //IO
    this.getOA_MAX150_IO = function () { return this.Find("OA_IO_MAX150"); }; //rate
	this.getCOMP_OA_MAX150_IO = function () { return this.Find("CP_OA_IO_MAX150"); }; //comparison rate
    //PI
	this.getOA_MAX150_INV = function () { return this.Find("OA_PI_INV_MAX150"); }; //rate
	this.getCOMP_OA_MAX150_INV = function () { return this.Find("CP_OA_PI_INV_MAX150"); }; //comparison rate
    //IO
    this.getOA_MAX150_INV_IO = function () { return this.Find("OA_IO_INV_MAX150"); }; //rate
    this.getCOMP_OA_MAX150_INV_IO = function () { return this.Find("CP_OA_IO_INV_MAX150"); }; //comp rate
    
    //New LVR bands
    //LVR 50% or less
    //OO P&I
    this.getOA_MAX150_LVR50 = function () { return this.Find("OA_MAX150_LVR50"); }; 
	this.getCP_OA_MAX150_LVR50 = function () { return this.Find("CP_OA_MAX150_LVR50"); }; 
    //Inv P&I
    this.getOA_MAX150_INV_LVR50 = function () { return this.Find("OA_MAX150_INV_LVR50"); }; 
    this.getCP_OA_MAX150_INV_LVR50 = function () { return this.Find("CP_OA_MAX150_INV_LVR50"); }; 
    //OO IO
    this.getOA_IO_MAX150_OO_LVR50 = function () { return this.Find("OA_IO_MAX150_OO_LVR50"); }; 
    this.getCP_OA_IO_MAX150_OO_LVR50 = function () { return this.Find("CP_OA_IO_MAX150_OO_LVR50"); };
    //INV IO
    this.getOA_IO_MAX150_INV_LVR50 = function () { return this.Find("OA_IO_MAX150_INV_LVR50"); }; 
    this.getCP_OA_IO_MAX150_INV_LVR50 = function () { return this.Find("CP_OA_IO_MAX150_INV_LVR50"); };

    //LVR between 50% and 60%
    //OO P&I
    this.getOA_MAX150_LVR50_60 = function () { return this.Find("OA_MAX150_LVR50_60"); }; 
    this.getCP_OA_MAX150_LVR50_60 = function () { return this.Find("CP_OA_MAX150_LVR50_60"); }; 
    //Inv P&I
    this.getOA_MAX150_INV_LVR50_60 = function () { return this.Find("OA_MAX150_INV_LVR50_60"); }; 
    this.getCP_OA_MAX150_INV_LVR50_60 = function () { return this.Find("CP_OA_MAX150_INV_LVR50_60"); }; 
    //OO IO
    this.getOA_IO_MAX150_OO_LVR50_60 = function () { return this.Find("OA_IO_MAX150_OO_LVR50_60"); }; 
    this.getCP_OA_IO_MAX150_OO_LVR50_60 = function () { return this.Find("CP_OA_IO_MAX150_OO_LVR50_60"); };
    //INV IO
    this.getOA_IO_MAX150_INV_LVR50_60 = function () { return this.Find("OA_IO_MAX150_INV_LVR50_60"); }; 
    this.getCP_OA_IO_MAX150_INV_LVR50_60 = function () { return this.Find("CP_OA_IO_MAX150_INV_LVR50_60"); };

    
    //LVR between 60% and 70%
    //OO P&I
    this.getOA_MAX150_LVR60_70 = function () { return this.Find("OA_MAX150_LVR60_70"); }; 
    this.getCP_OA_MAX150_LVR60_70 = function () { return this.Find("CP_OA_MAX150_LVR60_70"); }; 
    //Inv P&I
    this.getOA_MAX150_INV_LVR60_70 = function () { return this.Find("OA_MAX150_INV_LVR60_70"); }; 
    this.getCP_OA_MAX150_INV_LVR60_70 = function () { return this.Find("CP_OA_MAX150_INV_LVR60_70"); }; 
    //OO IO
    this.getOA_IO_MAX150_OO_LVR60_70 = function () { return this.Find("OA_IO_MAX150_OO_LVR60_70"); }; 
    this.getCP_OA_IO_MAX150_OO_LVR60_70 = function () { return this.Find("CP_OA_IO_MAX150_OO_LVR60_70"); };
    //INV IO
    this.getOA_IO_MAX150_INV_LVR60_70 = function () { return this.Find("OA_IO_MAX150_INV_LVR60_70"); }; 
    this.getCP_OA_IO_MAX150_INV_LVR60_70 = function () { return this.Find("CP_OA_IO_MAX150_INV_LVR60_70"); };

    //LVR between 70% and 80%
    //OO P&I
    this.getOA_MAX150_LVR70_80 = function () { return this.Find("OA_MAX150_LVR70_80"); }; 
    this.getCP_OA_MAX150_LVR70_80 = function () { return this.Find("CP_OA_MAX150_LVR70_80"); }; 
    //Inv P&I
    this.getOA_MAX150_INV_LVR70_80 = function () { return this.Find("OA_MAX150_INV_LVR70_80"); }; 
    this.getCP_OA_MAX150_INV_LVR70_80 = function () { return this.Find("CP_OA_MAX150_INV_LVR70_80"); }; 
    //OO IO
    this.getOA_IO_MAX150_OO_LVR70_80 = function () { return this.Find("OA_IO_MAX150_OO_LVR70_80"); }; 
    this.getCP_OA_IO_MAX150_OO_LVR70_80 = function () { return this.Find("CP_OA_IO_MAX150_OO_LVR70_80"); };
    //INV IO
    this.getOA_IO_MAX150_INV_LVR70_80 = function () { return this.Find("OA_IO_MAX150_INV_LVR70_80"); }; 
    this.getCP_OA_IO_MAX150_INV_LVR70_80 = function () { return this.Find("CP_OA_IO_MAX150_INV_LVR70_80"); };

    //LVR between 80% and 90%
    //OO P&I
    this.getOA_MAX150_LVR80_90 = function () { return this.Find("OA_MAX150_LVR80_90"); }; 
    this.getCP_OA_MAX150_LVR80_90 = function () { return this.Find("CP_OA_MAX150_LVR80_90"); }; 
    //Inv P&I
    this.getOA_MAX150_INV_LVR80_90 = function () { return this.Find("OA_MAX150_INV_LVR80_90"); }; 
    this.getCP_OA_MAX150_INV_LVR80_90 = function () { return this.Find("CP_OA_MAX150_INV_LVR80_90"); }; 
    //OO IO
    this.getOA_IO_MAX150_OO_LVR80_90 = function () { return this.Find("OA_IO_MAX150_OO_LVR80_90"); }; 
    this.getCP_OA_IO_MAX150_OO_LVR80_90 = function () { return this.Find("CP_OA_IO_MAX150_OO_LVR80_90"); };
    //INV IO
    this.getOA_IO_MAX150_INV_LVR80_90 = function () { return this.Find("OA_IO_MAX150_INV_LVR80_90"); }; 
    this.getCP_OA_IO_MAX150_INV_LVR80_90 = function () { return this.Find("CP_OA_IO_MAX150_INV_LVR80_90"); };

    //LVR above 90%
    //OO P&I
    this.getOA_MAX150_LVR90 = function () { return this.Find("OA_MAX150_LVR90"); }; 
    this.getCP_OA_MAX150_LVR90 = function () { return this.Find("CP_OA_MAX150_LVR90"); }; 
    //Inv P&I
    this.getOA_MAX150_INV_LVR90 = function () { return this.Find("OA_MAX150_INV_LVR90"); }; 
    this.getCP_OA_MAX150_INV_LVR90 = function () { return this.Find("CP_OA_MAX150_INV_LVR90"); }; 
    //OO IO
    this.getOA_IO_MAX150_OO_LVR90 = function () { return this.Find("OA_IO_MAX150_OO_LVR90"); }; 
    this.getCP_OA_IO_MAX150_OO_LVR90 = function () { return this.Find("CP_OA_IO_MAX150_OO_LVR90"); };
    //INV IO
    this.getOA_IO_MAX150_INV_LVR90 = function () { return this.Find("OA_IO_MAX150_INV_LVR90"); }; 
    this.getCP_OA_IO_MAX150_INV_LVR90 = function () { return this.Find("CP_OA_IO_MAX150_INV_LVR90"); };



    //Orange Advantage
    //>$150k <$500k
    //old segment
    //PI
	this.getOA_MAX500_80 = function () { return this.Find("OA150_500_LVR80"); };
	this.getCOMP_OA_MAX500_80 = function () { return this.Find("CP_OA150_500_LVR80"); };
    //IO
    this.getOA_MAX500_80_IO = function () { return this.Find("OA_IO_150_500_OO_LVR80"); };
	this.getCOMP_OA_MAX500_80_IO = function () { return this.Find("CP_OA_IO_150_500_OO_LVR80"); };
    //PI
	this.getOA_MAX500_8090 = function () { return this.Find("OA150_500_LVR80_90"); };
	this.getCOMP_OA_MAX500_8090 = function () { return this.Find("CP_OA150_500_LR80_90"); };
    //IO
    this.getOA_MAX500_8090_IO = function () { return this.Find("OA_IO_150_500_OO_LVR80_90"); };
	this.getCOMP_OA_MAX500_8090_IO = function () { return this.Find("CP_OA_IO_150_500_OO_LVR80_90"); };
    //PI
	this.getOA_MAX500_90 = function () { return this.Find("OA150_500_LVR90"); };
	this.getCOMP_OA_MAX500_90 = function () { return this.Find("CP_OA150_500_LVR90"); };
    //IO
    this.getOA_MAX500_90_IO = function () { return this.Find("OA_IO_150_500_OO_LVR90"); };
	this.getCOMP_OA_MAX500_90_IO = function () { return this.Find("CP_OA_IO_150_500_OO_LVR90"); };

    //PI
    this.getOA_MAX500_INV_80 = function () { return this.Find("OA150_500_INV_LVR80"); };
    this.getCOMP_OA_MAX500_INV_80 = function () { return this.Find("CP_OA150_500_INVLR80"); };
    //IO
    this.getOA_MAX500_INV_80_IO = function () { return this.Find("OA_IO_150_500_INV_LVR80"); };
    this.getCOMP_OA_MAX500_INV_80_IO = function () { return this.Find("CP_OA_IO_150_500_INV_LVR80"); };
    //PI
    this.getOA_MAX500_INV_8090 = function () { return this.Find("OA150_500_INVLR80_90"); };
    this.getCOMP_OA_MAX500_INV_8090 = function () { return this.Find("CPOA150_500_INV80_90"); };
    //IO
    this.getOA_MAX500_INV_8090_IO = function () { return this.Find("OA_IO_150_500_INV_LVR80_90"); };
    this.getCOMP_OA_MAX500_INV_8090_IO = function () { return this.Find("CP_OA_IO_150_500_INV_LVR80_90"); };


    //New LVR bands
    //LVR 50% or less
    //OO P&I
    this.getOA150_500_LVR50 = function () { return this.Find("OA150_500_LVR50"); }; 
	this.getCP_OA150_500_LVR50 = function () { return this.Find("CP_OA150_500_LVR50"); }; 
    //Inv P&I
    this.getOA150_500_INV_LVR50 = function () { return this.Find("OA150_500_INV_LVR50"); }; 
    this.getCP_OA150_500_INV_LVR50 = function () { return this.Find("CP_OA150_500_INV_LVR50"); }; 
    //OO IO
    this.getOA_IO_150_500_OO_LVR50 = function () { return this.Find("OA_IO_150_500_OO_LVR50"); }; 
    this.getCP_OA_IO_150_500_OO_LVR50 = function () { return this.Find("CP_OA_IO_150_500_OO_LVR50"); };
    //INV IO
    this.getOA_IO_150_500_INV_LVR50 = function () { return this.Find("OA_IO_150_500_INV_LVR50"); }; 
    this.getCP_OA_IO_150_500_INV_LVR50 = function () { return this.Find("CP_OA_IO_150_500_INV_LVR50"); };

    //LVR between 50% and 60%
    //OO P&I
    this.getOA150_500_LVR50_60 = function () { return this.Find("OA150_500_LVR50_60"); }; 
	this.getCP_OA150_500_LVR50_60 = function () { return this.Find("CP_OA150_500_LVR50_60"); }; 
    //Inv P&I
    this.getOA150_500_INV_LVR50_60 = function () { return this.Find("OA150_500_INV_LVR50_60"); }; 
    this.getCP_OA150_500_INV_LVR50_60 = function () { return this.Find("CP_OA150_500_INV_LVR50_60"); }; 
    //OO IO
    this.getOA_IO_150_500_OO_LVR50_60 = function () { return this.Find("OA_IO_150_500_OO_LVR50_60"); }; 
    this.getCP_OA_IO_150_500_OO_LVR50_60 = function () { return this.Find("CP_OA_IO_150_500_OO_LVR50_60"); };
    //INV IO
    this.getOA_IO_150_500_INV_LVR50_60 = function () { return this.Find("OA_IO_150_500_INV_LVR50_60"); }; 
    this.getCP_OA_IO_150_500_INV_LVR50_60 = function () { return this.Find("CP_OA_IO_150_500_INV_LVR50_60"); };

    //LVR between 60% and 70%
    //OO P&I
    this.getOA150_500_LVR60_70 = function () { return this.Find("OA150_500_LVR60_70"); }; 
	this.getCP_OA150_500_LVR60_70 = function () { return this.Find("CP_OA150_500_LVR60_70"); }; 
    //Inv P&I
    this.getOA150_500_INV_LVR60_70 = function () { return this.Find("OA150_500_INV_LVR60_70"); }; 
    this.getCP_OA150_500_INV_LVR60_70 = function () { return this.Find("CP_OA150_500_INV_LVR60_70"); }; 
    //OO IO
    this.getOA_IO_150_500_OO_LVR60_70 = function () { return this.Find("OA_IO_150_500_OO_LVR60_70"); }; 
    this.getCP_OA_IO_150_500_OO_LVR60_70 = function () { return this.Find("CP_OA_IO_150_500_OO_LVR60_70"); };
    //INV IO
    this.getOA_IO_150_500_INV_LVR60_70 = function () { return this.Find("OA_IO_150_500_INV_LVR60_70"); }; 
    this.getCP_OA_IO_150_500_INV_LVR60_70 = function () { return this.Find("CP_OA_IO_150_500_INV_LVR60_70"); };

    //LVR between 70% and 80%
    //OO P&I
    this.getOA150_500_LVR70_80 = function () { return this.Find("OA150_500_LVR70_80"); }; 
	this.getCP_OA150_500_LVR70_80 = function () { return this.Find("CP_OA150_500_LVR70_80"); }; 
    //Inv P&I
    this.getOA150_500_INV_LVR70_80 = function () { return this.Find("OA150_500_INV_LVR70_80"); }; 
    this.getCP_OA150_500_INV_LVR70_80 = function () { return this.Find("CP_OA150_500_INV_LVR70_80"); }; 
    //OO IO
    this.getOA_IO_150_500_OO_LVR70_80 = function () { return this.Find("OA_IO_150_500_OO_LVR70_80"); }; 
    this.getCP_OA_IO_150_500_OO_LVR70_80 = function () { return this.Find("CP_OA_IO_150_500_OO_LVR70_80"); };
    //INV IO
    this.getOA_IO_150_500_INV_LVR70_80 = function () { return this.Find("OA_IO_150_500_INV_LVR70_80"); }; 
    this.getCP_OA_IO_150_500_INV_LVR70_80 = function () { return this.Find("CP_OA_IO_150_500_INV_LVR70_80"); };

    //LVR above 90%
    //INV P&I
    this.getOA150_500_INV_LVR90 = function () { return this.Find("OA150_500_INV_LVR90"); }; 
    this.getCP_OA150_500_INV_LVR90 = function () { return this.Find("CP_OA150_500_INV_LVR90"); };
    //INV IO
    this.getOA_IO_150_500_INV_LVR90 = function () { return this.Find("OA_IO_150_500_INV_LVR90"); }; 
    this.getCP_OA_IO_150_500_INV_LVR90 = function () { return this.Find("CP_OA_IO_150_500_INV_LVR90"); };


    //>$500k
    //old segment
    //PI
	this.getOA_MIN500_80 = function () { return this.Find("OA_MIN500_LVR80"); };
	this.getCOMP_OA_MIN500_80 = function () { return this.Find("CP_OA_MIN500_LR80"); };
    //IO
    this.getOA_MIN500_80_IO = function () { return this.Find("OA_IO_MIN500_OO_LVR80"); };
	this.getCOMP_OA_MIN500_80_IO = function () { return this.Find("CP_OA_IO_MIN500_OO_LVR80"); };
    //PI
	this.getOA_MIN500_8090 = function () { return this.Find("OA_MIN500_LVR80_90"); };
	this.getCOMP_OA_MIN500_8090 = function () { return this.Find("CP_OA_MIN500_LR80_90"); };
    //IO
    this.getOA_MIN500_8090_IO = function () { return this.Find("OA_IO_MIN500_OO_LVR80_90"); };
	this.getCOMP_OA_MIN500_8090_IO = function () { return this.Find("CP_OA_IO_MIN500_OO_LVR80_90"); };
    //PI
	this.getOA_MIN500_90 = function () { return this.Find("OA_MIN500_LVR90"); };
	this.getCOMP_OA_MIN500_90 = function () { return this.Find("CP_OA_MIN500_LVR90"); };
    //IO
    this.getOA_MIN500_90_IO = function () { return this.Find("OA_IO_MIN500_OO_LVR90"); };
	this.getCOMP_OA_MIN500_90_IO = function () { return this.Find("CP_OA_IO_MIN500_OO_LVR90"); };

	/*this.getOA_MIN500_INV = function () { return this.Find("OA_MIN500_INV_ALL"); };
	this.getCOMP_OA_MIN500_INV = function () { return this.Find("CP_OA_MIN500_INV_ALL"); };
    */
    //PI
	this.getOA_MIN500_INV_80 = function () { return this.Find("OA_MIN500_INV_LVR80"); };
	this.getCOMP_OA_MIN500_INV_80 = function () { return this.Find("CP_OAMIN500_INV_LR80"); };
    //IO
    this.getOA_MIN500_INV_80_IO = function () { return this.Find("OA_IO_MIN500_INV_LVR80"); };
	this.getCOMP_OA_MIN500_INV_80_IO = function () { return this.Find("CP_OA_IO_MIN500_INV_LVR80"); };
    //PI
	this.getOA_MIN500_INV_8090 = function () { return this.Find("OAMIN500_INV_LR80_90"); };
	this.getCOMP_OA_MIN500_INV_8090 = function () { return this.Find("CP_OAMIN500_INV80_90"); };
    //IO
    this.getOA_MIN500_INV_8090_IO = function () { return this.Find("OA_IO_MIN500_INV_LVR80_90"); };
	this.getCOMP_OA_MIN500_INV_8090_IO = function () { return this.Find("CP_OA_IO_MIN500_INV_LVR80_90"); };


    //New LVR Bands
    //LVR 50% or less
    //OO P&I
    this.getOA_MIN500_LVR50 = function () { return this.Find("OA_MIN500_LVR50"); }; 
	this.getCP_OA_MIN500_LVR50 = function () { return this.Find("CP_OA_MIN500_LVR50"); }; 
    //Inv P&I
    this.getOA_MIN500_INV_LVR50 = function () { return this.Find("OA_MIN500_INV_LVR50"); }; 
    this.getCP_OA_MIN500_INV_LVR50 = function () { return this.Find("CP_OA_MIN500_INV_LVR50"); }; 
    //OO IO
    this.getOA_IO_MIN500_OO_LVR50 = function () { return this.Find("OA_IO_MIN500_OO_LVR50"); }; 
    this.getCP_OA_IO_MIN500_OO_LVR50 = function () { return this.Find("CP_OA_IO_MIN500_OO_LVR50"); };
    //INV IO
    this.getOA_IO_MIN500_INV_LVR50 = function () { return this.Find("OA_IO_MIN500_INV_LVR50"); }; 
    this.getCP_OA_IO_MIN500_INV_LVR50 = function () { return this.Find("CP_OA_IO_MIN500_INV_LVR50"); };

    //LVR between 50% & 60%
    //OO P&I
    this.getOA_MIN500_LVR50_60 = function () { return this.Find("OA_MIN500_LVR50_60"); }; 
	this.getCP_OA_MIN500_LVR50_60 = function () { return this.Find("CP_OA_MIN500_LVR50_60"); }; 
    //Inv P&I
    this.getOA_MIN500_INV_LVR50_60 = function () { return this.Find("OA_MIN500_INV_LVR50_60"); }; 
    this.getCP_OA_MIN500_INV_LVR50_60 = function () { return this.Find("CP_OA_MIN500_INV_LVR50_60"); }; 
    //OO IO
    this.getOA_IO_MIN500_OO_LVR50_60 = function () { return this.Find("OA_IO_MIN500_OO_LVR50_60"); }; 
    this.getCP_OA_IO_MIN500_OO_LVR50_60 = function () { return this.Find("CP_OA_IO_MIN500_OO_LVR50_60"); };
    //INV IO
    this.getOA_IO_MIN500_INV_LVR50_60 = function () { return this.Find("OA_IO_MIN500_INV_LVR50_60"); }; 
    this.getCP_OA_IO_MIN500_INV_LVR50_60 = function () { return this.Find("CP_OA_IO_MIN500_INV_LVR50_60"); };

    //LVR between 60% & 70%
    //OO P&I
    this.getOA_MIN500_LVR60_70 = function () { return this.Find("OA_MIN500_LVR60_70"); }; 
	this.getCP_OA_MIN500_LVR60_70 = function () { return this.Find("CP_OA_MIN500_LVR60_70"); }; 
    //Inv P&I
    this.getOA_MIN500_INV_LVR60_70 = function () { return this.Find("OA_MIN500_INV_LVR60_70"); }; 
    this.getCP_OA_MIN500_INV_LVR60_70 = function () { return this.Find("CP_OA_MIN500_INV_LVR60_70"); }; 
    //OO IO
    this.getOA_IO_MIN500_OO_LVR60_70 = function () { return this.Find("OA_IO_MIN500_OO_LVR60_70"); }; 
    this.getCP_OA_IO_MIN500_OO_LVR60_70 = function () { return this.Find("CP_OA_IO_MIN500_OO_LVR60_70"); };
    //INV IO
    this.getOA_IO_MIN500_INV_LVR60_70 = function () { return this.Find("OA_IO_MIN500_INV_LVR60_70"); }; 
    this.getCP_OA_IO_MIN500_INV_LVR60_70 = function () { return this.Find("CP_OA_IO_MIN500_INV_LVR60_70"); };
   
    //LVR between 70% & 80%
    //OO P&I
    this.getOA_MIN500_LVR70_80 = function () { return this.Find("OA_MIN500_LVR70_80"); }; 
	this.getCP_OA_MIN500_LVR70_80 = function () { return this.Find("CP_OA_MIN500_LVR70_80"); }; 
    //Inv P&I
    this.getOA_MIN500_INV_LVR70_80 = function () { return this.Find("OA_MIN500_INV_LVR70_80"); }; 
    this.getCP_OA_MIN500_INV_LVR70_80 = function () { return this.Find("CP_OA_MIN500_INV_LVR70_80"); }; 
    //OO IO
    this.getOA_IO_MIN500_OO_LVR70_80 = function () { return this.Find("OA_IO_MIN500_OO_LVR70_80"); }; 
    this.getCP_OA_IO_MIN500_OO_LVR70_80 = function () { return this.Find("CP_OA_IO_MIN500_OO_LVR70_80"); };
    //INV IO
    this.getOA_IO_MIN500_INV_LVR70_80 = function () { return this.Find("OA_IO_MIN500_INV_LVR70_80"); }; 
    this.getCP_OA_IO_MIN500_INV_LVR70_80 = function () { return this.Find("CP_OA_IO_MIN500_INV_LVR70_80"); };

    //LVR above 90%
    //INV P&I
    this.getOA_MIN500_INV_LVR90 = function () { return this.Find("OA_MIN500_INV_LVR90"); }; 
	this.getCP_OA_MIN500_INV_LVR90 = function () { return this.Find("CP_OA_MIN500_INV_LVR90"); }; 
    //Inv IO
    this.getOA_IO_MIN500_INV_LVR90 = function () { return this.Find("OA_IO_MIN500_INV_LVR90"); }; 
	this.getCP_OA_IO_MIN500_INV_LVR90 = function () { return this.Find("CP_OA_IO_MIN500_INV_LVR90"); }; 




    //>$1M
    //Old segment
    //PI
    this.getOA_MIN1M_80 = function () { return this.Find("OA1M_OO_PI_LVR80"); };
	this.getCOMP_OA_MIN1M_80 = function () { return this.Find("CP_OA1M_OO_PI_LVR80"); };
    //IO
    this.getOA_MIN1M_80_IO = function () { return this.Find("OA1M_OO_IO_LVR80"); };
	this.getCOMP_OA_MIN1M_80_IO = function () { return this.Find("CP_OA1M_OO_IO_LVR80"); };


        //New LVR Bands
    //LVR 50% or less
    //OO P&I
    this.getOA_PI_1M_OO_LVR50 = function () { return this.Find("OA_PI_1M_OO_LVR50"); }; 
	this.getCP_OA_PI_1M_OO_LVR50 = function () { return this.Find("CP_OA_PI_1M_OO_LVR50"); }; 
    //Inv P&I
    this.getOA_PI_1M_INV_LVR50 = function () { return this.Find("OA_PI_1M_INV_LVR50"); }; 
    this.getCP_OA_PI_1M_INV_LVR50 = function () { return this.Find("CP_OA_PI_1M_INV_LVR50"); }; 
    //OO IO
    this.getOA_IO_1M_OO_LVR50 = function () { return this.Find("OA_IO_1M_OO_LVR50"); }; 
    this.getCP_OA_IO_1M_OO_LVR50 = function () { return this.Find("CP_OA_IO_1M_OO_LVR50"); };
    //INV IO
    this.getOA_IO_1M_INV_LVR50 = function () { return this.Find("OA_IO_1M_INV_LVR50"); }; 
    this.getCP_OA_IO_1M_INV_LVR50 = function () { return this.Find("CP_OA_IO_1M_INV_LVR50"); };

    //LVR between 50% & 60%
    //OO P&I
    this.getOA_PI_1M_OO_LVR50_60 = function () { return this.Find("OA_PI_1M_OO_LVR50_60"); }; 
	this.getCP_OA_PI_1M_OO_LVR50_60 = function () { return this.Find("CP_OA_PI_1M_OO_LVR50_60"); }; 
    //Inv P&I
    this.getOA_PI_1M_INV_LVR50_60 = function () { return this.Find("OA_PI_1M_INV_LVR50_60"); }; 
    this.getCP_OA_PI_1M_INV_LVR50_60 = function () { return this.Find("CP_OA_PI_1M_INV_LVR50_60"); }; 
    //OO IO
    this.getOA_IO_1M_OO_LVR50_60 = function () { return this.Find("OA_IO_1M_OO_LVR50_60"); }; 
    this.getCP_OA_IO_1M_OO_LVR50_60 = function () { return this.Find("CP_OA_IO_1M_OO_LVR50_60"); };
    //INV IO
    this.getOA_IO_1M_INV_LVR50_60 = function () { return this.Find("OA_IO_1M_INV_LVR50_60"); }; 
    this.getCP_OA_IO_1M_INV_LVR50_60 = function () { return this.Find("CP_OA_IO_1M_INV_LVR50_60"); };

    //LVR between 60% & 70%
    //OO P&I
    this.getOA_PI_1M_OO_LVR60_70 = function () { return this.Find("OA_PI_1M_OO_LVR60_70"); }; 
	this.getCP_OA_PI_1M_OO_LVR60_70 = function () { return this.Find("CP_OA_PI_1M_OO_LVR60_70"); }; 
    //Inv P&I
    this.getOA_PI_1M_INV_LVR60_70 = function () { return this.Find("OA_PI_1M_INV_LVR60_70"); }; 
    this.getCP_OA_PI_1M_INV_LVR60_70 = function () { return this.Find("CP_OA_PI_1M_INV_LVR60_70"); }; 
    //OO IO
    this.getOA_IO_1M_OO_LVR60_70 = function () { return this.Find("OA_IO_1M_OO_LVR60_70"); }; 
    this.getCP_OA_IO_1M_OO_LVR60_70 = function () { return this.Find("CP_OA_IO_1M_OO_LVR60_70"); };
    //INV IO
    this.getOA_IO_1M_INV_LVR60_70 = function () { return this.Find("OA_IO_1M_INV_LVR60_70"); }; 
    this.getCP_OA_IO_1M_INV_LVR60_70 = function () { return this.Find("CP_OA_IO_1M_INV_LVR60_70"); };
   
    //LVR between 70% & 80%
    //OO P&I
    this.getOA_PI_1M_OO_LVR70_80 = function () { return this.Find("OA_PI_1M_OO_LVR70_80"); }; 
	this.getCP_OA_PI_1M_OO_LVR70_80 = function () { return this.Find("CP_OA_PI_1M_OO_LVR70_80"); }; 
    //Inv P&I
    this.getOA_PI_1M_INV_LVR70_80 = function () { return this.Find("OA_PI_1M_INV_LVR70_80"); }; 
    this.getCP_OA_PI_1M_INV_LVR70_80 = function () { return this.Find("CP_OA_PI_1M_INV_LVR70_80"); }; 
    //OO IO
    this.getOA_IO_1M_OO_LVR70_80 = function () { return this.Find("OA_IO_1M_OO_LVR70_80"); }; 
    this.getCP_OA_IO_1M_OO_LVR70_80 = function () { return this.Find("CP_OA_IO_1M_OO_LVR70_80"); };
    //INV IO
    this.getOA_IO_1M_INV_LVR70_80 = function () { return this.Find("OA_IO_1M_INV_LVR70_80"); }; 
    this.getCP_OA_IO_1M_INV_LVR70_80 = function () { return this.Find("CP_OA_IO_1M_INV_LVR70_80"); };

    //LVR between 80% & 90%
    //OO P&I
    this.getOA_PI_1M_OO_LVR80_90 = function () { return this.Find("OA_PI_1M_OO_LVR80_90"); }; 
	this.getCP_OA_PI_1M_OO_LVR80_90 = function () { return this.Find("CP_OA_PI_1M_OO_LVR80_90"); }; 
    //Inv P&I
    this.getOA_PI_1M_INV_LVR80_90 = function () { return this.Find("OA_PI_1M_INV_LVR80_90"); }; 
    this.getCP_OA_PI_1M_INV_LVR80_90 = function () { return this.Find("CP_OA_PI_1M_INV_LVR80_90"); }; 
    //OO IO
    this.getOA_IO_1M_OO_LVR80_90 = function () { return this.Find("OA_IO_1M_OO_LVR80_90"); }; 
    this.getCP_OA_IO_1M_OO_LVR80_90 = function () { return this.Find("CP_OA_IO_1M_OO_LVR80_90"); };
    //INV IO
    this.getOA_IO_1M_INV_LVR80_90 = function () { return this.Find("OA_IO_1M_INV_LVR80_90"); }; 
    this.getCP_OA_IO_1M_INV_LVR80_90 = function () { return this.Find("CP_OA_IO_1M_INV_LVR80_90"); };

    //LVR above 90%
    //OO P&I
    this.getOA_PI_1M_OO_LVR90 = function () { return this.Find("OA_PI_1M_OO_LVR90"); }; 
	this.getCP_OA_PI_1M_OO_LVR90 = function () { return this.Find("CP_OA_PI_1M_OO_LVR90"); }; 
    //OO IO
    this.getOA_IO_1M_OO_LVR90 = function () { return this.Find("OA_IO_1M_OO_LVR90"); }; 
	this.getCP_OA_IO_1M_OO_LVR90 = function () { return this.Find("CP_OA_IO_1M_OO_LVR90"); }; 
    //INV P&I
    this.getOA_PI_1M_INV_LVR90 = function () { return this.Find("OA_PI_1M_INV_LVR90"); }; 
	this.getCP_OA_PI_1M_INV_LVR90 = function () { return this.Find("CP_OA_PI_1M_INV_LVR90"); }; 
    //Inv IO
    this.getOA_IO_1M_INV_LVR90 = function () { return this.Find("OA_IO_1M_INV_LVR90"); }; 
	this.getCP_OA_IO_1M_INV_LVR90 = function () { return this.Find("CP_OA_IO_1M_INV_LVR90"); }; 


    //Mortgage Simplifier

    //$150k or less
    //Old Segment
	//PI
    this.getMS_MAX150 = function () { return this.Find("MS_MAX150"); }; //rate
	this.getCOMP_MS_MAX150 = function () { return this.Find("CP_MS_MAX150"); }; //comparison rate
    //IO
    this.getMS_MAX150_IO = function () { return this.Find("MS_IO_MAX150"); }; //rate
	this.getCOMP_MS_MAX150_IO = function () { return this.Find("CP_MS_IO_MAX150"); }; //comparison rate
    //PI
	this.getMS_MAX150_INV = function () { return this.Find("MS_PI_INV_MAX150"); }; //rate
	this.getCOMP_MS_MAX150_INV = function () { return this.Find("CP_MS_PI_INV_MAX150"); }; //comparison rate
    //IO
    this.getMS_MAX150_INV_IO = function () { return this.Find("MS_IO_INV_MAX150"); }; //rate
	this.getCOMP_MS_MAX150_INV_IO = function () { return this.Find("CP_MS_IO_INV_MAX150"); }; //comparison rate

    //New LVR bands
    //LVR 50% or less
    //OO P&I
    this.getMS_MAX150_LVR50 = function () { return this.Find("MS_MAX150_LVR50"); }; 
	this.getCP_MS_MAX150_LVR50 = function () { return this.Find("CP_MS_MAX150_LVR50"); }; 
    //Inv P&I
    this.getMS_MAX150_INV_LVR50 = function () { return this.Find("MS_MAX150_INV_LVR50"); }; 
    this.getCP_MS_MAX150_INV_LVR50 = function () { return this.Find("CP_MS_MAX150_INV_LVR50"); }; 
    //OO IO
    this.getMS_IO_MAX150_OO_LVR50 = function () { return this.Find("MS_IO_MAX150_OO_LVR50"); }; 
    this.getCP_MS_IO_MAX150_OO_LVR50 = function () { return this.Find("CP_MS_IO_MAX150_OO_LVR50"); };
    //INV IO
    this.getMS_IO_MAX150_INV_LVR50 = function () { return this.Find("MS_IO_MAX150_INV_LVR50"); }; 
    this.getCP_MS_IO_MAX150_INV_LVR50 = function () { return this.Find("CP_MS_IO_MAX150_INV_LVR50"); };

    //LVR between 50% and 60%
    //OO P&I
    this.getMS_MAX150_LVR50_60 = function () { return this.Find("MS_MAX150_LVR50_60"); }; 
    this.getCP_MS_MAX150_LVR50_60 = function () { return this.Find("CP_MS_MAX150_LVR50_60"); }; 
    //Inv P&I
    this.getMS_MAX150_INV_LVR50_60 = function () { return this.Find("MS_MAX150_INV_LVR50_60"); }; 
    this.getCP_MS_MAX150_INV_LVR50_60 = function () { return this.Find("CP_MS_MAX150_INV_LVR50_60"); }; 
    //OO IO
    this.getMS_IO_MAX150_OO_LVR50_60 = function () { return this.Find("MS_IO_MAX150_OO_LVR50_60"); }; 
    this.getCP_MS_IO_MAX150_OO_LVR50_60 = function () { return this.Find("CP_MS_IO_MAX150_OO_LVR50_60"); };
    //INV IO
    this.getMS_IO_MAX150_INV_LVR50_60 = function () { return this.Find("MS_IO_MAX150_INV_LVR50_60"); }; 
    this.getCP_MS_IO_MAX150_INV_LVR50_60 = function () { return this.Find("CP_MS_IO_MAX150_INV_LVR50_60"); };

    
    //LVR between 60% and 70%
    //OO P&I
    this.getMS_MAX150_LVR60_70 = function () { return this.Find("MS_MAX150_LVR60_70"); }; 
    this.getCP_MS_MAX150_LVR60_70 = function () { return this.Find("CP_MS_MAX150_LVR60_70"); }; 
    //Inv P&I
    this.getMS_MAX150_INV_LVR60_70 = function () { return this.Find("MS_MAX150_INV_LVR60_70"); }; 
    this.getCP_MS_MAX150_INV_LVR60_70 = function () { return this.Find("CP_MS_MAX150_INV_LVR60_70"); }; 
    //OO IO
    this.getMS_IO_MAX150_OO_LVR60_70 = function () { return this.Find("MS_IO_MAX150_OO_LVR60_70"); }; 
    this.getCP_MS_IO_MAX150_OO_LVR60_70 = function () { return this.Find("CP_MS_IO_MAX150_OO_LVR60_70"); };
    //INV IO
    this.getMS_IO_MAX150_INV_LVR60_70 = function () { return this.Find("MS_IO_MAX150_INV_LVR60_70"); }; 
    this.getCP_MS_IO_MAX150_INV_LVR60_70 = function () { return this.Find("CP_MS_IO_MAX150_INV_LVR60_70"); };

    //LVR between 70% and 80%
    //OO P&I
    this.getMS_MAX150_LVR70_80 = function () { return this.Find("MS_MAX150_LVR70_80"); }; 
    this.getCP_MS_MAX150_LVR70_80 = function () { return this.Find("CP_MS_MAX150_LVR70_80"); }; 
    //Inv P&I
    this.getMS_MAX150_INV_LVR70_80 = function () { return this.Find("MS_MAX150_INV_LVR70_80"); }; 
    this.getCP_MS_MAX150_INV_LVR70_80 = function () { return this.Find("CP_MS_MAX150_INV_LVR70_80"); }; 
    //OO IO
    this.getMS_IO_MAX150_OO_LVR70_80 = function () { return this.Find("MS_IO_MAX150_OO_LVR70_80"); }; 
    this.getCP_MS_IO_MAX150_OO_LVR70_80 = function () { return this.Find("CP_MS_IO_MAX150_OO_LVR70_80"); };
    //INV IO
    this.getMS_IO_MAX150_INV_LVR70_80 = function () { return this.Find("MS_IO_MAX150_INV_LVR70_80"); }; 
    this.getCP_MS_IO_MAX150_INV_LVR70_80 = function () { return this.Find("CP_MS_IO_MAX150_INV_LVR70_80"); };

    //LVR between 80% and 90%
    //OO P&I
    this.getMS_MAX150_LVR80_90 = function () { return this.Find("MS_MAX150_LVR80_90"); }; 
    this.getCP_MS_MAX150_LVR80_90 = function () { return this.Find("CP_MS_MAX150_LVR80_90"); }; 
    //Inv P&I
    this.getMS_MAX150_INV_LVR80_90 = function () { return this.Find("MS_MAX150_INV_LVR80_90"); }; 
    this.getCP_MS_MAX150_INV_LVR80_90 = function () { return this.Find("CP_MS_MAX150_INV_LVR80_90"); }; 
    //OO IO
    this.getMS_IO_MAX150_OO_LVR80_90 = function () { return this.Find("MS_IO_MAX150_OO_LVR80_90"); }; 
    this.getCP_MS_IO_MAX150_OO_LVR80_90 = function () { return this.Find("CP_MS_IO_MAX150_OO_LVR80_90"); };
    //INV IO
    this.getMS_IO_MAX150_INV_LVR80_90 = function () { return this.Find("MS_IO_MAX150_INV_LVR80_90"); }; 
    this.getCP_MS_IO_MAX150_INV_LVR80_90 = function () { return this.Find("CP_MS_IO_MAX150_INV_LVR80_90"); };

    //LVR above 90%
    //OO P&I
    this.getMS_MAX150_LVR90 = function () { return this.Find("MS_MAX150_LVR90"); }; 
    this.getCP_MS_MAX150_LVR90 = function () { return this.Find("CP_MS_MAX150_LVR90"); }; 
    //Inv P&I
    this.getMS_MAX150_INV_LVR90 = function () { return this.Find("MS_MAX150_INV_LVR90"); }; 
    this.getCP_MS_MAX150_INV_LVR90 = function () { return this.Find("CP_MS_MAX150_INV_LVR90"); }; 
    //OO IO
    this.getMS_IO_MAX150_OO_LVR90 = function () { return this.Find("MS_IO_MAX150_OO_LVR90"); }; 
    this.getCP_MS_IO_MAX150_OO_LVR90 = function () { return this.Find("CP_MS_IO_MAX150_OO_LVR90"); };
    //INV IO
    this.getMS_IO_MAX150_INV_LVR90 = function () { return this.Find("MS_IO_MAX150_INV_LVR90"); }; 
    this.getCP_MS_IO_MAX150_INV_LVR90 = function () { return this.Find("CP_MS_IO_MAX150_INV_LVR90"); };


    //>$150k <$500k
    //Old segment
    //PI
	this.getMS_MAX500_80 = function () { return this.Find("MS150_500_LVR80"); };
	this.getCOMP_MS_MAX500_80 = function () { return this.Find("CP_MS150_500_LVR80"); };
    //IO
    this.getMS_MAX500_80_IO = function () { return this.Find("MS_IO_150_500_OO_LVR80"); };
	this.getCOMP_MS_MAX500_80_IO = function () { return this.Find("CP_MS_IO_150_500_OO_LVR80"); };
    //PI
	this.getMS_MAX500_8090 = function () { return this.Find("MS150_500_LVR80_90"); };
	this.getCOMP_MS_MAX500_8090 = function () { return this.Find("CP_MS150_500_LR80_90"); };
    //IO
    this.getMS_MAX500_8090_IO = function () { return this.Find("MS_IO_150_500_OO_LVR80_90"); };
	this.getCOMP_MS_MAX500_8090_IO = function () { return this.Find("CP_MS_IO_150_500_OO_LVR80_90"); };
    //PI
	this.getMS_MAX500_90 = function () { return this.Find("MS150_500_LVR90"); };
	this.getCOMP_MS_MAX500_90 = function () { return this.Find("CP_MS150_500_LVR90"); };
    //IO
    this.getMS_MAX500_90_IO = function () { return this.Find("MS_IO_150_500_OO_LVR90"); };
	this.getCOMP_MS_MAX500_90_IO = function () { return this.Find("CP_MS_IO_150_500_OO_LVR90"); };

    //PI
	this.getMS_MAX500_INV_80 = function () { return this.Find("MS150_500_INV_LVR80"); };
	this.getCOMP_MS_MAX500_INV_80 = function () { return this.Find("CP_MS150_500_INVLR80"); };
    //IO
    this.getMS_MAX500_INV_80_IO = function () { return this.Find("MS_IO_150_500_INV_LVR80"); };
	this.getCOMP_MS_MAX500_INV_80_IO = function () { return this.Find("CP_MS_IO_150_500_INV_LVR80"); };
    //PI
    this.getMS_MAX500_INV_8090 = function () { return this.Find("MS150_500_INVLR80_90"); };
	this.getCOMP_MS_MAX500_INV_8090 = function () { return this.Find("CPMS150_500_INV80_90"); };
    //IO
	this.getMS_MAX500_INV_8090_IO = function () { return this.Find("MS_IO_150_500_INV_LVR80_90"); };
	this.getCOMP_MS_MAX500_INV_8090_IO = function () { return this.Find("CP_MS_IO_150_500_INV_LVR80_90"); };

    //New LVR Bands
    //LVR 50% or less
    //OO P&I
    this.getMS150_500_LVR50 = function () { return this.Find("MS150_500_LVR50"); }; 
	this.getCP_MS150_500_LVR50 = function () { return this.Find("CP_MS150_500_LVR50"); }; 
    //Inv P&I
    this.getMS150_500_INV_LVR50 = function () { return this.Find("MS150_500_INV_LVR50"); }; 
    this.getCP_MS150_500_INV_LVR50 = function () { return this.Find("CP_MS150_500_INV_LVR50"); }; 
    //OO IO
    this.getMS_IO_150_500_OO_LVR50 = function () { return this.Find("MS_IO_150_500_OO_LVR50"); }; 
    this.getCP_MS_IO_150_500_OO_LVR50 = function () { return this.Find("CP_MS_IO_150_500_OO_LVR50"); };
    //INV IO
    this.getMS_IO_150_500_INV_LVR50 = function () { return this.Find("MS_IO_150_500_INV_LVR50"); }; 
    this.getCP_MS_IO_150_500_INV_LVR50 = function () { return this.Find("CP_MS_IO_150_500_INV_LVR50"); };

    //LVR between 50% and 60%
    //OO P&I
    this.getMS150_500_LVR50_60 = function () { return this.Find("MS150_500_LVR50_60"); }; 
	this.getCP_MS150_500_LVR50_60 = function () { return this.Find("CP_MS150_500_LVR50_60"); }; 
    //Inv P&I
    this.getMS150_500_INV_LVR50_60 = function () { return this.Find("MS150_500_INV_LVR50_60"); }; 
    this.getCP_MS150_500_INV_LVR50_60 = function () { return this.Find("CP_MS150_500_INV_LVR50_60"); }; 
    //OO IO
    this.getMS_IO_150_500_OO_LVR50_60 = function () { return this.Find("MS_IO_150_500_OO_LVR50_60"); }; 
    this.getCP_MS_IO_150_500_OO_LVR50_60 = function () { return this.Find("CP_MS_IO_150_500_OO_LVR50_60"); };
    //INV IO
    this.getMS_IO_150_500_INV_LVR50_60 = function () { return this.Find("MS_IO_150_500_INV_LVR50_60"); }; 
    this.getCP_MS_IO_150_500_INV_LVR50_60 = function () { return this.Find("CP_MS_IO_150_500_INV_LVR50_60"); };

    //LVR between 60% and 70%
    //OO P&I
    this.getMS150_500_LVR60_70 = function () { return this.Find("MS150_500_LVR60_70"); }; 
	this.getCP_MS150_500_LVR60_70 = function () { return this.Find("CP_MS150_500_LVR60_70"); }; 
    //Inv P&I
    this.getMS150_500_INV_LVR60_70 = function () { return this.Find("MS150_500_INV_LVR60_70"); }; 
    this.getCP_MS150_500_INV_LVR60_70 = function () { return this.Find("CP_MS150_500_INV_LVR60_70"); }; 
    //OO IO
    this.getMS_IO_150_500_OO_LVR60_70 = function () { return this.Find("MS_IO_150_500_OO_LVR60_70"); }; 
    this.getCP_MS_IO_150_500_OO_LVR60_70 = function () { return this.Find("CP_MS_IO_150_500_OO_LVR60_70"); };
    //INV IO
    this.getMS_IO_150_500_INV_LVR60_70 = function () { return this.Find("MS_IO_150_500_INV_LVR60_70"); }; 
    this.getCP_MS_IO_150_500_INV_LVR60_70 = function () { return this.Find("CP_MS_IO_150_500_INV_LVR60_70"); };

    //LVR between 70% and 80%
    //OO P&I
    this.getMS150_500_LVR70_80 = function () { return this.Find("MS150_500_LVR70_80"); }; 
	this.getCP_MS150_500_LVR70_80 = function () { return this.Find("CP_MS150_500_LVR70_80"); }; 
    //Inv P&I
    this.getMS150_500_INV_LVR70_80 = function () { return this.Find("MS150_500_INV_LVR70_80"); }; 
    this.getCP_MS150_500_INV_LVR70_80 = function () { return this.Find("CP_MS150_500_INV_LVR70_80"); }; 
    //OO IO
    this.getMS_IO_150_500_OO_LVR70_80 = function () { return this.Find("MS_IO_150_500_OO_LVR70_80"); }; 
    this.getCP_MS_IO_150_500_OO_LVR70_80 = function () { return this.Find("CP_MS_IO_150_500_OO_LVR70_80"); };
    //INV IO
    this.getMS_IO_150_500_INV_LVR70_80 = function () { return this.Find("MS_IO_150_500_INV_LVR70_80"); }; 
    this.getCP_MS_IO_150_500_INV_LVR70_80 = function () { return this.Find("CP_MS_IO_150_500_INV_LVR70_80"); };

    //LVR above 90%
    //INV P&I
    this.getMS150_500_INV_LVR90 = function () { return this.Find("MS150_500_INV_LVR90"); }; 
    this.getCP_MS150_500_INV_LVR90 = function () { return this.Find("CP_MS150_500_INV_LVR90"); };
    //INV IO
    this.getMS_IO_150_500_INV_LVR90 = function () { return this.Find("MS_IO_150_500_INV_LVR90"); }; 
    this.getCP_MS_IO_150_500_INV_LVR90 = function () { return this.Find("CP_MS_IO_150_500_INV_LVR90"); };

    //All borrowings
    //INV P&I
    this.getMS150_500_INV_ALL = function () { return this.Find("MS150_500_INV_ALL"); }; 
    this.getCP_MS150_500_INV_ALL = function () { return this.Find("CP_MS150_500_INV_ALL"); };


    //>$500k
    //Old Segment
    //PI
	this.getMS_MIN500_80 = function () { return this.Find("MS_MIN500_LVR80"); };
	this.getCOMP_MS_MIN500_80 = function () { return this.Find("CP_MS_MIN500_LR80"); };
    //IO
    this.getMS_MIN500_80_IO = function () { return this.Find("MS_IO_MIN500_OO_LVR80"); };
	this.getCOMP_MS_MIN500_80_IO = function () { return this.Find("CP_MS_IO_MIN500_OO_LVR80"); };
    //PI
	this.getMS_MIN500_8090 = function () { return this.Find("MS_MIN500_LVR80_90"); };
	this.getCOMP_MS_MIN500_8090 = function () { return this.Find("CP_MS_MIN500_LR80_90"); };
    //IO
    this.getMS_MIN500_8090_IO = function () { return this.Find("MS_IO_MIN500_OO_LVR80_90"); };
	this.getCOMP_MS_MIN500_8090_IO = function () { return this.Find("CP_MS_IO_MIN500_OO_LVR80_90"); };
    //PI
	this.getMS_MIN500_90 = function () { return this.Find("MS_MIN500_LVR90"); };
	this.getCOMP_MS_MIN500_90 = function () { return this.Find("CP_MS_MIN500_LVR90"); };
    //IO
    this.getMS_MIN500_90_IO = function () { return this.Find("MS_IO_MIN500_OO_LVR90"); };
	this.getCOMP_MS_MIN500_90_IO = function () { return this.Find("CP_MS_IO_MIN500_OO_LVR90"); };

    //PI
	this.getMS_MIN500_INV_80 = function () { return this.Find("MS_MIN500_INV_LVR80"); };
	this.getCOMP_MS_MIN500_INV_80 = function () { return this.Find("CP_MSMIN500_INV_LR80"); };
    //IO
    this.getMS_MIN500_INV_80_IO = function () { return this.Find("MS_IO_MIN500_INV_LVR80"); };
	this.getCOMP_MS_MIN500_INV_80_IO = function () { return this.Find("CP_MS_IO_MIN500_INV_LVR80"); };
    //PI
	this.getMS_MIN500_INV_8090 = function () { return this.Find("MSMIN500_INV_LR80_90"); };
	this.getCOMP_MS_MIN500_INV_8090 = function () { return this.Find("CP_MSMIN500_INV80_90"); };
    //IO
    this.getMS_MIN500_INV_8090_IO = function () { return this.Find("MS_IO_MIN500_INV_LVR80_90"); };
	this.getCOMP_MS_MIN500_INV_8090_IO = function () { return this.Find("CP_MS_IO_MIN500_INV_LVR80_90"); };


    //New LVR Bands
    //LVR 50% or less
    //OO P&I
    this.getMS_MIN500_LVR50 = function () { return this.Find("MS_MIN500_LVR50"); }; 
	this.getCP_MS_MIN500_LVR50 = function () { return this.Find("CP_MS_MIN500_LVR50"); }; 
    //Inv P&I
    this.getMS_MIN500_INV_LVR50 = function () { return this.Find("MS_MIN500_INV_LVR50"); }; 
    this.getCP_MS_MIN500_INV_LVR50 = function () { return this.Find("CP_MS_MIN500_INV_LVR50"); }; 
    //OO IO
    this.getMS_IO_MIN500_OO_LVR50 = function () { return this.Find("MS_IO_MIN500_OO_LVR50"); }; 
    this.getCP_MS_IO_MIN500_OO_LVR50 = function () { return this.Find("CP_MS_IO_MIN500_OO_LVR50"); };
    //INV IO
    this.getMS_IO_MIN500_INV_LVR50 = function () { return this.Find("MS_IO_MIN500_INV_LVR50"); }; 
    this.getCP_MS_IO_MIN500_INV_LVR50 = function () { return this.Find("CP_MS_IO_MIN500_INV_LVR50"); };

    //LVR between 50% & 60%
    //OO P&I
    this.getMS_MIN500_LVR50_60 = function () { return this.Find("MS_MIN500_LVR50_60"); }; 
	this.getCP_MS_MIN500_LVR50_60 = function () { return this.Find("CP_MS_MIN500_LVR50_60"); }; 
    //Inv P&I
    this.getMS_MIN500_INV_LVR50_60 = function () { return this.Find("MS_MIN500_INV_LVR50_60"); }; 
    this.getCP_MS_MIN500_INV_LVR50_60 = function () { return this.Find("CP_MS_MIN500_INV_LVR50_60"); }; 
    //OO IO
    this.getMS_IO_MIN500_OO_LVR50_60 = function () { return this.Find("MS_IO_MIN500_OO_LVR50_60"); }; 
    this.getCP_MS_IO_MIN500_OO_LVR50_60 = function () { return this.Find("CP_MS_IO_MIN500_OO_LVR50_60"); };
    //INV IO
    this.getMS_IO_MIN500_INV_LVR50_60 = function () { return this.Find("MS_IO_MIN500_INV_LVR50_60"); }; 
    this.getCP_MS_IO_MIN500_INV_LVR50_60 = function () { return this.Find("CP_MS_IO_MIN500_INV_LVR50_60"); };

    //LVR between 60% & 70%
    //OO P&I
    this.getMS_MIN500_LVR60_70 = function () { return this.Find("MS_MIN500_LVR60_70"); }; 
	this.getCP_MS_MIN500_LVR60_70 = function () { return this.Find("CP_MS_MIN500_LVR60_70"); }; 
    //Inv P&I
    this.getMS_MIN500_INV_LVR60_70 = function () { return this.Find("MS_MIN500_INV_LVR60_70"); }; 
    this.getCP_MS_MIN500_INV_LVR60_70 = function () { return this.Find("CP_MS_MIN500_INV_LVR60_70"); }; 
    //OO IO
    this.getMS_IO_MIN500_OO_LVR60_70 = function () { return this.Find("MS_IO_MIN500_OO_LVR60_70"); }; 
    this.getCP_MS_IO_MIN500_OO_LVR60_70 = function () { return this.Find("CP_MS_IO_MIN500_OO_LVR60_70"); };
    //INV IO
    this.getMS_IO_MIN500_INV_LVR60_70 = function () { return this.Find("MS_IO_MIN500_INV_LVR60_70"); }; 
    this.getCP_MS_IO_MIN500_INV_LVR60_70 = function () { return this.Find("CP_MS_IO_MIN500_INV_LVR60_70"); };
   
    //LVR between 70% & 80%
    //OO P&I
    this.getMS_MIN500_LVR70_80 = function () { return this.Find("MS_MIN500_LVR70_80"); }; 
	this.getCP_MS_MIN500_LVR70_80 = function () { return this.Find("CP_MS_MIN500_LVR70_80"); }; 
    //Inv P&I
    this.getMS_MIN500_INV_LVR70_80 = function () { return this.Find("MS_MIN500_INV_LVR70_80"); }; 
    this.getCP_MS_MIN500_INV_LVR70_80 = function () { return this.Find("CP_MS_MIN500_INV_LVR70_80"); }; 
    //OO IO
    this.getMS_IO_MIN500_OO_LVR70_80 = function () { return this.Find("MS_IO_MIN500_OO_LVR70_80"); }; 
    this.getCP_MS_IO_MIN500_OO_LVR70_80 = function () { return this.Find("CP_MS_IO_MIN500_OO_LVR70_80"); };
    //INV IO
    this.getMS_IO_MIN500_INV_LVR70_80 = function () { return this.Find("MS_IO_MIN500_INV_LVR70_80"); }; 
    this.getCP_MS_IO_MIN500_INV_LVR70_80 = function () { return this.Find("CP_MS_IO_MIN500_INV_LVR70_80"); };

    //LVR above 90%
    //INV P&I
    this.getMS_MIN500_INV_LVR90 = function () { return this.Find("MS_MIN500_INV_LVR90"); }; 
	this.getCP_MS_MIN500_INV_LVR90 = function () { return this.Find("CP_MS_MIN500_INV_LVR90"); }; 
    //OO IO
    this.getMS_IO_MIN500_INV_LVR90 = function () { return this.Find("MS_IO_MIN500_INV_LVR90"); }; 
    this.getCP_MS_IO_MIN500_INV_LVR90 = function () { return this.Find("CP_MS_IO_MIN500_INV_LVR90"); }; 
    
    //All borrowings
    //INV P&I
    this.getMS_MIN500_INV_ALL = function () { return this.Find("MS_MIN500_INV_ALL"); }; 
    this.getCP_MS_MIN500_INV_ALL = function () { return this.Find("CP_MS_MIN500_INV_ALL"); };



    //>$1M

    //Old Segment
    //PI
    this.getMS_MIN1M_80 = function () { return this.Find("MS1M_OO_PI_LVR80"); };
	this.getCOMP_MS_MIN1M_80 = function () { return this.Find("CP_MS1M_OO_PI_LVR80"); };
    //IO
    this.getMS_MIN1M_80_IO = function () { return this.Find("MS1M_OO_IO_LVR80"); };
    this.getCOMP_MS_MIN1M_80_IO = function () { return this.Find("CP_MS1M_OO_IO_LVR80"); };
    

    //New LVR Bands
    //LVR 50% or less
    //OO P&I
    this.getMS_MIN1_LVR50 = function () { return this.Find("MS_MIN1_LVR50"); }; 
    this.getCP_MS_MIN1_LVR50 = function () { return this.Find("CP_MS_MIN1_LVR50"); }; 
    //Inv P&I
    this.getMS_MIN1_INV_LVR50 = function () { return this.Find("MS_MIN1_INV_LVR50"); }; 
    this.getCP_MS_MIN1_INV_LVR50 = function () { return this.Find("CP_MS_MIN1_INV_LVR50"); }; 
    //OO IO
    this.getMS_IO_MIN1_OO_LVR50 = function () { return this.Find("MS_IO_MIN1_OO_LVR50"); }; 
    this.getCP_MS_IO_MIN1_OO_LVR50 = function () { return this.Find("CP_MS_IO_MIN1_OO_LVR50"); };
    //INV IO
    this.getMS_IO_MIN1_INV_LVR50 = function () { return this.Find("MS_IO_MIN1_INV_LVR50"); }; 
    this.getCP_MS_IO_MIN1_INV_LVR50 = function () { return this.Find("CP_MS_IO_MIN1_INV_LVR50"); };

    //LVR between 50% and 60%
    //OO P&I
    this.getMS_MIN1_LVR50_60 = function () { return this.Find("MS_MIN1_LVR50_60"); }; 
    this.getCP_MS_MIN1_LVR50_60 = function () { return this.Find("CP_MS_MIN1_LVR50_60"); }; 
    //Inv P&I
    this.getMS_MIN1_INV_LVR50_60 = function () { return this.Find("MS_MIN1_INV_LVR50_60"); }; 
    this.getCP_MS_MIN1_INV_LVR50_60 = function () { return this.Find("CP_MS_MIN1_INV_LVR50_60"); }; 
    //OO IO
    this.getMS_IO_MIN1_OO_LVR50_60 = function () { return this.Find("MS_IO_MIN1_OO_LVR50_60"); }; 
    this.getCP_MS_IO_MIN1_OO_LVR50_60 = function () { return this.Find("CP_MS_IO_MIN1_OO_LVR50_60"); };
    //INV IO
    this.getMS_IO_MIN1_INV_LVR50_60 = function () { return this.Find("MS_IO_MIN1_INV_LVR50_60"); }; 
    this.getCP_MS_IO_MIN1_INV_LVR50_60 = function () { return this.Find("CP_MS_IO_MIN1_INV_LVR50_60"); };

    //LVR between 60% and 70%
   //OO P&I
    this.getMS_MIN1_LVR60_70 = function () { return this.Find("MS_MIN1_LVR60_70"); }; 
    this.getCP_MS_MIN1_LVR60_70 = function () { return this.Find("CP_MS_MIN1_LVR60_70"); }; 
    //Inv P&I
    this.getMS_MIN1_INV_LVR60_70 = function () { return this.Find("MS_MIN1_INV_LVR60_70"); }; 
    this.getCP_MS_MIN1_INV_LVR60_70 = function () { return this.Find("CP_MS_MIN1_INV_LVR60_70"); }; 
    //OO IO
    this.getMS_IO_MIN1_OO_LVR60_70 = function () { return this.Find("MS_IO_MIN1_OO_LVR60_70"); }; 
    this.getCP_MS_IO_MIN1_OO_LVR60_70 = function () { return this.Find("CP_MS_IO_MIN1_OO_LVR60_70"); };
    //INV IO
    this.getMS_IO_MIN1_INV_LVR60_70 = function () { return this.Find("MS_IO_MIN1_INV_LVR60_70"); }; 
    this.getCP_MS_IO_MIN1_INV_LVR60_70 = function () { return this.Find("CP_MS_IO_MIN1_INV_LVR60_70"); };

    //LVR between 70% and 80%
    //OO P&I
    this.getMS_MIN1_LVR70_80 = function () { return this.Find("MS_MIN1_LVR70_80"); }; 
    this.getCP_MS_MIN1_LVR70_80 = function () { return this.Find("CP_MS_MIN1_LVR70_80"); }; 
    //Inv P&I
    this.getMS_MIN1_INV_LVR70_80 = function () { return this.Find("MS_MIN1_INV_LVR70_80"); }; 
    this.getCP_MS_MIN1_INV_LVR70_80 = function () { return this.Find("CP_MS_MIN1_INV_LVR70_80"); }; 
    //OO IO
    this.getMS_IO_MIN1_OO_LVR70_80 = function () { return this.Find("MS_IO_MIN1_OO_LVR70_80"); }; 
    this.getCP_MS_IO_MIN1_OO_LVR70_80 = function () { return this.Find("CP_MS_IO_MIN1_OO_LVR70_80"); };
    //INV IO
    this.getMS_IO_MIN1_INV_LVR70_80 = function () { return this.Find("MS_IO_MIN1_INV_LVR70_80"); }; 
    this.getCP_MS_IO_MIN1_INV_LVR70_80 = function () { return this.Find("CP_MS_IO_MIN1_INV_LVR70_80"); };

    //LVR between 80% and 90%
    //OO P&I
    this.getMS_MIN1_LVR80_90 = function () { return this.Find("MS_MIN1_LVR80_90"); }; 
    this.getCP_MS_MIN1_LVR80_90 = function () { return this.Find("CP_MS_MIN1_LVR80_90"); }; 
    //Inv P&I
    this.getMS_MIN1_INV_LVR80_90 = function () { return this.Find("MS_MIN1_INV_LVR80_90"); }; 
    this.getCP_MS_MIN1_INV_LVR80_90 = function () { return this.Find("CP_MS_MIN1_INV_LVR80_90"); }; 
    //OO IO
    this.getMS_IO_MIN1_OO_LVR80_90 = function () { return this.Find("MS_IO_MIN1_OO_LVR80_90"); }; 
    this.getCP_MS_IO_MIN1_OO_LVR80_90 = function () { return this.Find("CP_MS_IO_MIN1_OO_LVR80_90"); };
    //INV IO
    this.getMS_IO_MIN1_INV_LVR80_90 = function () { return this.Find("MS_IO_MIN1_INV_LVR80_90"); }; 
    this.getCP_MS_IO_MIN1_INV_LVR80_90 = function () { return this.Find("CP_MS_IO_MIN1_INV_LVR80_90"); };

    //LVR above 90%
    //OO P&I
    this.getMS_MIN1_LVR90 = function () { return this.Find("MS_MIN1_LVR90"); }; 
    this.getCP_MS_MIN1_LVR90 = function () { return this.Find("CP_MS_MIN1_LVR90"); }; 
    //Inv P&I
    this.getMS_MIN1_INV_LVR90 = function () { return this.Find("MS_MIN1_INV_LVR90"); }; 
    this.getCP_MS_MIN1_INV_LVR90 = function () { return this.Find("CP_MS_MIN1_INV_LVR90"); }; 
    //OO IO
    this.getMS_IO_MIN1_OO_LVR90 = function () { return this.Find("MS_IO_MIN1_OO_LVR90"); }; 
    this.getCP_MS_IO_MIN1_OO_LVR90 = function () { return this.Find("CP_MS_IO_MIN1_OO_LVR90"); };
    //INV IO
    this.getMS_IO_MIN1_INV_LVR90 = function () { return this.Find("MS_IO_MIN1_INV_LVR90"); }; 
    this.getCP_MS_IO_MIN1_INV_LVR90 = function () { return this.Find("CP_MS_IO_MIN1_INV_LVR90"); };



    //Fixed Rate

    //Owner Occupier
    //1 Year P&I
	this.getFRL_1_YEAR = function () { return this.Find("FRL_1_YEAR"); };
    this.getCOMP_FRL_1_YEAR = function () { return this.Find("COMP_FRL_1_YEAR"); };
    this.getFRL_1_YEAR_LVR50 = function () { return this.Find("FRL_1_YEAR_LVR50"); };
    this.getCOMP_FRL_1_YEAR_LVR50 = function () { return this.Find("COMP_FRL_1_YEAR_LVR50"); };
    this.getFRL_1_YEAR_LVR50_60 = function () { return this.Find("FRL_1_YEAR_LVR50_60"); };
    this.getCOMP_FRL_1_YEAR_LVR50_60 = function () { return this.Find("COMP_FRL_1_YEAR_LVR50_60"); };
    this.getFRL_1_YEAR_LVR60_70 = function () { return this.Find("FRL_1_YEAR_LVR60_70"); };
    this.getCOMP_FRL_1_YEAR_LVR60_70 = function () { return this.Find("COMP_FRL_1_YEAR_LVR60_70"); };
    this.getFRL_1_YEAR_LVR70_80 = function () { return this.Find("FRL_1_YEAR_LVR70_80"); };
    this.getCOMP_FRL_1_YEAR_LVR70_80 = function () { return this.Find("COMP_FRL_1_YEAR_LVR70_80"); };
    this.getFRL_1_YEAR_LVR80_90 = function () { return this.Find("FRL_1_YEAR_LVR80_90"); };
    this.getCOMP_FRL_1_YEAR_LVR80_90 = function () { return this.Find("COMP_FRL_1_YEAR_LVR80_90"); };
    this.getFRL_1_YEAR_LVR90 = function () { return this.Find("FRL_1_YEAR_LVR90"); };
    this.getCOMP_FRL_1_YEAR_LVR90 = function () { return this.Find("COMP_FRL_1_YEAR_LVR90"); };
    
    //2 Year P&I
	this.getFRL_2_YEARS = function () { return this.Find("FRL_2_YEARS"); };
    this.getCOMP_FRL_2_YEARS = function () { return this.Find("COMP_FRL_2_YEARS"); };
    this.getFRL_2_YEARS_LVR50 = function () { return this.Find("FRL_2_YEARS_LVR50"); };
    this.getCOMP_FRL_2_YEARS_LVR50 = function () { return this.Find("COMP_FRL_2_YEARS_LVR50"); };
    this.getFRL_2_YEARS_LVR50_60 = function () { return this.Find("FRL_2_YEARS_LVR50_60"); };
    this.getCOMP_FRL_2_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_2_YEARS_LVR50_60"); };
    this.getFRL_2_YEARS_LVR60_70 = function () { return this.Find("FRL_2_YEARS_LVR60_70"); };
    this.getCOMP_FRL_2_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_2_YEARS_LVR60_70"); };
    this.getFRL_2_YEARS_LVR70_80 = function () { return this.Find("FRL_2_YEARS_LVR70_80"); };
    this.getCOMP_FRL_2_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_2_YEARS_LVR70_80"); };
    this.getFRL_2_YEARS_LVR80_90 = function () { return this.Find("FRL_2_YEARS_LVR80_90"); };
    this.getCOMP_FRL_2_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_2_YEARS_LVR80_90"); };
    this.getFRL_2_YEARS_LVR90 = function () { return this.Find("FRL_2_YEARS_LVR90"); };
    this.getCOMP_FRL_2_YEARS_LVR90 = function () { return this.Find("COMP_FRL_2_YEARS_LVR90"); };

    //3 Year P&I
	this.getFRL_3_YEARS = function () { return this.Find("FRL_3_YEARS"); };
    this.getCOMP_FRL_3_YEARS = function () { return this.Find("COMP_FRL_3_YEARS"); };
    this.getFRL_3_YEARS_LVR50 = function () { return this.Find("FRL_3_YEARS_LVR50"); };
    this.getCOMP_FRL_3_YEARS_LVR50 = function () { return this.Find("COMP_FRL_3_YEARS_LVR50"); };
    this.getFRL_3_YEARS_LVR50_60 = function () { return this.Find("FRL_3_YEARS_LVR50_60"); };
    this.getCOMP_FRL_3_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_3_YEARS_LVR50_60"); };
    this.getFRL_3_YEARS_LVR60_70 = function () { return this.Find("FRL_3_YEARS_LVR60_70"); };
    this.getCOMP_FRL_3_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_3_YEARS_LVR60_70"); };
    this.getFRL_3_YEARS_LVR70_80 = function () { return this.Find("FRL_3_YEARS_LVR70_80"); };
    this.getCOMP_FRL_3_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_3_YEARS_LVR70_80"); };
    this.getFRL_3_YEARS_LVR80_90 = function () { return this.Find("FRL_3_YEARS_LVR80_90"); };
    this.getCOMP_FRL_3_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_3_YEARS_LVR80_90"); };
    this.getFRL_3_YEARS_LVR90 = function () { return this.Find("FRL_3_YEARS_LVR90"); };
    this.getCOMP_FRL_3_YEARS_LVR90 = function () { return this.Find("COMP_FRL_3_YEARS_LVR90"); };

    //4 Year P&I
	this.getFRL_4_YEARS = function () { return this.Find("FRL_4_YEARS"); };
	this.getCOMP_FRL_4_YEARS = function () { return this.Find("COMP_FRL_4_YEARS"); };
    this.getFRL_4_YEARS_LVR50 = function () { return this.Find("FRL_4_YEARS_LVR50"); };
    this.getCOMP_FRL_4_YEARS_LVR50 = function () { return this.Find("COMP_FRL_4_YEARS_LVR50"); };
    this.getFRL_4_YEARS_LVR50_60 = function () { return this.Find("FRL_4_YEARS_LVR50_60"); };
    this.getCOMP_FRL_4_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_4_YEARS_LVR50_60"); };
    this.getFRL_4_YEARS_LVR60_70 = function () { return this.Find("FRL_4_YEARS_LVR60_70"); };
    this.getCOMP_FRL_4_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_4_YEARS_LVR60_70"); };
    this.getFRL_4_YEARS_LVR70_80 = function () { return this.Find("FRL_4_YEARS_LVR70_80"); };
    this.getCOMP_FRL_4_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_4_YEARS_LVR70_80"); };
    this.getFRL_4_YEARS_LVR80_90 = function () { return this.Find("FRL_4_YEARS_LVR80_90"); };
    this.getCOMP_FRL_4_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_4_YEARS_LVR80_90"); };
    this.getFRL_4_YEARS_LVR90 = function () { return this.Find("FRL_4_YEARS_LVR90"); };
    this.getCOMP_FRL_4_YEARS_LVR90 = function () { return this.Find("COMP_FRL_4_YEARS_LVR90"); };

    //5 Year P&I
    this.getFRL_5_YEARS = function () { return this.Find("FRL_5_YEARS"); };
    this.getCOMP_FRL_5_YEARS = function () { return this.Find("COMP_FRL_5_YEARS"); };
    this.getFRL_5_YEARS_LVR50 = function () { return this.Find("FRL_5_YEARS_LVR50"); };
    this.getCOMP_FRL_5_YEARS_LVR50 = function () { return this.Find("COMP_FRL_5_YEARS_LVR50"); };
    this.getFRL_5_YEARS_LVR50_60 = function () { return this.Find("FRL_5_YEARS_LVR50_60"); };
    this.getCOMP_FRL_5_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_5_YEARS_LVR50_60"); };
    this.getFRL_5_YEARS_LVR60_70 = function () { return this.Find("FRL_5_YEARS_LVR60_70"); };
    this.getCOMP_FRL_5_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_5_YEARS_LVR60_70"); };
    this.getFRL_5_YEARS_LVR70_80 = function () { return this.Find("FRL_5_YEARS_LVR70_80"); };
    this.getCOMP_FRL_5_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_5_YEARS_LVR70_80"); };
    this.getFRL_5_YEARS_LVR80_90 = function () { return this.Find("FRL_5_YEARS_LVR80_90"); };
    this.getCOMP_FRL_5_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_5_YEARS_LVR80_90"); };
    this.getFRL_5_YEARS_LVR90 = function () { return this.Find("FRL_5_YEARS_LVR90"); };
    this.getCOMP_FRL_5_YEARS_LVR90 = function () { return this.Find("COMP_FRL_5_YEARS_LVR90"); };


    // Owner Occupier IO
    //1 Year
    this.getFRL_1_YEAR_IO = function () { return this.Find("FRL_1_YEAR_IO"); };
    this.getCOMP_FRL_1_YEAR_IO = function () { return this.Find("COMP_FRL_1_YEAR_IO"); }; 
    this.getFRL_1_YEAR_IO_LVR50 = function () { return this.Find("FRL_1_YEAR_IO_LVR50"); };
    this.getCP_FRL_1_YEAR_IO_LVR50 = function () { return this.Find("CP_FRL_1_YEAR_IO_LVR50"); };
    this.getFRL_1_YEAR_IO_LVR50_60 = function () { return this.Find("FRL_1_YEAR_IO_LVR50_60"); };
    this.getCP_FRL_1_YEAR_IO_LVR50_60 = function () { return this.Find("CP_FRL_1_YEAR_IO_LVR50_60"); };
    this.getFRL_1_YEAR_IO_LVR60_70 = function () { return this.Find("FRL_1_YEAR_IO_LVR60_70"); };
    this.getCP_FRL_1_YEAR_IO_LVR60_70 = function () { return this.Find("CP_FRL_1_YEAR_IO_LVR60_70"); };
    this.getFRL_1_YEAR_IO_LVR70_80 = function () { return this.Find("FRL_1_YEAR_IO_LVR70_80"); };
    this.getCP_FRL_1_YEAR_IO_LVR70_80 = function () { return this.Find("CP_FRL_1_YEAR_IO_LVR70_80"); };
    this.getFRL_1_YEAR_IO_LVR80_90 = function () { return this.Find("FRL_1_YEAR_IO_LVR80_90"); };
    this.getCP_FRL_1_YEAR_IO_LVR80_90 = function () { return this.Find("CP_FRL_1_YEAR_IO_LVR80_90"); };
    this.getFRL_1_YEAR_IO_LVR90 = function () { return this.Find("FRL_1_YEAR_IO_LVR90"); };
    this.getCP_FRL_1_YEAR_IO_LVR90 = function () { return this.Find("CP_FRL_1_YEAR_IO_LVR90"); };

    //2 Year 
    this.getFRL_2_YEARS_IO = function () { return this.Find("FRL_2_YEARS_IO"); };
    this.getCOMP_FRL_2_YEARS_IO = function () { return this.Find("COMP_FRL_2_YEARS_IO"); };
    this.getFRL_2_YEARS_IO_LVR50 = function () { return this.Find("FRL_2_YEARS_IO_LVR50"); };
    this.getCP_FRL_2_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_2_YEARS_IO_LVR50"); };
    this.getFRL_2_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_2_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_2_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_2_YEARS_IO_LVR50_60"); };
    this.getFRL_2_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_2_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_2_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_2_YEARS_IO_LVR60_70"); };
    this.getFRL_2_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_2_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_2_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_2_YEARS_IO_LVR70_80"); };
    this.getFRL_2_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_2_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_2_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_2_YEARS_IO_LVR80_90"); };
    this.getFRL_2_YEARS_IO_LVR90 = function () { return this.Find("FRL_2_YEARS_IO_LVR90"); };
    this.getCP_FRL_2_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_2_YEARS_IO_LVR90"); };

    //3 Year
    this.getFRL_3_YEARS_IO = function () { return this.Find("FRL_3_YEARS_IO"); };
    this.getCOMP_FRL_3_YEARS_IO = function () { return this.Find("COMP_FRL_3_YEARS_IO"); };
    this.getFRL_3_YEARS_IO_LVR50 = function () { return this.Find("FRL_3_YEARS_IO_LVR50"); };
    this.getCP_FRL_3_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_3_YEARS_IO_LVR50"); };
    this.getFRL_3_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_3_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_3_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_3_YEARS_IO_LVR50_60"); };
    this.getFRL_3_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_3_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_3_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_3_YEARS_IO_LVR60_70"); };
    this.getFRL_3_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_3_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_3_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_3_YEARS_IO_LVR70_80"); };
    this.getFRL_3_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_3_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_3_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_3_YEARS_IO_LVR80_90"); };
    this.getFRL_3_YEARS_IO_LVR90 = function () { return this.Find("FRL_3_YEARS_IO_LVR90"); };
    this.getCP_FRL_3_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_3_YEARS_IO_LVR90"); };
    
    //4 Year
    this.getFRL_4_YEARS_IO = function () { return this.Find("FRL_4_YEARS_IO"); };
    this.getCOMP_FRL_4_YEARS_IO = function () { return this.Find("COMP_FRL_4_YEARS_IO"); };
    this.getFRL_4_YEARS_IO_LVR50 = function () { return this.Find("FRL_4_YEARS_IO_LVR50"); };
    this.getCP_FRL_4_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_4_YEARS_IO_LVR50"); };
    this.getFRL_4_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_4_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_4_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_4_YEARS_IO_LVR50_60"); };
    this.getFRL_4_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_4_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_4_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_4_YEARS_IO_LVR60_70"); };
    this.getFRL_4_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_4_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_4_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_4_YEARS_IO_LVR70_80"); };
    this.getFRL_4_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_4_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_4_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_4_YEARS_IO_LVR80_90"); };
    this.getFRL_4_YEARS_IO_LVR90 = function () { return this.Find("FRL_4_YEARS_IO_LVR90"); };
    this.getCP_FRL_4_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_4_YEARS_IO_LVR90"); };

    //5 Year
    this.getFRL_5_YEARS_IO = function () { return this.Find("FRL_5_YEARS_IO"); };
	this.getCOMP_FRL_5_YEARS_IO = function () { return this.Find("COMP_FRL_5_YEARS_IO"); };
    this.getFRL_5_YEARS_IO_LVR50 = function () { return this.Find("FRL_5_YEARS_IO_LVR50"); };
    this.getCP_FRL_5_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_5_YEARS_IO_LVR50"); };
    this.getFRL_5_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_5_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_5_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_5_YEARS_IO_LVR50_60"); };
    this.getFRL_5_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_5_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_5_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_5_YEARS_IO_LVR60_70"); };
    this.getFRL_5_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_5_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_5_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_5_YEARS_IO_LVR70_80"); };
    this.getFRL_5_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_5_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_5_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_5_YEARS_IO_LVR80_90"); };
    this.getFRL_5_YEARS_IO_LVR90 = function () { return this.Find("FRL_5_YEARS_IO_LVR90"); };
    this.getCP_FRL_5_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_5_YEARS_IO_LVR90"); };

   
    //Owner Occupier + Orange Advantage P&I
    //1 Year
	this.getFRL_OA_1_YEAR = function () { return this.Find("FRL_OA_1_YEAR"); };
    this.getCOMP_OA_FRL_1_YEAR = function () { return this.Find("COMP_FRL_OA_1_YEAR"); };
    this.getFRL_OA_1_YEAR_LVR50 = function () { return this.Find("FRL_OA_1_YEAR_LVR50"); };
    this.getCOMP_FRL_OA_1_YEAR_LVR50 = function () { return this.Find("COMP_FRL_OA_1_YEAR_LVR50"); };
    this.getFRL_OA_1_YEAR_LVR50_60 = function () { return this.Find("FRL_OA_1_YEAR_LVR50_60"); };
    this.getCOMP_FRL_OA_1_YEAR_LVR50_60 = function () { return this.Find("COMP_FRL_OA_1_YEAR_LVR50_60"); };
    this.getFRL_OA_1_YEAR_LVR60_70 = function () { return this.Find("FRL_OA_1_YEAR_LVR60_70"); };
    this.getCOMP_FRL_OA_1_YEAR_LVR60_70 = function () { return this.Find("COMP_FRL_OA_1_YEAR_LVR60_70"); };
    this.getFRL_OA_1_YEAR_LVR70_80 = function () { return this.Find("FRL_OA_1_YEAR_LVR70_80"); };
    this.getCOMP_FRL_OA_1_YEAR_LVR70_80 = function () { return this.Find("COMP_FRL_OA_1_YEAR_LVR70_80"); };
    this.getFRL_OA_1_YEAR_LVR80_90 = function () { return this.Find("FRL_OA_1_YEAR_LVR80_90"); };
    this.getCOMP_FRL_OA_1_YEAR_LVR80_90 = function () { return this.Find("COMP_FRL_OA_1_YEAR_LVR80_90"); };
    this.getFRL_OA_1_YEAR_LVR90 = function () { return this.Find("FRL_OA_1_YEAR_LVR90"); };
    this.getCOMP_FRL_OA_1_YEAR_LVR90 = function () { return this.Find("COMP_FRL_OA_1_YEAR_LVR90"); };

    //2 Year
	this.getFRL_OA_2_YEARS = function () { return this.Find("FRL_OA_2_YEARS"); };
    this.getCOMP_OA_FRL_2_YEARS = function () { return this.Find("COMP_FRL_OA_2_YEARS"); };
    this.getFRL_OA_2_YEARS_LVR50 = function () { return this.Find("FRL_OA_2_YEARS_LVR50"); };
    this.getCOMP_FRL_OA_2_YEARS_LVR50 = function () { return this.Find("COMP_FRL_OA_2_YEARS_LVR50"); };
    this.getFRL_OA_2_YEARS_LVR50_60 = function () { return this.Find("FRL_OA_2_YEARS_LVR50_60"); };
    this.getCOMP_FRL_OA_2_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_OA_2_YEARS_LVR50_60"); };
    this.getFRL_OA_2_YEARS_LVR60_70 = function () { return this.Find("FRL_OA_2_YEARS_LVR60_70"); };
    this.getCOMP_FRL_OA_2_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_OA_2_YEARS_LVR60_70"); };
    this.getFRL_OA_2_YEARS_LVR70_80 = function () { return this.Find("FRL_OA_2_YEARS_LVR70_80"); };
    this.getCOMP_FRL_OA_2_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_OA_2_YEARS_LVR70_80"); };
    this.getFRL_OA_2_YEARS_LVR80_90 = function () { return this.Find("FRL_OA_2_YEARS_LVR80_90"); };
    this.getCOMP_FRL_OA_2_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_OA_2_YEARS_LVR80_90"); };
    this.getFRL_OA_2_YEARS_LVR90 = function () { return this.Find("FRL_OA_2_YEARS_LVR90"); };
    this.getCOMP_FRL_OA_2_YEARS_LVR90 = function () { return this.Find("COMP_FRL_OA_2_YEARS_LVR90"); };

    //3 Year
	this.getFRL_OA_3_YEARS = function () { return this.Find("FRL_OA_3_YEARS"); };
    this.getCOMP_OA_FRL_3_YEARS = function () { return this.Find("COMP_FRL_OA_3_YEARS"); };
    this.getFRL_OA_3_YEARS_LVR50 = function () { return this.Find("FRL_OA_3_YEARS_LVR50"); };
    this.getCOMP_FRL_OA_3_YEARS_LVR50 = function () { return this.Find("COMP_FRL_OA_3_YEARS_LVR50"); };
    this.getFRL_OA_3_YEARS_LVR50_60 = function () { return this.Find("FRL_OA_3_YEARS_LVR50_60"); };
    this.getCOMP_FRL_OA_3_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_OA_3_YEARS_LVR50_60"); };
    this.getFRL_OA_3_YEARS_LVR60_70 = function () { return this.Find("FRL_OA_3_YEARS_LVR60_70"); };
    this.getCOMP_FRL_OA_3_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_OA_3_YEARS_LVR60_70"); };
    this.getFRL_OA_3_YEARS_LVR70_80 = function () { return this.Find("FRL_OA_3_YEARS_LVR70_80"); };
    this.getCOMP_FRL_OA_3_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_OA_3_YEARS_LVR70_80"); };
    this.getFRL_OA_3_YEARS_LVR80_90 = function () { return this.Find("FRL_OA_3_YEARS_LVR80_90"); };
    this.getCOMP_FRL_OA_3_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_OA_3_YEARS_LVR80_90"); };
    this.getFRL_OA_3_YEARS_LVR90 = function () { return this.Find("FRL_OA_3_YEARS_LVR90"); };
    this.getCOMP_FRL_OA_3_YEARS_LVR90 = function () { return this.Find("COMP_FRL_OA_3_YEARS_LVR90"); };

    //4 Year
	this.getFRL_OA_4_YEARS = function () { return this.Find("FRL_OA_4_YEARS"); };
    this.getCOMP_OA_FRL_4_YEARS = function () { return this.Find("COMP_FRL_OA_4_YEARS"); };
    this.getFRL_OA_4_YEARS_LVR50 = function () { return this.Find("FRL_OA_4_YEARS_LVR50"); };
    this.getCOMP_FRL_OA_4_YEARS_LVR50 = function () { return this.Find("COMP_FRL_OA_4_YEARS_LVR50"); };
    this.getFRL_OA_4_YEARS_LVR50_60 = function () { return this.Find("FRL_OA_4_YEARS_LVR50_60"); };
    this.getCOMP_FRL_OA_4_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_OA_4_YEARS_LVR50_60"); };
    this.getFRL_OA_4_YEARS_LVR60_70 = function () { return this.Find("FRL_OA_4_YEARS_LVR60_70"); };
    this.getCOMP_FRL_OA_4_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_OA_4_YEARS_LVR60_70"); };
    this.getFRL_OA_4_YEARS_LVR70_80 = function () { return this.Find("FRL_OA_4_YEARS_LVR70_80"); };
    this.getCOMP_FRL_OA_4_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_OA_4_YEARS_LVR70_80"); };
    this.getFRL_OA_4_YEARS_LVR80_90 = function () { return this.Find("FRL_OA_4_YEARS_LVR80_90"); };
    this.getCOMP_FRL_OA_4_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_OA_4_YEARS_LVR80_90"); };
    this.getFRL_OA_4_YEARS_LVR90 = function () { return this.Find("FRL_OA_4_YEARS_LVR90"); };
    this.getCOMP_FRL_OA_4_YEARS_LVR90 = function () { return this.Find("COMP_FRL_OA_4_YEARS_LVR90"); };

    //5 Year
	this.getFRL_OA_5_YEARS = function () { return this.Find("FRL_OA_5_YEARS"); };
    this.getCOMP_OA_FRL_5_YEARS = function () { return this.Find("COMP_FRL_OA_5_YEARS"); };
    this.getFRL_OA_5_YEARS_LVR50 = function () { return this.Find("FRL_OA_5_YEARS_LVR50"); };
    this.getCOMP_FRL_OA_5_YEARS_LVR50 = function () { return this.Find("COMP_FRL_OA_5_YEARS_LVR50"); };
    this.getFRL_OA_5_YEARS_LVR50_60 = function () { return this.Find("FRL_OA_5_YEARS_LVR50_60"); };
    this.getCOMP_FRL_OA_5_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_OA_5_YEARS_LVR50_60"); };
    this.getFRL_OA_5_YEARS_LVR60_70 = function () { return this.Find("FRL_OA_5_YEARS_LVR60_70"); };
    this.getCOMP_FRL_OA_5_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_OA_5_YEARS_LVR60_70"); };
    this.getFRL_OA_5_YEARS_LVR70_80 = function () { return this.Find("FRL_OA_5_YEARS_LVR70_80"); };
    this.getCOMP_FRL_OA_5_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_OA_5_YEARS_LVR70_80"); };
    this.getFRL_OA_5_YEARS_LVR80_90 = function () { return this.Find("FRL_OA_5_YEARS_LVR80_90"); };
    this.getCOMP_FRL_OA_5_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_OA_5_YEARS_LVR80_90"); };
    this.getFRL_OA_5_YEARS_LVR90 = function () { return this.Find("FRL_OA_5_YEARS_LVR90"); };
    this.getCOMP_FRL_OA_5_YEARS_LVR90 = function () { return this.Find("COMP_FRL_OA_5_YEARS_LVR90"); };


    //Owner Occupier + Orange Advantage IO
    //1 Year
	this.getFRL_OA_1_YEAR_IO = function () { return this.Find("FRL_OA_1_YEAR_IO"); };
    this.getCOMP_OA_FRL_1_YEAR_IO = function () { return this.Find("COMP_FRL_OA_1_YEAR_IO"); };
    this.getFRL_OA_1_YEAR_IO_LVR50 = function () { return this.Find("FRL_OA_1_YEAR_IO_LVR50"); };
    this.getCP_FRL_OA_1_YEAR_IO_LVR50 = function () { return this.Find("CP_FRL_OA_1_YEAR_IO_LVR50"); };
    this.getFRL_OA_1_YEAR_IO_LVR50_60 = function () { return this.Find("FRL_OA_1_YEAR_IO_LVR50_60"); };
    this.getCP_FRL_OA_1_YEAR_IO_LVR50_60 = function () { return this.Find("CP_FRL_OA_1_YEAR_IO_LVR50_60"); };
    this.getFRL_OA_1_YEAR_IO_LVR60_70 = function () { return this.Find("FRL_OA_1_YEAR_IO_LVR60_70"); };
    this.getCP_FRL_OA_1_YEAR_IO_LVR60_70 = function () { return this.Find("CP_FRL_OA_1_YEAR_IO_LVR60_70"); };
    this.getFRL_OA_1_YEAR_IO_LVR70_80 = function () { return this.Find("FRL_OA_1_YEAR_IO_LVR70_80"); };
    this.getCP_FRL_OA_1_YEAR_IO_LVR70_80 = function () { return this.Find("CP_FRL_OA_1_YEAR_IO_LVR70_80"); };
    this.getFRL_OA_1_YEAR_IO_LVR80_90 = function () { return this.Find("FRL_OA_1_YEAR_IO_LVR80_90"); };
    this.getCP_FRL_OA_1_YEAR_IO_LVR80_90 = function () { return this.Find("CP_FRL_OA_1_YEAR_IO_LVR80_90"); };
    this.getFRL_OA_1_YEAR_IO_LVR90 = function () { return this.Find("FRL_OA_1_YEAR_IO_LVR90"); };
    this.getCP_FRL_OA_1_YEAR_IO_LVR90 = function () { return this.Find("CP_FRL_OA_1_YEAR_IO_LVR90"); };

    //2 Year
    this.getFRL_OA_2_YEARS_IO = function () { return this.Find("FRL_OA_2_YEARS_IO"); };
    this.getCOMP_OA_FRL_2_YEARS_IO = function () { return this.Find("COMP_FRL_OA_2_YEARS_IO"); };
    this.getFRL_OA_2_YEARS_IO_LVR50 = function () { return this.Find("FRL_OA_2_YEARS_IO_LVR50"); };
    this.getCP_FRL_OA_2_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_OA_2_YEARS_IO_LVR50"); };
    this.getFRL_OA_2_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_OA_2_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_OA_2_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_OA_2_YEARS_IO_LVR50_60"); };
    this.getFRL_OA_2_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_OA_2_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_OA_2_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_OA_2_YEARS_IO_LVR60_70"); };
    this.getFRL_OA_2_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_OA_2_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_OA_2_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_OA_2_YEARS_IO_LVR70_80"); };
    this.getFRL_OA_2_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_OA_2_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_OA_2_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_OA_2_YEARS_IO_LVR80_90"); };
    this.getFRL_OA_2_YEARS_IO_LVR90 = function () { return this.Find("FRL_OA_2_YEARS_IO_LVR90"); };
    this.getCP_FRL_OA_2_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_OA_2_YEARS_IO_LVR90"); };

    //3 Year
    this.getFRL_OA_3_YEARS_IO = function () { return this.Find("FRL_OA_3_YEARS_IO"); };
    this.getCOMP_OA_FRL_3_YEARS_IO = function () { return this.Find("COMP_FRL_OA_3_YEARS_IO"); };
    this.getFRL_OA_3_YEARS_IO_LVR50 = function () { return this.Find("FRL_OA_3_YEARS_IO_LVR50"); };
    this.getCP_FRL_OA_3_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_OA_3_YEARS_IO_LVR50"); };
    this.getFRL_OA_3_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_OA_3_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_OA_3_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_OA_3_YEARS_IO_LVR50_60"); };
    this.getFRL_OA_3_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_OA_3_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_OA_3_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_OA_3_YEARS_IO_LVR60_70"); };
    this.getFRL_OA_3_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_OA_3_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_OA_3_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_OA_3_YEARS_IO_LVR70_80"); };
    this.getFRL_OA_3_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_OA_3_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_OA_3_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_OA_3_YEARS_IO_LVR80_90"); };
    this.getFRL_OA_3_YEARS_IO_LVR90 = function () { return this.Find("FRL_OA_3_YEARS_IO_LVR90"); };
    this.getCP_FRL_OA_3_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_OA_3_YEARS_IO_LVR90"); };

    //4 Year
    this.getFRL_OA_4_YEARS_IO = function () { return this.Find("FRL_OA_4_YEARS_IO"); };
    this.getCOMP_OA_FRL_4_YEARS_IO = function () { return this.Find("COMP_FRL_OA_4_YEARS_IO"); };
    this.getFRL_OA_4_YEARS_IO_LVR50 = function () { return this.Find("FRL_OA_4_YEARS_IO_LVR50"); };
    this.getCP_FRL_OA_4_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_OA_4_YEARS_IO_LVR50"); };
    this.getFRL_OA_4_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_OA_4_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_OA_4_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_OA_4_YEARS_IO_LVR50_60"); };
    this.getFRL_OA_4_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_OA_4_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_OA_4_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_OA_4_YEARS_IO_LVR60_70"); };
    this.getFRL_OA_4_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_OA_4_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_OA_4_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_OA_4_YEARS_IO_LVR70_80"); };
    this.getFRL_OA_4_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_OA_4_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_OA_4_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_OA_4_YEARS_IO_LVR80_90"); };
    this.getFRL_OA_4_YEARS_IO_LVR90 = function () { return this.Find("FRL_OA_4_YEARS_IO_LVR90"); };
    this.getCP_FRL_OA_4_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_OA_4_YEARS_IO_LVR90"); };

    //5 Year
    this.getFRL_OA_5_YEARS_IO = function () { return this.Find("FRL_OA_5_YEARS_IO"); };
    this.getCOMP_OA_FRL_5_YEARS_IO = function () { return this.Find("COMP_FRL_OA_5_YEARS_IO"); };
    this.getFRL_OA_5_YEARS_IO_LVR50 = function () { return this.Find("FRL_OA_5_YEARS_IO_LVR50"); };
    this.getCP_FRL_OA_5_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_OA_5_YEARS_IO_LVR50"); };
    this.getFRL_OA_5_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_OA_5_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_OA_5_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_OA_5_YEARS_IO_LVR50_60"); };
    this.getFRL_OA_5_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_OA_5_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_OA_5_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_OA_5_YEARS_IO_LVR60_70"); };
    this.getFRL_OA_5_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_OA_5_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_OA_5_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_OA_5_YEARS_IO_LVR70_80"); };
    this.getFRL_OA_5_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_OA_5_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_OA_5_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_OA_5_YEARS_IO_LVR80_90"); };
    this.getFRL_OA_5_YEARS_IO_LVR90 = function () { return this.Find("FRL_OA_5_YEARS_IO_LVR90"); };
    this.getCP_FRL_OA_5_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_OA_5_YEARS_IO_LVR90"); };


    //Investor
    // Investor P&I
    //1 Year
	this.getFRL_INV_1_YEAR = function () { return this.Find("FRL_INV_1_YEAR"); };
    this.getCOMP_INV_FRL_1_YEAR = function () { return this.Find("COMP_FRL_INV_1_YEAR"); };
    this.getFRL_INV_1_YEAR_LVR50 = function () { return this.Find("FRL_INV_1_YEAR_LVR50"); };
    this.getCOMP_FRL_INV_1_YEAR_LVR50 = function () { return this.Find("COMP_FRL_INV_1_YEAR_LVR50"); };
    this.getFRL_INV_1_YEAR_LVR50_60 = function () { return this.Find("FRL_INV_1_YEAR_LVR50_60"); };
    this.getCOMP_FRL_INV_1_YEAR_LVR50_60 = function () { return this.Find("COMP_FRL_INV_1_YEAR_LVR50_60"); };
    this.getFRL_INV_1_YEAR_LVR60_70 = function () { return this.Find("FRL_INV_1_YEAR_LVR60_70"); };
    this.getCOMP_FRL_INV_1_YEAR_LVR60_70 = function () { return this.Find("COMP_FRL_INV_1_YEAR_LVR60_70"); };
    this.getFRL_INV_1_YEAR_LVR70_80 = function () { return this.Find("FRL_INV_1_YEAR_LVR70_80"); };
    this.getCOMP_FRL_INV_1_YEAR_LVR70_80 = function () { return this.Find("COMP_FRL_INV_1_YEAR_LVR70_80"); };
    this.getFRL_INV_1_YEAR_LVR80_90 = function () { return this.Find("FRL_INV_1_YEAR_LVR80_90"); };
    this.getCOMP_FRL_INV_1_YEAR_LVR80_90 = function () { return this.Find("COMP_FRL_INV_1_YEAR_LVR80_90"); };
    this.getFRL_INV_1_YEAR_LVR90 = function () { return this.Find("FRL_INV_1_YEAR_LVR90"); };
    this.getCOMP_FRL_INV_1_YEAR_LVR90 = function () { return this.Find("COMP_FRL_INV_1_YEAR_LVR90"); };

    //2 year
    this.getFRL_INV_2_YEARS = function () { return this.Find("FRL_INV_2_YEARS"); };
    this.getCOMP_INV_FRL_2_YEARS = function () { return this.Find("COMP_FRL_INV_2_YEARS"); };
    this.getFRL_INV_2_YEARS_LVR50 = function () { return this.Find("FRL_INV_2_YEARS_LVR50"); };
    this.getCOMP_FRL_INV_2_YEARS_LVR50 = function () { return this.Find("COMP_FRL_INV_2_YEARS_LVR50"); };
    this.getFRL_INV_2_YEARS_LVR50_60 = function () { return this.Find("FRL_INV_2_YEARS_LVR50_60"); };
    this.getCOMP_FRL_INV_2_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_INV_2_YEARS_LVR50_60"); };
    this.getFRL_INV_2_YEARS_LVR60_70 = function () { return this.Find("FRL_INV_2_YEARS_LVR60_70"); };
    this.getCOMP_FRL_INV_2_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_INV_2_YEARS_LVR60_70"); };
    this.getFRL_INV_2_YEARS_LVR70_80 = function () { return this.Find("FRL_INV_2_YEARS_LVR70_80"); };
    this.getCOMP_FRL_INV_2_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_INV_2_YEARS_LVR70_80"); };
    this.getFRL_INV_2_YEARS_LVR80_90 = function () { return this.Find("FRL_INV_2_YEARS_LVR80_90"); };
    this.getCOMP_FRL_INV_2_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_INV_2_YEARS_LVR80_90"); };
    this.getFRL_INV_2_YEARS_LVR90 = function () { return this.Find("FRL_INV_2_YEARS_LVR90"); };
    this.getCOMP_FRL_INV_2_YEARS_LVR90 = function () { return this.Find("COMP_FRL_INV_2_YEARS_LVR90"); };

    //3 Year
    this.getFRL_INV_3_YEARS = function () { return this.Find("FRL_INV_3_YEARS"); };
    this.getCOMP_INV_FRL_3_YEARS = function () { return this.Find("COMP_FRL_INV_3_YEARS"); };
    this.getFRL_INV_3_YEARS_LVR50 = function () { return this.Find("FRL_INV_3_YEARS_LVR50"); };
    this.getCOMP_FRL_INV_3_YEARS_LVR50 = function () { return this.Find("COMP_FRL_INV_3_YEARS_LVR50"); };
    this.getFRL_INV_3_YEARS_LVR50_60 = function () { return this.Find("FRL_INV_3_YEARS_LVR50_60"); };
    this.getCOMP_FRL_INV_3_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_INV_3_YEARS_LVR50_60"); };
    this.getFRL_INV_3_YEARS_LVR60_70 = function () { return this.Find("FRL_INV_3_YEARS_LVR60_70"); };
    this.getCOMP_FRL_INV_3_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_INV_3_YEARS_LVR60_70"); };
    this.getFRL_INV_3_YEARS_LVR70_80 = function () { return this.Find("FRL_INV_3_YEARS_LVR70_80"); };
    this.getCOMP_FRL_INV_3_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_INV_3_YEARS_LVR70_80"); };
    this.getFRL_INV_3_YEARS_LVR80_90 = function () { return this.Find("FRL_INV_3_YEARS_LVR80_90"); };
    this.getCOMP_FRL_INV_3_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_INV_3_YEARS_LVR80_90"); };
    this.getFRL_INV_3_YEARS_LVR90 = function () { return this.Find("FRL_INV_3_YEARS_LVR90"); };
    this.getCOMP_FRL_INV_3_YEARS_LVR90 = function () { return this.Find("COMP_FRL_INV_3_YEARS_LVR90"); };

    //4 Year
    this.getFRL_INV_4_YEARS = function () { return this.Find("FRL_INV_4_YEARS"); };
    this.getCOMP_INV_FRL_4_YEARS = function () { return this.Find("COMP_FRL_INV_4_YEARS"); };
    this.getFRL_INV_4_YEARS_LVR50 = function () { return this.Find("FRL_INV_4_YEARS_LVR50"); };
    this.getCOMP_FRL_INV_4_YEARS_LVR50 = function () { return this.Find("COMP_FRL_INV_4_YEARS_LVR50"); };
    this.getFRL_INV_4_YEARS_LVR50_60 = function () { return this.Find("FRL_INV_4_YEARS_LVR50_60"); };
    this.getCOMP_FRL_INV_4_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_INV_4_YEARS_LVR50_60"); };
    this.getFRL_INV_4_YEARS_LVR60_70 = function () { return this.Find("FRL_INV_4_YEARS_LVR60_70"); };
    this.getCOMP_FRL_INV_4_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_INV_4_YEARS_LVR60_70"); };
    this.getFRL_INV_4_YEARS_LVR70_80 = function () { return this.Find("FRL_INV_4_YEARS_LVR70_80"); };
    this.getCOMP_FRL_INV_4_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_INV_4_YEARS_LVR70_80"); };
    this.getFRL_INV_4_YEARS_LVR80_90 = function () { return this.Find("FRL_INV_4_YEARS_LVR80_90"); };
    this.getCOMP_FRL_INV_4_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_INV_4_YEARS_LVR80_90"); };
    this.getFRL_INV_4_YEARS_LVR90 = function () { return this.Find("FRL_INV_4_YEARS_LVR90"); };
    this.getCOMP_FRL_INV_4_YEARS_LVR90 = function () { return this.Find("COMP_FRL_INV_4_YEARS_LVR90"); };

    //5 Year
	this.getFRL_INV_5_YEARS = function () { return this.Find("FRL_INV_5_YEARS"); };
    this.getCOMP_INV_FRL_5_YEARS = function () { return this.Find("COMP_FRL_INV_5_YEARS"); };
    this.getFRL_INV_5_YEARS_LVR50 = function () { return this.Find("FRL_INV_5_YEARS_LVR50"); };
    this.getCOMP_FRL_INV_5_YEARS_LVR50 = function () { return this.Find("COMP_FRL_INV_5_YEARS_LVR50"); };
    this.getFRL_INV_5_YEARS_LVR50_60 = function () { return this.Find("FRL_INV_5_YEARS_LVR50_60"); };
    this.getCOMP_FRL_INV_5_YEARS_LVR50_60 = function () { return this.Find("COMP_FRL_INV_5_YEARS_LVR50_60"); };
    this.getFRL_INV_5_YEARS_LVR60_70 = function () { return this.Find("FRL_INV_5_YEARS_LVR60_70"); };
    this.getCOMP_FRL_INV_5_YEARS_LVR60_70 = function () { return this.Find("COMP_FRL_INV_5_YEARS_LVR60_70"); };
    this.getFRL_INV_5_YEARS_LVR70_80 = function () { return this.Find("FRL_INV_5_YEARS_LVR70_80"); };
    this.getCOMP_FRL_INV_5_YEARS_LVR70_80 = function () { return this.Find("COMP_FRL_INV_5_YEARS_LVR70_80"); };
    this.getFRL_INV_5_YEARS_LVR80_90 = function () { return this.Find("FRL_INV_5_YEARS_LVR80_90"); };
    this.getCOMP_FRL_INV_5_YEARS_LVR80_90 = function () { return this.Find("COMP_FRL_INV_5_YEARS_LVR80_90"); };
    this.getFRL_INV_5_YEARS_LVR90 = function () { return this.Find("FRL_INV_5_YEARS_LVR90"); };
    this.getCOMP_FRL_INV_5_YEARS_LVR90 = function () { return this.Find("COMP_FRL_INV_5_YEARS_LVR90"); };

    // Investor IO
    //1 Year
    this.getFRL_INV_1_YEAR_IO = function () { return this.Find("FRL_INV_1_YEAR_IO"); };
    this.getCOMP_INV_FRL_1_YEAR_IO = function () { return this.Find("COMP_FRL_INV_1_YEAR_IO"); };
    this.getFRL_INV_1_YEAR_IO_LVR50 = function () { return this.Find("FRL_INV_1_YEAR_IO_LVR50"); };
    this.getCP_FRL_INV_1_YEAR_IO_LVR50 = function () { return this.Find("CP_FRL_INV_1_YEAR_IO_LVR50"); };
    this.getFRL_INV_1_YEAR_IO_LVR50_60 = function () { return this.Find("FRL_INV_1_YEAR_IO_LVR50_60"); };
    this.getCP_FRL_INV_1_YEAR_IO_LVR50_60 = function () { return this.Find("CP_FRL_INV_1_YEAR_IO_LVR50_60"); };
    this.getFRL_INV_1_YEAR_IO_LVR60_70 = function () { return this.Find("FRL_INV_1_YEAR_IO_LVR60_70"); };
    this.getCP_FRL_INV_1_YEAR_IO_LVR60_70 = function () { return this.Find("CP_FRL_INV_1_YEAR_IO_LVR60_70"); };
    this.getFRL_INV_1_YEAR_IO_LVR70_80 = function () { return this.Find("FRL_INV_1_YEAR_IO_LVR70_80"); };
    this.getCP_FRL_INV_1_YEAR_IO_LVR70_80 = function () { return this.Find("CP_FRL_INV_1_YEAR_IO_LVR70_80"); };
    this.getFRL_INV_1_YEAR_IO_LVR80_90 = function () { return this.Find("FRL_INV_1_YEAR_IO_LVR80_90"); };
    this.getCP_FRL_INV_1_YEAR_IO_LVR80_90 = function () { return this.Find("CP_FRL_INV_1_YEAR_IO_LVR80_90"); };
    this.getFRL_INV_1_YEAR_IO_LVR90 = function () { return this.Find("FRL_INV_1_YEAR_IO_LVR90"); };
    this.getCP_FRL_INV_1_YEAR_IO_LVR90 = function () { return this.Find("CP_FRL_INV_1_YEAR_IO_LVR90"); };
    
    //2 Year
    this.getFRL_INV_2_YEARS_IO = function () { return this.Find("FRL_INV_2_YEARS_IO"); };
    this.getCOMP_INV_FRL_2_YEARS_IO = function () { return this.Find("COMP_FRL_INV_2_YEARS_IO"); };
    this.getFRL_INV_2_YEARS_IO_LVR50 = function () { return this.Find("FRL_INV_2_YEARS_IO_LVR50"); };
    this.getCP_FRL_INV_2_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_INV_2_YEARS_IO_LVR50"); };
    this.getFRL_INV_2_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_INV_2_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_INV_2_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_INV_2_YEARS_IO_LVR50_60"); };
    this.getFRL_INV_2_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_INV_2_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_INV_2_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_INV_2_YEARS_IO_LVR60_70"); };
    this.getFRL_INV_2_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_INV_2_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_INV_2_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_INV_2_YEARS_IO_LVR70_80"); };
    this.getFRL_INV_2_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_INV_2_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_INV_2_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_INV_2_YEARS_IO_LVR80_90"); };
    this.getFRL_INV_2_YEARS_IO_LVR90 = function () { return this.Find("FRL_INV_2_YEARS_IO_LVR90"); };
    this.getCP_FRL_INV_2_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_INV_2_YEARS_IO_LVR90"); };
    
    //3 Year
    this.getFRL_INV_3_YEARS_IO = function () { return this.Find("FRL_INV_3_YEARS_IO"); };
    this.getCOMP_INV_FRL_3_YEARS_IO = function () { return this.Find("COMP_FRL_INV_3_YEARS_IO"); };
    this.getFRL_INV_3_YEARS_IO_LVR50 = function () { return this.Find("FRL_INV_3_YEARS_IO_LVR50"); };
    this.getCP_FRL_INV_3_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_INV_3_YEARS_IO_LVR50"); };
    this.getFRL_INV_3_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_INV_3_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_INV_3_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_INV_3_YEARS_IO_LVR50_60"); };
    this.getFRL_INV_3_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_INV_3_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_INV_3_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_INV_3_YEARS_IO_LVR60_70"); };
    this.getFRL_INV_3_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_INV_3_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_INV_3_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_INV_3_YEARS_IO_LVR70_80"); };
    this.getFRL_INV_3_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_INV_3_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_INV_3_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_INV_3_YEARS_IO_LVR80_90"); };
    this.getFRL_INV_3_YEARS_IO_LVR90 = function () { return this.Find("FRL_INV_3_YEARS_IO_LVR90"); };
    this.getCP_FRL_INV_3_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_INV_3_YEARS_IO_LVR90"); };

    //4 Year
    this.getFRL_INV_4_YEARS_IO = function () { return this.Find("FRL_INV_4_YEARS_IO"); };
    this.getCOMP_INV_FRL_4_YEARS_IO = function () { return this.Find("COMP_FRL_INV_4_YEARS_IO"); };
    this.getFRL_INV_4_YEARS_IO_LVR50 = function () { return this.Find("FRL_INV_4_YEARS_IO_LVR50"); };
    this.getCP_FRL_INV_4_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_INV_4_YEARS_IO_LVR50"); };
    this.getFRL_INV_4_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_INV_4_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_INV_4_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_INV_4_YEARS_IO_LVR50_60"); };
    this.getFRL_INV_4_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_INV_4_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_INV_4_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_INV_4_YEARS_IO_LVR60_70"); };
    this.getFRL_INV_4_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_INV_4_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_INV_4_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_INV_4_YEARS_IO_LVR70_80"); };
    this.getFRL_INV_4_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_INV_4_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_INV_4_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_INV_4_YEARS_IO_LVR80_90"); };
    this.getFRL_INV_4_YEARS_IO_LVR90 = function () { return this.Find("FRL_INV_4_YEARS_IO_LVR90"); };
    this.getCP_FRL_INV_4_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_INV_4_YEARS_IO_LVR90"); };

    //5 Year
    this.getFRL_INV_5_YEARS_IO = function () { return this.Find("FRL_INV_5_YEARS_IO"); };
    this.getCOMP_INV_FRL_5_YEARS_IO = function () { return this.Find("COMP_FRL_INV_5_YEARS_IO"); };
    this.getFRL_INV_5_YEARS_IO_LVR50 = function () { return this.Find("FRL_INV_5_YEARS_IO_LVR50"); };
    this.getCP_FRL_INV_5_YEARS_IO_LVR50 = function () { return this.Find("CP_FRL_INV_5_YEARS_IO_LVR50"); };
    this.getFRL_INV_5_YEARS_IO_LVR50_60 = function () { return this.Find("FRL_INV_5_YEARS_IO_LVR50_60"); };
    this.getCP_FRL_INV_5_YEARS_IO_LVR50_60 = function () { return this.Find("CP_FRL_INV_5_YEARS_IO_LVR50_60"); };
    this.getFRL_INV_5_YEARS_IO_LVR60_70 = function () { return this.Find("FRL_INV_5_YEARS_IO_LVR60_70"); };
    this.getCP_FRL_INV_5_YEARS_IO_LVR60_70 = function () { return this.Find("CP_FRL_INV_5_YEARS_IO_LVR60_70"); };
    this.getFRL_INV_5_YEARS_IO_LVR70_80 = function () { return this.Find("FRL_INV_5_YEARS_IO_LVR70_80"); };
    this.getCP_FRL_INV_5_YEARS_IO_LVR70_80 = function () { return this.Find("CP_FRL_INV_5_YEARS_IO_LVR70_80"); };
    this.getFRL_INV_5_YEARS_IO_LVR80_90 = function () { return this.Find("FRL_INV_5_YEARS_IO_LVR80_90"); };
    this.getCP_FRL_INV_5_YEARS_IO_LVR80_90 = function () { return this.Find("CP_FRL_INV_5_YEARS_IO_LVR80_90"); };
    this.getFRL_INV_5_YEARS_IO_LVR90 = function () { return this.Find("FRL_INV_5_YEARS_IO_LVR90"); };
    this.getCP_FRL_INV_5_YEARS_IO_LVR90 = function () { return this.Find("CP_FRL_INV_5_YEARS_IO_LVR90"); };
 
    
    //Reference Rates

    //Owner Occupier
	this.getREF_OA_OO = function () { return this.Find("OA_OO_REF"); };      //Orange Advantage - PI 
   	this.getREF_OA_OO_IO = function () { return this.Find("OA_OO_IO_REF"); };   //Orange Advantage - IO

	this.getREF_MS_OO = function () { return this.Find("MS_OO_REF"); };    //Mortgage Simplifier - PI
   	this.getREF_MS_OO_IO = function () { return this.Find("MS_OO_IO_REF"); };    //Mortgage Simplifier - IO

	this.getREF_CL_OO = function () { return this.Find("CL_OO_REF"); };    //Construction Loan
	this.getREF_SHL_OO = function () { return this.Find("SHL_OO_REF"); };    //Smart Home Loan
    this.getREF_AEL_OO = function () { return this.Find("AEL_OO_REF"); };    //Action Equity Loan

    this.getFR_OO_PI_REF = function () { return this.Find("FR_OO_PI_REF"); };    //FRL P&I
    this.getFR_OO_IO_REF = function () { return this.Find("FR_OO_IO_REF"); };    //FRL IO
    



    //Investor
	this.getREF_OA_INV = function () { return this.Find("OA_INV_REF"); };      //Orange Advantage - PI
   	this.getREF_OA_INV_IO = function () { return this.Find("OA_INV_IO_REF"); };      //Orange Advantage - IO 

	this.getREF_MS_INV = function () { return this.Find("MS_INV_REF"); };    //Mortgage Simplifier - PI
	this.getREF_MS_INV_IO = function () { return this.Find("MS_INV_IO_REF"); };    //Mortgage Simplifier - IO

	this.getREF_CL_INV = function () { return this.Find("CL_INV_REF"); };    //Construction Loan
	this.getREF_SHL_INV = function () { return this.Find("SHL_INV_REF"); };    //Smart Home Loan
    this.getREF_AEL_INV = function () { return this.Find("AEL_INV_REF"); };    //Action Equity Loan

    this.getFR_INV_PI_REF = function () { return this.Find("FR_INV_PI_REF"); };    //FRL P&I
    this.getFR_INV_IO_REF = function () { return this.Find("FFR_INV_IO_REF"); };    //FRL IO
    






	this.getInterestRate_AEL = function () { return this.Find("AEL_BASE"); };               //Action Equity Loan
	this.getCL_BASE = function () { return this.Find("CL_BASE"); };                         //Construction Loan
	this.getCOMP_AEL_BASE = function () { return this.Find("COMP_AEL_BASE"); };             //Action Equity Loan Comparison
	this.getCOMP_CL_BASE = function () { return this.Find("COMP_CL_BASE"); };                //Construction Loan Comparison
	this.getMS_BASE = function () { return this.Find("MS_BASE"); };                         //Mortgage Simplifier Comparison
	this.getCOMP_MS_BASE = function () { return this.Find("COMP_MS_BASE"); };               //Mortgage Simplifier Comparison
	this.getCOMP_OA_TIER2_MIN250 = function () { return this.Find("COMP_OA_TIER2_MIN250"); };   //Orange Advantage Tier 2 Min 250k Comparison
	this.getCOMP_OA_TIER_1_MIN0 = function () { return this.Find("COMP_OA_TIER_1_MIN0"); }; //Orange Advantage Tier 1 Min 0 Comparison
	this.getCOMP_SHL_BASE = function () { return this.Find("COMP_SHL_BASE"); };             //Smart Home Loan Comparison
	this.getSHL_BASE = function () { return this.Find("SHL_BASE"); };                       //Smart Home Loan
	this.getSMARTPACK_SHL = function () { return this.Find("getSMARTPACK_SHL"); };          //Smart Home Loan with SmartPack
	this.getOA_TIER_1_MIN0 = function () { return this.Find("OA_TIER_1_MIN0"); };           //Orange Advantage Tier 1 Min 0
	this.getOA_TIER_2_MIN250K = function () { return this.Find("OA_TIER_2_MIN250K"); };     //Orange Advantage Tier 2 Min 250k


    //Super
    //TD
	this.getSUPER30DAYTD = function () { return this.Find("SUPER30DAYTD"); };    //Super 30 days Term Deposit.
	this.getSUPER90DAYTD = function () { return this.Find("SUPER90DAYTD"); };    //Super 90 days Term Deposit.
	this.getSUPER120DAYTD = function () { return this.Find("SUPER120DAYTD"); };  //Super 120 days Term Deposit.
	this.getSUPER180DAYTD = function () { return this.Find("SUPER180DAYTD"); };  //Super 180 days Term Deposit.
	this.getSUPER210DAYTD = function () { return this.Find("SUPER210DAYTD"); };  //Super 180 days Term Deposit.
	this.getSUPER270DAYTD = function () { return this.Find("SUPER270DAYTD"); };  //Super 180 days Term Deposit.
	this.getSUPER330DAYTD = function () { return this.Find("SUPER330DAYTD"); };  //Super 180 days Term Deposit.
	this.getSUPER365DAYTD = function () { return this.Find("SUPER365DAYTD"); };  //Super 365 days Term Deposit.
	this.getSUPER730DAYTD = function () { return this.Find("SUPER730DAYTD"); };  //Super 730 days Term Deposit.
	//CASH
	this.getSUPER_CASH_HUB = function () { return this.Find("SUPER_CASH_HUB"); };    //Super Cash Hub
	this.getSUPER_CASH_OPTION = function () { return this.Find("SUPER_CASH_OPTION"); }; //Super Cash Option

	//rate_Smsf_LoyaltyBonus_InterestRate is missing

	// Orange One Classic
	// --------------------------------------------
	this.getOO_BASE = function () { return this.Find("ORANGE_ONE_BASE"); };    							//Orange One Base
	this.getOO_CASH_ADV = function () { return this.Find("ORANGE_ONE_CASH_ADV"); };    			//Orange One Cash advances
	this.getOO_INSTALMENT = function () { return this.Find("ORANGE_ONE_INSTALLMENT"); };		//Orange One Instalments
	// --------------------------------------------
    //Orange One Platinum
    // --------------------------------------------
	this.getOO_PL_BASE = function () { return this.Find("ORANGE_ONE_PL_BASE"); };    							//Orange One Base
	this.getOO_PL_CASH_ADV = function () { return this.Find("ORANGE_ONE_PL_CASH_ADV"); };    			//Orange One Cash advances
	this.getOO_PL_INSTALMENT = function () { return this.Find("ORANGE_ONE_PL_INSTALLMENT"); };		//Orange One Instalments
    // --------------------------------------------
    
    // Personal Loans
    //------------------------------------------------
    this.getPL_FIXED = function () { return this.Find("FIXED_PERSONAL_LOAN"); };  
	this.getPL_FIXED_CP = function () { return this.Find("CP_FIXED_PERSONAL_LOAN"); };


    




	this.SortInterest = function (a, b) {
		return a.RateCode > b.RateCode;
	};
};

jQuery.fn.extend({
    toTwoDecimalPlaces: function () {

        $.each(this, function (index, value) {


            if ($(value).text() == "" || $(value).text() == "0") {
                $(value).text("");
            } else {
                $(value).text(parseFloat($(value).text()).toFixed(2));
            }});






		return this;
	}
});

(function() {

    var manager = new InterestRateManager();
    manager.CallService(function(data) {

        manager.responseObj = eval(data);
        // LASH - additional call for homeloan angular
        manager.NotifyAngular();

        //EFFECTIVE DATES
        //CATEGORY
        $('.HLcat_Effective_Date').text("29 September 2017"); // https://www.ingdirect.com.au/home-loans.html
        $('.SavCat_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/savings.html
        $('.BusCat_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/business.html
        $('.OE_Effective_Date').text("14 July 2017"); // https://www.ingdirect.com.au/everyday-banking.html

        //PRODUCT
        //Home Loans
        $('.OA_Effective_Date').text("29 September 2017"); // https://www.ingdirect.com.au/home-loans/orange-advantage.html
        $('.MS_Effective_Date').text("29 September 2017"); // https://www.ingdirect.com.au/home-loans/mortgage-simplifier.html
        $('.FRHL_Effective_Date').text("3 July 2018"); // https://www.ingdirect.com.au/home-loans/fixed-rate-home-loan.html
        $('.CL_Effective_Date').text("1 November 2016"); // https://www.ingdirect.com.au/home-loans/commercial-loan.html
        $('.CompHL_Effective_Date').text("3 July 2018"); // https://www.ingdirect.com.au/home-loans/compare.html
        $('.hlRates_Effective_Date').text("29 September 2017"); // https://www.ingdirect.com.au/rates-and-fees/home-loan-rates.html
        $('.RefRatesHL_Effective_Date').text("3 July 2018"); // https://www.ingdirect.com.au/rates-and-fees/home-loan-reference-rates.html


        //Savings
        $('.SM_Effective_Date').text("14 July 2017"); // https://www.ingdirect.com.au/savings/savings-maximiser.html
        $('.SA_Effective_Date').text("14 July 2017"); // https://www.ingdirect.com.au/savings/savings-accelerator.html
        $('.PTD_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/savings/term-deposit.html
        $('.CompSav_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/savings/compare-savings.html
        $('.savRates_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/rates-and-fees/savings-interest-rates.html
        $('.termRates_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/rates-and-fees/term-deposit-rates.html

        //Super
        $('.LScash_Effective_Date').text("23 June 2017"); // https://www.ingdirect.com.au/superannuation/living-super.html
        $('.LSterm_Effective_Date').text("23 June 2017"); // https://www.ingdirect.com.au/superannuation/living-super.html
        $('.SMSFcash_Effective_Date').text("28 April 2017"); // https://www.ingdirect.com.au/superannuation/smsf-cash.html
        $('.SMSFtd_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/superannuation/smsf-term-deposit.html
        $('.superRates_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/rates-and-fees/superannuation-rates.html
        $('.superRatesTD_Effective_Date').text("23 June 2017"); // https://www.ingdirect.com.au/rates-and-fees/superannuation-rates.html
        $('.CompSMSF_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/superannuation/smsf-compare.html

        //Business
        $('.BO_Effective_Date').text("28 April 2017"); // https://www.ingdirect.com.au/business/business-optimiser.html
        $('.BTD_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/business/term-deposit.html
        $('.busRates_Effective_Date').text("28 July 2017"); // https://www.ingdirect.com.au/rates-and-fees/business-banking-rates.html

        //RATES
        $('.interestRateSM').text(manager.getSM_BASE().Rate).toTwoDecimalPlaces();
        $('.interestRateSM_PBB').text(manager.getSM_WELCOME().Rate).toTwoDecimalPlaces();
        $('.interestRateSM_PBBonly').text(manager.getSM_PBB_BONUS().Rate).toTwoDecimalPlaces();

        $('.interestRateSA1').text(manager.getSA_TIER_1_MIN0().Rate).toTwoDecimalPlaces();
        $('.interestRateSA2').text(manager.getSA_TIER_2_MIN50K().Rate).toTwoDecimalPlaces();
        $('.interestRateSA3').text(manager.getSA_TIER_3_MIN150K().Rate).toTwoDecimalPlaces();

        $('.rate_PTD_LoyaltyBonus_InterestRate').text(manager.getPTD_LOYALTYBONUS().Rate).toTwoDecimalPlaces();

        $('.interestRatePTD30').text(manager.getPTD_30_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD90').text(manager.getPTD_90_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD120').text(manager.getPTD_120_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD180').text(manager.getPTD_180_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD210').text(manager.getPTD_210_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD270').text(manager.getPTD_270_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD330').text(manager.getPTD_330_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD1y').text(manager.getPTD_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.interestRatePTD2y').text(manager.getPTD_2_YEARS().Rate).toTwoDecimalPlaces();

        $('.interestRateBO').text(manager.getBO_BASE().Rate).toTwoDecimalPlaces();
        $('.rate_BO_Welcome_InterestRate').text(manager.getBO_WELCOME().Rate).toTwoDecimalPlaces();

        $('.rate_BTD_LoyaltyBonus_InterestRate').text(manager.getBTD_LOYALTYBONUS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD30').text(manager.getBTD_30_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD90').text(manager.getBTD_90_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD120').text(manager.getBTD_120_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD180').text(manager.getBTD_180_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD210').text(manager.getBTD_210_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD270').text(manager.getBTD_270_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD330').text(manager.getBTD_330_DAYS().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD1y').text(manager.getBTD_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.interestRateBTD2y').text(manager.getBTD_2_YEARS().Rate).toTwoDecimalPlaces();

        //SUPER
        $('.rate_SUPER_CH_InterestRate').text(manager.getSUPER_CASH_HUB().Rate).toTwoDecimalPlaces();
        $('.rate_SUPER_CO_InterestRate').text(manager.getSUPER_CASH_OPTION().Rate).toTwoDecimalPlaces();

        $('.rate_LS_TD_30_InterestRate').text(manager.getSUPER30DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_90_InterestRate').text(manager.getSUPER90DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_120_InterestRate').text(manager.getSUPER120DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_180_InterestRate').text(manager.getSUPER180DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_210_InterestRate').text(manager.getSUPER210DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_270_InterestRate').text(manager.getSUPER270DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_330_InterestRate').text(manager.getSUPER330DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_1year_InterestRate').text(manager.getSUPER365DAYTD().Rate).toTwoDecimalPlaces();
        $('.rate_LS_TD_2year_InterestRate').text(manager.getSUPER730DAYTD().Rate).toTwoDecimalPlaces();


            //Mortgage Simplifier

            $('.rate_HL_MS_InterestRate').text(manager.getMS_BASE().Rate).toTwoDecimalPlaces();
            $('.rate_HLComparison_MS_InterestRate').text(manager.getCOMP_MS_BASE().Rate).toTwoDecimalPlaces();
    
            //<$150k
            //Old segment
            //PI
            $('.rate_HL_MS_150_lower_InterestRate').text(manager.getMS_MAX150().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_lower_InterestRate').text(manager.getCOMP_MS_MAX150().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_150_lower_InterestRate_IO').text(manager.getMS_MAX150_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_lower_InterestRate_IO').text(manager.getCOMP_MS_MAX150_IO().Rate).toTwoDecimalPlaces();
            //PI
            $('.rate_HL_MS_INV_150_lower_InterestRate').text(manager.getMS_MAX150_INV().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_INV_150_lower_InterestRate').text(manager.getCOMP_MS_MAX150_INV().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_INV_150_lower_InterestRate_IO').text(manager.getMS_MAX150_INV_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_INV_150_lower_InterestRate_IO').text(manager.getCOMP_MS_MAX150_INV_IO().Rate).toTwoDecimalPlaces();
    
          
            //New LVR Bands
            //LVR 50% or less
            //OO P&I
            $('.rate_HL_MS_MAX150_LVR50_InterestRate').text(manager.getMS_MAX150_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_LVR50_InterestRate').text(manager.getCP_MS_MAX150_LVR50().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MAX150_INV_LVR50_InterestRate').text(manager.getMS_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_INV_LVR50_InterestRate').text(manager.getCP_MS_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MAX150_OO_LVR50_InterestRate').text(manager.getMS_IO_MAX150_OO_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_OO_LVR50_InterestRate').text(manager.getCP_MS_IO_MAX150_OO_LVR50().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MAX150_INV_LVR50_InterestRate').text(manager.getMS_IO_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_INV_LVR50_InterestRate').text(manager.getCP_MS_IO_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
     
            //LVR between 50% and 60%
            //OO P&I
            $('.rate_HL_MS_MAX150_LVR50_60_InterestRate').text(manager.getMS_MAX150_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_LVR50_60_InterestRate').text(manager.getCP_MS_MAX150_LVR50_60().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MAX150_INV_LVR50_60_InterestRate').text(manager.getMS_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_INV_LVR50_60_InterestRate').text(manager.getCP_MS_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MAX150_OO_LVR50_60_InterestRate').text(manager.getMS_IO_MAX150_OO_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_OO_LVR50_60_InterestRate').text(manager.getCP_MS_IO_MAX150_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MAX150_INV_LVR50_60_InterestRate').text(manager.getMS_IO_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_INV_LVR50_60_InterestRate').text(manager.getCP_MS_IO_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();
    
            //LVR between 60% and 70%
            //OO P&I
            $('.rate_HL_MS_MAX150_LVR60_70_InterestRate').text(manager.getMS_MAX150_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_LVR60_70_InterestRate').text(manager.getCP_MS_MAX150_LVR60_70().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MAX150_INV_LVR60_70_InterestRate').text(manager.getMS_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_INV_LVR60_70_InterestRate').text(manager.getCP_MS_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MAX150_OO_LVR60_70_InterestRate').text(manager.getMS_IO_MAX150_OO_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_OO_LVR60_70_InterestRate').text(manager.getCP_MS_IO_MAX150_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MAX150_INV_LVR60_70_InterestRate').text(manager.getMS_IO_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_INV_LVR60_70_InterestRate').text(manager.getCP_MS_IO_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();
    
            //LVR between 70% and 80%
            //OO P&I
            $('.rate_HL_MS_MAX150_LVR70_80_InterestRate').text(manager.getMS_MAX150_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_LVR70_80_InterestRate').text(manager.getCP_MS_MAX150_LVR70_80().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MAX150_INV_LVR70_80_InterestRate').text(manager.getMS_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_INV_LVR70_80_InterestRate').text(manager.getCP_MS_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MAX150_OO_LVR70_80_InterestRate').text(manager.getMS_IO_MAX150_OO_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_OO_LVR70_80_InterestRate').text(manager.getCP_MS_IO_MAX150_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MAX150_INV_LVR70_80_InterestRate').text(manager.getMS_IO_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_INV_LVR70_80_InterestRate').text(manager.getCP_MS_IO_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();
    
            //LVR between 80% and 90%
            //OO P&I
            $('.rate_HL_MS_MAX150_LVR80_90_InterestRate').text(manager.getMS_MAX150_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_LVR80_90_InterestRate').text(manager.getCP_MS_MAX150_LVR80_90().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MAX150_INV_LVR80_90_InterestRate').text(manager.getMS_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_INV_LVR80_90_InterestRate').text(manager.getCP_MS_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MAX150_OO_LVR80_90_InterestRate').text(manager.getMS_IO_MAX150_OO_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_OO_LVR80_90_InterestRate').text(manager.getCP_MS_IO_MAX150_OO_LVR80_90().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MAX150_INV_LVR80_90_InterestRate').text(manager.getMS_IO_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_INV_LVR80_90_InterestRate').text(manager.getCP_MS_IO_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();
    
            //LVR above 90%
            //OO P&I
            $('.rate_HL_MS_MAX150_LVR90_InterestRate').text(manager.getMS_MAX150_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_LVR90_InterestRate').text(manager.getCP_MS_MAX150_LVR90().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MAX150_INV_LVR90_InterestRate').text(manager.getMS_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MAX150_INV_LVR90_InterestRate').text(manager.getCP_MS_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MAX150_OO_LVR90_InterestRate').text(manager.getMS_IO_MAX150_OO_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_OO_LVR90_InterestRate').text(manager.getCP_MS_IO_MAX150_OO_LVR90().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MAX150_INV_LVR90_InterestRate').text(manager.getMS_IO_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MAX150_INV_LVR90_InterestRate').text(manager.getCP_MS_IO_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();
    
    
    
            //>$150k <$500k
    
            //Old segment
            //OO
            //PI
            $('.rate_HL_MS_150_500_80_InterestRate').text(manager.getMS_MAX500_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_80_InterestRate').text(manager.getCOMP_MS_MAX500_80().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_150_500_80_InterestRate_IO').text(manager.getMS_MAX500_80_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_80_InterestRate_IO').text(manager.getCOMP_MS_MAX500_80_IO().Rate).toTwoDecimalPlaces();
            
            //LVR 80 to 90
            //PI
            $('.rate_HL_MS_150_500_8090_InterestRate').text(manager.getMS_MAX500_8090().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_8090_InterestRate').text(manager.getCOMP_MS_MAX500_8090().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_150_500_8090_InterestRate_IO').text(manager.getMS_MAX500_8090_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_8090_InterestRate_IO').text(manager.getCOMP_MS_MAX500_8090_IO().Rate).toTwoDecimalPlaces();
            
            //LVR 90 or more
            //PI
            $('.rate_HL_MS_150_500_90_InterestRate').text(manager.getMS_MAX500_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_90_InterestRate').text(manager.getCOMP_MS_MAX500_90().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_150_500_90_InterestRate_IO').text(manager.getMS_MAX500_90_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_90_InterestRate_IO').text(manager.getCOMP_MS_MAX500_90_IO().Rate).toTwoDecimalPlaces();
            
            //INV
            //PI
            $('.rate_HL_MS_150_500_INV_80_InterestRate').text(manager.getMS_MAX500_INV_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_INV_80_InterestRate').text(manager.getCOMP_MS_MAX500_INV_80().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_150_500_INV_80_InterestRate_IO').text(manager.getMS_MAX500_INV_80_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_INV_80_InterestRate_IO').text(manager.getCOMP_MS_MAX500_INV_80_IO().Rate).toTwoDecimalPlaces();
            //PI
            $('.rate_HL_MS_150_500_INV_8090_InterestRate').text(manager.getMS_MAX500_INV_8090().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_INV_8090_InterestRate').text(manager.getCOMP_MS_MAX500_INV_8090().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_150_500_INV_8090_InterestRate_IO').text(manager.getMS_MAX500_INV_8090_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_150_500_INV_8090_InterestRate_IO').text(manager.getCOMP_MS_MAX500_INV_8090_IO().Rate).toTwoDecimalPlaces();
    
    
            //New LVR bands
            //LVR 50% or less
            //OO P&I
            $('.rate_HL_MS150_500_LVR50_InterestRate').text(manager.getMS150_500_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_LVR50_InterestRate').text(manager.getCP_MS150_500_LVR50().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS150_500_INV_LVR50_InterestRate').text(manager.getMS150_500_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_INV_LVR50_InterestRate').text(manager.getCP_MS150_500_INV_LVR50().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_150_500_OO_LVR50_InterestRate').text(manager.getMS_IO_150_500_OO_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_OO_LVR50_InterestRate').text(manager.getCP_MS_IO_150_500_OO_LVR50().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_150_500_INV_LVR50_InterestRate').text(manager.getMS_IO_150_500_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_INV_LVR50_InterestRate').text(manager.getCP_MS_IO_150_500_INV_LVR50().Rate).toTwoDecimalPlaces();
    
            //LVR between 50% and 60%
            $('.rate_HL_MS150_500_LVR50_60_InterestRate').text(manager.getMS150_500_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_LVR50_60_InterestRate').text(manager.getCP_MS150_500_LVR50_60().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS150_500_INV_LVR50_60_InterestRate').text(manager.getMS150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_INV_LVR50_60_InterestRate').text(manager.getCP_MS150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_150_500_OO_LVR50_60_InterestRate').text(manager.getMS_IO_150_500_OO_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_OO_LVR50_60_InterestRate').text(manager.getCP_MS_IO_150_500_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_150_500_INV_LVR50_60_InterestRate').text(manager.getMS_IO_150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_INV_LVR50_60_InterestRate').text(manager.getCP_MS_IO_150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
    
            //LVR between 60% and 70%
            $('.rate_HL_MS150_500_LVR60_70_InterestRate').text(manager.getMS150_500_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_LVR60_70_InterestRate').text(manager.getCP_MS150_500_LVR60_70().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS150_500_INV_LVR60_70_InterestRate').text(manager.getMS150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_INV_LVR60_70_InterestRate').text(manager.getCP_MS150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_150_500_OO_LVR60_70_InterestRate').text(manager.getMS_IO_150_500_OO_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_OO_LVR60_70_InterestRate').text(manager.getCP_MS_IO_150_500_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_150_500_INV_LVR60_70_InterestRate').text(manager.getMS_IO_150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_INV_LVR60_70_InterestRate').text(manager.getCP_MS_IO_150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
    
            //LVR between 70% and 80%
            $('.rate_HL_MS150_500_LVR70_80_InterestRate').text(manager.getMS150_500_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_LVR70_80_InterestRate').text(manager.getCP_MS150_500_LVR70_80().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS150_500_INV_LVR70_80_InterestRate').text(manager.getMS150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_INV_LVR70_80_InterestRate').text(manager.getCP_MS150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_150_500_OO_LVR70_80_InterestRate').text(manager.getMS_IO_150_500_OO_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_OO_LVR70_80_InterestRate').text(manager.getCP_MS_IO_150_500_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_150_500_INV_LVR70_80_InterestRate').text(manager.getMS_IO_150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_INV_LVR70_80_InterestRate').text(manager.getCP_MS_IO_150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
    
            //LVR above 90%
            //INV P&I
            $('.rate_HL_MS150_500_INV_LVR90_InterestRate').text(manager.getMS150_500_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_INV_LVR90_InterestRate').text(manager.getCP_MS150_500_INV_LVR90().Rate).toTwoDecimalPlaces(); 
            //INV IO
            $('.rate_HL_MS_IO_150_500_INV_LVR90_InterestRate').text(manager.getMS_IO_150_500_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_150_500_INV_LVR90_InterestRate').text(manager.getCP_MS_IO_150_500_INV_LVR90().Rate).toTwoDecimalPlaces(); 
    
            //All borrowings
            //INV P&I
            $('.rate_HL_MS150_500_INV_ALL_InterestRate').text(manager.getMS150_500_INV_ALL().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS150_500_INV_ALL_InterestRate').text(manager.getCP_MS150_500_INV_ALL().Rate).toTwoDecimalPlaces(); 
    
    
    
            //>$500k
    
            //Old segment
            //PI
            $('.rate_HL_MS_MIN500_80_InterestRate').text(manager.getMS_MIN500_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_80_InterestRate').text(manager.getCOMP_MS_MIN500_80().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_MIN500_80_InterestRate_IO').text(manager.getMS_MIN500_80_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_80_InterestRate_IO').text(manager.getCOMP_MS_MIN500_80_IO().Rate).toTwoDecimalPlaces();
            //PI
            $('.rate_HL_MS_MIN500_8090_InterestRate').text(manager.getMS_MIN500_8090().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_8090_InterestRate').text(manager.getCOMP_MS_MIN500_8090().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_MIN500_8090_InterestRate_IO').text(manager.getMS_MIN500_8090_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_8090_InterestRate_IO').text(manager.getCOMP_MS_MIN500_8090_IO().Rate).toTwoDecimalPlaces();
            //PI
            $('.rate_HL_MS_MIN500_90_InterestRate').text(manager.getMS_MIN500_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_90_InterestRate').text(manager.getCOMP_MS_MIN500_90().Rate).toTwoDecimalPlaces();
            //PI
            $('.rate_HL_MS_MIN500_INV_80_InterestRate').text(manager.getMS_MIN500_INV_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_INV_80_InterestRate').text(manager.getCOMP_MS_MIN500_INV_80().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_MIN500_INV_80_InterestRate_IO').text(manager.getMS_MIN500_INV_80_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_INV_80_InterestRate_IO').text(manager.getCOMP_MS_MIN500_INV_80_IO().Rate).toTwoDecimalPlaces();
            //PI
            $('.rate_HL_MS_MIN500_INV_8090_InterestRate').text(manager.getMS_MAX500_INV_8090().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_INV_8090_InterestRate').text(manager.getCOMP_MS_MAX500_INV_8090().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_MIN500_INV_8090_InterestRate_IO').text(manager.getMS_MAX500_INV_8090_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN500_INV_8090_InterestRate_IO').text(manager.getCOMP_MS_MAX500_INV_8090_IO().Rate).toTwoDecimalPlaces();
    
    
            //New LVR Bands
            //LVR 50% or less
            $('.rate_HL_MS_MIN500_LVR50_InterestRate').text(manager.getMS_MIN500_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_LVR50_InterestRate').text(manager.getCP_MS_MIN500_LVR50().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN500_INV_LVR50_InterestRate').text(manager.getMS_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_INV_LVR50_InterestRate').text(manager.getCP_MS_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN500_OO_LVR50_InterestRate').text(manager.getMS_IO_MIN500_OO_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_OO_LVR50_InterestRate').text(manager.getCP_MS_IO_MIN500_OO_LVR50().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN500_INV_LVR50_InterestRate').text(manager.getMS_IO_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_INV_LVR50_InterestRate').text(manager.getCP_MS_IO_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();
    
            //LVR between 50% and 60%
            $('.rate_HL_MS_MIN500_LVR50_60_InterestRate').text(manager.getMS_MIN500_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_LVR50_60_InterestRate').text(manager.getCP_MS_MIN500_LVR50_60().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN500_INV_LVR50_60_InterestRate').text(manager.getMS_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_INV_LVR50_60_InterestRate').text(manager.getCP_MS_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN500_OO_LVR50_60_InterestRate').text(manager.getMS_IO_MIN500_OO_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_OO_LVR50_60_InterestRate').text(manager.getCP_MS_IO_MIN500_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN500_INV_LVR50_60_InterestRate').text(manager.getMS_IO_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_INV_LVR50_60_InterestRate').text(manager.getCP_MS_IO_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
    
            //LVR between 60% and 70%
            $('.rate_HL_MS_MIN500_LVR60_70_InterestRate').text(manager.getMS_MIN500_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_LVR60_70_InterestRate').text(manager.getCP_MS_MIN500_LVR60_70().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN500_INV_LVR60_70_InterestRate').text(manager.getMS_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_INV_LVR60_70_InterestRate').text(manager.getCP_MS_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN500_OO_LVR60_70_InterestRate').text(manager.getMS_IO_MIN500_OO_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_OO_LVR60_70_InterestRate').text(manager.getCP_MS_IO_MIN500_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN500_INV_LVR60_70_InterestRate').text(manager.getMS_IO_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_INV_LVR60_70_InterestRate').text(manager.getCP_MS_IO_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
    
            //LVR between 70% and 80%
            $('.rate_HL_MS_MIN500_LVR70_80_InterestRate').text(manager.getMS_MIN500_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_LVR70_80_InterestRate').text(manager.getCP_MS_MIN500_LVR70_80().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN500_INV_LVR70_80_InterestRate').text(manager.getMS_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_INV_LVR70_80_InterestRate').text(manager.getCP_MS_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN500_OO_LVR70_80_InterestRate').text(manager.getMS_IO_MIN500_OO_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_OO_LVR70_80_InterestRate').text(manager.getCP_MS_IO_MIN500_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN500_INV_LVR70_80_InterestRate').text(manager.getMS_IO_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_INV_LVR70_80_InterestRate').text(manager.getCP_MS_IO_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
    
            //LVR above 90%
            //INV P&I
            $('.rate_HL_MS_MIN500_INV_LVR90_InterestRate').text(manager.getMS_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_INV_LVR90_InterestRate').text(manager.getCP_MS_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces(); 
            //INV IO
            $('.rate_HL_MS_IO_MIN500_INV_LVR90_InterestRate').text(manager.getMS_IO_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN500_INV_LVR90_InterestRate').text(manager.getCP_MS_IO_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces();
    
            //All borrowings
            //INV P&I
            $('.rate_HL_MS_MIN500_INV_ALL_InterestRate').text(manager.getMS_MIN500_INV_ALL().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN500_INV_ALL_InterestRate').text(manager.getCP_MS_MIN500_INV_ALL().Rate).toTwoDecimalPlaces(); 
    
    
            //>$1M
    
            //Old segment
            //PI
            $('.rate_HL_MS_MIN1M_80_InterestRate').text(manager.getMS_MIN1M_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN1M_80_InterestRate').text(manager.getCOMP_MS_MIN1M_80().Rate).toTwoDecimalPlaces();
            //IO
            $('.rate_HL_MS_MIN1M_80_InterestRate_IO').text(manager.getMS_MIN1M_80_IO().Rate).toTwoDecimalPlaces();
            $('.rate_HL_MS_COMP_MIN1M_80_InterestRate_IO').text(manager.getCOMP_MS_MIN1M_80_IO().Rate).toTwoDecimalPlaces();
    
    
            //New LVR Bands
            //LVR 50% or less
            $('.rate_HL_MS_MIN1_LVR50_InterestRate').text(manager.getMS_MIN1_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_LVR50_InterestRate').text(manager.getCP_MS_MIN1_LVR50().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN1_INV_LVR50_InterestRate').text(manager.getMS_MIN1_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_INV_LVR50_InterestRate').text(manager.getCP_MS_MIN1_INV_LVR50().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN1_OO_LVR50_InterestRate').text(manager.getMS_IO_MIN1_OO_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_OO_LVR50_InterestRate').text(manager.getCP_MS_IO_MIN1_OO_LVR50().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN1_INV_LVR50_InterestRate').text(manager.getMS_IO_MIN1_INV_LVR50().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_INV_LVR50_InterestRate').text(manager.getCP_MS_IO_MIN1_INV_LVR50().Rate).toTwoDecimalPlaces();
    
            //LVR between 50% and 60%
            $('.rate_HL_MS_MIN1_LVR50_60_InterestRate').text(manager.getMS_MIN1_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_LVR50_60_InterestRate').text(manager.getCP_MS_MIN1_LVR50_60().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN1_INV_LVR50_60_InterestRate').text(manager.getMS_MIN1_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_INV_LVR50_60_InterestRate').text(manager.getCP_MS_MIN1_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN1_OO_LVR50_60_InterestRate').text(manager.getMS_IO_MIN1_OO_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_OO_LVR50_60_InterestRate').text(manager.getCP_MS_IO_MIN1_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN1_INV_LVR50_60_InterestRate').text(manager.getMS_IO_MIN1_INV_LVR50_60().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_INV_LVR50_60_InterestRate').text(manager.getCP_MS_IO_MIN1_INV_LVR50_60().Rate).toTwoDecimalPlaces();
    
            //LVR between 60% and 70%
            $('.rate_HL_MS_MIN1_LVR60_70_InterestRate').text(manager.getMS_MIN1_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_LVR60_70_InterestRate').text(manager.getCP_MS_MIN1_LVR60_70().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN1_INV_LVR60_70_InterestRate').text(manager.getMS_MIN1_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_INV_LVR60_70_InterestRate').text(manager.getCP_MS_MIN1_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN1_OO_LVR60_70_InterestRate').text(manager.getMS_IO_MIN1_OO_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_OO_LVR60_70_InterestRate').text(manager.getCP_MS_IO_MIN1_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN1_INV_LVR60_70_InterestRate').text(manager.getMS_IO_MIN1_INV_LVR60_70().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_INV_LVR60_70_InterestRate').text(manager.getCP_MS_IO_MIN1_INV_LVR60_70().Rate).toTwoDecimalPlaces();
    
            //LVR between 70% and 80%
            $('.rate_HL_MS_MIN1_LVR70_80_InterestRate').text(manager.getMS_MIN1_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_LVR70_80_InterestRate').text(manager.getCP_MS_MIN1_LVR70_80().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN1_INV_LVR70_80_InterestRate').text(manager.getMS_MIN1_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_INV_LVR70_80_InterestRate').text(manager.getCP_MS_MIN1_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN1_OO_LVR70_80_InterestRate').text(manager.getMS_IO_MIN1_OO_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_OO_LVR70_80_InterestRate').text(manager.getCP_MS_IO_MIN1_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN1_INV_LVR70_80_InterestRate').text(manager.getMS_IO_MIN1_INV_LVR70_80().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_INV_LVR70_80_InterestRate').text(manager.getCP_MS_IO_MIN1_INV_LVR70_80().Rate).toTwoDecimalPlaces();
    
            //LVR between 80% and 90%
            $('.rate_HL_MS_MIN1_LVR80_90_InterestRate').text(manager.getMS_MIN1_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_LVR80_90_InterestRate').text(manager.getCP_MS_MIN1_LVR80_90().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN1_INV_LVR80_90_InterestRate').text(manager.getMS_MIN1_INV_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_INV_LVR80_90_InterestRate').text(manager.getCP_MS_MIN1_INV_LVR80_90().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN1_OO_LVR80_90_InterestRate').text(manager.getMS_IO_MIN1_OO_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_OO_LVR80_90_InterestRate').text(manager.getCP_MS_IO_MIN1_OO_LVR80_90().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN1_INV_LVR80_90_InterestRate').text(manager.getMS_IO_MIN1_INV_LVR80_90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_INV_LVR80_90_InterestRate').text(manager.getCP_MS_IO_MIN1_INV_LVR80_90().Rate).toTwoDecimalPlaces();
    
            //LVR above 90%
            $('.rate_HL_MS_MIN1_LVR90_InterestRate').text(manager.getMS_MIN1_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_LVR90_InterestRate').text(manager.getCP_MS_MIN1_LVR90().Rate).toTwoDecimalPlaces(); 
            //Inv P&I
            $('.rate_HL_MS_MIN1_INV_LVR90_InterestRate').text(manager.getMS_MIN1_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_MIN1_INV_LVR90_InterestRate').text(manager.getCP_MS_MIN1_INV_LVR90().Rate).toTwoDecimalPlaces();
            //OO IO
            $('.rate_HL_MS_IO_MIN1_OO_LVR90_InterestRate').text(manager.getMS_IO_MIN1_OO_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_OO_LVR90_InterestRate').text(manager.getCP_MS_IO_MIN1_OO_LVR90().Rate).toTwoDecimalPlaces();;
            //INV IO
            $('.rate_HL_MS_IO_MIN1_INV_LVR90_InterestRate').text(manager.getMS_IO_MIN1_INV_LVR90().Rate).toTwoDecimalPlaces();
            $('.rate_HL_CP_MS_IO_MIN1_INV_LVR90_InterestRate').text(manager.getCP_MS_IO_MIN1_INV_LVR90().Rate).toTwoDecimalPlaces();
    
    
    
        //Orange Advantage
        $('.rate_HL_OA_250_higher_InterestRate').text(manager.getOA_TIER_2_MIN250K().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_250_lower_InterestRate').text(manager.getOA_TIER_1_MIN0().Rate).toTwoDecimalPlaces();
        
        //Old segment
        
        //<$150k
        
        //PI
        $('.rate_HL_OA_150_lower_InterestRate').text(manager.getOA_MAX150().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_lower_InterestRate').text(manager.getCOMP_OA_MAX150().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_150_lower_InterestRate_IO').text(manager.getOA_MAX150_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_lower_InterestRate_IO').text(manager.getCOMP_OA_MAX150_IO().Rate).toTwoDecimalPlaces();
        //PI
        $('.rate_HL_OA_INV_150_lower_InterestRate').text(manager.getOA_MAX150_INV().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_INV_150_lower_InterestRate').text(manager.getCOMP_OA_MAX150_INV().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_INV_150_lower_InterestRate_IO').text(manager.getOA_MAX150_INV_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_INV_150_lower_InterestRate_IO').text(manager.getCOMP_OA_MAX150_INV_IO().Rate).toTwoDecimalPlaces();



        //New LVR Bands
        //LVR 50% or less
        //OO P&I
        $('.rate_HL_OA_MAX150_LVR50_InterestRate').text(manager.getOA_MAX150_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_LVR50_InterestRate').text(manager.getCP_OA_MAX150_LVR50().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MAX150_INV_LVR50_InterestRate').text(manager.getOA_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_INV_LVR50_InterestRate').text(manager.getCP_OA_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MAX150_OO_LVR50_InterestRate').text(manager.getOA_IO_MAX150_OO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_OO_LVR50_InterestRate').text(manager.getCP_OA_IO_MAX150_OO_LVR50().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MAX150_INV_LVR50_InterestRate').text(manager.getOA_IO_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_INV_LVR50_InterestRate').text(manager.getCP_OA_IO_MAX150_INV_LVR50().Rate).toTwoDecimalPlaces();
 
        //LVR between 50% and 60%
        //OO P&I
        $('.rate_HL_OA_MAX150_LVR50_60_InterestRate').text(manager.getOA_MAX150_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_LVR50_60_InterestRate').text(manager.getCP_OA_MAX150_LVR50_60().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MAX150_INV_LVR50_60_InterestRate').text(manager.getOA_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_INV_LVR50_60_InterestRate').text(manager.getCP_OA_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MAX150_OO_LVR50_60_InterestRate').text(manager.getOA_IO_MAX150_OO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_OO_LVR50_60_InterestRate').text(manager.getCP_OA_IO_MAX150_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MAX150_INV_LVR50_60_InterestRate').text(manager.getOA_IO_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_IO_MAX150_INV_LVR50_60_InterestRate').text(manager.getCP_OA_IO_MAX150_INV_LVR50_60().Rate).toTwoDecimalPlaces();

        //LVR between 60% and 70%
        //OO P&I
        $('.rate_HL_OA_MAX150_LVR60_70_InterestRate').text(manager.getOA_MAX150_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_LVR60_70_InterestRate').text(manager.getCP_OA_MAX150_LVR60_70().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MAX150_INV_LVR60_70_InterestRate').text(manager.getOA_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_INV_LVR60_70_InterestRate').text(manager.getCP_OA_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MAX150_OO_LVR60_70_InterestRate').text(manager.getOA_IO_MAX150_OO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_OO_LVR60_70_InterestRate').text(manager.getCP_OA_IO_MAX150_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MAX150_INV_LVR60_70_InterestRate').text(manager.getOA_IO_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_INV_LVR60_70_InterestRate').text(manager.getCP_OA_IO_MAX150_INV_LVR60_70().Rate).toTwoDecimalPlaces();

        //LVR between 70% and 80%
        //OO P&I
        $('.rate_HL_OA_MAX150_LVR70_80_InterestRate').text(manager.getOA_MAX150_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_LVR70_80_InterestRate').text(manager.getCP_OA_MAX150_LVR70_80().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MAX150_INV_LVR70_80_InterestRate').text(manager.getOA_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_INV_LVR70_80_InterestRate').text(manager.getCP_OA_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MAX150_OO_LVR70_80_InterestRate').text(manager.getOA_IO_MAX150_OO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_OO_LVR70_80_InterestRate').text(manager.getCP_OA_IO_MAX150_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MAX150_INV_LVR70_80_InterestRate').text(manager.getOA_IO_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_INV_LVR70_80_InterestRate').text(manager.getCP_OA_IO_MAX150_INV_LVR70_80().Rate).toTwoDecimalPlaces();

        //LVR between 80% and 90%
        //OO P&I
        $('.rate_HL_OA_MAX150_LVR80_90_InterestRate').text(manager.getOA_MAX150_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_LVR80_90_InterestRate').text(manager.getCP_OA_MAX150_LVR80_90().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MAX150_INV_LVR80_90_InterestRate').text(manager.getOA_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_INV_LVR80_90_InterestRate').text(manager.getCP_OA_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MAX150_OO_LVR80_90_InterestRate').text(manager.getOA_IO_MAX150_OO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_OO_LVR80_90_InterestRate').text(manager.getCP_OA_IO_MAX150_OO_LVR80_90().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MAX150_INV_LVR80_90_InterestRate').text(manager.getOA_IO_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_INV_LVR80_90_InterestRate').text(manager.getCP_OA_IO_MAX150_INV_LVR80_90().Rate).toTwoDecimalPlaces();

        //LVR above 90%
        //OO P&I
        $('.rate_HL_OA_MAX150_LVR90_InterestRate').text(manager.getOA_MAX150_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_LVR90_InterestRate').text(manager.getCP_OA_MAX150_LVR90().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MAX150_INV_LVR90_InterestRate').text(manager.getOA_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MAX150_INV_LVR90_InterestRate').text(manager.getCP_OA_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MAX150_OO_LVR90_InterestRate').text(manager.getOA_IO_MAX150_OO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_OO_LVR90_InterestRate').text(manager.getCP_OA_IO_MAX150_OO_LVR90().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MAX150_INV_LVR90_InterestRate').text(manager.getOA_IO_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MAX150_INV_LVR90_InterestRate').text(manager.getCP_OA_IO_MAX150_INV_LVR90().Rate).toTwoDecimalPlaces();



        //>$150k <$500k
        //Old segment
        //OO
        //PI
        $('.rate_HL_OA_150_500_80_InterestRate').text(manager.getOA_MAX500_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_80_InterestRate').text(manager.getCOMP_OA_MAX500_80().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_150_500_80_InterestRate_IO').text(manager.getOA_MAX500_80_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_80_InterestRate_IO').text(manager.getCOMP_OA_MAX500_80_IO().Rate).toTwoDecimalPlaces();
        //PI OO
        $('.rate_HL_OA_150_500_8090_InterestRate').text(manager.getOA_MAX500_8090().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_8090_InterestRate').text(manager.getCOMP_OA_MAX500_8090().Rate).toTwoDecimalPlaces();
        //IO OO
        $('.rate_HL_OA_150_500_8090_InterestRate_IO').text(manager.getOA_MAX500_8090_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_8090_InterestRate_IO').text(manager.getCOMP_OA_MAX500_8090_IO().Rate).toTwoDecimalPlaces();
        //PI
        $('.rate_HL_OA_150_500_90_InterestRate').text(manager.getOA_MAX500_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_90_InterestRate').text(manager.getCOMP_OA_MAX500_90().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_150_500_90_InterestRate_IO').text(manager.getOA_MAX500_90_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_90_InterestRate_IO').text(manager.getCOMP_OA_MAX500_90_IO().Rate).toTwoDecimalPlaces();

        //PI
        $('.rate_HL_OA_150_500_INV_80_InterestRate').text(manager.getOA_MAX500_INV_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_INV_80_InterestRate').text(manager.getCOMP_OA_MAX500_INV_80().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_150_500_INV_80_InterestRate_IO').text(manager.getOA_MAX500_INV_80_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_INV_80_InterestRate_IO').text(manager.getCOMP_OA_MAX500_INV_80_IO().Rate).toTwoDecimalPlaces();
        //PI
        $('.rate_HL_OA_150_500_INV_8090_InterestRate').text(manager.getOA_MAX500_INV_8090().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_INV_8090_InterestRate').text(manager.getCOMP_OA_MAX500_INV_8090().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_150_500_INV_8090_InterestRate_IO').text(manager.getOA_MAX500_INV_8090_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_150_500_INV_8090_InterestRate_IO').text(manager.getCOMP_OA_MAX500_INV_8090_IO().Rate).toTwoDecimalPlaces();


        //New LVR bands
        //LVR 50% or less
        $('.rate_HL_OA150_500_LVR50_InterestRate').text(manager.getOA150_500_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_LVR50_InterestRate').text(manager.getCP_OA150_500_LVR50().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA150_500_INV_LVR50_InterestRate').text(manager.getOA150_500_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_INV_LVR50_InterestRate').text(manager.getCP_OA150_500_INV_LVR50().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_150_500_OO_LVR50_InterestRate').text(manager.getOA_IO_150_500_OO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_OO_LVR50_InterestRate').text(manager.getCP_OA_IO_150_500_OO_LVR50().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_150_500_INV_LVR50_InterestRate').text(manager.getOA_IO_150_500_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_INV_LVR50_InterestRate').text(manager.getCP_OA_IO_150_500_INV_LVR50().Rate).toTwoDecimalPlaces();

        //LVR between 50% and 60%
        $('.rate_HL_OA150_500_LVR50_60_InterestRate').text(manager.getOA150_500_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_LVR50_60_InterestRate').text(manager.getCP_OA150_500_LVR50_60().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA150_500_INV_LVR50_60_InterestRate').text(manager.getOA150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_INV_LVR50_60_InterestRate').text(manager.getCP_OA150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_150_500_OO_LVR50_60_InterestRate').text(manager.getOA_IO_150_500_OO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_OO_LVR50_60_InterestRate').text(manager.getCP_OA_IO_150_500_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_150_500_INV_LVR50_60_InterestRate').text(manager.getOA_IO_150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_INV_LVR50_60_InterestRate').text(manager.getCP_OA_IO_150_500_INV_LVR50_60().Rate).toTwoDecimalPlaces();

        //LVR between 60% and 70%
        $('.rate_HL_OA150_500_LVR60_70_InterestRate').text(manager.getOA150_500_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_LVR60_70_InterestRate').text(manager.getCP_OA150_500_LVR60_70().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA150_500_INV_LVR60_70_InterestRate').text(manager.getOA150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_INV_LVR60_70_InterestRate').text(manager.getCP_OA150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_150_500_OO_LVR60_70_InterestRate').text(manager.getOA_IO_150_500_OO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_OO_LVR60_70_InterestRate').text(manager.getCP_OA_IO_150_500_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_150_500_INV_LVR60_70_InterestRate').text(manager.getOA_IO_150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_INV_LVR60_70_InterestRate').text(manager.getCP_OA_IO_150_500_INV_LVR60_70().Rate).toTwoDecimalPlaces();

        //LVR between 70% and 80%
        $('.rate_HL_OA150_500_LVR70_80_InterestRate').text(manager.getOA150_500_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_LVR70_80_InterestRate').text(manager.getCP_OA150_500_LVR70_80().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA150_500_INV_LVR70_80_InterestRate').text(manager.getOA150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_INV_LVR70_80_InterestRate').text(manager.getCP_OA150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_150_500_OO_LVR70_80_InterestRate').text(manager.getOA_IO_150_500_OO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_OO_LVR70_80_InterestRate').text(manager.getCP_OA_IO_150_500_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_150_500_INV_LVR70_80_InterestRate').text(manager.getOA_IO_150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_INV_LVR70_80_InterestRate').text(manager.getCP_OA_IO_150_500_INV_LVR70_80().Rate).toTwoDecimalPlaces();

        //LVR above 90%
        //INV P&I
        $('.rate_HL_OA150_500_INV_LVR90_InterestRate').text(manager.getOA150_500_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA150_500_INV_LVR90_InterestRate').text(manager.getCP_OA150_500_INV_LVR90().Rate).toTwoDecimalPlaces(); 

        //INV IO
        $('.rate_HL_OA_IO_150_500_INV_LVR90_InterestRate').text(manager.getOA_IO_150_500_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_150_500_INV_LVR90_InterestRate').text(manager.getCP_OA_IO_150_500_INV_LVR90().Rate).toTwoDecimalPlaces(); 


        //>$500k
        //Old segment
        //PI
        $('.rate_HL_OA_MIN500_80_InterestRate').text(manager.getOA_MIN500_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_80_InterestRate').text(manager.getCOMP_OA_MIN500_80().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_MIN500_80_InterestRate_IO').text(manager.getOA_MIN500_80_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_80_InterestRate_IO').text(manager.getCOMP_OA_MIN500_80_IO().Rate).toTwoDecimalPlaces();
        //PI
        $('.rate_HL_OA_MIN500_8090_InterestRate').text(manager.getOA_MIN500_8090().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_8090_InterestRate').text(manager.getCOMP_OA_MIN500_8090().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_MIN500_8090_InterestRate_IO').text(manager.getOA_MIN500_8090_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_8090_InterestRate_IO').text(manager.getCOMP_OA_MIN500_8090_IO().Rate).toTwoDecimalPlaces();
        //PI
        $('.rate_HL_OA_MIN500_90_InterestRate').text(manager.getOA_MIN500_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_90_InterestRate').text(manager.getCOMP_OA_MIN500_90().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_MIN500_90_InterestRate_IO').text(manager.getOA_MIN500_90_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_90_InterestRate_IO').text(manager.getCOMP_OA_MIN500_90_IO().Rate).toTwoDecimalPlaces();

        //PI
        $('.rate_HL_OA_MIN500_INV_80_InterestRate').text(manager.getOA_MIN500_INV_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_INV_80_InterestRate').text(manager.getCOMP_OA_MIN500_INV_80().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_MIN500_INV_80_InterestRate_IO').text(manager.getOA_MIN500_INV_80_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_INV_80_InterestRate_IO').text(manager.getCOMP_OA_MIN500_INV_80_IO().Rate).toTwoDecimalPlaces();
        //PI
        $('.rate_HL_OA_MIN500_INV_8090_InterestRate').text(manager.getOA_MIN500_INV_8090().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_INV_8090_InterestRate').text(manager.getCOMP_OA_MIN500_INV_8090().Rate).toTwoDecimalPlaces();
        //IO
        $('.rate_HL_OA_MIN500_INV_8090_InterestRate_IO').text(manager.getOA_MIN500_INV_8090_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN500_INV_8090_InterestRate_IO').text(manager.getCOMP_OA_MIN500_INV_8090_IO().Rate).toTwoDecimalPlaces();

        //New LVR Bands
        //LVR 50% or less
        $('.rate_HL_OA_MIN500_LVR50_InterestRate').text(manager.getOA_MIN500_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_LVR50_InterestRate').text(manager.getCP_OA_MIN500_LVR50().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MIN500_INV_LVR50_InterestRate').text(manager.getOA_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_INV_LVR50_InterestRate').text(manager.getCP_OA_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MIN500_OO_LVR50_InterestRate').text(manager.getOA_IO_MIN500_OO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_OO_LVR50_InterestRate').text(manager.getCP_OA_IO_MIN500_OO_LVR50().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MIN500_INV_LVR50_InterestRate').text(manager.getOA_IO_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_INV_LVR50_InterestRate').text(manager.getCP_OA_IO_MIN500_INV_LVR50().Rate).toTwoDecimalPlaces();

        //LVR between 50% and 60%
        $('.rate_HL_OA_MIN500_LVR50_60_InterestRate').text(manager.getOA_MIN500_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_LVR50_60_InterestRate').text(manager.getCP_OA_MIN500_LVR50_60().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MIN500_INV_LVR50_60_InterestRate').text(manager.getOA_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_INV_LVR50_60_InterestRate').text(manager.getCP_OA_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MIN500_OO_LVR50_60_InterestRate').text(manager.getOA_IO_MIN500_OO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_OO_LVR50_60_InterestRate').text(manager.getCP_OA_IO_MIN500_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MIN500_INV_LVR50_60_InterestRate').text(manager.getOA_IO_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_INV_LVR50_60_InterestRate').text(manager.getCP_OA_IO_MIN500_INV_LVR50_60().Rate).toTwoDecimalPlaces();

        //LVR between 60% and 70%
        $('.rate_HL_OA_MIN500_LVR60_70_InterestRate').text(manager.getOA_MIN500_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_LVR60_70_InterestRate').text(manager.getCP_OA_MIN500_LVR60_70().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MIN500_INV_LVR60_70_InterestRate').text(manager.getOA_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_INV_LVR60_70_InterestRate').text(manager.getCP_OA_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MIN500_OO_LVR60_70_InterestRate').text(manager.getOA_IO_MIN500_OO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_OO_LVR60_70_InterestRate').text(manager.getCP_OA_IO_MIN500_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MIN500_INV_LVR60_70_InterestRate').text(manager.getOA_IO_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_INV_LVR60_70_InterestRate').text(manager.getCP_OA_IO_MIN500_INV_LVR60_70().Rate).toTwoDecimalPlaces();

        //LVR between 70% and 80%
        $('.rate_HL_OA_MIN500_LVR70_80_InterestRate').text(manager.getOA_MIN500_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_LVR70_80_InterestRate').text(manager.getCP_OA_MIN500_LVR70_80().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_MIN500_INV_LVR70_80_InterestRate').text(manager.getOA_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_INV_LVR70_80_InterestRate').text(manager.getCP_OA_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_MIN500_OO_LVR70_80_InterestRate').text(manager.getOA_IO_MIN500_OO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_OO_LVR70_80_InterestRate').text(manager.getCP_OA_IO_MIN500_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_MIN500_INV_LVR70_80_InterestRate').text(manager.getOA_IO_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_INV_LVR70_80_InterestRate').text(manager.getCP_OA_IO_MIN500_INV_LVR70_80().Rate).toTwoDecimalPlaces();

        //LVR above 90%
        //Inv P&I
        $('.rate_HL_OA_MIN500_INV_LVR90_InterestRate').text(manager.getOA_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_MIN500_INV_LVR90_InterestRate').text(manager.getCP_OA_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces(); 
        //Inv IO
        $('.rate_HL_OA_IO_MIN500_INV_LVR90_InterestRate').text(manager.getOA_IO_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_MIN500_INV_LVR90_InterestRate').text(manager.getCP_OA_IO_MIN500_INV_LVR90().Rate).toTwoDecimalPlaces();


        //>$1M
        //Old Segment
        //PI
        $('.rate_HL_OA_MIN1M_80_InterestRate').text(manager.getOA_MIN1M_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN1M_80_InterestRate').text(manager.getCOMP_OA_MIN1M_80().Rate).toTwoDecimalPlaces(); 
        //IO
        $('.rate_HL_OA_MIN1M_80_InterestRate_IO').text(manager.getOA_MIN1M_80_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_COMP_MIN1M_80_InterestRate_IO').text(manager.getCOMP_OA_MIN1M_80_IO().Rate).toTwoDecimalPlaces();

        //New LVR Bands
        //LVR 50% or less
        $('.rate_HL_OA_PI_1M_OO_LVR50_InterestRate').text(manager.getOA_PI_1M_OO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_OO_LVR50_InterestRate').text(manager.getCP_OA_PI_1M_OO_LVR50().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_PI_1M_INV_LVR50_InterestRate').text(manager.getOA_PI_1M_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_INV_LVR50_InterestRate').text(manager.getCP_OA_PI_1M_INV_LVR50().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_1M_OO_LVR50_InterestRate').text(manager.getOA_IO_1M_OO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_OO_LVR50_InterestRate').text(manager.getCP_OA_IO_1M_OO_LVR50().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_1M_INV_LVR50_InterestRate').text(manager.getOA_IO_1M_INV_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_INV_LVR50_InterestRate').text(manager.getCP_OA_IO_1M_INV_LVR50().Rate).toTwoDecimalPlaces();

        //LVR between 50% and 60%
        $('.rate_HL_OA_PI_1M_OO_LVR50_60_InterestRate').text(manager.getOA_PI_1M_OO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_OO_LVR50_60_InterestRate').text(manager.getCP_OA_PI_1M_OO_LVR50_60().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_PI_1M_INV_LVR50_60_InterestRate').text(manager.getOA_PI_1M_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_INV_LVR50_60_InterestRate').text(manager.getCP_OA_PI_1M_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_1M_OO_LVR50_60_InterestRate').text(manager.getOA_IO_1M_OO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_OO_LVR50_60_InterestRate').text(manager.getCP_OA_IO_1M_OO_LVR50_60().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_1M_INV_LVR50_60_InterestRate').text(manager.getOA_IO_1M_INV_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_INV_LVR50_60_InterestRate').text(manager.getCP_OA_IO_1M_INV_LVR50_60().Rate).toTwoDecimalPlaces();

        //LVR between 60% and 70%
        $('.rate_HL_OA_PI_1M_OO_LVR60_70_InterestRate').text(manager.getOA_PI_1M_OO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_OO_LVR60_70_InterestRate').text(manager.getCP_OA_PI_1M_OO_LVR60_70().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_PI_1M_INV_LVR60_70_InterestRate').text(manager.getOA_PI_1M_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_INV_LVR60_70_InterestRate').text(manager.getCP_OA_PI_1M_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_1M_OO_LVR60_70_InterestRate').text(manager.getOA_IO_1M_OO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_OO_LVR60_70_InterestRate').text(manager.getCP_OA_IO_1M_OO_LVR60_70().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_1M_INV_LVR60_70_InterestRate').text(manager.getOA_IO_1M_INV_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_INV_LVR60_70_InterestRate').text(manager.getCP_OA_IO_1M_INV_LVR60_70().Rate).toTwoDecimalPlaces();

        //LVR between 70% and 80%
        $('.rate_HL_OA_PI_1M_OO_LVR70_80_InterestRate').text(manager.getOA_PI_1M_OO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_OO_LVR70_80_InterestRate').text(manager.getCP_OA_PI_1M_OO_LVR70_80().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_PI_1M_INV_LVR70_80_InterestRate').text(manager.getOA_PI_1M_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_INV_LVR70_80_InterestRate').text(manager.getCP_OA_PI_1M_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_1M_OO_LVR70_80_InterestRate').text(manager.getOA_IO_1M_OO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_OO_LVR70_80_InterestRate').text(manager.getCP_OA_IO_1M_OO_LVR70_80().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_1M_INV_LVR70_80_InterestRate').text(manager.getOA_IO_1M_INV_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_INV_LVR70_80_InterestRate').text(manager.getCP_OA_IO_1M_INV_LVR70_80().Rate).toTwoDecimalPlaces();

        //LVR between 80% and 90%
        $('.rate_HL_OA_PI_1M_OO_LVR80_90_InterestRate').text(manager.getOA_PI_1M_OO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_OO_LVR80_90_InterestRate').text(manager.getCP_OA_PI_1M_OO_LVR80_90().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_PI_1M_INV_LVR80_90_InterestRate').text(manager.getOA_PI_1M_INV_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_INV_LVR80_90_InterestRate').text(manager.getCP_OA_PI_1M_INV_LVR80_90().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_1M_OO_LVR80_90_InterestRate').text(manager.getOA_IO_1M_OO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_OO_LVR80_90_InterestRate').text(manager.getCP_OA_IO_1M_OO_LVR80_90().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_1M_INV_LVR80_90_InterestRate').text(manager.getOA_IO_1M_INV_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_INV_LVR80_90_InterestRate').text(manager.getCP_OA_IO_1M_INV_LVR80_90().Rate).toTwoDecimalPlaces();

        //LVR above 90%
        $('.rate_HL_OA_PI_1M_OO_LVR90_InterestRate').text(manager.getOA_PI_1M_OO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_OO_LVR90_InterestRate').text(manager.getCP_OA_PI_1M_OO_LVR90().Rate).toTwoDecimalPlaces(); 
        //Inv P&I
        $('.rate_HL_OA_PI_1M_INV_LVR90_InterestRate').text(manager.getOA_PI_1M_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_PI_1M_INV_LVR90_InterestRate').text(manager.getCP_OA_PI_1M_INV_LVR90().Rate).toTwoDecimalPlaces();
        //OO IO
        $('.rate_HL_OA_IO_1M_OO_LVR90_InterestRate').text(manager.getOA_IO_1M_OO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_OO_LVR90_InterestRate').text(manager.getCP_OA_IO_1M_OO_LVR90().Rate).toTwoDecimalPlaces();;
        //INV IO
        $('.rate_HL_OA_IO_1M_INV_LVR90_InterestRate').text(manager.getOA_IO_1M_INV_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_OA_IO_1M_INV_LVR90_InterestRate').text(manager.getCP_OA_IO_1M_INV_LVR90().Rate).toTwoDecimalPlaces();



        //Fixed Rate Home Loan
        //Owner Occupier - P&I
        //1 Year
        $('.rate_HL_Fixed_1_InterestRate').text(manager.getFRL_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_1_COMP_InterestRate').text(manager.getCOMP_FRL_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_LVR50_InterestRate').text(manager.getFRL_1_YEAR_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_1_YEAR_LVR50_InterestRate').text(manager.getCOMP_FRL_1_YEAR_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_LVR50_60_InterestRate').text(manager.getFRL_1_YEAR_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_1_YEAR_LVR50_60_InterestRate').text(manager.getCOMP_FRL_1_YEAR_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_LVR60_70_InterestRate').text(manager.getFRL_1_YEAR_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_1_YEAR_LVR60_70_InterestRate').text(manager.getCOMP_FRL_1_YEAR_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_LVR70_80_InterestRate').text(manager.getFRL_1_YEAR_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_1_YEAR_LVR70_80_InterestRate').text(manager.getCOMP_FRL_1_YEAR_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_LVR80_90_InterestRate').text(manager.getFRL_1_YEAR_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_1_YEAR_LVR80_90_InterestRate').text(manager.getCOMP_FRL_1_YEAR_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_LVR90_InterestRate').text(manager.getFRL_1_YEAR_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_1_YEAR_LVR90_InterestRate').text(manager.getCOMP_FRL_1_YEAR_LVR90().Rate).toTwoDecimalPlaces();

        //2 Year
        $('.rate_HL_Fixed_2_InterestRate').text(manager.getFRL_2_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_2_COMP_InterestRate').text(manager.getCOMP_FRL_2_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_LVR50_InterestRate').text(manager.getFRL_2_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_2_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_2_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_LVR50_60_InterestRate').text(manager.getFRL_2_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_2_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_2_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_LVR60_70_InterestRate').text(manager.getFRL_2_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_2_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_2_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_LVR70_80_InterestRate').text(manager.getFRL_2_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_2_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_2_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_LVR80_90_InterestRate').text(manager.getFRL_2_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_2_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_2_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_LVR90_InterestRate').text(manager.getFRL_2_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_2_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_2_YEARS_LVR90().Rate).toTwoDecimalPlaces();

        //3 Year
        $('.rate_HL_Fixed_3_InterestRate').text(manager.getFRL_3_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_3_COMP_InterestRate').text(manager.getCOMP_FRL_3_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_LVR50_InterestRate').text(manager.getFRL_3_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_3_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_3_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_LVR50_60_InterestRate').text(manager.getFRL_3_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_3_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_3_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_LVR60_70_InterestRate').text(manager.getFRL_3_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_3_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_3_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_LVR70_80_InterestRate').text(manager.getFRL_3_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_3_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_3_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_LVR80_90_InterestRate').text(manager.getFRL_3_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_3_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_3_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_LVR90_InterestRate').text(manager.getFRL_3_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_3_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_3_YEARS_LVR90().Rate).toTwoDecimalPlaces();

        //4 Year
        $('.rate_HL_Fixed_4_InterestRate').text(manager.getFRL_4_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_4_COMP_InterestRate').text(manager.getCOMP_FRL_4_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_LVR50_InterestRate').text(manager.getFRL_4_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_4_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_4_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_LVR50_60_InterestRate').text(manager.getFRL_4_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_4_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_4_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_LVR60_70_InterestRate').text(manager.getFRL_4_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_4_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_4_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_LVR70_80_InterestRate').text(manager.getFRL_4_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_4_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_4_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_LVR80_90_InterestRate').text(manager.getFRL_4_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_4_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_4_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_LVR90_InterestRate').text(manager.getFRL_4_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_4_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_4_YEARS_LVR90().Rate).toTwoDecimalPlaces();

        //5 Year
        $('.rate_HL_Fixed_5_InterestRate').text(manager.getFRL_5_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_5_COMP_InterestRate').text(manager.getCOMP_FRL_5_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_LVR50_InterestRate').text(manager.getFRL_5_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_5_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_5_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_LVR50_60_InterestRate').text(manager.getFRL_5_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_5_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_5_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_LVR60_70_InterestRate').text(manager.getFRL_5_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_5_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_5_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_LVR70_80_InterestRate').text(manager.getFRL_5_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_5_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_5_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_LVR80_90_InterestRate').text(manager.getFRL_5_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_5_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_5_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_LVR90_InterestRate').text(manager.getFRL_5_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_5_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_5_YEARS_LVR90().Rate).toTwoDecimalPlaces();


        //Owner Occupier IO
        //1 Year
        $('.rate_HL_Fixed_1_IO_InterestRate').text(manager.getFRL_1_YEAR_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_1_IO_COMP_InterestRate').text(manager.getCOMP_FRL_1_YEAR_IO().Rate).toTwoDecimalPlaces();
        
        $('.rate_HL_FRL_1_YEAR_IO_LVR50_InterestRate').text(manager.getFRL_1_YEAR_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_1_YEAR_IO_LVR50_InterestRate').text(manager.getCP_FRL_1_YEAR_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_IO_LVR50_60_InterestRate').text(manager.getFRL_1_YEAR_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_1_YEAR_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_1_YEAR_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_IO_LVR60_70_InterestRate').text(manager.getFRL_1_YEAR_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_1_YEAR_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_1_YEAR_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_IO_LVR70_80_InterestRate').text(manager.getFRL_1_YEAR_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_1_YEAR_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_1_YEAR_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_IO_LVR80_90_InterestRate').text(manager.getFRL_1_YEAR_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_1_YEAR_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_1_YEAR_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_1_YEAR_IO_LVR90_InterestRate').text(manager.getFRL_1_YEAR_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_1_YEAR_IO_LVR90_InterestRate').text(manager.getCP_FRL_1_YEAR_IO_LVR90().Rate).toTwoDecimalPlaces();

        //2 Year
        $('.rate_HL_Fixed_2_IO_InterestRate').text(manager.getFRL_2_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_2_IO_COMP_InterestRate').text(manager.getCOMP_FRL_2_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_2_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_2_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_2_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_2_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_2_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_2_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_2_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_2_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_2_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_2_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_2_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_2_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_2_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_2_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_2_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_2_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_2_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_2_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_2_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //3 Year
        $('.rate_HL_Fixed_3_IO_InterestRate').text(manager.getFRL_3_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_3_IO_COMP_InterestRate').text(manager.getCOMP_FRL_3_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_3_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_3_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_3_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_3_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_3_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_3_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_3_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_3_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_3_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_3_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_3_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_3_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_3_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_3_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_3_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_3_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_3_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_3_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_3_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //4 Year
        $('.rate_HL_Fixed_4_IO_InterestRate').text(manager.getFRL_4_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_4_IO_COMP_InterestRate').text(manager.getCOMP_FRL_4_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_4_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_4_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_4_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_4_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_4_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_4_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_4_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_4_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_4_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_4_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_4_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_4_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_4_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_4_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_4_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_4_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_4_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_4_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_4_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //5 Year
        $('.rate_HL_Fixed_5_IO_InterestRate').text(manager.getFRL_5_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_5_IO_COMP_InterestRate').text(manager.getCOMP_FRL_5_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_5_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_5_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_5_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_5_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_5_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_5_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_5_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_5_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_5_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_5_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_5_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_5_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_5_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_5_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_5_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_5_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_5_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_5_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_5_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();



        //Owner Occupier + Orange Advantage P&I
        //1 Year
        $('.rate_HL_Fixed_1_OA_InterestRate').text(manager.getFRL_OA_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_1_OA_COMP_InterestRate').text(manager.getCOMP_OA_FRL_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_LVR50_InterestRate').text(manager.getFRL_OA_1_YEAR_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_1_YEAR_LVR50_InterestRate').text(manager.getCOMP_FRL_OA_1_YEAR_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_LVR50_60_InterestRate').text(manager.getFRL_OA_1_YEAR_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_1_YEAR_LVR50_60_InterestRate').text(manager.getCOMP_FRL_OA_1_YEAR_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_LVR60_70_InterestRate').text(manager.getFRL_OA_1_YEAR_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_1_YEAR_LVR60_70_InterestRate').text(manager.getCOMP_FRL_OA_1_YEAR_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_LVR70_80_InterestRate').text(manager.getFRL_OA_1_YEAR_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_1_YEAR_LVR70_80_InterestRate').text(manager.getCOMP_FRL_OA_1_YEAR_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_LVR80_90_InterestRate').text(manager.getFRL_OA_1_YEAR_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_1_YEAR_LVR80_90_InterestRate').text(manager.getCOMP_FRL_OA_1_YEAR_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_LVR90_InterestRate').text(manager.getFRL_OA_1_YEAR_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_1_YEAR_LVR90_InterestRate').text(manager.getCOMP_FRL_OA_1_YEAR_LVR90().Rate).toTwoDecimalPlaces();  

        //2 Year
        $('.rate_HL_Fixed_2_OA_InterestRate').text(manager.getFRL_OA_2_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_2_OA_COMP_InterestRate').text(manager.getCOMP_OA_FRL_2_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_LVR50_InterestRate').text(manager.getFRL_OA_2_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_2_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_OA_2_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_LVR50_60_InterestRate').text(manager.getFRL_OA_2_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_2_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_OA_2_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_LVR60_70_InterestRate').text(manager.getFRL_OA_2_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_2_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_OA_2_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_LVR70_80_InterestRate').text(manager.getFRL_OA_2_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_2_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_OA_2_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_LVR80_90_InterestRate').text(manager.getFRL_OA_2_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_2_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_OA_2_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_LVR90_InterestRate').text(manager.getFRL_OA_2_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_2_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_OA_2_YEARS_LVR90().Rate).toTwoDecimalPlaces();  

        //3 Year
        $('.rate_HL_Fixed_3_OA_InterestRate').text(manager.getFRL_OA_3_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_3_OA_COMP_InterestRate').text(manager.getCOMP_OA_FRL_3_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_LVR50_InterestRate').text(manager.getFRL_OA_3_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_3_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_OA_3_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_LVR50_60_InterestRate').text(manager.getFRL_OA_3_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_3_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_OA_3_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_LVR60_70_InterestRate').text(manager.getFRL_OA_3_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_3_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_OA_3_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_LVR70_80_InterestRate').text(manager.getFRL_OA_3_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_3_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_OA_3_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_LVR80_90_InterestRate').text(manager.getFRL_OA_3_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_3_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_OA_3_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_LVR90_InterestRate').text(manager.getFRL_OA_3_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_3_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_OA_3_YEARS_LVR90().Rate).toTwoDecimalPlaces();  

        //4 Year
        $('.rate_HL_Fixed_4_OA_InterestRate').text(manager.getFRL_OA_4_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_4_OA_COMP_InterestRate').text(manager.getCOMP_OA_FRL_4_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_LVR50_InterestRate').text(manager.getFRL_OA_4_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_4_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_OA_4_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_LVR50_60_InterestRate').text(manager.getFRL_OA_4_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_4_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_OA_4_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_LVR60_70_InterestRate').text(manager.getFRL_OA_4_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_4_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_OA_4_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_LVR70_80_InterestRate').text(manager.getFRL_OA_4_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_4_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_OA_4_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_LVR80_90_InterestRate').text(manager.getFRL_OA_4_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_4_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_OA_4_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_LVR90_InterestRate').text(manager.getFRL_OA_4_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_4_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_OA_4_YEARS_LVR90().Rate).toTwoDecimalPlaces();  

        //5 Year
        $('.rate_HL_Fixed_5_OA_InterestRate').text(manager.getFRL_OA_5_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_5_OA_COMP_InterestRate').text(manager.getCOMP_OA_FRL_5_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_LVR50_InterestRate').text(manager.getFRL_OA_5_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_5_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_OA_5_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_LVR50_60_InterestRate').text(manager.getFRL_OA_5_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_5_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_OA_5_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_LVR60_70_InterestRate').text(manager.getFRL_OA_5_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_5_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_OA_5_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_LVR70_80_InterestRate').text(manager.getFRL_OA_5_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_5_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_OA_5_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_LVR80_90_InterestRate').text(manager.getFRL_OA_5_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_5_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_OA_5_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_LVR90_InterestRate').text(manager.getFRL_OA_5_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_OA_5_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_OA_5_YEARS_LVR90().Rate).toTwoDecimalPlaces();  



        //Owner Occupier + Orange Advantage IO
        //1 Year
        $('.rate_HL_Fixed_1_OA_IO_InterestRate').text(manager.getFRL_OA_1_YEAR_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_1_OA_IO_COMP_InterestRate').text(manager.getCOMP_OA_FRL_1_YEAR_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_IO_LVR50_InterestRate').text(manager.getFRL_OA_1_YEAR_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_1_YEAR_IO_LVR50_InterestRate').text(manager.getCP_FRL_OA_1_YEAR_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_IO_LVR50_60_InterestRate').text(manager.getFRL_OA_1_YEAR_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_1_YEAR_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_OA_1_YEAR_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_IO_LVR60_70_InterestRate').text(manager.getFRL_OA_1_YEAR_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_1_YEAR_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_OA_1_YEAR_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_IO_LVR70_80_InterestRate').text(manager.getFRL_OA_1_YEAR_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_1_YEAR_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_OA_1_YEAR_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_IO_LVR80_90_InterestRate').text(manager.getFRL_OA_1_YEAR_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_1_YEAR_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_OA_1_YEAR_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_1_YEAR_IO_LVR90_InterestRate').text(manager.getFRL_OA_1_YEAR_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_1_YEAR_IO_LVR90_InterestRate').text(manager.getCP_FRL_OA_1_YEAR_IO_LVR90().Rate).toTwoDecimalPlaces();

        //2 Year
        $('.rate_HL_Fixed_2_OA_IO_InterestRate').text(manager.getFRL_OA_2_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_2_OA_IO_COMP_InterestRate').text(manager.getCOMP_OA_FRL_2_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_OA_2_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_2_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_OA_2_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_OA_2_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_2_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_OA_2_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_OA_2_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_2_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_OA_2_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_OA_2_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_2_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_OA_2_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_OA_2_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_2_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_OA_2_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_2_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_OA_2_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_2_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_OA_2_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //3 Year
        $('.rate_HL_Fixed_3_OA_IO_InterestRate').text(manager.getFRL_OA_3_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_3_OA_IO_COMP_InterestRate').text(manager.getCOMP_OA_FRL_3_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_OA_3_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_3_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_OA_3_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_OA_3_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_3_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_OA_3_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_OA_3_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_3_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_OA_3_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_OA_3_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_3_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_OA_3_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_OA_3_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_3_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_OA_3_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_3_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_OA_3_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_3_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_OA_3_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //4 Year
        $('.rate_HL_Fixed_4_OA_IO_InterestRate').text(manager.getFRL_OA_4_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_4_OA_IO_COMP_InterestRate').text(manager.getCOMP_OA_FRL_4_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_OA_4_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_4_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_OA_4_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_OA_4_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_4_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_OA_4_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_OA_4_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_4_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_OA_4_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_OA_4_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_4_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_OA_4_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_OA_4_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_4_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_OA_4_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_4_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_OA_4_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_4_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_OA_4_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //5 Year
        $('.rate_HL_Fixed_5_OA_IO_InterestRate').text(manager.getFRL_OA_5_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_5_OA_IO_COMP_InterestRate').text(manager.getCOMP_OA_FRL_5_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_OA_5_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_5_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_OA_5_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_OA_5_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_5_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_OA_5_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_OA_5_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_5_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_OA_5_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_OA_5_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_5_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_OA_5_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_OA_5_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_5_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_OA_5_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_OA_5_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_OA_5_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_OA_5_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_OA_5_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();



        //Investor
        //Investor P&I
        //1 Year
        $('.rate_HL_Fixed_1_INV_InterestRate').text(manager.getFRL_INV_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_1_INV_COMP_InterestRate').text(manager.getCOMP_INV_FRL_1_YEAR().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_LVR50_InterestRate').text(manager.getFRL_INV_1_YEAR_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_1_YEAR_LVR50_InterestRate').text(manager.getCOMP_FRL_INV_1_YEAR_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_LVR50_60_InterestRate').text(manager.getFRL_INV_1_YEAR_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_1_YEAR_LVR50_60_InterestRate').text(manager.getCOMP_FRL_INV_1_YEAR_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_LVR60_70_InterestRate').text(manager.getFRL_INV_1_YEAR_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_1_YEAR_LVR60_70_InterestRate').text(manager.getCOMP_FRL_INV_1_YEAR_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_LVR70_80_InterestRate').text(manager.getFRL_INV_1_YEAR_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_1_YEAR_LVR70_80_InterestRate').text(manager.getCOMP_FRL_INV_1_YEAR_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_LVR80_90_InterestRate').text(manager.getFRL_INV_1_YEAR_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_1_YEAR_LVR80_90_InterestRate').text(manager.getCOMP_FRL_INV_1_YEAR_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_LVR90_InterestRate').text(manager.getFRL_INV_1_YEAR_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_1_YEAR_LVR90_InterestRate').text(manager.getCOMP_FRL_INV_1_YEAR_LVR90().Rate).toTwoDecimalPlaces();

        //2 Year
        $('.rate_HL_Fixed_2_INV_InterestRate').text(manager.getFRL_INV_2_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_2_INV_COMP_InterestRate').text(manager.getCOMP_INV_FRL_2_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_LVR50_InterestRate').text(manager.getFRL_INV_2_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_2_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_INV_2_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_LVR50_60_InterestRate').text(manager.getFRL_INV_2_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_2_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_INV_2_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_LVR60_70_InterestRate').text(manager.getFRL_INV_2_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_2_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_INV_2_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_LVR70_80_InterestRate').text(manager.getFRL_INV_2_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_2_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_INV_2_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_LVR80_90_InterestRate').text(manager.getFRL_INV_2_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_2_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_INV_2_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_LVR90_InterestRate').text(manager.getFRL_INV_2_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_2_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_INV_2_YEARS_LVR90().Rate).toTwoDecimalPlaces();

        //3 Year
        $('.rate_HL_Fixed_3_INV_InterestRate').text(manager.getFRL_INV_3_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_3_INV_COMP_InterestRate').text(manager.getCOMP_INV_FRL_3_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_LVR50_InterestRate').text(manager.getFRL_INV_3_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_3_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_INV_3_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_LVR50_60_InterestRate').text(manager.getFRL_INV_3_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_3_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_INV_3_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_LVR60_70_InterestRate').text(manager.getFRL_INV_3_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_3_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_INV_3_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_LVR70_80_InterestRate').text(manager.getFRL_INV_3_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_3_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_INV_3_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_LVR80_90_InterestRate').text(manager.getFRL_INV_3_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_3_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_INV_3_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_LVR90_InterestRate').text(manager.getFRL_INV_3_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_3_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_INV_3_YEARS_LVR90().Rate).toTwoDecimalPlaces();

        //4 Year
        $('.rate_HL_Fixed_4_INV_InterestRate').text(manager.getFRL_INV_4_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_4_INV_COMP_InterestRate').text(manager.getCOMP_INV_FRL_4_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_LVR50_InterestRate').text(manager.getFRL_INV_4_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_4_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_INV_4_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_LVR50_60_InterestRate').text(manager.getFRL_INV_4_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_4_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_INV_4_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_LVR60_70_InterestRate').text(manager.getFRL_INV_4_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_4_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_INV_4_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_LVR70_80_InterestRate').text(manager.getFRL_INV_4_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_4_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_INV_4_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_LVR80_90_InterestRate').text(manager.getFRL_INV_4_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_4_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_INV_4_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_LVR90_InterestRate').text(manager.getFRL_INV_4_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_4_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_INV_4_YEARS_LVR90().Rate).toTwoDecimalPlaces();

        //5 Year
        $('.rate_HL_Fixed_5_INV_InterestRate').text(manager.getFRL_INV_5_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_5_INV_COMP_InterestRate').text(manager.getCOMP_INV_FRL_5_YEARS().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_LVR50_InterestRate').text(manager.getFRL_INV_5_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_5_YEARS_LVR50_InterestRate').text(manager.getCOMP_FRL_INV_5_YEARS_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_LVR50_60_InterestRate').text(manager.getFRL_INV_5_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_5_YEARS_LVR50_60_InterestRate').text(manager.getCOMP_FRL_INV_5_YEARS_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_LVR60_70_InterestRate').text(manager.getFRL_INV_5_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_5_YEARS_LVR60_70_InterestRate').text(manager.getCOMP_FRL_INV_5_YEARS_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_LVR70_80_InterestRate').text(manager.getFRL_INV_5_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_5_YEARS_LVR70_80_InterestRate').text(manager.getCOMP_FRL_INV_5_YEARS_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_LVR80_90_InterestRate').text(manager.getFRL_INV_5_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_5_YEARS_LVR80_90_InterestRate').text(manager.getCOMP_FRL_INV_5_YEARS_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_LVR90_InterestRate').text(manager.getFRL_INV_5_YEARS_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_COMP_FRL_INV_5_YEARS_LVR90_InterestRate').text(manager.getCOMP_FRL_INV_5_YEARS_LVR90().Rate).toTwoDecimalPlaces();


        // Investor IO
        //1 Year
        $('.rate_HL_Fixed_1_INV_IO_InterestRate').text(manager.getFRL_INV_1_YEAR_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_1_INV_IO_COMP_InterestRate').text(manager.getCOMP_INV_FRL_1_YEAR_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_IO_LVR50_InterestRate').text(manager.getFRL_INV_1_YEAR_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_1_YEAR_IO_LVR50_InterestRate').text(manager.getCP_FRL_INV_1_YEAR_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_IO_LVR50_60_InterestRate').text(manager.getFRL_INV_1_YEAR_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_1_YEAR_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_INV_1_YEAR_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_IO_LVR60_70_InterestRate').text(manager.getFRL_INV_1_YEAR_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_1_YEAR_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_INV_1_YEAR_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_IO_LVR70_80_InterestRate').text(manager.getFRL_INV_1_YEAR_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_1_YEAR_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_INV_1_YEAR_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_IO_LVR80_90_InterestRate').text(manager.getFRL_INV_1_YEAR_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_1_YEAR_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_INV_1_YEAR_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_1_YEAR_IO_LVR90_InterestRate').text(manager.getFRL_INV_1_YEAR_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_1_YEAR_IO_LVR90_InterestRate').text(manager.getCP_FRL_INV_1_YEAR_IO_LVR90().Rate).toTwoDecimalPlaces();

        //2 Year
        $('.rate_HL_Fixed_2_INV_IO_InterestRate').text(manager.getFRL_INV_2_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_2_INV_IO_COMP_InterestRate').text(manager.getCOMP_INV_FRL_2_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_INV_2_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_2_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_INV_2_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_INV_2_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_2_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_INV_2_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_INV_2_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_2_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_INV_2_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_INV_2_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_2_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_INV_2_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_INV_2_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_2_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_INV_2_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_2_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_INV_2_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_2_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_INV_2_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //3 Year
        $('.rate_HL_Fixed_3_INV_IO_InterestRate').text(manager.getFRL_INV_3_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_3_INV_IO_COMP_InterestRate').text(manager.getCOMP_INV_FRL_3_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_INV_3_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_3_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_INV_3_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_INV_3_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_3_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_INV_3_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_INV_3_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_3_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_INV_3_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_INV_3_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_3_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_INV_3_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_INV_3_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_3_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_INV_3_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_3_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_INV_3_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_3_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_INV_3_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //4 Year
        $('.rate_HL_Fixed_4_INV_IO_InterestRate').text(manager.getFRL_INV_4_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_4_INV_IO_COMP_InterestRate').text(manager.getCOMP_INV_FRL_4_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_INV_4_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_4_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_INV_4_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_INV_4_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_4_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_INV_4_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_INV_4_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_4_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_INV_4_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_INV_4_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_4_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_INV_4_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_INV_4_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_4_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_INV_4_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_4_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_INV_4_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_4_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_INV_4_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();

        //5 Year
        $('.rate_HL_Fixed_5_INV_IO_InterestRate').text(manager.getFRL_INV_5_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Fixed_5_INV_IO_COMP_InterestRate').text(manager.getCOMP_INV_FRL_5_YEARS_IO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_IO_LVR50_InterestRate').text(manager.getFRL_INV_5_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_5_YEARS_IO_LVR50_InterestRate').text(manager.getCP_FRL_INV_5_YEARS_IO_LVR50().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_IO_LVR50_60_InterestRate').text(manager.getFRL_INV_5_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_5_YEARS_IO_LVR50_60_InterestRate').text(manager.getCP_FRL_INV_5_YEARS_IO_LVR50_60().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_IO_LVR60_70_InterestRate').text(manager.getFRL_INV_5_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_5_YEARS_IO_LVR60_70_InterestRate').text(manager.getCP_FRL_INV_5_YEARS_IO_LVR60_70().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_IO_LVR70_80_InterestRate').text(manager.getFRL_INV_5_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_5_YEARS_IO_LVR70_80_InterestRate').text(manager.getCP_FRL_INV_5_YEARS_IO_LVR70_80().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_IO_LVR80_90_InterestRate').text(manager.getFRL_INV_5_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_5_YEARS_IO_LVR80_90_InterestRate').text(manager.getCP_FRL_INV_5_YEARS_IO_LVR80_90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FRL_INV_5_YEARS_IO_LVR90_InterestRate').text(manager.getFRL_INV_5_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();
        $('.rate_HL_CP_FRL_INV_5_YEARS_IO_LVR90_InterestRate').text(manager.getCP_FRL_INV_5_YEARS_IO_LVR90().Rate).toTwoDecimalPlaces();


        //Reference Rates
        //Owner Occupier loans
        $('.rate_HL_OA_OWN_REF').text(manager.getREF_OA_OO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_OWN_IO_REF').text(manager.getREF_OA_OO_IO().Rate).toTwoDecimalPlaces();

        $('.rate_HL_MS_OWN_REF').text(manager.getREF_MS_OO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_MS_OWN_IO_REF').text(manager.getREF_MS_OO_IO().Rate).toTwoDecimalPlaces();

        $('.rate_HL_CL_OWN_REF').text(manager.getREF_CL_OO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_SHL_OWN_REF').text(manager.getREF_SHL_OO().Rate).toTwoDecimalPlaces();
        $('.rate_HL_AEL_OWN_REF').text(manager.getREF_AEL_OO().Rate).toTwoDecimalPlaces();

        $('.rate_HL_FR_OO_PI_REF').text(manager.getFR_OO_PI_REF().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FR_OO_IO_REF').text(manager.getFR_OO_IO_REF().Rate).toTwoDecimalPlaces();


        //Investor
        $('.rate_HL_OA_INV_REF').text(manager.getREF_OA_INV().Rate).toTwoDecimalPlaces();
        $('.rate_HL_OA_INV_IO_REF').text(manager.getREF_OA_INV_IO().Rate).toTwoDecimalPlaces();

        $('.rate_HL_MS_INV_REF').text(manager.getREF_MS_INV().Rate).toTwoDecimalPlaces();
        $('.rate_HL_MS_INV_IO_REF').text(manager.getREF_MS_INV_IO().Rate).toTwoDecimalPlaces();

        $('.rate_HL_CL_INV_REF').text(manager.getREF_CL_INV().Rate).toTwoDecimalPlaces();
        $('.rate_HL_SHL_INV_REF').text(manager.getREF_SHL_INV().Rate).toTwoDecimalPlaces();
        $('.rate_HL_AEL_INV_REF').text(manager.getREF_AEL_INV().Rate).toTwoDecimalPlaces();

        $('.rate_HL_FR_INV_PI_REF').text(manager.getFR_INV_PI_REF().Rate).toTwoDecimalPlaces();
        $('.rate_HL_FR_INV_IO_REF').text(manager.getFR_INV_IO_REF().Rate).toTwoDecimalPlaces();



        $('.rate_HL_AE_InterestRate').text(manager.getInterestRate_AEL().Rate).toTwoDecimalPlaces();
        $('.rate_HLComparison_AE_InterestRate').text(manager.getCOMP_AEL_BASE().Rate).toTwoDecimalPlaces();

        $('.rate_HL_Smart_InterestRate').text(manager.getSHL_BASE().Rate).toTwoDecimalPlaces();
        $('.rate_HL_Smart_SP_InterestRate').text(manager.getSMARTPACK_SHL().Rate).toTwoDecimalPlaces();
        $('.rate_HLComparison_Smart_InterestRate').text(manager.getCOMP_SHL_BASE().Rate).toTwoDecimalPlaces();
        $('.rate_HLComparison_OA_250_higher_InterestRate').text(manager.getCOMP_OA_TIER2_MIN250().Rate).toTwoDecimalPlaces();
        $('.rate_HLComparison_OA_250_lower_InterestRate').text(manager.getCOMP_OA_TIER_1_MIN0().Rate).toTwoDecimalPlaces();




        // Orange One Classic
        // --------------------------------------------
        $('.rate_OrangeOne_Base_InterestRate').text(manager.getOO_BASE().Rate).toTwoDecimalPlaces();
        $('.rate_OrangeOne_Cash_Advance_InterestRate').text(manager.getOO_CASH_ADV().Rate).toTwoDecimalPlaces();
        $('.rate_OrangeOne_Instalment_InterestRate').text(manager.getOO_INSTALMENT().Rate).toTwoDecimalPlaces();
        // --------------------------------------------
        // Orange One Platinum
        // --------------------------------------------
        $('.rate_OrangeOne_PL_Base_InterestRate').text(manager.getOO_PL_BASE().Rate).toTwoDecimalPlaces();
        $('.rate_OrangeOne_PL_Cash_Advance_InterestRate').text(manager.getOO_PL_CASH_ADV().Rate).toTwoDecimalPlaces();
        $('.rate_OrangeOne_PL_Instalment_InterestRate').text(manager.getOO_PL_INSTALMENT().Rate).toTwoDecimalPlaces();
        // --------------------------------------------


        // Personal Loans
        //-----------------------------------------------
        $('.rate_FIXED_PERSONAL_LOAN_InterestRate').text(manager.getPL_FIXED().Rate).toTwoDecimalPlaces();
        $('.rate_CP_FIXED_PERSONAL_LOAN_InterestRate').text(manager.getPL_FIXED_CP().Rate).toTwoDecimalPlaces();
        //-----------------------------------------------
        
    }, function() {
        //alert('error');
        //error
    });
})();