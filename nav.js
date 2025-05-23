// nav.js

function scrollToTop(event) {
  if(event) event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function collapseNavbar() {
  const navbarCollapse = document.getElementById('navbarNavAltMarkup');
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    if (window.jQuery) {
      window.jQuery(navbarCollapse).collapse('hide');
    } else {
      // Defer class removal to avoid layout thrashing
      requestAnimationFrame(() => {
        navbarCollapse.classList.remove('show');
      });
    }
  }
}

window.scrollToTop = scrollToTop;
window.collapseNavbar = collapseNavbar;

window.addEventListener('load', () => {
  // Load GA4 script asynchronously after load event
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR_GA4_MEASUREMENT_ID';
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;

  gaScript.onload = function() {
    gtag('js', new Date());
    gtag('config', 'YOUR_GA4_MEASUREMENT_ID');
  };

  // Setup click tracking for #joinUsLink button
  const setupJoinUsTracking = () => {
    const joinUsLink = document.getElementById('joinUsLink');
    if (!joinUsLink) return;
    const joinUsButton = joinUsLink.querySelector('button');
    if (!joinUsButton) return;

    joinUsLink.addEventListener('click', function (e) {
      e.preventDefault();

      if (window.gtag) {
        gtag('event', 'click', {
          'event_category': 'Join Us Button',
          'event_label': 'Google Form Link'
        });
      }

      joinUsButton.innerText = 'Loading...';

      const formUrl = joinUsLink.href;
      const newWindow = window.open(formUrl, '_blank');

      if (!newWindow) {
        joinUsButton.innerText = 'Join Us';
        alert('Unable to open the form. Please disable popup blockers or try again later.');
        return;
      }

      const timer = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(timer);
          joinUsButton.innerText = 'Join Us';
        }
      }, 500);
    });
  };

  if (document.readyState === 'complete') {
    setupJoinUsTracking();
  } else {
    window.addEventListener('DOMContentLoaded', setupJoinUsTracking);
  }
});

// Reset Join Us button text when user returns to the page
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const joinUsButton = document.querySelector('#joinUsLink button');
    if (joinUsButton) joinUsButton.innerText = 'Join Us';
  }
});
