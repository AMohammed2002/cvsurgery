/**
 * Vercel Web Analytics for CardiacSchool
 * Initializes tracking in production only
 */
(function() {
  'use strict';
  
  // Initialize the queue
  if (!window.va) {
    window.va = function() {
      (window.vaq = window.vaq || []).push(arguments);
    };
  }
  
  // Detect environment - only track in production
  var isProduction = true;
  try {
    // Don't track on localhost or development environments
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '' ||
        window.location.port === '8765') {
      isProduction = false;
    }
  } catch (e) {}
  
  if (!isProduction) {
    console.log('[Vercel Analytics] Development mode - tracking disabled');
    return;
  }
  
  // Load the analytics script
  var script = document.createElement('script');
  script.src = '/_vercel/insights/script.js';
  script.defer = true;
  script.setAttribute('data-sdkn', '@vercel/analytics');
  script.setAttribute('data-sdkv', '2.0.1');
  
  script.onerror = function() {
    console.log('[Vercel Analytics] Failed to load. Enable Web Analytics in your Vercel dashboard.');
  };
  
  if (document.head) {
    document.head.appendChild(script);
  }
})();
