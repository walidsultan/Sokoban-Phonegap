(function (ns) {
    ns.resolve = function (name) {
        if (!name) {
            return null;
        }
        name = name.split('.');
        var last = window,
            o = window,
            i = -1,
            segment;
        while (segment = name[++i]) {
            o = o[segment];
            if (!o) {
                o = last[segment] = {};
            }
            last = o;
        }
        return o;
    };

    ns.extend = function (TSuper, TSub, overrides) {
        if (typeof TSuper == 'object') {
            overrides = TSuper;
            TSuper = Object;
            TSub = function () {
                // Empty
            };
        } else if (typeof TSub == 'object') {
            overrides = TSub;
            TSub = TSuper;
            TSuper = Object;
        }
        function ctor() {
            // Empty
        }
        ctor.prototype = TSuper.prototype;
        TSub.prototype = new ctor;
        TSub.prototype.constructor = TSub;
        if (overrides) {
            for (var name in overrides) {
                TSub.prototype[name] = overrides[name];
            }
        }
        TSub.extend = function (T, overrides) {
            if (typeof T == 'object') {
                overrides = T;
                T = function () {
                    TSub.apply(this, arguments);
                };
            }
            ns.extend(TSub, T, overrides);
            return T;
        };
        return TSub;
    };
})(window.skui = window.skui || {});


var InitializeView = (function ($) {

    function initialize(obj) {
        var args;
        try {
            args = Array.prototype.slice.call(arguments, 1);
            var cls = eval(obj);

            function View() {
                return cls.apply(this, args);
            }

            View.prototype = cls.prototype;
            return new View();

        } catch (ex) {
            args = args || "";
            console.log("View Initialization Error. " + ex.message);
            return null;
        }
    };

    return function (obj) {
        var views;
        var args;
        try {
            views = {};
            args = Array.prototype.slice.call(arguments, 1);
            if (args.length == 0) {
                views = initialize(obj);
            } else {
                views = initialize(obj, args[0]);
            }

            return views;
        }
        catch (ex) {
            args = args || "";
            views = views || {};
            console.log("View Initialization Error. "+ ex.message);
            return views;
        }
    };

})(jQuery);

function loadXMLDoc(filename) {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else // code for IE5 and IE6
    {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", filename, false);
    xhttp.send();
    return xhttp.responseXML;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    return false;
}