engine.onStart = function () {
    engine.autoNext = false;
};

/**
 * We've reached the end. Work out what they're entitled to and display it.
 *
 * The engine calls this function.
 */
engine.displayResults = function () {
    engine.disableCurrentGroup();
    $("#controlBox").hide();

    // Work out which benefits they get. It's just a case of evaluating the rule
    // for each benefit.
    var benefitPageUrls = [];
    for (var i = 0; i < allBenefits.length; i++) {
        if (engine.evaluate("$" + allBenefits[i]))
            benefitPageUrls.push("benefits/" + allBenefits[i] + ".html");
    }
    debug("benefits: " + benefitPageUrls);

    // Obligations - these work in the same way as benefits.
    var obligationPageUrls = [];
    for (var i = 0; i < allObligations.length; i++) {
        if (engine.evaluate("$" + allObligations[i]))
            obligationPageUrls.push("obligations/" + allObligations[i] + ".html");
    }
    debug("obligations: " + obligationPageUrls);

    // They're eligible for something. Assemble the information - there's a page
    // fragment (ie. an html file) for each benefit and for each obligation.
    // Load the appropriate fragments from the server and insert them into the page.
    if (benefitPageUrls.length > 0) {
        engine.loadPageFragmentsAndReplaceVariables($("#benefits"), benefitPageUrls, function () {
            engine.loadPageFragmentsAndReplaceVariables($("#obligations"), obligationPageUrls, function () {
                $("#eligible").slideDown(engine.SLIDE_TIME);
                $("form").hide();
                $('html,body').scrollTop(0);
            });
        });
    }

    // They're not entitled to anything. Say so.
    else {
        $("#ineligible").slideDown(engine.SLIDE_TIME);
        $("form").hide();
        $('html,body').scrollTop(0);
    }
};

var calculator = {
    /** They clicked the back button in the results section */
    onBackFromResults:function () {
        $(".results").hide();
        $("form").show();
        $("#controlBox").show();
        engine.changeGroup(0);
    },

    calculateAge:function (dateOfBirthString) {
        var millis = Date.parse(dateOfBirthString);
        var age;
        if (millis) {
            age = (new Date().getTime() - millis) / (1000 * 60 * 60 * 24 * 365.4);
        }
        else {
            age = undefined;
        }
        //debug("age: " + age);
        return age;
    }
};

//debugHelper.target(engine);
//debugHelper.target(calculator);
