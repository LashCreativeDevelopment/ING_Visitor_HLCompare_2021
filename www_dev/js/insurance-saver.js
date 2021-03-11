/*
 * ING Insurance Calculator
 *
 * 290419: v1.1 - removing Provider (Company)
 *
 */


var comparisonRates = [
    {
        "Type": "Home and Contents",
        "StateCompaniesList": {
            "NSW": 292,
            "QLD": 270,
            "VIC": 233,
            "WA": 264
        }
    }
];

var defaultValues = {
    Type: "Home and Contents", 
    State:  "NSW"
};


$(function() {
    // DROP DOWN SCRIPT START
    var animationDuration = {
        faster: 150,
        fast:   300,
        normal: 500,
        slow:   800,
        slower: 1000
    };

    // input decoration
    $('.filter-container .filter-input').focusout(function() {
        changeInputPlaceholderPosition(this);
    });

    // decoration function
    function changeInputPlaceholderPosition(object) {
        var inputContent = $(object).val();
        if ( inputContent !== '' ) {
            $(object).addClass('has-content');
        } else {
            $(object).removeClass('has-content');
        }
    }

    // dropdown selector
    $('.filter-menu-list.style-doubleline li.menu, .filter-menu-list.style-singleline li.menu').on('click', function(event) {
        event.preventDefault();
        var info = $(this).find('.filter-info-container').html();
        var target = $(this).parents('.filter-menu').attr('aria-labelledby');
        var container = $('#'+target).find('.filter-info-container');
        $('#'+target).addClass('has-content');
        container.fadeOut(animationDuration.faster, function() {
            container.html(info);
            container.fadeIn(animationDuration.faster);
        });
    }).on("reset", function(event) {
        event.preventDefault();
        var target = $(this).parents('.filter-menu').attr('aria-labelledby');
        var container = $('#'+target).find('.filter-info-container');
        $('#'+target).removeClass('has-content');
        container.fadeOut(animationDuration.faster, function() {
            container.html("<span class=\"initial-placeholder\">Select</span>");
            container.fadeIn(animationDuration.faster);
        });
    });

/*
    $('.filter-menu-list.style-tripleline li.menu').on('click', function(event) {
        event.preventDefault();
        var info = $(this).find('.filter-info-container').html();
        var target = $(this).parents('.filter-menu').attr('aria-labelledby');
        var container = $('#'+target).find('.filter-info-container');
        $('#'+target).addClass('has-content');
        container.fadeOut(animationDuration.faster, function() {
            container.html(info).find('.description')[0].remove();
            container.fadeIn(animationDuration.faster);
        });
    });
*/

    $(".filter-button").on("reset", function(e) {
        e.preventDefault();
        $(this).removeClass("has-content");
        var infoContainer = $(this).find(".filter-info-container")
        infoContainer.fadeOut(animationDuration.faster, function() {
            infoContainer.html("<span class=\"initial-placeholder\">Select</span>");
            infoContainer.fadeIn(animationDuration.faster);
        });
    });


    /*
    // MARK: just for scenario
    $('[aria-labelledby="transfer-dropdown-biller"] li.menu').on('click', function(event) {
        event.preventDefault();
        $('#biller-CRN').collapse('show');
        $('#biller-history').collapse('show');
    });
    $('[aria-labelledby="transfer-dropdown-anyone"] li.menu').on('click', function(event) {
        event.preventDefault();
        $('#anyone-history').collapse('show');
    });
    */



    // DROP DOWN SCRIPT START

    // INSURANCE SAVER MAIN SCRIPT
    var $policies = $("#dropdown-policies-list");
    var $states = $("#dropdown-states-list");
    //var $providers = $("#dropdown-providers-list");
    
    var $savedAmount = $("#insurance-save-amount");
    var $dropdownOption = $(".filter-menu-cell").first().clone(true); 

    // PREPARE POLICY NAME DROPDOWN
    $policies.empty();
    comparisonRates.forEach(function(policyObj) {
        var policyName = policyObj.Type;
        var $option = $dropdownOption.clone(true);
        $option.find(".option-name").text(policyName).attr("data-value", policyName);
        $policies.append($option);
    });

    $policies.children(".filter-menu-cell").click(function() {
        var selectedOption = $(this).find(".option-name").data("value");

        resetDropdown($states);
        //resetDropdown($providers);

        var $option = $dropdownOption.clone(true);
        //$option.find(".option-name").text("Provider");
        //$providers.empty().append($option);

        // PREPARE STATE DROPDOWN UPON SELECTED POLICY
        $states.empty();
        $savedAmount.text("");
        comparisonRates.forEach(function(policyObj) {
            // console.log(selectedOption);
            if(policyObj.Type === selectedOption) {

                Object.keys(policyObj.StateCompaniesList).forEach(function(stateName) {
                    var $option = $dropdownOption.clone(true);
                    $option.find(".option-name").text(stateName).attr("data-value", stateName)
                    $states.append($option);

                    $option.click(function() {
                        animateNumber($savedAmount, policyObj.StateCompaniesList[stateName]);
                    });

                    /*
                    $option.click(function() {
                        resetDropdown($providers);
                        $providers.empty();
                        $savedAmount.text("");
                        Object.keys(policyObj.StateCompaniesList[stateName]).forEach(function(providerName) {
                            var $option = $dropdownOption.clone(true);
                            $option.find(".option-name").text(providerName); //.attr("data-value", providerName)
                            $providers.append($option);

                            $option.click(function() {
                                animateNumber($savedAmount, policyObj.StateCompaniesList[stateName][providerName]);
                            });
                        });
                    });
                    */
                });
            }
        });
    });


    // SET DEFAULT VALUES
    setTimeout(function(){
        $policies.find('.option-name[data-value="'+defaultValues.Type+'"]').closest('.filter-menu-cell').trigger('click');
        setTimeout(function(){
            $states.find('.option-name[data-value="'+defaultValues.State+'"]').closest('.filter-menu-cell').trigger('click');
        }, 100);
    }, 0);

});

// count animation
function animateNumber($el, num) {
    $el.prop("Counter", 0).animate(
        { Counter: num },
        {
          duration: 2000,
          easing: "swing",
          step: function(now) {
            $el.text(Math.ceil(now));
        },
        onComplete: function() {
            $el.text(Math.ceil(num));
        }
    }
    );
}

function resetDropdown($dropdown) {
    var name = $dropdown.parents(".filter-menu").attr("aria-labelledby");
    $("#" + name).trigger("reset");
}

