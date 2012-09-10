// Uncomment this to enable debugging. Don't leave it that way though because it's
// a performance hit.
// enableDebugging();

// Note there is engine customisation at the end of this file.

var calculator = {
    nextIncomeSourceIndex:1,

    addIncomeSource:function () {
        var nnew = $(".incomeSource").first().clone();

        nnew.find(':input[name^="income"]').each(function () {
            $(this).attr("name", $(this).attr("name") + calculator.nextIncomeSourceIndex);
        });
        calculator.nextIncomeSourceIndex++;

        $(".incomeSource").last().after(nnew);
        engine.clearAllControlsIn(nnew);

        // Show the close button. These are hidden by default so it doesn't show on the first one.
        nnew.find("button").show();

        engine.onDomAdded();
    },

    removeIncomeSource:function (domElement) {
        $(domElement).closest(".incomeSource").remove();
    },

    /**
     * Something is being hidden, so questions are being set to unanswered. Remove all
     * income sources except the first.
     * (callback from the engine)
     */
    onControlsClearedInElement:function (elt) {
        elt.find(".incomeSource").not(":first").remove();
    },

    applyNow:function () {



        /*
         *  Aged Under 19 with 1 or more dependent children: http://www.workandincome.govt.nz/online-services/apply/apply-under-19-with-child.html			
         Aged 16 -17 with no dependent children: http://www.workandincome.govt.nz/online-services/apply/apply-16-17.html			
         Aged 18 - 64.75: (18 year old with no dependent children): http://www.workandincome.govt.nz/online-services/apply/apply-18-64.html			
         Aged between 64.75 and 65: http://www.workandincome.govt.nz/online-services/ (since we can't easily tell if they want to apply for a benefit or NZS)
         Aged 65 or more: http://www.workandincome.govt.nz/online-services/superannuation/index.html
         * 
         */

        //we can decide where to send them for their on-line application.
        if (
            engine.evaluate("$potentialNewZealandSuperannuationSingle")
                || engine.evaluate("$potentialNewZealandSuperannuationNonQualifiedSpouse")
                || engine.evaluate("$potentialNewZealandSuperannuationPartnerNotIncluded")) {

            if (engine.evaluate("$age<65")) {
                window.location = "http://www.workandincome.govt.nz/online-services/";
            } else {
                window.location = "http://www.workandincome.govt.nz/online-services/superannuation/";
            }
            return;
        } else if (engine.evaluate("$age16to17 && $single && $dependentChildren==0")) {
            window.location = "http://www.workandincome.govt.nz/online-services/apply/apply-16-17.html";
        } else if (engine.evaluate("$youngParent")) {
            window.location = "http://www.workandincome.govt.nz/online-services/apply/apply-under-19-with-child.html";
        } else if (engine.evaluate("$workingAge && $dependentChildren==0")) {
            window.location = "http://www.workandincome.govt.nz/online-services/apply/apply-18-64.html";
        } else {
            //fall back
            window.location = "http://www.workandincome.govt.nz/online-services/";
            return;
        }


    },

    exitWI:function () {

        window.location = "http://www.workandincome.govt.nz/online-services/";
    },


    confirmExit:function () {
        $('#outer').hide();
        $('#confirmExit').show();
    },

    cancelExit:function () {
        $('#confirmExit').hide();
        $('#outer').show();
    },

    /** They clicked the back button in the results section */
    onBackFromResults:function () {
        $(".results").hide();
        $("form").show();
        $("#controlBox").show();
        $('#nextButton').show();
        engine.changeGroup(0);
    },

    calculateAge:function (dateOfBirthString) {
        var dob = Date.parseNzDate(dateOfBirthString);
        var age;
        if (dob) {
            age = dob.yearsBefore(new Date());
        }
        else {
            age = undefined;
        }
        debug("age: " + age + " (" + dob + ")");
        return age;
    },

    calculateTotalOtherIncome:function () {
        var total = 0;
        var amounts = $('input[name^="incomeAmount"]:visible');
        var freqs = $('select[name^="incomeFrequency"]:visible');
        //debug(amounts.length + " other income sources");
        for (var i = 0; i < amounts.length; i++) {
            var amount = parseFloat($(amounts[i]).val());
            var freq = $(freqs[i]).val();
            if (freq == 'Weekly')
                total += amount;
            else if (freq == 'Fortnightly')
                total += amount / 2;
            else if (freq == 'Monthly')
                total += amount * 12 / 52;
            else if (freq == '2 Monthly')
                total += amount * 6 / 52;
            else if (freq == 'Quarterly')
                total += amount * 4 / 52;
            else if (freq == '6 Monthly')
                total += amount * 2 / 52;
            else if (freq == 'Yearly')
                total += amount / 52;
            /*
             else
             debug("ignoring income '" + amount + "' with invalid frequency '" + freq + "'");
             */
        }
        debug("calculateTotalOtherIncome: " + total);
        return total;
    },

    /**
     * We've reached the end. Work out what they're entitled to and display it.
     *
     * The engine calls this function.
     */
    onFinished:function(ineligible) {
        if (ineligible) {
            calculator.displayIneligible();
            return;
        }

        $('.nextText').addClass('nextTextAnimated').removeClass('.nextText');
        $('.nextText').html('Wait..');
        //
        //gives the illusion of speed by waiting.. 
        setTimeout(function () {


            engine.disableCurrentGroup();
            var mainBenefitUrls = [];
            var superIndex = undefined;
            var hrbIndex = undefined;
            for (var i = 0; i < allMainBenefits.length; i++) {
                if (engine.evaluate("$" + allMainBenefits[i])) {
                    mainBenefitUrls.push("benefits/" + allMainBenefits[i] + ".html");
                    
                    if (/^potentialNewZealandSuperannuation/.test(allMainBenefits[i]))
                        superIndex = mainBenefitUrls.length - 1;
                        
                    if (/^potentialHealthRelatedBenefit/.test(allMainBenefits[i]))
                        hrbIndex = mainBenefitUrls.length - 1;    
                }
            }

            var supplementaryBenefitUrls = [];

            // Between 64.75 and 65 they can be entitled both to super and another main benefit (eg. UB).
            // In this case, super is displayed as a supplementary, and appears first.
            if (superIndex != undefined && mainBenefitUrls.length > 1) {
                supplementaryBenefitUrls.push(mainBenefitUrls[superIndex]);
                mainBenefitUrls.splice(superIndex, 1);
            }
            
            
            // if the person gets HRB as well as some other benefit, we display HRB as a suplimentary
            if (hrbIndex != undefined && mainBenefitUrls.length > 1) {
                supplementaryBenefitUrls.push(mainBenefitUrls[hrbIndex]);
                mainBenefitUrls.splice(hrbIndex, 1);
            }


            //  Supplementaries - these work in the same way as benefits.
            for (var i = 0; i < allSupplementaryBenefits.length; i++) {
                if (engine.evaluate("$" + allSupplementaryBenefits[i]))
                
                    supplementaryBenefitUrls.push("benefits/" + allSupplementaryBenefits[i] + ".html");
            }

            debug("benefits: " + mainBenefitUrls);
            debug("supplementaries: " + supplementaryBenefitUrls);


            // They're eligible for something. Assemble the information - there's a page
            // fragment (ie. an html file) for each benefit and for each obligation.
            // Load the appropriate fragments from the server and insert them into the page.
            if (mainBenefitUrls.length > 0 || supplementaryBenefitUrls > 0) {
                engine.loadPageFragmentsAndReplaceVariables($("#benefits"), mainBenefitUrls, function () {
                    engine.loadPageFragmentsAndReplaceVariables($("#otherBenefits"), supplementaryBenefitUrls, function () {
                        engine.applyVisibilityToChildren($("#eligible"));
                        $("#controlBox").hide();
                        $("#eligible").slideDown(engine.SLIDE_TIME);
                        $("form").hide();
                        $('html,body').scrollTop(0);
                        $('#loadingAnimation').hide();
                        $('.nextTextAnimated').addClass('nextText').removeClass('nextTextAnimated');
                        $('.nextText').html('Next');
                    });
                });
            }

            // They're not entitled to anything. Say so.
            else {
                $('.nextTextAnimated').addClass('nextText').removeClass('nextTextAnimated');
                $('.nextText').html('Next');
                calculator.displayIneligible();
            }


        }, 500);
    },
    
    displayIneligible: function() {
        $("#controlBox").hide();
        $("#ineligible").slideDown(engine.SLIDE_TIME);
        $("form").hide();
        $('html,body').scrollTop(0);
    }
};

// Allow for our fixed-position header.
engine.groupScrollYPosition = 250;
engine.onFinished = calculator.onFinished;
engine.onControlsClearedInElement = calculator.onControlsClearedInElement;