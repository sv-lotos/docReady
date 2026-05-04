(function(h, d) {
    d = d || window;
    var callbacks = [];
    var executed = false;    
    var domReady = false;     
    var needDocReady = false;  
    var timer = null;

    function execute() {
        if (executed) return;
        var docReadyOk = !needDocReady || d.DOCREADY == true;
        if (domReady && docReadyOk) {
            executed = true;
            if (timer) clearInterval(timer);
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i].fn.call(d, callbacks[i].ctx);
            }
            callbacks = [];
        }
    }

    function setDomReady() {
        if (domReady) return;
        domReady = true;
        execute();
    }

    function onReadyStateChange() {
        if (d.document.readyState === "complete") setDomReady();
    }

    if (typeof d.DOCREADY !== 'undefined') {
        needDocReady = true;
       if (d.DOCREADY == true) {
            execute();
        } else {
            timer = setInterval(function() {
                if (d.DOCREADY == true) execute();
            }, 50);
        }
    }

    if (d.document.addEventListener) {
        d.document.addEventListener("DOMContentLoaded", setDomReady, false);
        d.addEventListener("load", setDomReady, false);
    } else {
        d.document.attachEvent("onreadystatechange", onReadyStateChange);
        d.attachEvent("onload", setDomReady);
    }
    if (d.document.readyState === "complete") {
        setTimeout(setDomReady, 1);
    }

   d[h || "docReady"] = function(fn, ctx) {
        if (typeof fn !== 'function')
            throw new TypeError("callback for docReady(fn) must be a function");
        if (executed) {
            setTimeout(function() { fn.call(d, ctx); }, 1);
            return;
        }
        callbacks.push({ fn: fn, ctx: ctx });
        execute(); 
    };
})("docReady", window);
