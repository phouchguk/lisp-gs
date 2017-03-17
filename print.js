/* globals car, cdr, Pair, Symbol */

(function (exports) {
    "use strict";

    var writePair;

    writePair = function (pair) {
        var carObj, cdrObj, temp;

        carObj = car(pair);
        cdrObj = cdr(pair);

        temp = exports.write(carObj);

        if (cdrObj instanceof Pair) {
            return temp + " " + writePair(cdrObj);
        }

        if (cdrObj === null) {
            return temp;
        }

        return temp + " . " + exports.write(cdrObj);
    };

    exports.write = function (obj) {
        var c, i, len, t, token;

        if (obj === true) {
            return "#t";
        }

        if (obj === null) {
            return "nil";
        }

        if (obj instanceof Pair) {
            return "(" + writePair(obj) + ")";
        }

        if (obj instanceof Symbol) {
            return obj.value;
        }

        t = typeof(obj);

        if (t === "number") {
            return obj + "";
        }

        if (t === "string") {
            token = "";
            len = obj.length;

            for (i = 0; i < len; i++) {
                c = obj.substring(i, i + 1);

                switch (c) {
                case "\n":
                    token = token + "\\n";
                    break;

                case "\\":
                    token = token + "\\\\";
                    break;

                case "\"":
                    token = token + "\\\"";
                    break;

                default:
                    token = token + c;
                }
            }

            return "\"" + token + "\"";
        }

        throw("cannot write unknown type");
    };
}(window.print = window.print || {}));
