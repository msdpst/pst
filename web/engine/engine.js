/*
 ===================== Q U E S T I O N   E N G I N E =====================
 
 Generic engine for displaying a series of questions and evaluating rules.
 It's generic! It is used by the Eligibility Calculator (EC), but nothing
 in the engine directory should contain any code that is specific to EC 
 (or any other implementation).
 
 How to use:
 
 Use the EC code as a guideline. The general structure is:
 
 - calculator/index.html: Content, marked up with certain "magic" classes
        and cusom attributes (see below). Don't put any Javascript in here.
 - calculator/rules.js: 
 
 
 General rules to document:

 Checkboxes should each have their own names, even within the same group. Value
 should always be "true", ie. they're treated as booleans.
 */
var engine;
var debugConditions = true;

$(document).ready(function () {
    engine.onReady();
});

engine = {
    
    // =============== E X T E R N A L   C O N F I G U R A T I O N ===========
    
    /** 
     * When the last question in a group is answered, go to the next question automatically. 
     * Convenient, but potentially confusing for users.
     * Set this from the client if desired.
     */
    autoNext:false,

    /**
     * When the current group changes it is scrolled into view, this far (in pixels)
     * from the top of the window. The client should adjust this if necessary, eg. if
     * (like EC) it has a fixed header at the top of the window.
     */
    groupScrollYPosition: 20,


    /**
     * Rule definitions - a map of names to expressions.
     * Override this in the client.
     */
    definitions: {},


    /**
     * Called when they reach the end of the questions. The client should override this!
     */
    onFinished: function() {},

    /**
     * Called after clearing all inputs within an element, usually because the element
     * (eg. a question or group) is being hidden.
     * 
     * The client can override if they have additional custom tasks to do.
     */
    onControlsClearedInElement: function(elt) {},
    

    // =========== E X T E R N A L   C O N F I G U R A T I O N   E N D S ===========

    validator:undefined,
    currentGroupNum:0,
    SLIDE_TIME:500,

    onReady:function () {
        debug("====== hello ======");

        // Make sure everything's hidden to start off with. The html page should do this in a
        // style block in the head so that content isn't shown while waiting for this JS, but
        // do it here too just in case.
        $(".group, .results").hide();

        // Field validation. Use our own date parsing - validator uses JS's built-in stuff by
        // default, which is (a) too lenient and (b) dependent on the client computer's region settings.
        $.validator.addMethod("nzdate", Date.validateNzDate, "Please enter a valid date");
        $.validator.addMethod("currency", engine.validateCurrency, "Please enter a valid amount");
        
        $.validator.messages["digits"] = "Please enter a whole number";
        
        // Min and max that allow for leading $ and commas
        $.validator.addMethod("min", function(val, elt, param) {
            val = $.trim(val.replace(/^\$/, "").replace(/,/g, ""));
            var result = val == "" || Number(val) >= Number(param);
            return result;
        }, "Please enter a value greater than or equal to {0}");
        
        $.validator.addMethod("max", function(val, elt, param) {
            val = $.trim(val.replace(/^\$/, "").replace(/,/g, ""));
            var result = val == "" || Number(val) <= Number(param);
            return result;
        }, "Please enter a value less than or equal to {0}");
        
        // Can specify a custom error message on the validated field with the "data-error" attribute. Nice to keep the content in the html.
        var customValidationMessages = { };
        $("*[data-error]").each(function () {
            customValidationMessages[$(this).attr("name")] = $(this).attr("data-error");
        });
        
        engine.validator = $("form").validate({
            onkeyup: false,
            messages: customValidationMessages
        });
        
        
        
        
        // make pressing return be the same as clicking next
        $(".question :input").keypress(function (e) {
            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                engine.onNext();
                return false;
            } 
            else {
                return true;
            }
        });


        // Expandable help sections
        $(".helpButton").each(function () {
            $(this).click(function () {
                var start = $(this);
                var elt;
                do {
                    elt = start.nextAll(".help").first();
                    start = start.parent();
                }
                while (elt.length == 0);
                //modify text depending on help text status
                if (elt.is(':hidden')){
                	$(this).data("help-text",$(this).html());
                	$(this).html('Hide help text');
                }else{
                	$(this).html($(this).data("help-text"));
                }
                elt.slideToggle(engine.SLIDE_TIME);
                return false;
            });
        });
        $(".help").hide();

        // Progress bar - default to 5% (0 looks funny)
        if ($("#progress").length)
            $("#progress").progressbar({value:5});

        // Update question visibility every time a question's answered.
        // (We used to update progress here too, but now it's just based on groups so there's no need.)
        $(".question :input").change(function () {
            engine.showOrHideElementsInGroup($(this).closest(".group"));

            // If this is the last question in the group, go to the next group automatically
            // unless this is an input field (which would be confusing).
            if (engine.autoNext) {
                if (
                        $(this).attr("type") != "text" &&
                        $(this).attr("type") != "checkbox" &&
                        $(this).closest(".question").nextAll(".question:visible").length == 0
                        ) {
                    engine.onNext(true);
                }
            }
        });

        engine.changeGroup(0);
    },

    /** They clicked the Back button */
    onBack:function () {
        engine.changeGroup(-1);
        $('#answerAllMessage').hide();
        $('#answerAllMessage').css('visibility','hidden');
    },

    /** They clicked the Next button */
    onNext:function(automatic) {
        var inputSelector = engine.groupSel(engine.currentGroupNum) + " :input:visible";

        // They might have just answered a question in a way that reveals a new question.
        // If so, reveal the new question and don't move to the next group.
        var before = $(inputSelector).length;
        engine.showOrHideElementsInGroup($(engine.groupSel(engine.currentGroupNum)));
        if ($(inputSelector).length > before)
            return;

        // Make sure everything is filled in
        var ok = true;
        $(inputSelector).each(function () {
            var fieldName = $(this).attr("name");

            // Don't worry about checkboxes (see below) or unnamed fields
            if (fieldName && $(this).attr("type") != "checkbox" ) {
                if (!engine.isAnswered($(this))) {
                    ok = false;
                    debug(fieldName + " not answered");
                }
            }
        });
        
        // data-required-checkbox-group: a group of checkboxes in which at least one must be ticked
        $(engine.groupSel(engine.currentGroupNum) + " *[data-required-checkbox-group='true']:visible").each(function() {
            if ($(this).find("input[type='checkbox']:checked").length == 0){
                ok = false;
            }
        });
        
        if (!ok) {
            // Don't display error on auto-next (ie. when they answer last question in group)
            if (!automatic) {
            	$('#answerAllMessage').show('slow');
            	$('#answerAllMessage').css('visibility','visible');
            }
            return;
        }

        // Validation
        ok = true;
        $('#answerAllMessage').hide();
        $('#answerAllMessage').css('visibility','hidden');
        $(inputSelector).each(function () {
            if (!engine.validator.element($(this)))
                ok = false;
        });
        if (!ok)
            return;

        // Have their answers made them ineligible?
        var ineligible = false;
        $(engine.groupSel(engine.currentGroupNum) + " .question").each(function () {
            var cond = $(this).attr("data-ineligible");
            if (cond) {
                if (engine.evaluate(cond)) {
                    ineligible = true;
                }
            }
        });
        if (ineligible) {
            engine.finish();
            return;
        }

        // hide all help text, change help toggle message & Display the next group of questions
        
        $('.help').hide();
        //$('.helpButton').html('More information');
        
        $('.helpButton').each(function(){   	
        	$(this).html($(this).data("help-text"));
        });
        
        engine.changeGroup(1);
        return false;
    },
    
    /** They've just hit Next in the last group */
    finish: function() {
        engine.setProgressBarToFinished();
        engine.onFinished();        
    },
    
    /**
     * Move forward or back a group. Groups whose visibility preconditions are not met are skipped.
     *
     * @param direction -1 = back, 1 = forwards, 0 = display whatever engine.currentGroupNum is
     */
    changeGroup:function (direction) {
        engine.disableCurrentGroup();

        // Move to the next or previous group. If the group or all its questions
        // are to be hidden, continue to the next one.
        var newGroupNum = engine.currentGroupNum;
        var keepGoing = true;
        while (keepGoing) {
            newGroupNum += direction;
            var group = $(engine.groupSel(newGroupNum));

            // Have we reached the end?
            if (group.length == 0) {
                engine.finish();
                return;
            }

            if (engine.shouldShow(group)) {
                if (engine.showOrHideElementsInGroup(group) > 0)
                    keepGoing = false;
            }
            else {
                // Through use of the back button, we might now have an answer to a question that
                // no longer applies. Clear it to save confusion. (This also happens in the
                // question-hiding code.)
                engine.clearAllControlsIn(group);
            }
        }

        // Enable controls in the new group
        $(engine.groupSel(newGroupNum) + " :input").each(function () {
            $(this).removeAttr("disabled");
            $(this).removeClass("dontRead");
        });

        // Highlight the new group
        $(engine.groupSel(newGroupNum)).addClass("current");

        // Show or hide back button
        if (newGroupNum == 0)
            $("#backButton").hide();
        else
            $("#backButton").show();

        /*
         // Reveal the group (if it's not already displayed) and scroll the window so it's
         // fully visible if necessary.
         $(grp(newGroupNum)).slideDown(engine.SLIDE_TIME, function() {
         if (!scrollToVisible($(grp(newGroupNum)).offset().top))
         scrollToVisible($("#backButton").offset().top + $("#backButton").height());
         });
         */

        // Hide all question groups after this one
        $(engine.groupSel(newGroupNum)).nextAll(".group").hide(/*engine.SLIDE_TIME*/);

        engine.revealAndScroll($(engine.groupSel(newGroupNum)));
        engine.currentGroupNum = newGroupNum;

        // Focus on the first field in the group
        var firstInput = $(engine.groupSel(newGroupNum) + " :input:visible:first");
        firstInput.focus();
        firstInput.select();

        engine.updateProgressBar();
    },

    /** Reveal the question group and scroll the page so the group is centered vertically (if it fits)*/
    revealAndScroll:function (elt) {
        elt.show(/*engine.SLIDE_TIME*/);

        var y = elt.offset().top - engine.groupScrollYPosition;
        if (y < 0)
            y = 0;
        
        var bb = $("#bottomBuffer");
        if (bb.length) {
            var h = $(window).height() - (bb.offset().top - y);
            if (h < 0)
                h = 0;
            bb.height(h);
            //alert("y: " + y + " t: " + bb.offset().top + ", h: " + $(window).height());
        }

        $('html,body').animate({scrollTop:y}, {duration:engine.SLIDE_TIME, queue:false});

        /*
         // This code scrolls the page so the group is centered vertically (if it fits).
         // Might be userful. Would need to be modified to take account of the fixed position header.
         //
         var y = elt.offset().top - (window.innerHeight - elt.height()) / 2;
         // It's one of the first questions - scroll to top of page if not there already
         if (y < 0)
         y = 0;
         // Group taller than window - scroll to top of group
         if (y > elt.offset().top)
         y = elt.offset().top;
         $('html,body').animate({scrollTop: y}, {duration: engine.SLIDE_TIME, queue: false});
         */
    },

    /**
     * Shows or hides elements in the specified group according to their visibility preconditions -
     * usually it's questions that have preconditions but it may be other elements too.
     * 
     * @param group - jquery element
     * @return {Number} the number of visible questions in the group
     */
    showOrHideElementsInGroup:function(group) {
        // Show/hide non-question elements with visibility conditions
        group.find("[data-visible]").each(function() {
            if (!$(this).hasClass("question"))
                engine.applyVisibility($(this));
        });

        var visible = 0;
        group.find(".question").each(function () {
            if (engine.shouldShow($(this))) {
                if (group.is(':visible'))
                    $(this).slideDown(engine.SLIDE_TIME);
                else
                    $(this).show();
                visible++;
            }
            else {
                // Through use of the back button, we might now have an answer to a question that
                // no longer applies. Clear it to save confusion. (This also happens in the
                // group-hiding code.)
                engine.clearAllControlsIn($(this));
                $(this).hide();
            }
        });
        
        return visible;
    },

    /** Unhighlight the current group and disable its controls */
    disableCurrentGroup:function () {
        $(engine.groupSel(engine.currentGroupNum)).removeClass("current");
        $(engine.groupSel(engine.currentGroupNum)).addClass("dontRead");

        $(engine.groupSel(engine.currentGroupNum) + " :input").each(function () {
            $(this).attr("disabled", "disabled");    
        });
    },
    

    restart:function(){
    	
    	window.location.reload();
    	
    },


// ------------------- Nuts and bolts --------------------

    /**
     * Loads html page "fragments" from a list of urls into the supplied element.
     * Existing element content is removed. Loading is asynchronous - supply an
     * onFinished callback if you want to do somethig once loading is complete.
     *
     * @param intoElement  - jQuery element to load content into
     * @param fragmentUrls -  Array of urls
     * @param onFinished - callback when finished
     */
    loadPageFragmentsAndReplaceVariables:function (intoElement, fragmentUrls, onFinished) {
        intoElement.html("");
        var fetch = function () {
            if (fragmentUrls.length) {
                var url = fragmentUrls.shift();

                // avoid caching
                url += (url.match(/\?/) ? "&" : "?") + "dummy=" + $.now();

                debug("fetching " + url);
                var newbox = $("<div class='pageFragment'></div>");
                newbox.appendTo(intoElement);
                newbox.load(url, null, fetch);
            }
            else {
                intoElement.html(engine.replaceVariablesInText(intoElement.html()));
                if (onFinished)
                    onFinished();
            }
        };
        fetch();
    },

    /**
     * Resolve all $something variable references in the supplied text.
     *
     * @param text - text to process
     * @return processed text
     */
    replaceVariablesInText:function (text) {
    	if (null==text){return "";}
        return text.replace(/(\$[a-z,A-Z]+)\b/g, engine.evaluate);
    },

    /**
     * Shows or hides the element according to its precondition. If it doesn't have a
     * precondition, it's shown.
     * @param element - a jquery element
     * @return {Boolean} true if it's shown
     */
    shouldShow:function (element) {
        var cond = element.attr("data-visible");
        return !cond || engine.evaluate(cond);
    },
    
    applyVisibilityToChildren: function(element) {
        element.find("*[data-visible]").each(function () {
            engine.applyVisibility($(this));
        });
    },
    
    applyVisibility: function(elt) {
        if (engine.shouldShow(elt)) {
            elt.show();
        }
        else {
            elt.hide();
            engine.clearAllControlsIn(elt);
        }
    },

    /**
     * Evaluate a JavaScript-style expression. Variables references as $something will
     * be resolved using processVariables (see below).
     *
     * Note that because non-answered numeric questions evaluate to 0, calculations using
     * non-answered questions are ok.
     *
     * @param expression - eg. "$age > 25 && $single" or "$applicantIncome + $partnerIncome"
     * @return {*} the result of evaluating the expression
     */
    evaluate:function (expression) {
        debugIf(debugConditions, "expression: " + expression);
        var cond2 = engine.processVariables(expression);
        debugIf(debugConditions, "processed expression: " + cond2);
        eval("window.evaluationResult = " + cond2);
        debugIf(debugConditions, " -> " + window.evaluationResult);
        return window.evaluationResult;
    },


    evalMap:function (map, description) {
    	for (var exp in map){
    		if (engine.evaluate(exp)){
                debug(description + ": " + map[exp]);
    			return map[exp];
    		}
    	}
    	debug("evalMap - no match found for " + description);
    	return undefined;
    },

    /**
     * Converts a condition string to a JS string we can eval, by expanding $variables to
     * either getAnswer calls or rule definitions as appropriate. Expansion is recursive.
     * @param expression  eg. "$age > 25 && $single"
     * @return JavaScript code
     */
    processVariables:function (expression) {
        return expression.replace(/\$(\w+)/g, function (s) {
            var result;
            var name = s.substring(1);
            if (engine.definitions[name] !== undefined) {
                if (jQuery.type(engine.definitions[name]) == "string")
                    result = "(" + engine.processVariables(engine.definitions[name]) + ")";
                else
                    result = "(" + engine.definitions[name] + ")";
            }
            else {
                result = "engine.getAnswer('" + name + "')";
            }
            //debug("'" + s + "' => '" + result + "'");
            return result;
        });
    },

    /**
     * Get the value they entered or selected for the specified field.
     * If the question hasn't been answered, undefined is returned.
     *
     * String values are trimmed and blanks are returned as undefined.
     *
     * Numbers (class="number" - as also used by jQuery validation) are
     * returned as actual numbers if valid,
     * a string if not valid and 0 if blank. (The latter is important for
     * calculations involving questions which have not needed to be answered.)
     *
     * For radio buttons and checkboxes, "true" and "false" are converted to their
     * actual boolean values.
     *
     * @param fieldName - eg. age
     * @return {*} the value of the field
     */
    getAnswer:function (fieldName) {
        var element = $(":input[name=" + fieldName + "]");
        var val = engine.getAnswerAsText(fieldName);

        if (element.attr("type") == "radio" || element.attr("type") == "checkbox") {
            if (val == "true")
                val = true;
            else if (val == "false")
                val = false;
        }

        else if (element.hasClass("number")) {
            if (val === undefined) {
                val = 0;
            }
            else if (!isNaN(Number(val))) {
                val = Number(val);
            }
        }
        
        else if (element.hasClass("digit")) {
            if (val === undefined) {
                val = 0;
            }
            else if (!isNaN(Number(val))) {
                val = Number(val);
            }
        }

        else if (element.hasClass("currency")) {
            if (val === undefined) {
                val = 0;
            }
            else {
                var v2 = val;

                // Remove leading $ sign
                v2 = v2.replace(/^\$/, "");
                
                // Remove commas
                v2 = v2.replace(/,/g, "");

                if (!isNaN(Number(v2))) {
                    val = Number(v2);
                }
            }
        }

        return val;
    },

    /**
     * Returns the answer they've entered, without converting booleans
     * or numbers. Usually you'll want getAnswer() instead.
     *
     * Does convert blanks to undefined though.
     *
     * @param fieldName
     * @return {*}
     */
    getAnswerAsText:function (fieldName) {
        var element = $(":input[name=" + fieldName + "]");
        if (element.length == 0) {
            throw "No such field name (have you forgotten to define a rule?): " + fieldName;
        }
        return engine.getInputValueAsText(element);
    },

    getInputValueAsText:function (element) {
        var val;

        // Radio button - look for a checked element with the same name
        if (element.attr("type") == "radio") {
            var checkedElt = $("input[name=" + element.attr("name") + "]:checked");
            val = checkedElt.val();
        }

        // Checkboxes - note we assume each has its own name - we don't handle multiple checkboxes
        // with the same name
        else if (element.attr("type") == "checkbox") {
            val = element.attr("checked")? element.val() : undefined;
        }

        // Text fields and selects
        else {
            val = element.val();
            if (val !== undefined) {
                val = $.trim(val);
                if (val === "")
                    val = undefined;
            }
        }
        return val;
    },

    /**
     * @param input - a jQuery element
     * @return {Boolean} whether an answer has been provided for this field
     */
    isAnswered:function (input) {
        return engine.getInputValueAsText(input) !== undefined;
    },

    /**
     * Clear all controls within the specified element
     * @param elt - jQuery element
     */
    clearAllControlsIn:function (elt) {
        elt.find(":text").val("");
        elt.find(":radio").attr("checked", false);
        elt.find(":checkbox").attr("checked", false);

        // select the first option in every select - we assume this is the "unselected" option
        elt.find("select :nth-child(1)").attr("selected", "selected");

        // Custom client code
        engine.onControlsClearedInElement(elt);
    },

    /**
     * Update the progress bar to reflect how far through we think they are.
     *
     * Note we assume the progress bar goes from 0 to 100.
     */
    updateProgressBar:function () {
        var progressBar = $("#progress");
        if (progressBar.length) {
            /*
             The calculation is simply the current group compared to the total number of groups.
             (We used to do something more complicated based on the number of questions we thought 
             they had left, but progress went backwards in some circumstances.)
             Note with this algorithm they often never reach 100%, so the call to setProgressBarToFinished()
             is important.
             */
            var result = Math.max(5, Math.round((engine.currentGroupNum + 1) * 100 / $(".group").length));
            progressBar.progressbar("option", "value", result);
        }
    },
    
    setProgressBarToFinished: function() {
        var progressBar = $("#progress");
        if (progressBar.length) {
            progressBar.progressbar("option", "value", 100);
        }
    },

    /**
     * Scroll the window so that the specified y coordinate is visible. If scrolling is performed,
     * y ends up 50 pixels away from the top or bottom of the window.
     *
     * @param y coordinate
     * @return {Boolean} whether scrolling was necessary
     */
    scrollToVisible:function (y) {
        var newTop = 0;
        if (y < $(window).scrollTop()) {
            newTop = y - 50;
        }
        else if (y > $(window).scrollTop() + window.innerHeight) {
            newTop = y - window.innerHeight + 50;
        }
        else {
            newTop = 0;
        }

        if (newTop != 0) {
            $('html,body').animate({scrollTop:newTop}, engine.SLIDE_TIME);
            return true;
        }
        else
            return false;
    },

    /**
     * @param groupNum group number (starting at 0)
     * @return {String} jQuery selector for selecting the specified group
     */
    groupSel:function (groupNum) {
        return ".group:eq(" + groupNum + ")";
    },

    /**
     * A number with
     * - optional leading $
     * - optional cents (ie 2 decimal places)
     * - options commas (see validateIntegerWithOptionalCommas() below)
     * 
     * The string is trimmed before validation. Blanks are valid.
     * 
     * @param str
     * @return {Boolean}
     */
    validateCurrency: function (str) {
        str = $.trim(str);
        
        if (str == "")
            return true;
        
        // remove cents if present
        str = str.replace(/\.\d\d$/, "");
        
        // remove leading $ if present
        str = str.replace(/^\$/, "");
        
        return engine.validateIntegerWithOptionalCommas(str);
    },

    /**
     * An integer with optional commas. If commas are present at all, they must
     * all be present and in the correct places.
     * 
     * 1000 and 100000 and 1 are valid
     * 1,000 and 100,000 are valid
     * 10,00 and 10,000000 are not valid
     * 
     * The string is trimmed before validation. Blanks are valid.
     * 
     * @param str
     * @return {Boolean}
     */
    validateIntegerWithOptionalCommas: function(str) {
        str = $.trim(str);

        if (/,/.test(str)) {
            return /^\d{1,3}(,\d{3})*$/.test(str);
        }
        
        // No commas - must be digits (or blank)
        else {
            return /^\d*$/.test(str);
        }
    }
    
};

/* ----------- Date extensions ------------ */

/**
 * Validate that a date is in the format "31/1/1970" or "31 Jan 1970"
 * @param str
 * @return {Boolean}
 */
Date.validateNzDate = function(str) {
    return Date.parseNzDate(str) != undefined;
};

/**
 * Parse a date in the format "31/1/1970" or "31 Jan 1970".
 * @param str Date string
 * @return Date (not millis!), or undefined if the string is invalid
 */
Date.parseNzDate = function(str) {
    var date = undefined;

    // parseDate is lenient about the number of digits in a year. We don't want that.
    if (str != undefined && str.match(/[/ ]\d\d\d\d$/)) {

        // 31/1/1970
        date = Date.parseWithFormat(str, "d/m/yy");

        // 31 Jan 1970
        if (date == undefined)
            date = Date.parseWithFormat(str, "d M yy");
    }
    return date;
};

/**
 * Parses a date in the specified format. Currently implemented using JQuery UI's $.datepicker.parseDate().
 * Note it is lenient about the number of digits in a year.
 * 
 * @param dateStr
 * @param format
 * @return Date (not millis!) or undefined if the date string (or format string) is invalid
 */
Date.parseWithFormat = function(dateStr, format) {
    try {
        return $.datepicker.parseDate(format, dateStr);
    }
    catch (ex) {
        return undefined;
    }
};

/**
 * The number of years otherDate is after this date. Time of day is ignored.
 * 
 * @param otherDate
 * @return years - possibly fractional, possibly negative
 */
Date.prototype.yearsBefore = function(otherDate) {
    // We deal with one component at a time - this ensures the number we produce
    // is intuitively correct, producing a better result than simply calculating
    // the different in millis and dividing by the appropriate number.
    var years = otherDate.getFullYear() - this.getFullYear();
    var copy = new Date(this.getTime());
    copy.setFullYear(otherDate.getFullYear());
    years += (otherDate.getMonth() - copy.getMonth()) / 12;
    copy.setMonth(otherDate.getMonth());
    years += (otherDate.getDate() - copy.getDate()) / 365.4;
    return years;
};