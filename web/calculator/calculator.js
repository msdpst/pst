// Uncomment this to enable debugging. Don't leave it that way though because it's
// a performance hit.
// enableDebugging();

// Note there is engine customisation at the end of this file.

var calculator = {
    addIncomeSource: function() {
        var last = $(".incomeSource").last();
        var nnew = last.clone();
        last.after(nnew);
        engine.clearAllControlsIn(nnew);

        // Show the close button. These are hidden by default so it doesn't show on the first one.
        nnew.find("button").show();
        
    },

    removeIncomeSource: function(domElement) {
        $(domElement).closest(".incomeSource").remove();
    },
    
    /**
     * Something is being hidden, so questions are being set to unanswered. Remove all
     * income sources except the first.
     * (callback from the engine)
     */
    onControlsClearedInElement: function(elt) {
        elt.find(".incomeSource").not(":first").remove();
    },
    
    applyNow:function(){
    	
    	//we can decide where to send them for their on-line application.
    	if (		
    			engine.evaluate("$potentialNewZealandSuperannuationSingle")
    			||  engine.evaluate("$potentialNewZealandSuperannuationNonQualifiedSpouse")
    			||  engine.evaluate("$potentialNewZealandSupperannuationPartnerNotIncluded")){
    		window.location="http://www.workandincome.govt.nz/online-services/superannuation/"; 	
    		return;
    	}else if (engine.evaluate("$age16to17 && $single" )){
    		window.location="http://www.workandincome.govt.nz/online-services/apply/apply-16-17.html";
    	}else if (engine.evaluate("$youngParent" )){	
    		window.location="http://www.workandincome.govt.nz/online-services/apply/apply-under-19-with-child.html";
    	}else if (engine.evaluate("$workingAge" )){	
    		window.location="http://www.workandincome.govt.nz/online-services/apply/apply-18-64.html";
    	}else{
    		//fall back
    		window.location="http://www.workandincome.govt.nz/online-services/";
    		return;
    	}
    	
    	
    },
    
    exitWI:function(){
    	
    	window.location="http://www.workandincome.govt.nz/online-services/";
    },
    
    
    confirmExit:function(){
    	$('#outer').hide();
    	$('#confirmExit').show();
    },
    
    cancelExit:function(){
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

    calculateTotalOtherIncome: function() {
        var total = 0;
        var amounts = $('input[name="incomeAmount"]:visible');
        var freqs = $('select[name="incomeFrequency"]:visible');
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
    
    
    
    calculateAccSuppMax: function() {
        var partner = engine.getAnswer("partner");
        var dependentChildren = engine.getAnswer("dependentChildren");
        var area = engine.getAnswer("area");
        
        // If area's not set yet, don't cause a scripting error
        if (!(area >= 1 && area <= 4)) {
            debug("calculateAccSuppMax exiting because of invalid area: " + area);
            return 0;
        }

        area--; // convert to array index
        
        if (partner) {
            if (dependentChildren > 0)
                return engine.definitions.accSuppCoupleWithChildren[area];
            else
                return engine.definitions.accSuppCouple[area];
        }
        else {
            if (dependentChildren > 1)
                return engine.definitions.accSuppSoleParent2OrMoreChildren[area];
            else if (dependentChildren == 1)
                return engine.definitions.accSuppSoleParent1Child[area];
            else
                return engine.definitions.accSuppSingle[area];
        }
    },
    
    /**
     * We've reached the end. Work out what they're entitled to and display it.
     *
     * The engine calls this function.
     */
    onFinished: function () {

        $('.nextText').addClass('nextTextAnimated').removeClass('.nextText');
        $('.nextText').html('Wait..');
        //
        //gives the illusion of speed by waiting.. 
        setTimeout(function(){
            
            
             engine.disableCurrentGroup();
             var benefitPageUrls = [];
                var otherBenefitUrls = [];
                var ub = engine.evaluate("$potentialUnemploymentBenefit");
                for (var i = 0; i < allBenefits.length; i++) {
                    if (engine.evaluate("$" + allBenefits[i])) {
                        // Special handling for when they're entitled to both UB and super
                        // (aged between 64.75 and 65) - super goes in "other" section. JSEC-77.
                        if (ub && /^potentialNewZealandSuperannuation/.test(allBenefits[i]))
                            otherBenefitUrls.push("benefits/" + allBenefits[i] + ".html");
                        else    
                            benefitPageUrls.push("benefits/" + allBenefits[i] + ".html");
                    }
                }
                debug("benefits: " + benefitPageUrls);
    
    
    
               //  PBAs - these work in the same way as benefits.
                for (var i = 0; i < allOtherBenefits.length; i++) {
                    if (engine.evaluate("$" + allOtherBenefits[i]))
                        otherBenefitUrls.push("benefits/" + allOtherBenefits[i] + ".html");
                }
                debug("Others: " + otherBenefitUrls);
    
    
                // They're eligible for something. Assemble the information - there's a page
                // fragment (ie. an html file) for each benefit and for each obligation.
                // Load the appropriate fragments from the server and insert them into the page.
                if (benefitPageUrls.length > 0 || otherBenefitUrls > 0) {
                    engine.loadPageFragmentsAndReplaceVariables($("#benefits"), benefitPageUrls, function () {
                        engine.loadPageFragmentsAndReplaceVariables($("#otherBenefits"), otherBenefitUrls, function () {
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
                    $("#controlBox").hide();
                    $("#ineligible").slideDown(engine.SLIDE_TIME);
                    $("form").hide();
                    $('html,body').scrollTop(0);
                    $('.nextTextAnimated').addClass('nextText').removeClass('nextTextAnimated');	
                    $('.nextText').html('Next');
                }
            
            
            
        },500);
    }
};

// Allow for our fixed-position header.
engine.groupScrollYPosition = 250;
engine.onFinished = calculator.onFinished;
engine.onControlsClearedInElement = calculator.onControlsClearedInElement;