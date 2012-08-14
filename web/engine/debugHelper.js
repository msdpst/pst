
var debugHelper = {
    stack:[],
    debugging:[],

    target:function (target) {
        var functionNames = [];
        for (var functionName in target) {
            if (target.hasOwnProperty(functionName) && target[functionName] instanceof Function)
                functionNames.push(functionName);
        }

        for (var i = 0; i < functionNames.length; i++) {
            var name = functionNames[i];
            var fn = target[name];
            target[name] = function () {
                //console.log("func: " + arguments.callee.originalName);
                debugHelper.stack.push(arguments.callee.originalName + ": " + Array.prototype.slice.call(arguments).join(","));
                var result = arguments.callee.original.apply(this, arguments);
                debugHelper.stack.pop();
                return result;
            };
            target[name].original = fn;
            target[name].originalName = name;
        }

        if (!window.onerror) {
            window.onerror = function (err) {
                alert(err + "\n\n" + debugHelper.stack.join("\n") + "\n\n" + debugHelper.debugging.join("\n"));
                debugHelper.stack = [];
            };

            window.debug = function (msg) {
                debugHelper.debugging.push(msg);
                if (debugHelper.debugging.length > 10)
                    debugHelper.debugging.pop();
                if (window.console)
                    window.console.log(msg);
            }
        }
    }
};