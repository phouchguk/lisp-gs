/* globals car, cdr, cons, lisp, makeSymbol */

(function (exports) {
    "use strict";

    var eatWhitespace, isDigit, isDelimiter, isSpace, readPair;

    eatWhitespace = function (s) {
        var c;

        while ((c = s.next()) !== null) {
            if (isSpace(c)) {
                continue;
            }

            if (c === ";") {
                while ((c = s.next()) !== null && c !== "\n") { continue; }
                continue;
            }

            s.back();

            break;
        }
    };

    isDelimiter = function (c) {
        return isSpace(c) || c === null ||
            c === "(" || c === ")" ||
            c === "\"" || c === ";";
    };

    isDigit = function (c) {
        return c === "0" || c === "1" || c === "2" ||
            c === "3" || c === "4" || c === "5" ||
            c === "6" || c === "7" || c === "8" ||
            c === "9";
    };

    isSpace = function (c) {
        return c === " " || c === "\n" || c === "\t";
    };

    readPair = function (s) {
        var c, carObj, cdrObj;

        eatWhitespace(s);

        c = s.next();

        if (c === ")") {
            // read the empty list
            return null;
        }

        s.back();
        carObj = exports.read(s);
        eatWhitespace(s);
        c = s.next();

        if (c === ".") {
            // read improper list
            c = s.peek();

            if (!isDelimiter(c)) {
                throw("dot not followed by delimiter");
            }

            cdrObj = exports.read(s);
            eatWhitespace(s);
            c = s.next();

            if (c !== ")") {
                throw("where was the trailing paren?");
            }

            return cons(carObj, cdrObj);
        }

        // read list
        s.back();
        cdrObj = readPair(s);

        return cons(carObj, cdrObj);
    };

    exports.readMacros = null;

    exports.read = function (s) {
        var c, mac, nr, token;

        eatWhitespace(s);

        c = s.next();

        mac = exports.readMacros;
        while (mac !== null) {
            if (c === car(car(mac))) {
                lisp.eval(cdr(car(mac)));
            }

            mac = cdr(mac);
        }

        // TRUE
        if (c === "#") {
            c = s.next();

            if (c === "t") {
                return true;
            }

            throw("unknown boolean or character literal");
        }

        // NUMBER
        if (isDigit(c) || c === "-" && isDigit(s.peek())) {
            token = c;

            while (!isDelimiter(c = s.next())) {
                token = token + c;
            }

            s.back();
            nr = parseFloat(token);

            if (isNaN(nr)) {
                throw("invalid number");
            }

            return nr;
        }

        // STRING
        if (c === "\"") {
            token = "";

            while ((c = s.next()) !== "\"") {
                if (c === "\\") {
                    c = s.next();

                    if (c === "n") {
                        c = "\n";
                    }
                }

                if (c === null) {
                    throw("non-terminated string literal");
                }

                token = token + c;
            }

            return token;
        }


        // PAIR
        if (c === "(") {
            return readPair(s);
        }

        // SYMBOL
        token = "";

        while (!isDelimiter(c)) {
            token = token + c;
            c = s.next();
        }

        s.back();

        if (token === "nil") {
            return null;
        }

        return makeSymbol(token);
    };
}(window.parser = window.parser || {}));
