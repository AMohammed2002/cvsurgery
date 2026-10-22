/* ============================================================================
   spring.js — dependency-free springs for fluid, interruptible motion.
   No build step, no library: a small rAF spring that animates from the live
   value so gestures can grab and reverse it mid-flight. Mirrors the Apple
   "designing fluid interfaces" model — response/bounce params, velocity
   handoff, momentum projection, rubber-banding.

   Exposes: window.Spring, window.springParams, window.projectMomentum,
            window.rubberband, window.prefersReducedMotion
   ========================================================================== */
(function (global) {
  "use strict";

  var rmq = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)");
  function prefersReducedMotion() { return !!(rmq && rmq.matches); }

  /* Apple-style (response, bounce) -> physical (stiffness, damping), mass = 1.
     response = seconds to settle-ish; bounce = 0 critically damped (no
     overshoot), > 0 overshoots. Default is a graceful, non-distracting spring. */
  function springParams(response, bounce) {
    response = response > 0 ? response : 0.4;
    bounce = bounce || 0;
    var mass = 1;
    var omega = (2 * Math.PI) / response;      // natural angular frequency
    var zeta = Math.max(0, 1 - bounce);        // damping ratio (1 = critical)
    return { stiffness: omega * omega * mass, damping: 2 * zeta * omega * mass, mass: mass };
  }

  function Spring(value, opts) {
    opts = opts || {};
    var p = opts.response != null
      ? springParams(opts.response, opts.bounce)
      : { stiffness: opts.stiffness || 170, damping: opts.damping || 26, mass: opts.mass || 1 };
    this.k = p.stiffness; this.c = p.damping; this.m = p.mass;
    this.x = value || 0; this.v = 0; this.target = this.x;
    this.onUpdate = opts.onUpdate || null;
    this.onRest = opts.onRest || null;
    this.eps = opts.eps || 0.01;
    this.epsV = opts.epsV || 0.05;
    this._raf = 0; this._last = 0;
    this._tick = this._tick.bind(this);
  }

  Spring.prototype._emit = function () { if (this.onUpdate) this.onUpdate(this.x, this.v); };

  /* Jump to a value with no animation (e.g. 1:1 drag tracking). */
  Spring.prototype.set = function (x, v) {
    this.stop();
    this.x = x; this.v = v || 0; this.target = x;
    this._emit();
  };

  /* Animate toward target, optionally handing off a release velocity (px/s).
     Always continues from the current on-screen value, so it is interruptible. */
  Spring.prototype.setTarget = function (target, velocity) {
    this.target = target;
    if (velocity != null) this.v = velocity;
    if (prefersReducedMotion()) {           // reduced motion: snap, don't travel
      this.x = target; this.v = 0; this._emit();
      this.stop(); if (this.onRest) this.onRest();
      return;
    }
    if (!this._raf) { this._last = 0; this._raf = requestAnimationFrame(this._tick); }
  };

  Spring.prototype.stop = function () {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  };

  Spring.prototype._tick = function (now) {
    if (!this._last) this._last = now;
    var dt = (now - this._last) / 1000;
    this._last = now;
    if (dt > 0.064) dt = 0.064;             // clamp after a tab switch / stall
    var h = 1 / 240, acc = dt;              // fixed sub-steps keep it stable
    while (acc > 0) {
      var step = acc > h ? h : acc; acc -= step;
      var a = (-this.k * (this.x - this.target) - this.c * this.v) / this.m;
      this.v += a * step; this.x += this.v * step;
    }
    this._emit();
    if (Math.abs(this.x - this.target) < this.eps && Math.abs(this.v) < this.epsV) {
      this.x = this.target; this.v = 0; this._emit();
      this.stop(); if (this.onRest) this.onRest();
      return;
    }
    this._raf = requestAnimationFrame(this._tick);
  };

  /* Momentum projection — Apple's exponential-decay form (not v^2/2a).
     Where a flick would come to rest. velocity in px/s. */
  function projectMomentum(velocity, decel) {
    decel = decel || 0.998;
    return (velocity / 1000) * decel / (1 - decel);
  }

  /* Progressive resistance past a boundary (drag less the further you go). */
  function rubberband(overshoot, dimension, constant) {
    constant = constant || 0.55;
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
  }

  global.Spring = Spring;
  global.springParams = springParams;
  global.projectMomentum = projectMomentum;
  global.rubberband = rubberband;
  global.prefersReducedMotion = prefersReducedMotion;
})(window);
