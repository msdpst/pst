engine.autoNext = true;
engine.groupScrollYPosition = 200;

engine.displayResults = function() {
    $("#wrk4u").attr("checked", engine.evaluate("$wrk4uRequired"));
    $("#cv").attr("checked", engine.evaluate("$cvRequired"));
    $("#jobSearchProfile").attr("checked", engine.evaluate("$jobSearchProfileRequired"));
    $("#jobSearchEvidence").attr("checked", engine.evaluate("$jobSearchEvidenceRequired"));
    $("#pam").attr("checked", engine.evaluate("$pamRequired"));

    $("input[name='exception']").attr("checked", false);
    
    engine.revealAndScroll($(".results"));
};

/** They clicked the back button in the results section */
function onBackFromResults() {
    $(".results").hide();
    engine.changeGroup(0);
}