document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.createElement('div');
    cookieBanner.id = 'cookie-banner';
    cookieBanner.innerHTML = `
        <div class="cookie-content">
            <p><strong>Vážíme si vašeho soukromí 🍪</strong></p>
            <p>Používáme cookies k analýze návštěvnosti a pro personalizaci reklam. Váš souhlas nám pomůže web vylepšovat.</p>
            <div class="cookie-buttons">
                <button id="cookie-reject" class="btn btn-outline">Jen nezbytné</button>
                <button id="cookie-accept" class="btn btn-primary">Souhlasím se vším</button>
            </div>
        </div>
    `;

    document.body.appendChild(cookieBanner);

    const consent = localStorage.getItem('cookie_consent');

    if (consent === 'granted') {
        cookieBanner.style.display = 'none';
        loadScripts();
    } else if (consent === 'denied') {
        cookieBanner.style.display = 'none';
    } else {
        // Show banner
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 500);
    }

    document.getElementById('cookie-accept').addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'granted');
        cookieBanner.classList.remove('visible');
        loadScripts();
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'denied');
        cookieBanner.classList.remove('visible');
    });

    function loadScripts() {
        console.log('Cookies accepted - Tracking enabled');

        // Facebook Pixel Code
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', '3694738397332830');
        fbq('track', 'PageView');
    }
});
