/* ============ Drag-to-highlight ============
   Selecting (dragging) text inside #main marks it. Dragging over text that is
   already fully marked removes the mark instead (toggle). Highlights are stored
   per route (location.hash) as character offsets into the view's text, so they
   survive the app's frequent re-renders and reload from localStorage.

   Self-contained: no dependencies, no changes to the render engine. */
(function () {
  "use strict";

  var STORE_KEY = "cs_highlights";
  var MARK_CLASS = "cs-hl";

  function root() { return document.getElementById("main"); }

  /* The app navigates lesson chunks by re-rendering #main WITHOUT changing the
     hash, so the hash alone cannot tell one chunk from the next. We key each
     view by hash + a fingerprint of the opening text of #main. That fingerprint
     is stable while a chunk is on screen (marks don't change the text, and text
     appended later — e.g. a checkpoint explanation — doesn't touch the opening),
     but differs from chunk to chunk, so highlights never leak across chunks. */
  function fingerprint(el) {
    var text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160);
    var h = 5381;
    for (var i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function viewKey() {
    var el = root();
    return (location.hash || "#/") + "|" + (el ? fingerprint(el) : "");
  }

  /* ---------- persistence ---------- */
  function loadAll() {
    try { return JSON.parse((window.StaffPreview?.active() ? StaffPreview.storage : localStorage).getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveAll(map) {
    try { (window.StaffPreview?.active() ? StaffPreview.storage : localStorage).setItem(STORE_KEY, JSON.stringify(map)); } catch (e) {}
  }
  function currentRanges() { return loadAll()[viewKey()] || []; }
  function setCurrentRanges(ranges) {
    var map = loadAll();
    var key = viewKey();
    if (ranges.length) map[key] = ranges;
    else delete map[key];
    saveAll(map);
  }

  /* ---------- range-set arithmetic (union / difference) ---------- */
  function addRange(list, s, e) {
    var merged = list.concat([[s, e]]).sort(function (a, b) { return a[0] - b[0]; });
    var out = [];
    for (var i = 0; i < merged.length; i++) {
      var r = merged[i];
      if (out.length && r[0] <= out[out.length - 1][1]) {
        out[out.length - 1][1] = Math.max(out[out.length - 1][1], r[1]);
      } else {
        out.push([r[0], r[1]]);
      }
    }
    return out;
  }
  function subtractRange(list, s, e) {
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var x = list[i][0], y = list[i][1];
      if (y <= s || x >= e) { out.push([x, y]); continue; }
      if (x < s) out.push([x, s]);
      if (y > e) out.push([e, y]);
    }
    return out;
  }

  /* ---------- text-node walking ---------- */
  function textNodes(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var out = [], n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  /* Global character offset of a boundary point within #main. */
  function boundaryOffset(el, node, offset) {
    var r = document.createRange();
    r.setStart(el, 0);
    try { r.setEnd(node, offset); } catch (e) { return 0; }
    return r.toString().length;
  }

  /* ---------- apply / clear marks in the DOM ---------- */
  function unwrapAll(el) {
    var marks = el.querySelectorAll("mark." + MARK_CLASS);
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i], parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize();
    }
  }

  function wrapOffsets(el, start, end) {
    if (end <= start) return;
    var nodes = textNodes(el), pos = 0, targets = [];
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i], len = t.nodeValue.length;
      var nodeStart = pos, nodeEnd = pos + len;
      pos = nodeEnd;
      if (nodeEnd <= start) continue;
      if (nodeStart >= end) break;
      var s = Math.max(start, nodeStart) - nodeStart;
      var e = Math.min(end, nodeEnd) - nodeStart;
      if (e > s) targets.push({ node: t, s: s, e: e });
    }
    for (var j = 0; j < targets.length; j++) {
      var w = targets[j], p = w.node.parentNode;
      if (p && p.classList && p.classList.contains(MARK_CLASS)) continue;
      var range = document.createRange();
      range.setStart(w.node, w.s);
      range.setEnd(w.node, w.e);
      var mark = document.createElement("mark");
      mark.className = MARK_CLASS;
      try { range.surroundContents(mark); } catch (err) {}
    }
  }

  var internal = false; /* guards the observer against our own DOM edits */
  function repaint() {
    var el = root();
    if (!el) return;
    internal = true;
    unwrapAll(el);
    var ranges = currentRanges();
    for (var i = 0; i < ranges.length; i++) wrapOffsets(el, ranges[i][0], ranges[i][1]);
    internal = false;
  }

  /* ---------- selection -> toggle ---------- */
  /* How much of [start,end] already sits inside a stored highlight. */
  function coveredLength(ranges, start, end) {
    var covered = 0;
    for (var i = 0; i < ranges.length; i++) {
      var lo = Math.max(start, ranges[i][0]);
      var hi = Math.min(end, ranges[i][1]);
      if (hi > lo) covered += hi - lo;
    }
    return covered;
  }

  function handleSelection() {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    var range = sel.getRangeAt(0);
    var el = root();
    if (!el || !el.contains(range.commonAncestorContainer)) return;
    if (!range.toString().trim()) return;

    /* skip selections inside interactive controls */
    var host = range.commonAncestorContainer;
    if (host.nodeType === 3) host = host.parentNode;
    if (host && host.closest && host.closest("input, textarea, button, select, [contenteditable]")) return;

    var start = boundaryOffset(el, range.startContainer, range.startOffset);
    var end = boundaryOffset(el, range.endContainer, range.endOffset);
    if (end <= start) return;

    /* Re-dragging over text that's already (mostly) highlighted removes it;
       otherwise the selection is highlighted. Using overlap by character offset
       is tolerant of a selection spilling a few chars past the existing mark. */
    var ranges = currentRanges();
    var remove = coveredLength(ranges, start, end) >= (end - start) * 0.6;
    var next = remove
      ? subtractRange(ranges, start, end)
      : addRange(ranges, start, end);

    setCurrentRanges(next);
    sel.removeAllRanges();
    repaint();
  }

  function onRelease() {
    /* let the browser finish committing the selection first */
    setTimeout(handleSelection, 0);
  }

  /* ---------- wiring ---------- */
  function init() {
    document.addEventListener("mouseup", onRelease);
    document.addEventListener("touchend", onRelease);

    /* re-apply after the app re-renders #main */
    var el = root();
    if (el) {
      var pending;
      var obs = new MutationObserver(function () {
        if (internal) return;
        clearTimeout(pending);
        pending = setTimeout(repaint, 60);
      });
      obs.observe(el, { childList: true, subtree: true });
    }

    window.addEventListener("hashchange", function () { setTimeout(repaint, 60); });
    repaint();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
