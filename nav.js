function collapseNavbar() {
   
    if ($('.navbar-toggler').is(':visible')) {
    $('.navbar-collapse').collapse('hide');
    }
}

// Load GA4 script asynchronously
(function() {
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

  document.addEventListener('DOMContentLoaded', function () {
    const joinUsLink = document.getElementById('joinUsLink');
    if (!joinUsLink) return;
    const joinUsButton = joinUsLink.querySelector('button');

    joinUsLink.addEventListener('click', function (e) {
      e.preventDefault();  // Prevent default navigation

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
        // Popup blocked or failed to open
        joinUsButton.innerText = 'Join Us';
        alert('Unable to open the form. Please disable popup blockers or try again later.');
        return;
      }

      // Poll to detect if user closed the form window
      const timer = setInterval(() => {
        if (newWindow.closed) {
          clearInterval(timer);
          joinUsButton.innerText = 'Join Us';
        }
      }, 500);

      // Reset button if user comes back to page (in case window open detection failed)
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          joinUsButton.innerText = 'Join Us';
        }
      });
    });
  });
})();
