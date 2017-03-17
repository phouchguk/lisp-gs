(function () {
    "use strict";

    window.Pair = function (car, cdr) {
        this.car = car;
        this.cdr = cdr;
    };

    window.car = function (pair) {
        return pair.car;
    };

    window.cdr = function (pair) {
        return pair.cdr;
    };

    window.cons = function (a, d) {
        return new window.Pair(a, d);
    };
})();
