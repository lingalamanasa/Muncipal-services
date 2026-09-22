/**
 * Stackly Municipal Services - Universal Page History Tracker
 * Enables rock-solid "Go Back" navigation from 404 error page back to the exact previous page,
 * including all citizen, staff dashboard, and public portal pages, across all protocols (http, https, file:///).
 */
(function() {
  function recordCurrentPage() {
    try {
      const href = window.location.href;
      // Never store 404 pages as previous destination
      if (href && !href.includes('404')) {
        sessionStorage.setItem('stackly_last_page', href);
        localStorage.setItem('stackly_last_page', href);
        
        // Also store filename (e.g. 'projects.html', 'citizen-taxes.html')
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        if (!filename.includes('404')) {
          sessionStorage.setItem('stackly_last_filename', filename);
          localStorage.setItem('stackly_last_filename', filename);
        }
      }
    } catch (e) {}
  }

  // 1. Immediately record when script executes in <head>
  recordCurrentPage();

  // 2. Record on DOMContentLoaded, pageshow (bfcache), and beforeunload
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', recordCurrentPage);
  }
  window.addEventListener('pageshow', recordCurrentPage);
  window.addEventListener('beforeunload', recordCurrentPage);

  // 3. Capture-phase click listener: saves current URL before any 404 navigation begins
  document.addEventListener('click', function(e) {
    const el = e.target.closest('a, button, [onclick], span, div');
    if (!el) return;
    const onclickStr = String(el.getAttribute('onclick') || '');
    const hrefStr = String(el.getAttribute('href') || '');
    if (onclickStr.includes('404') || hrefStr.includes('404')) {
      recordCurrentPage();
    }
  }, true);
})();
