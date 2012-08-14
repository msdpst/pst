/**
 * Debugging.
 * 
 * You can put calls to debug() and debugIf() in your code, but they won't
 * do anything (for efficiency) unless you call enableDebugging().
 */
function enableDebugging() {
    
    /** Outputs a message to the console (if there is one) */
    window.debug = function(msg) {
        if (window.console) {
            console.log(msg);
        }
    };
    
    /** Output a debugging message if condition is true */
    window.debugIf = function(condition, msg) {
        if (condition)
            debug(msg);
    };

    /** Display an alert the only first time the invocation is reached. Useful
     * for debugging IE, since its tools are so awful.
     * 
     * Make sure your keys are unique to each call.
     */
    window.debugAlertOnce = function(key, msg) {
        if (!window.debugAlerts)
            window.debugAlerts = {};
        if (!window.debugAlerts[key]) {
            window.debugAlerts[key] = true;
            alert(msg);
        }
    };
}

/**
 * Stub methods.
 */
window.debug = function() {};
window.debugIf = function() {};