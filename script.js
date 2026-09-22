document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile menu ---
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const willOpen = mobileMenu.hidden;
      mobileMenu.hidden = !willOpen;
      menuButton.setAttribute('aria-expanded', String(willOpen));
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        mobileMenu.hidden = true;
        menuButton.setAttribute('aria-expanded', 'false');

        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView();
          }
        }
      });
    });
  }

  // --- Cookie consent banner ---
  const cookieBanner = document.querySelector('[data-cookie-banner]');
  const acceptBtn = document.querySelector('[data-cookie-accept]');
  const rejectBtn = document.querySelector('[data-cookie-reject]');
  const settingsLinks = document.querySelectorAll('[data-cookie-settings]');

  function loadMarketingScripts() {
    if (window.fbq) return;

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

  function showCookieBanner() {
    if (cookieBanner) cookieBanner.hidden = false;
  }

  function hideCookieBanner() {
    if (cookieBanner) cookieBanner.hidden = true;
  }

  if (cookieBanner) {
    const consent = localStorage.getItem('cookie_consent');

    if (consent === 'granted') {
      loadMarketingScripts();
    } else if (consent !== 'denied') {
      showCookieBanner();
    }
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'granted');
      hideCookieBanner();
      loadMarketingScripts();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'denied');
      hideCookieBanner();
    });
  }

  settingsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showCookieBanner();
    });
  });

  // --- Track Lead event on contact form submit ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      if (typeof fbq === 'function') {
        fbq('track', 'Lead');
      }
    });
  }

});
