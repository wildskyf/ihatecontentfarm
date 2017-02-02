var escapeHTML = str => str.replace(/[&"'<>]/g, m => ({ "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" })[m]);

var addMultipleListeners = (element, events, handler, useCapture, args) => {
    if (!(events instanceof Array)) {
        throw 'addMultipleListeners: '+
        'please supply an array of eventstrings '+
        '(like ["click","mouseover"])';
    }
    //create a wrapper for to be able to use additional arguments
    var handlerFn = e => {
        handler.apply(this, args && args instanceof Array ? args : []);
    }
    events.forEach( event => {
        element.addEventListener(event,handlerFn,useCapture);
    });
};

var Utils = {
    tr: (selector, message) => {
        document.querySelector(selector).textContent = escapeHTML(browser.i18n.getMessage(message));
    },

    hostname: url => {
        var parser = document.createElement("a");
        parser.href = url;
        return parser.hostname;
    },

    trFromTable: table => {
        for (var i in table) {
            document.querySelector(i).textContent = escapeHTML(browser.i18n.getMessage(table[i]));
        }
    }
};
