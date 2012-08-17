/**
 * General rules to document:
 *
 * Checkboxes should each have their own names, even within the same group. Value
 * should always be "true", ie. they're treated as booleans.
 */

var engine;
var debugConditions = true;


$(document).ready(function () {
    engine.onReady();
});

engine = {
    /** 
     * When the last question in a group is answered, go to the next question automatically. 
     * Convenient, but potentially confusing for users.
     * (Set this from the client if desired.)
     */
    autoNext:false,

    /**
     * When the current group changes it is scrolled into view, this far (in pixels)
     * from the top of the window. The client should adjust this if necessary, eg. if
     * (like EC) it has a fixed header at the top of the window.
     */
    groupScrollYPosition: 20,
    
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
        
        
        engine.validator = $("form").validate({messages:{
        	dependentChildren:"Please enter a whole number between 0 and 127",
        	cashAssets:"Please enter a valid amount between $0 and $1,000,000",
        	rentPerWeek:"Please enter a valid amount between $1 and $500,000",
        	boardPerWeek:"Please enter a valid amount between $1 and $500,000",
        	outgoingsPerWeek:"Please enter a valid amount between $1 and $500,000",
        	parentsIncome:"Please enter a valid amount between $1 and $500,000"
        }});
        
        
        
        
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
                elt.slideToggle(engine.SLIDE_TIME);
                return false;
            });
        });
        $(".help").hide();

        // Progress bar - default to 5% (0 looks funny)
        if ($("#progress").length)
            $("#progress").progressbar({value:5});

        // Update progress and question visibility every time a question's answered
        $(".question :input").change(function () {
            engine.updateProgressBar();
            engine.showOrHideQuestionsInGroup($(this).closest(".group"));

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
        engine.showOrHideQuestionsInGroup($(engine.groupSel(engine.currentGroupNum)));
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
                    if($(this).attr("type") == "radio"){
                    	$(this).closest('fieldset').addClass('borked');
                	}else{
                		$(this).addClass('borked');
                	}
                }
                else{
                	
                	if($(this).attr("type") == "radio"){
                    	$(this).closest('fieldset').removeClass('borked');
                	}else{
                		$(this).removeClass('borked');
                	}
                }
            }
        });
        
        // data-required-checkbox-group: a group of checkboxes in which at least one must be ticked
        $(engine.groupSel(engine.currentGroupNum) + " *[data-required-checkbox-group='true']:visible").each(function() {
            if ($(this).find("input[type='checkbox']:checked").length == 0){
                ok = false;
                $(this).closest('fieldset').addClass('borked');
            }else{    	
            	$(this).closest('fieldset').removeClass('borked');
            }
        });
        
        if (!ok) {
            // Don't alert on auto-next (ie. when they answer last question in group)
            if (!automatic)
                //alert("Please answer all questions");
            	$('#answerAllMessage').show('slow');
            	$('#answerAllMessage').css('visibility','visible');
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
            engine.displayResults();
            return;
        }

        // Display the next group of questions
        engine.changeGroup(1);
        return false;
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
                engine.displayResults();
                return;
            }

            if (engine.shouldShow(group)) {
                if (engine.showOrHideQuestionsInGroup(group) > 0)
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

        engine.revealAndScroll($(engine.groupSel(newGroupNum)));
        engine.currentGroupNum = newGroupNum;

        // Hide all question groups after this one
        $(engine.groupSel(newGroupNum)).nextAll(".group").slideUp(engine.SLIDE_TIME);

        // Focus on the first field in the group
        $(engine.groupSel(newGroupNum) + " :input:first").focus();
        $(engine.groupSel(newGroupNum) + " :input:first").select();

        engine.updateProgressBar();
    },

    /** Reveal the question group and scroll the page so the group is centered vertically (if it fits)*/
    revealAndScroll:function (elt) {
    	
    	
    	
        elt.fadeIn(engine.SLIDE_TIME);

        var y = elt.offset().top - engine.groupScrollYPosition;
        if (y < 0)
            y = 0;
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
     * Shows or hides questions in the specified group according to their visibility preconditions.
     * @param group - jquery element
     * @return {Number} the number of visible elements in the group
     */
    showOrHideQuestionsInGroup:function (group) {
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
            if (definitions[name] !== undefined) {
                if (jQuery.type(definitions[name]) == "string")
                    result = "(" + engine.processVariables(definitions[name]) + ")";
                else
                    result = "(" + definitions[name] + ")";
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
                if (v2.length > 0 && v2.charAt(0) == '$')
                    v2 = v2.substr(1);

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

        // select the first option in every select - we assume this is the "unselected" option
        elt.find("select :nth-child(1)").attr("selected", "selected");
    },

    /**
     * Update the progress bar to reflect how far through we think they are. It's only
     * a rough estimate, as the number of questions varies according to how they answer.
     *
     * Note we assume the progress bar goes from 0 to 100.
     */
    updateProgressBar:function () {
        if ($("#progress").length) {
            debugConditions = false;
            var count = 0; // number of questions we think they'll have to answer
            var unanswered = 0; // number of these they've not answered yet
            $(".group").each(function () {
                if (engine.shouldShow($(this))) {
                    $(this).find(".question").each(function () {
                        if (engine.shouldShow($(this))) {
                            count++;

                            // Just look at the first input in each question, and ignore checkboxes.
                            // Not entirely accurate, but that's ok.
                            var inp = $(this).find(":input").first();
                            if (inp.attr("name") && inp.attr("type") != "checkbox") {
                                if (!engine.isAnswered(inp))
                                    unanswered++;
                            }
                        }
                    });
                }
            });
            debugConditions = true;
            // Work out the percentage. Never show less than 5 though - it looks nicer.
            var result = Math.max(5, Math.round((count - unanswered) * 100 / count));
            debug("unanswered " + unanswered + " / " + count + " = " + result);

            $("#progress").progressbar("option", "value", result);
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

    validateCurrency: function (str) {
        str = $.trim(str);
        return str.length == 0 || str.match(/^\$?\d+$/) || str.match(/^\$?\d+\.\d\d$/);
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