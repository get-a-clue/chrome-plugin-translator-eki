(() => {

    'use strict'

    const CORS_ANYWHERE = "https://cors-anywhere.herokuapp.com/";
    function sM(a) {
        let e = [];
        let f = 0;
        for (let g = 0; g < a.length; g++) {
            let l = a.charCodeAt(g);
            128 > l
                ? (e[f++] = l)
                : (2048 > l
                ? (e[f++] = (l >> 6) | 192)
                : (55296 == (l & 64512) &&
                g + 1 < a.length &&
                56320 == (a.charCodeAt(g + 1) & 64512)
                    ? ((l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                        (e[f++] = (l >> 18) | 240),
                        (e[f++] = ((l >> 12) & 63) | 128))
                    : (e[f++] = (l >> 12) | 224),
                    (e[f++] = ((l >> 6) & 63) | 128)),
                    (e[f++] = (l & 63) | 128));
        }
        let a_ = 0;
        for (f = 0; f < e.length; f++) {
            a_ += e[f];
            a_ = xr(a_, "+-a^+6");
        }
        a_ = xr(a_, "+-3^+b+-f");
        a_ ^= 0;
        0 > a_ && (a_ = (a_ & 2147483647) + 2147483648);
        a_ %= 1e6;
        return a_.toString() + "." + a_.toString();
    }
    const xr = function (a, b) {
        for (let c = 0; c < b.length - 2; c += 3) {
            let d = b.charAt(c + 2);
            d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
            d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
            a = "+" == b.charAt(c) ? a + d : a ^ d;
        }
        return a;
    };
    function calculateFreeGoogleTranslateToken(text) {
        return { name: "tk", value: sM(text) };
    }

    function getGoogleTranslateUrl(fromLang, toLang, text, token) {
        const encodedText = encodeURIComponent(text);
        const url = "https://translate.google.com/translate_a/single";
        const uri = `client=gtx&sl=${fromLang}&tl=${toLang}&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&kc=7`;
        return url + "?" + uri + `&q=${encodedText}&${token.name}=${token.value}`;
    }

    function parseGoogleTranslateResult(bodyString) {
        const body = JSON.parse(bodyString);
        const result = {
            text: ""
        };
        body[0].forEach((obj) => {
            if (obj[0]) {
                result.text += obj[0];
            }
        });
        return result;
    }

    document.onkeyup = e => {

        (e.key === 'q' || e.key === 'Q') && (() => {

            let textToTranslate = window.getSelection().toString()
            if (!textToTranslate) {
                return
            }

            const old = document.getElementsByTagName('translator')
            if (old.length) {
                old[0].parentNode.removeChild(old[0])
            }

            const tk = calculateFreeGoogleTranslateToken(textToTranslate);
            const url = getGoogleTranslateUrl("et", "ru", textToTranslate, tk);
            const finalUrl = CORS_ANYWHERE + url;

            const translator = document.createElement('translator')
            document.body.appendChild(translator)

            const btn = '<a href="javascript:void(0)" class="closeBtn" onclick="document.getElementsByTagName(\'translator\')[0].style.display = \'none\';">×</a>';
            translator.innerHTML = btn + "...please wait";

            fetch(finalUrl, { headers: { "x-requested-with": "*" }})
                .then(function(response) {
                    return response.text();
                })
                .then(function(text) {
                    const parsed = parseGoogleTranslateResult(text);
                    console.log(parsed.text);

                    translator.innerHTML = btn + parsed.text;
                    translator.style.backgroundColor = "#f4f4d7";
                })
                .catch(function(error) {
                    console.log('Request failed', error)
                    translator.innerHTML = btn + 'Request failed: ' + error;
                    translator.style.backgroundColor = "#FDD2D2";
                });
        })();

        (e.key === 'e' || e.key === 'E') && (() => {

            let text = window.getSelection().toString()

            if (!text) {
                return
            }

            var w = window.innerWidth;
            var h = window.innerHeight;

            var width = (w / 3);
            var height = (h / 6) * 5;
            var left = ((w * 2) / 3);

            let params = `scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,
width=${width},height=${height},left=${left},top=70`;

            open(`https://www.eki.ee/dict/evs/index.cgi?Q=${text}`, 'test', params);
        })()
    }
})()

