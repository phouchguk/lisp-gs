(function (exports) {
    "use strict";

    exports.Stream = function (str) {
        this.str = str;
        this.len = str.length;
        this.pos = 0;
    };

    exports.Stream.prototype.back = function () {
        if (this.pos > 0) {
            this.pos -= 1;
        }
    };

    exports.Stream.prototype.next = function () {
        var c;

        c = this.peek();

        if (c !== null) {
            this.pos += 1;
        }

        return c;
    };

    exports.Stream.prototype.peek = function () {
        if (this.pos >= this.len) {
            return null;
        }

        return this.str.substring(this.pos, this.pos + 1);
    };
}(window.stream = window.stream || {}));
