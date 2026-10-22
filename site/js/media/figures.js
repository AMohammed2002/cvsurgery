/* Textbook figures have been removed from the public app. Keep the stable
   surface API so lessons, labs and operations render without empty panels. */
(function () {
  "use strict";
  window.Figures = Object.freeze({ slot: () => "", atlas: () => "" });
})();
