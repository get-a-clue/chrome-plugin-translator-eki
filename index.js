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

    function getSelectionPosition() {
        const markerTextChar = "\ufeff";
        const markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

        let sel = window.getSelection();
        let range = sel.getRangeAt(0).cloneRange();
        range.collapse(false);

        // Create the marker element containing a single invisible character using DOM methods and insert it
        let markerEl = window.document.createElement("span");
        markerEl.id = markerId;
        markerEl.appendChild(window.document.createTextNode(markerTextChar));
        range.insertNode(markerEl);

        let left = Math.floor(markerEl.getBoundingClientRect().left);
        let top = Math.floor(markerEl.getBoundingClientRect().top);
        let bottom = Math.floor(markerEl.getBoundingClientRect().bottom);

        markerEl.parentNode.removeChild(markerEl);

        return {
            left: left,
            top: top,
            bottom: bottom
        }
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

            const popupPosition = getSelectionPosition();
            console.log("selection position: " + JSON.stringify(popupPosition));

            const tk = calculateFreeGoogleTranslateToken(textToTranslate);
            const url = getGoogleTranslateUrl("et", "ru", textToTranslate, tk);
            const finalUrl = CORS_ANYWHERE + url;

            const translator = document.createElement('translator');
            translator.onclick = () => {
                document.getElementsByTagName('translator')[0].style.display = "none";
            };
            document.body.appendChild(translator);
            translator.style.top = popupPosition.bottom + 4 + "px";

            const btn = '<a href="javascript:void(0)" class="closeBtn" onclick="document.getElementsByTagName(\'translator\')[0].style.display = \'none\';">×</a>';
            translator.innerHTML = btn + "...please wait";

            fetch(finalUrl, { headers: { "x-requested-with": "*" }})
                .then(function(response) {
                    return response.text();
                })
                .then(function(text) {
                    const parsed = parseGoogleTranslateResult(text);
                    console.log(parsed.text);

                    translator.innerHTML = parsed.text;
                    translator.style.backgroundColor = "#f4f4d7";
                })
                .catch(function(error) {
                    console.log('Request failed', error)
                    translator.innerHTML = btn + 'Request failed: ' + error;
                    translator.style.backgroundColor = "#FDD2D2";
                });
        })();

        (e.key === 'e' || e.key === 'E') && (() => {

            let text = window.getSelection().toString();
            if (!text) {
                return
            }

            const width = (window.innerWidth / 3);
            const height = (window.innerHeight / 6) * 5;
            const left = ((window.innerWidth * 2) / 3);

            const params = `scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,
width=${width},height=${height},left=${left},top=70`;

            open(`https://www.eki.ee/dict/evs/index.cgi?Q=${text}`, 'test', params);
        })()
    }
})()

