//
// StarWebPrintDisplayBuilder API
//
// Version 1.0.0
//
// Copyright (C) 2018 STAR MICRONICS CO., LTD. All Rights Reserved.
//
class StarWebPrintDisplayBuilder {
    constructor() { }
    createBackSpaceElement(a) { return "<backspace/>"; }
    createHorizontalTabElement(a) { return "<horizontal_tab/>"; }
    createReturnElement(a) {
        var b = "<return";
        void 0 != a && (b += this._analysisEnumAttribute("type", a.type, /^(lf|cr|crlf)$/));
        return b + "/>";
    }
    createBitimageElement(a) {
        var b = "<bitimage";
        if (void 0 != a) {
            var d = 0, e = 0, c = 0, f = 0;
            void 0 != a.x && (d = a.x);
            void 0 != a.y && (e = a.y);
            void 0 != a.width && (c = a.width);
            void 0 != a.height && (f = a.height);
            this._analysisValueAttribute("x", d, 0, 65535);
            this._analysisValueAttribute("y", e, 0, 65535);
            b += this._analysisValueAttribute("width", c, 0, 65535);
            b += this._analysisValueAttribute("height", f, 0, 65535);
            if (void 0 == a.context)
                throw Error('Argument "context" is undefined.');
            b = b + ">" + this._encodeRasterImage(a.context.getImageData(d, e, c, f).data, c, f);
        }
        else
            throw Error("Argument is undefined.");
        return b += "</bitimage>";
    }
    createTextElement(a) {
        var b = "<text";
        if (void 0 != a)
            void 0 != a.codepage && (b += this._analysisEnumAttribute("codepage", a.codepage, /^(katakana|cp(437|850|852|858|860|863|865|866|1252)|shift_jis|gb2312|big5|korea)$/)), void 0 != a.international && (b += this._analysisEnumAttribute("international", a.international, /^(usa|france|germany|uk|denmark|sweden|italy|spain|japan|norway|denmark2|spain2|latin_america|korea)$/)), void 0 != a.data ? (b += ">", b = !0 == a.binary ? b + this._encodeEscapeSequenceBinary(a.data) : b + this._encodeEscapeSequence(a.data), b += "</text>") : b += "/>";
        else
            throw Error("Argument is undefined.");
        return b;
    }
    createClearScreenElement(a) {
        var b = "<clear";
        void 0 != a && (b += this._analysisEnumAttribute("type", a.type, /^(all|delete_to_end_of_line)$/));
        return b + "/>";
    }
    createCursorElement(a) {
        var b = "<cursor";
        void 0 != a && (void 0 != a.position && (b += this._analysisEnumAttribute("position", a.position, /^(home|specified)$/), "specified" == a.position && (b += this._analysisValueAttribute("x", a.x, 0, 65535), b += this._analysisValueAttribute("y", a.y, 0, 65535))), void 0 != a.mode && (b += this._analysisEnumAttribute("mode", a.mode, /^(off|on|blink)$/)));
        return b + "/>";
    }
    createToneElement(a) {
        var b = "<tone";
        void 0 != a && (void 0 != a.contrast && (b += this._analysisEnumAttribute("contrast", a.contrast, /^(minus3|minus2|minus1|default|plus1|plus2|plus3)$/)), void 0 != a.brightness && (b += this._analysisEnumAttribute("brightness", a.brightness, /^(minus3|minus2|minus1|default)$/)));
        return b + "/>";
    }
    createTurnOnElement(a) {
        var b = "<turnon";
        void 0 != a && (b += this._analysisEnumAttribute("type", a.type, /^(true|false)$/));
        return b + "/>";
    }
    createUserDefinedCharacterElement(a) {
        if (void 0 != a) {
            this._analysisValueAttribute("index", a.index, 0, 31);
            if (void 0 == a.code)
                throw Error('Argument "code" is undefined.');
            128 > a.code ? this._analysisValueAttribute("code", a.code, 32, 127) : this._analysisValueAttribute("code", a.code, 160, 223);
            if (void 0 == a.font)
                throw Error('Argument "font" is undefined.');
            this._encodeBase64Binary(a.font);
        }
        else
            throw Error("Argument is undefined.");
    }
    createUserDefinedDbcsCharacterElement(a) {
        if (void 0 != a) {
            this._analysisValueAttribute("index", a.index, 0, 15);
            if (void 0 == a.code)
                throw Error('Argument "code" is undefined.');
            128 > a.code ? this._analysisValueAttribute("code", a.code, 32, 127) : this._analysisValueAttribute("code", a.code, 32768, 65535);
            if (void 0 == a.font)
                throw Error('Argument "font" is undefined.');
            this._encodeBase64Binary(a.font);
        }
        else
            throw Error("Argument is undefined.");
    }
    createRawDataElement(a) {
        if (void 0 != a) {
            if (void 0 == a.data)
                throw Error('Argument "data" is undefined.');
            a = "<rawdata>" + this._encodeBase64Binary(a.data);
        }
        else
            throw Error("Argument is undefined.");
        return a + "</rawdata>";
    }
    _analysisEnumAttribute(a, b, d) {
        if (void 0 != b) {
            if (!d.test(b))
                throw Error('Argument "' + a + '" is invalid.');
            return " " + a + '="' + b + '"';
        }
        return "";
    }
    _analysisValueAttribute(a, b, d, e) {
        if (void 0 != b) {
            if (b < d || b > e)
                throw Error('Argument "' + a + '" is invalid.');
            return " " + a + '="' + b + '"';
        }
        return "";
    }
    _encodeEscapeSequence(a) {
        var b = /[\\\x00-\x20\x26\x3c\x3e\x7f]/g;
        b.test(a) && (a = a.replace(b, function (a) {
            return "\\" == a ? "\\\\" : "\\x" + ("0" + a.charCodeAt(0).toString(16)).slice(-2);
        }));
        return a;
    }
    _encodeEscapeSequenceBinary(a) {
        var b = /[\\\x00-\x20\x26\x3c\x3e\x7f-\xff]/g;
        b.test(a) && (a = a.replace(b, function (a) {
            return "\\" == a ? "\\\\" : "\\x" + ("0" + a.charCodeAt(0).toString(16)).slice(-2);
        }));
        return a;
    }
    _encodeBase64Binary(a) {
        var b = "", d = a.length;
        a += "\x00\x00";
        for (var e = 0; e < d; e += 3)
            var c = a.charCodeAt(e) << 16 | a.charCodeAt(e + 1) << 8 | a.charCodeAt(e + 2), b = b + ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c >> 18 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c >> 12 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c >> 6 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c & 63));
        switch (d % 3) {
            case 1: return b.slice(0, -2) + "==";
            case 2: return b.slice(0, -1) + "=";
        }
        return b;
    }
    _encodeRasterImage(a, b, d) {
        for (var e = [[-254, -126, -222, -94, -246, -118, -214, -86], [-62, -190, -30, -158, -54, -182, -22, -150], [-206, -78, -238, -110, -198, -70, -230, -102], [-14, -142, -46, -174, -6, -134, -38, -166], [-242, -114, -210, -82, -250, -122, -218, -90], [-50, -178, -18, -146, -58, -186, -26, -154], [-194, -66, -226, -98, -202, -74, -234, -106], [-2, -130, -34, -162, -10, -138, -42, -170]], c = "", f = 0, g = 0; g < d; g++) {
            for (var h = 0, k = 128, l = 0; l < b; l++)
                if (((30 * a[f] + 59 * a[f + 1] + 11 * a[f + 2]) * a[f + 3] + 12800) / 25500 - a[f + 3] < e[g & 7][l & 7] && (h |= k), f += 4, 0 == (k >>= 1))
                    c += String.fromCharCode(h), h = 0, k = 128;
            128 != k && (c += String.fromCharCode(h));
        }
        a = c;
        c = "";
        b = a.length;
        a += "\x00\x00";
        for (g = 0; g < b; g += 3)
            d = a.charCodeAt(g) << 16 | a.charCodeAt(g + 1) << 8 | a.charCodeAt(g + 2), c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d >> 18 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d >> 12 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d >> 6 & 63) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d & 63);
        switch (b % 3) {
            case 1: return c.slice(0, -2) + "==";
            case 2: return c.slice(0, -1) + "=";
        }
        return c;
    }
}

