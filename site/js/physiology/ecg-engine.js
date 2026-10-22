/*
 * CardiacSchool ECG signal engine.
 *
 * The engine keeps electrical timing in seconds and voltage in millivolts.
 * Renderers are responsible for mapping those physical units to calibrated
 * ECG paper. Limb leads are derived from the same frontal-plane vectors so
 * Einthoven/Goldberger relationships remain internally coherent.
 */
(function () {
  "use strict";

  const LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
  const LIMB_LEADS = new Set(["I", "II", "III", "aVR", "aVL", "aVF"]);
  const STANDARD_LAYOUT = [
    ["I", "aVR", "V1", "V4"],
    ["II", "aVL", "V2", "V5"],
    ["III", "aVF", "V3", "V6"]
  ];
  const AF_RR_RAW = Array.from({ length: 64 }, function (_, index) {
    const pseudoRandom = Math.sin((index + 1) * 12.9898) * 43758.5453;
    return 0.62 + (pseudoRandom - Math.floor(pseudoRandom)) * 0.86;
  });
  const AF_RR_MEAN = AF_RR_RAW.reduce(function (sum, value) { return sum + value; }, 0) / AF_RR_RAW.length;
  const AF_RR_FACTORS = AF_RR_RAW.map(function (value) { return value / AF_RR_MEAN; });
  const ORIGIN = 0.42;

  const PRECORDIAL = {
    V1: { p: [0.075, -0.055], q: 0.00, r: 0.18, s: -0.92, t: 0.10 },
    V2: { p: [0.08, 0.02], q: -0.02, r: 0.36, s: -1.02, t: 0.28 },
    V3: { p: [0.085, 0.025], q: -0.04, r: 0.72, s: -0.70, t: 0.40 },
    V4: { p: [0.09, 0.03], q: -0.06, r: 1.18, s: -0.34, t: 0.43 },
    V5: { p: [0.085, 0.025], q: -0.08, r: 1.30, s: -0.18, t: 0.36 },
    V6: { p: [0.075, 0.02], q: -0.08, r: 1.02, s: -0.10, t: 0.30 }
  };

  const BROAD_PRECORDIAL = {
    V1: [[0, 0], [0.10, 0.07], [0.22, 0], [0.48, -0.94], [0.68, -0.62], [0.84, -1.00], [1, 0]],
    V2: [[0, 0], [0.12, 0.10], [0.25, 0], [0.49, -0.82], [0.70, -0.52], [0.85, -0.88], [1, 0]],
    V3: [[0, 0], [0.13, 0.06], [0.29, -0.34], [0.50, -0.62], [0.72, -0.24], [0.86, 0.16], [1, 0]],
    V4: [[0, 0], [0.16, 0.10], [0.38, 0.66], [0.57, 0.48], [0.77, 0.78], [0.90, 0.62], [1, 0]],
    V5: [[0, 0], [0.16, 0.13], [0.38, 0.92], [0.58, 0.66], [0.78, 1.02], [0.91, 0.78], [1, 0]],
    V6: [[0, 0], [0.16, 0.12], [0.38, 0.82], [0.58, 0.61], [0.78, 0.91], [0.91, 0.70], [1, 0]]
  };

  const VT_PRECORDIAL_SCALE = { V1: 1.00, V2: 0.84, V3: 0.38, V4: -0.18, V5: -0.62, V6: -0.78 };
  const BROAD_PRECORDIAL_SIGN = { V1: -1, V2: -1, V3: -1, V4: 1, V5: 1, V6: 1 };

  function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
  function mod(value, divisor) { return ((value % divisor) + divisor) % divisor; }
  function radians(degrees) { return degrees * Math.PI / 180; }
  function isLimb(lead) { return LIMB_LEADS.has(lead); }
  function axisDegrees(ecg) {
    if (Number.isFinite(ecg.qrsAxis)) return ecg.qrsAxis;
    return { normal: 55, left: -50, right: 110, extreme: -135 }[ecg.axis] == null ? 55 : { normal: 55, left: -50, right: 110, extreme: -135 }[ecg.axis];
  }

  /* Derive all six limb leads from I and II, rather than scaling peers independently. */
  function limbProjection(angle, lead, magnitude) {
    const scale = magnitude == null ? 1 : magnitude;
    const leadI = Math.cos(radians(angle)) * scale;
    const leadII = Math.cos(radians(angle - 60)) * scale;
    if (lead === "I") return leadI;
    if (lead === "II") return leadII;
    if (lead === "III") return leadII - leadI;
    if (lead === "aVR") return -(leadI + leadII) / 2;
    if (lead === "aVL") return leadI - leadII / 2;
    if (lead === "aVF") return leadII - leadI / 2;
    return 0;
  }

  function meanRR(ecg) {
    const rate = ecg.ventricularRate || ecg.rate || (ecg.captureFailure && ecg.pacingRate ? ecg.pacingRate / 2 : 60);
    return 60 / Math.max(20, rate);
  }

  function intervalModel(ecg, rrOverride) {
    const rr = rrOverride || meanRR(ecg);
    const qrs = Math.max(0.06, (ecg.qrs || 90) / 1000);
    const pr = ecg.pr == null ? null : ecg.pr / 1000;
    const pDuration = clamp((ecg.pDuration || 100) / 1000, 0.07, 0.13);
    let qt;
    if (ecg.qt != null) qt = ecg.qt / 1000;
    else if (ecg.qtc != null) qt = ecg.qtc / 1000 * Math.cbrt(rr);
    else qt = 0.36 * Math.cbrt(rr);
    qt = clamp(qt, qrs + 0.12, Math.max(qrs + 0.12, rr - 0.035));
    const availableJT = Math.max(0.12, qt - qrs);
    const preferredTDuration = ecg.peakedT ? clamp(availableJT * 0.55, 0.09, 0.16) : clamp(availableJT * 0.70, 0.10, 0.24);
    const tDuration = Math.min(availableJT, preferredTDuration);
    return {
      rr: rr,
      pDuration: pDuration,
      pr: pr,
      qrs: qrs,
      qt: qt,
      qtc: ecg.qtc == null ? null : ecg.qtc / 1000,
      pOnset: pr == null ? null : -pr,
      pOffset: pr == null ? null : -pr + pDuration,
      qrsOnset: 0,
      qrsOffset: qrs,
      tOnset: qt - tDuration,
      tPeak: qt - tDuration * (ecg.peakedT ? 0.50 : 0.44),
      tOffset: qt
    };
  }

  function collectRegular(rate, start, end, origin, map) {
    const rr = 60 / Math.max(rate || 60, 1);
    const first = Math.floor((start - origin) / rr) - 1;
    const last = Math.ceil((end - origin) / rr) + 1;
    const out = [];
    for (let index = first; index <= last; index += 1) {
      const time = origin + index * rr;
      if (time >= start - rr && time <= end + rr) out.push(map ? map(time, index, rr) : { time: time, index: index, rr: rr });
    }
    return out;
  }

  function collectAF(ecg, start, end) {
    const baseRR = 60 / Math.max(ecg.rate || 100, 1);
    const cycle = baseRR * AF_RR_FACTORS.length;
    const firstCycle = Math.floor((start - ORIGIN) / cycle) - 1;
    const lastCycle = Math.ceil((end - ORIGIN) / cycle) + 1;
    const out = [];
    for (let c = firstCycle; c <= lastCycle; c += 1) {
      let cursor = ORIGIN + c * cycle;
      AF_RR_FACTORS.forEach(function (factor, i) {
        const rr = baseRR * factor;
        if (cursor >= start - baseRR && cursor <= end + baseRR) out.push({ time: cursor, index: c * AF_RR_FACTORS.length + i, rr: rr });
        cursor += rr;
      });
    }
    return out.sort(function (a, b) { return a.time - b.time; });
  }

  function events(ecg, start, end) {
    const margin = 0.8;
    const qrs = [];
    const spikes = [];
    const p = [];
    if (ecg.rhythm === "af") {
      collectAF(ecg, start - margin, end + margin).forEach(function (event) { qrs.push(event); });
    } else if (ecg.paced || ecg.rhythm === "ventricular-paced" || ecg.rhythm === "failure-capture") {
      const paceRate = ecg.pacingRate || ecg.rate || 70;
      collectRegular(paceRate, start - margin, end + margin, ORIGIN, function (time, index, rr) {
        const captured = !ecg.captureFailure || mod(index, 2) === 0;
        spikes.push({ time: time, index: index, captured: captured });
        if (captured) qrs.push({ time: time + 0.012, index: index, rr: ecg.captureFailure ? rr * 2 : rr, paced: true });
        return null;
      });
    } else {
      collectRegular(ecg.rate || 60, start - margin, end + margin, ORIGIN).forEach(function (event) { qrs.push(event); });
    }

    if (ecg.rhythm === "complete-block" || ecg.paced || ecg.rhythm === "ventricular-paced" || ecg.rhythm === "failure-capture") {
      if (ecg.p && ecg.atrialRate) {
        collectRegular(ecg.atrialRate, start - margin, end + margin, ORIGIN - 0.17).forEach(function (event) {
          p.push({ time: event.time, index: event.index, duration: clamp((ecg.pDuration || 100) / 1000, 0.07, 0.13) });
        });
      }
    } else if (ecg.p && ecg.rhythm !== "vt") {
      qrs.forEach(function (event) {
        const model = intervalModel(ecg, meanRR(ecg));
        if (model.pr != null) p.push({ time: event.time - model.pr, index: event.index, duration: model.pDuration });
      });
    }
    return { qrs: qrs, p: p, spikes: spikes, model: intervalModel(ecg, meanRR(ecg)) };
  }

  function cosineInterpolate(a, b, fraction) {
    const eased = (1 - Math.cos(Math.PI * clamp(fraction, 0, 1))) / 2;
    return a + (b - a) * eased;
  }

  function anchorValue(anchors, phase) {
    if (phase < 0 || phase > 1) return 0;
    for (let i = 1; i < anchors.length; i += 1) {
      if (phase <= anchors[i][0]) {
        const left = anchors[i - 1], right = anchors[i];
        return cosineInterpolate(left[1], right[1], (phase - left[0]) / Math.max(0.0001, right[0] - left[0]));
      }
    }
    return 0;
  }

  function normalQRS(ecg, lead, phase) {
    if (isLimb(lead)) {
      const projection = limbProjection(axisDegrees(ecg), lead, 1.05);
      return anchorValue([[0, 0], [0.10, -0.075], [0.21, 0], [0.35, 1.0], [0.54, 0], [0.72, -0.27], [1, 0]], phase) * projection;
    }
    const profile = PRECORDIAL[lead] || PRECORDIAL.V4;
    return anchorValue([[0, 0], [0.10, profile.q], [0.21, 0], [0.35, profile.r], [0.54, 0], [0.72, profile.s], [1, 0]], phase);
  }

  function broadQRS(ecg, lead, phase) {
    if (isLimb(lead)) {
      const projection = limbProjection(axisDegrees(ecg), lead, 1.12);
      return anchorValue([[0, 0], [0.12, 0.06], [0.31, 0.72], [0.50, 1.0], [0.68, 0.70], [0.84, 1.03], [1, 0]], phase) * projection;
    }
    return anchorValue(BROAD_PRECORDIAL[lead] || BROAD_PRECORDIAL.V4, phase);
  }

  function vtQRS(ecg, lead, phase) {
    const scale = isLimb(lead) ? limbProjection(axisDegrees(ecg), lead, 1.18) : (VT_PRECORDIAL_SCALE[lead] || 0.5);
    return anchorValue([[0, 0], [0.08, 0.06], [0.22, 0.58], [0.40, 1.05], [0.60, 0.78], [0.78, -0.28], [0.92, -0.10], [1, 0]], phase) * scale;
  }

  function hasSecondaryBroadMorphology(ecg) {
    return !!(ecg.lbbb || ecg.paced || ecg.rhythm === "complete-block");
  }

  function qrsValue(ecg, lead, phase) {
    if (ecg.rhythm === "vt") return vtQRS(ecg, lead, phase);
    if (hasSecondaryBroadMorphology(ecg)) return broadQRS(ecg, lead, phase);
    return normalQRS(ecg, lead, phase);
  }

  function dominantQRS(ecg, lead) {
    let dominant = 0;
    for (let i = 0; i <= 100; i += 1) {
      const value = qrsValue(ecg, lead, i / 100);
      if (Math.abs(value) > Math.abs(dominant)) dominant = value;
    }
    return dominant;
  }

  function pValue(ecg, lead, phase) {
    if (phase < 0 || phase > 1) return 0;
    const scale = ecg.pScale == null ? 1 : ecg.pScale;
    if (!isLimb(lead)) {
      const pair = (PRECORDIAL[lead] || PRECORDIAL.V4).p;
      if (phase < 0.5) return pair[0] * Math.sin(Math.PI * phase / 0.5) ** 2 * scale;
      return pair[1] * Math.sin(Math.PI * (phase - 0.5) / 0.5) ** 2 * scale;
    }
    const amplitude = limbProjection(ecg.pAxis == null ? 60 : ecg.pAxis, lead, 0.16) * scale;
    return amplitude * Math.sin(Math.PI * phase) ** 2;
  }

  function tAmplitude(ecg, lead) {
    if (ecg.peakedT) {
      if (isLimb(lead)) return limbProjection(55, lead, 0.72);
      return { V1: 0.48, V2: 0.75, V3: 0.88, V4: 0.86, V5: 0.72, V6: 0.58 }[lead] || 0.65;
    }
    if (ecg.lbbb || ecg.paced || ecg.rhythm === "complete-block" || ecg.rhythm === "vt") {
      if (isLimb(lead)) return limbProjection(axisDegrees(ecg) + 180, lead, ecg.rhythm === "vt" ? 0.34 : 0.28);
      const sign = ecg.rhythm === "vt" ? Math.sign(VT_PRECORDIAL_SCALE[lead] || 1) : (BROAD_PRECORDIAL_SIGN[lead] || 1);
      return -sign * (ecg.rhythm === "vt" ? 0.30 : 0.24);
    }
    if (isLimb(lead)) return limbProjection(ecg.tAxis == null ? 45 : ecg.tAxis, lead, 0.32);
    return (PRECORDIAL[lead] || PRECORDIAL.V4).t;
  }

  function peakedBump(phase, peak, exponent) {
    if (phase < 0 || phase > 1) return 0;
    const base = phase <= peak
      ? Math.sin((Math.PI / 2) * phase / Math.max(peak, 0.01))
      : Math.cos((Math.PI / 2) * (phase - peak) / Math.max(1 - peak, 0.01));
    return Math.max(0, base) ** exponent;
  }

  function smoothStep(value) {
    const x = clamp(value, 0, 1);
    return x * x * (3 - 2 * x);
  }

  function stAmplitude(ecg, lead) {
    if (isLimb(lead) && ecg.stVector) return limbProjection(ecg.stVector.axis, lead, ecg.stVector.amplitude);
    if (ecg.st && Number.isFinite(ecg.st[lead])) return ecg.st[lead] / 10;
    if (ecg.lbbb || ecg.paced || ecg.rhythm === "complete-block") {
      if (isLimb(lead)) return limbProjection(axisDegrees(ecg) + 180, lead, 0.12);
      return -(BROAD_PRECORDIAL_SIGN[lead] || 1) * 0.10;
    }
    return 0;
  }

  function qrsWithJPoint(ecg, lead, phase) {
    const transition = smoothStep((phase - 0.80) / 0.20);
    return qrsValue(ecg, lead, phase) + stAmplitude(ecg, lead) * transition;
  }

  function stBaseline(ecg, lead, local, model) {
    if (local < model.qrsOffset || local > model.tOffset) return 0;
    const amplitude = stAmplitude(ecg, lead);
    if (local <= model.tOnset) {
      const fraction = (local - model.qrsOffset) / Math.max(0.001, model.tOnset - model.qrsOffset);
      return amplitude * (1 - 0.28 * fraction);
    }
    const tPhase = (local - model.tOnset) / Math.max(0.001, model.tOffset - model.tOnset);
    return amplitude * 0.72 * (1 - smoothStep(tPhase / 0.72));
  }

  function stimulusAmplitude(lead) {
    return isLimb(lead) ? limbProjection(-25, lead, 1.55) : 1.55;
  }

  function afBaseline(ecg, lead, time) {
    if (ecg.rhythm !== "af") return 0;
    const firstPhase = 2 * Math.PI * (6.25 * time + 0.10 * Math.sin(2 * Math.PI * 0.17 * time));
    const secondPhase = 2 * Math.PI * (7.70 * time + 0.07 * Math.sin(2 * Math.PI * 0.23 * time + 0.8));
    const thirdPhase = 2 * Math.PI * (9.15 * time + 0.04 * Math.sin(2 * Math.PI * 0.11 * time + 1.7));
    const modulation = 0.82 + 0.18 * Math.sin(2 * Math.PI * 0.13 * time + 0.4);
    const first = modulation * 0.027 * Math.sin(firstPhase + 0.2);
    const second = 0.016 * Math.sin(secondPhase + 1.1) + 0.008 * Math.sin(thirdPhase + 2.2);
    if (isLimb(lead)) return limbProjection(72, lead, first) + limbProjection(-35, lead, second);
    const scale = lead === "V1" ? 1.45 : (lead === "V2" ? 1.15 : 0.72);
    return scale * (first + second);
  }

  function sampleComponents(ecg, lead, time, cachedEvents) {
    const cache = cachedEvents || events(ecg, time - 0.8, time + 0.8);
    const result = { p: 0, qrs: 0, st: 0, t: 0, pacer: 0, baseline: afBaseline(ecg, lead, time) };
    const model = cache.model || intervalModel(ecg, meanRR(ecg));
    cache.p.forEach(function (event) {
      const phase = (time - event.time) / event.duration;
      if (phase >= 0 && phase <= 1) result.p += pValue(ecg, lead, phase);
    });
    cache.qrs.forEach(function (event) {
      const local = time - event.time;
      if (local >= 0 && local < model.qrsOffset) result.qrs += qrsWithJPoint(ecg, lead, local / model.qrs);
      result.st += stBaseline(ecg, lead, local, model);
      if (local >= model.tOnset && local <= model.tOffset) {
        const phase = (local - model.tOnset) / Math.max(0.001, model.tOffset - model.tOnset);
        result.t += tAmplitude(ecg, lead) * peakedBump(phase, ecg.peakedT ? 0.50 : 0.56, ecg.peakedT ? 5 : 2);
      }
    });
    cache.spikes.forEach(function (event) {
      const distance = Math.abs(time - event.time);
      if (distance <= 0.00025) {
        const amplitude = stimulusAmplitude(lead);
        result.pacer += (1 - distance / 0.00025) * amplitude;
      }
    });
    return result;
  }

  function sample(ecg, lead, time, cachedEvents) {
    const cache = cachedEvents || events(ecg, time - 0.8, time + 0.8);
    const model = cache.model || intervalModel(ecg, meanRR(ecg));
    let value = afBaseline(ecg, lead, time);
    for (let i = 0; i < cache.p.length; i += 1) {
      const event = cache.p[i];
      const phase = (time - event.time) / event.duration;
      if (phase >= 0 && phase <= 1) value += pValue(ecg, lead, phase);
    }
    for (let i = 0; i < cache.qrs.length; i += 1) {
      const local = time - cache.qrs[i].time;
      if (local >= 0 && local < model.qrsOffset) value += qrsWithJPoint(ecg, lead, local / model.qrs);
      value += stBaseline(ecg, lead, local, model);
      if (local >= model.tOnset && local <= model.tOffset) {
        const phase = (local - model.tOnset) / Math.max(0.001, model.tOffset - model.tOnset);
        value += tAmplitude(ecg, lead) * peakedBump(phase, ecg.peakedT ? 0.50 : 0.56, ecg.peakedT ? 5 : 2);
      }
    }
    for (let i = 0; i < cache.spikes.length; i += 1) {
      const distance = Math.abs(time - cache.spikes[i].time);
      if (distance <= 0.00025) {
        const amplitude = stimulusAmplitude(lead);
        value += (1 - distance / 0.00025) * amplitude;
      }
    }
    return value;
  }

  function paperScale(speedMmPerSecond, gainMmPerMv, pixelsPerMm) {
    const speed = Number(speedMmPerSecond) || 25;
    const gain = Number(gainMmPerMv) || 10;
    const pxPerMm = Number(pixelsPerMm) || 5;
    return {
      speed: speed,
      gain: gain,
      pixelsPerMm: pxPerMm,
      pixelsPerSecond: speed * pxPerMm,
      pixelsPerMv: gain * pxPerMm,
      smallBoxSeconds: 1 / speed,
      smallBoxMv: 1 / gain,
      largeBoxSeconds: 5 / speed,
      largeBoxMv: 5 / gain
    };
  }

  window.CSECG = Object.freeze({
    LEADS: LEADS.slice(),
    STANDARD_LAYOUT: STANDARD_LAYOUT.map(function (row) { return row.slice(); }),
    AF_RR_FACTORS: AF_RR_FACTORS.slice(),
    meanRR: meanRR,
    intervals: intervalModel,
    events: events,
    sample: sample,
    sampleComponents: sampleComponents,
    qrsValue: qrsValue,
    dominantQRS: dominantQRS,
    stAmplitude: stAmplitude,
    stimulusAmplitude: stimulusAmplitude,
    limbProjection: limbProjection,
    paperScale: paperScale,
    isLimbLead: isLimb
  });
})();
