/* Silver Touch Green RE — landing page interactions */
(function () {
  "use strict";

  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var SVG_NS = "http://www.w3.org/2000/svg";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 1021px)");
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var ramp = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };

  
  /* ------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------ */
  function logoMark(x, y, w, color) {
    var h = w * 469 / 416;
    return '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="0 0 416 469" style="color:' + color + '"><use href="#logo-shape"/></svg>';
  }

  /* ------------------------------------------------------------------
     Year
     ------------------------------------------------------------------ */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Split headings into words (for staggered reveal)
     ------------------------------------------------------------------ */
  $$(".split").forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var wd = document.createElement("span");
            wd.className = "wd";
            var inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--w", i++);
            wd.appendChild(inner);
            frag.appendChild(wd);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);
  });

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  var revealTargets = $$("[data-reveal], .split");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in"); });
  }

  /* ------------------------------------------------------------------
     Navigation
     ------------------------------------------------------------------ */
  var nav = $("#nav");
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (!document.body.classList.contains("nav-open")) {
      nav.classList.toggle("is-hidden", y > lastY && y > 400);
    }
    lastY = y;
  }, { passive: true });

  var toggle = $(".nav-toggle");
  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setMenu(!document.body.classList.contains("nav-open")); });
  $$("#mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // Solutions dropdown: opens on hover (mouse) or click/keyboard
  $$(".nav-drop").forEach(function (drop) {
    var btn = $(".nav-drop-btn", drop), closeT, hoverOpened = false;
    var set = function (open) {
      drop.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    // A click that follows a hover-open keeps the menu open instead of toggling it shut
    btn.addEventListener("click", function () {
      if (hoverOpened) { hoverOpened = false; set(true); return; }
      set(!drop.classList.contains("is-open"));
    });
    drop.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse") return;
      clearTimeout(closeT);
      if (!drop.classList.contains("is-open")) hoverOpened = true;
      set(true);
    });
    drop.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse") return;
      hoverOpened = false;
      closeT = setTimeout(function () { set(false); }, 180);
    });
    drop.addEventListener("keydown", function (e) { if (e.key === "Escape") { set(false); btn.focus(); } });
    document.addEventListener("click", function (e) { if (!drop.contains(e.target)) set(false); });
    drop.addEventListener("focusout", function (e) { if (!drop.contains(e.relatedTarget)) set(false); });
  });

  /* ------------------------------------------------------------------
     Page transitions: a brand curtain covers the page on the way out and
     lifts on the way in (sessionStorage tells the next page to start covered).
     ------------------------------------------------------------------ */
  (function pageTransitions() {
    var root = document.documentElement;
    var label = $(".pt-label");
    var PAGE_NAMES = {
      "index.html": "Home", "about.html": "About us", "commercial-industrial-solar.html": "C&I solar EPC", "public-infrastructure.html": "Public infrastructure",
      "battery-storage.html": "Battery storage", "hybrid-solar-wind.html": "Hybrid solar + wind", "floating-solar.html": "Floating solar"
    };
    function fileOf(url) {
      var f = url.pathname.split("/").pop();
      return f === "" ? "index.html" : f;
    }
    // Arriving: lift the curtain once the first frame is ready
    if (root.classList.contains("pt-enter")) {
      var lift = function () {
        requestAnimationFrame(function () {
          root.classList.add("pt-reveal");
          setTimeout(function () { root.classList.remove("pt-enter", "pt-reveal"); }, 800);
        });
      };
      var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 450); })]).then(lift);
    }
    // Back/forward cache: never come back to a covered page
    window.addEventListener("pageshow", function (e) { if (e.persisted) root.classList.remove("pt-leave", "pt-enter", "pt-reveal"); });

    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var url;
      // getAttribute also covers SVG <a>, whose .href is not a string
      try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      var here = fileOf(location), there = fileOf(url);
      if (there === here) return; // same page (including #anchors): let the browser scroll
      if (!/\.html$/.test(there)) return;
      if (reduced) return;
      e.preventDefault();
      setMenuClosed();
      if (label) label.textContent = PAGE_NAMES[there] || "";
      root.classList.add("pt-leave");
      try { sessionStorage.setItem("stg-pt", "1"); } catch (err) {}
      setTimeout(function () { location.href = url.href; }, 560);
    });
    function setMenuClosed() {
      if (document.body.classList.contains("nav-open")) setMenu(false);
    }
  })();

  var navLinks = $$(".nav-links a");
  if ("IntersectionObserver" in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["top", "about", "solutions", "focus", "why", "process", "vision", "contact"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) secIO.observe(s);
    });
  }

  /* ------------------------------------------------------------------
     Hero ticker
     ------------------------------------------------------------------ */
  var tickWords = $$(".ticker-words span");
  if (tickWords.length && !reduced) {
    var ti = 0;
    setInterval(function () {
      var cur = tickWords[ti];
      ti = (ti + 1) % tickWords.length;
      var nxt = tickWords[ti];
      cur.classList.remove("is-in");
      cur.classList.add("is-out");
      nxt.classList.remove("is-out");
      // force reflow so the incoming word starts below
      void nxt.offsetWidth;
      nxt.classList.add("is-in");
      setTimeout(function () { cur.classList.remove("is-out"); }, 650);
    }, 2200);
  }

  /* ------------------------------------------------------------------
     Hero landscape: every asset maps to one of the five solutions
     ------------------------------------------------------------------ */
  (function buildScene() {
    var svg = $("#hero-scene");
    if (!svg) return;
    var INK = "#0a2216";

    function turbine(x, base, h, dur, fill, stroke) {
      var s = h / 150, hub = base - h, L = h * 0.44;
      var tw = 3.6 * s, tt = 1.4 * s;
      var t = '<path d="M' + (x - tw) + " " + base + " L" + (x - tt) + " " + hub + " L" + (x + tt) + " " + hub + " L" + (x + tw) + " " + base + ' Z" fill="' + fill + '" stroke="' + stroke + '"/>';
      var blade = "M" + x + " " + hub + " C " + (x + 5 * s) + " " + (hub - L * 0.3) + ", " + (x + 2.6 * s) + " " + (hub - L * 0.8) + ", " + x + " " + (hub - L) +
        " C " + (x - 1.2 * s) + " " + (hub - L * 0.8) + ", " + (x - 2 * s) + " " + (hub - L * 0.3) + ", " + x + " " + hub + " Z";
      var start = Math.round(Math.random() * 120);
      t += '<g fill="' + fill + '" stroke="' + stroke + '">' +
        [0, 120, 240].map(function (a) { return '<path d="' + blade + '" transform="rotate(' + a + " " + x + " " + hub + ')"/>'; }).join("") +
        '<animateTransform attributeName="transform" type="rotate" from="' + start + " " + x + " " + hub + '" to="' + (start + 360) + " " + x + " " + hub + '" dur="' + dur + 's" repeatCount="indefinite"/></g>';
      t += '<circle cx="' + x + '" cy="' + hub + '" r="' + 3.4 * s + '" fill="' + fill + '" stroke="' + stroke + '"/>';
      return t;
    }
    // A tilted module: bottom edge at y, top edge leaning back by `lean`
    function panel(x, y, w, h, lean) {
      var m1 = x + w / 3, m2 = x + (2 * w) / 3;
      return '<g class="hz-pv"><polygon points="' + [x, y, x + w, y, x + w + lean, y - h, x + lean, y - h].join(" ") + '" fill="#1f3b4a" stroke="' + INK + '" stroke-width=".8"/>' +
        '<path d="M' + m1 + " " + y + " L" + (m1 + lean) + " " + (y - h) + " M" + m2 + " " + y + " L" + (m2 + lean) + " " + (y - h) +
        " M" + (x + lean / 2) + " " + (y - h / 2) + " L" + (x + w + lean / 2) + " " + (y - h / 2) + '" stroke="rgba(255,255,255,.35)" stroke-width=".7" fill="none"/></g>';
    }
    function tree(x, y, r) {
      return '<path d="M' + x + " " + y + " V" + (y - r * 1.2) + '" stroke="#4b3a2a" stroke-width="2"/>' +
        '<circle cx="' + x + '" cy="' + (y - r * 1.5) + '" r="' + r + '" fill="#0b4026"/>' +
        '<circle cx="' + (x - r * 0.35) + '" cy="' + (y - r * 1.75) + '" r="' + r * 0.55 + '" fill="#2f6b33"/>';
    }
    function pylon(x, base, h) {
      var top = base - h;
      return '<path d="M' + (x - 10) + " " + base + " L" + (x - 2) + " " + top + " M" + (x + 10) + " " + base + " L" + (x + 2) + " " + top +
        " M" + (x - 16) + " " + (top + 12) + " H" + (x + 16) + " M" + (x - 12) + " " + (top + 26) + " H" + (x + 12) +
        " M" + (x - 8) + " " + (base - 18) + " L" + (x + 5) + " " + (base - 42) + " M" + (x + 8) + " " + (base - 18) + " L" + (x - 5) + " " + (base - 42) +
        '" stroke="#3d5a4c" stroke-width="1.4" fill="none"/>';
    }

    var out = "<defs>" +
      '<radialGradient id="hz-sun-g"><stop offset="0" stop-color="#fff6d6" stop-opacity=".95"/><stop offset=".35" stop-color="#ffe08a" stop-opacity=".5"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="hz-back-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d4c2"/><stop offset="1" stop-color="#a3c4ab"/></linearGradient>' +
      '<linearGradient id="hz-mid-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6cc84"/><stop offset="1" stop-color="#86b665"/></linearGradient>' +
      '<linearGradient id="hz-front-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6aa64c"/><stop offset="1" stop-color="#3f7d38"/></linearGradient>' +
      '<linearGradient id="hz-water-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6d7ec"/><stop offset="1" stop-color="#6fb6d8"/></linearGradient>' +
      "</defs>";

    // Sun
    out += '<g class="px-sun"><g class="hz-sun"><circle cx="1150" cy="215" r="170" fill="url(#hz-sun-g)"/><circle cx="1150" cy="215" r="44" fill="#ffd45e"/></g></g>';

    // Back hills + distant turbines
    var back = '<path d="M0 330 C 200 262, 380 300, 560 252 C 760 198, 900 282, 1080 242 C 1260 202, 1420 272, 1600 232 V520 H0 Z" fill="url(#hz-back-g)"/>';
    [[150, 300, 78, 7], [222, 290, 66, 6.2], [1290, 232, 84, 6.6], [1368, 244, 72, 5.8], [1440, 254, 64, 7.2]].forEach(function (t) {
      back += turbine(t[0], t[1], t[2], t[3], "#f1f6f4", "rgba(12,23,18,.18)");
    });
    out += '<g class="px-back"><g class="hz-back">' + back + "</g></g>";

    // Mid hills, transmission line, large turbines
    var mid = '<path d="M0 382 C 220 332, 420 362, 640 332 C 860 302, 1040 352, 1240 322 C 1400 300, 1520 332, 1600 322 V520 H0 Z" fill="url(#hz-mid-g)"/>';
    mid += pylon(500, 348, 78) + pylon(1040, 338, 78);
    mid += '<path d="M484 282 Q 770 314 1024 272 M516 282 Q 790 318 1056 272" stroke="rgba(12,23,18,.35)" stroke-width=".9" fill="none"/>';
    mid += turbine(300, 358, 160, 6.5, "#ffffff", "rgba(12,23,18,.28)");
    mid += turbine(1478, 324, 140, 5.6, "#ffffff", "rgba(12,23,18,.28)");
    out += '<g class="px-mid"><g class="hz-mid">' + mid + "</g></g>";

    // Foreground
    var fr = '<path d="M0 438 C 300 418, 600 430, 900 424 C 1200 418, 1400 440, 1600 430 V520 H0 Z" fill="url(#hz-front-g)"/>';
    // Solar farm (hybrid with the turbine behind it)
    for (var r = 0; r < 4; r++) {
      var y = 430 + r * 22, h = 12 + r * 2.5, w = 34 + r * 5, lean = 6 + r, x0 = 60 - r * 18, x1 = 540 + r * 6;
      fr += '<rect x="' + x0 + '" y="' + y + '" width="' + (x1 - x0) + '" height="3" fill="rgba(0,0,0,.12)"/>';
      for (var x = x0; x + w <= x1; x += w + 6) fr += panel(x, y, w, h, lean);
    }
    fr += '<path class="hz-flow" d="M548 470 C 556 470, 556 448, 562 444 M646 440 H660"/>';
    // Battery storage
    var bess = '<rect x="562" y="410" width="84" height="38" rx="3" fill="#eef2ec" stroke="' + INK + '" stroke-width="1.4"/><path d="M562 416 H646" stroke="rgba(12,23,18,.2)"/>';
    for (var c = 0; c < 4; c++) {
      bess += '<rect x="' + (570 + c * 19) + '" y="419" width="13" height="24" rx="1.5" fill="#d3dbcf"/>' +
        '<rect class="hz-level" style="--d:' + -c * 0.6 + 's" x="' + (570 + c * 19) + '" y="419" width="13" height="24" rx="1.5" fill="#9cc23f"/>';
    }
    fr += '<g class="hz-build">' + bess + "</g>";
    // Factory with sawtooth roof (C&I rooftop solar)
    var fac = '<rect x="660" y="360" width="300" height="88" fill="#f4f6f2" stroke="' + INK + '" stroke-width="1.4"/>';
    var saw = "M660 360";
    for (var k = 0; k < 5; k++) saw += " L" + (660 + k * 60) + " 328 L" + (720 + k * 60) + " 360";
    fac += '<path d="' + saw + ' Z" fill="#e6ece4" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>';
    for (k = 0; k < 5; k++) {
      var b = 660 + k * 60;
      fac += '<g class="hz-pv"><polygon points="' + [b + 3.6, 329.9, b + 56.4, 358.1, b + 59.7, 351.9, b + 6.9, 323.7].join(" ") + '" fill="#1f3b4a" stroke="' + INK + '" stroke-width=".8"/>' +
        '<path d="M' + (b + 21.2) + " 339.3 L" + (b + 24.5) + " 333.1 M" + (b + 38.8) + " 348.7 L" + (b + 42.1) + ' 342.5" stroke="rgba(255,255,255,.35)" stroke-width=".7"/></g>';
    }
    for (k = 0; k < 7; k++) fac += '<rect x="' + (676 + k * 38) + '" y="380" width="24" height="16" fill="#cfe0d5"/>';
    fac += '<rect x="790" y="410" width="40" height="38" fill="#dfe7dc" stroke="' + INK + '" stroke-width="1.2"/><path d="M790 420 H830 M790 430 H830 M790 440 H830" stroke="rgba(12,23,18,.2)"/>';
    fac += '<rect x="960" y="384" width="120" height="64" fill="#eef2ec" stroke="' + INK + '" stroke-width="1.4"/>';
    fac += panel(968, 383, 28, 8, 5) + panel(1004, 383, 28, 8, 5) + panel(1040, 383, 28, 8, 5);
    fac += '<rect x="984" y="414" width="30" height="34" fill="#dfe7dc" stroke="' + INK + '" stroke-width="1.2"/><rect x="1030" y="400" width="34" height="12" fill="#cfe0d5"/>';
    fr += '<g class="hz-build">' + fac + "</g>";
    fr += tree(1100, 448, 15) + tree(1118, 452, 11) + tree(40, 474, 16) + tree(640, 470, 10);
    // Government building (public sector)
    var gov = '<path d="M1188 352 A28 24 0 0 1 1242 352 Z" fill="#eef2ec" stroke="' + INK + '" stroke-width="1.3"/>' +
      '<rect x="1211" y="322" width="8" height="8" fill="#eef2ec" stroke="' + INK + '" stroke-width="1.2"/><path d="M1215 322 V300" stroke="' + INK + '" stroke-width="1.3"/>' +
      '<path class="flag" d="M1215 300 L1233 304 L1215 308 Z" fill="#0b4026"/>' +
      '<polygon points="1138,376 1215,346 1292,376" fill="#f4f6f2" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<rect x="1142" y="376" width="146" height="8" fill="#f4f6f2" stroke="' + INK + '" stroke-width="1.3"/>';
    for (k = 0; k < 6; k++) gov += '<rect x="' + (1150 + k * 24) + '" y="384" width="8" height="48" fill="#f4f6f2" stroke="' + INK + '" stroke-width="1.2"/>';
    gov += '<rect x="1140" y="432" width="150" height="6" fill="#f4f6f2" stroke="' + INK + '" stroke-width="1.2"/><rect x="1132" y="438" width="166" height="8" fill="#f4f6f2" stroke="' + INK + '" stroke-width="1.2"/>';
    fr += '<g class="hz-build">' + gov + "</g>";
    // Reservoir with floating solar
    var res = '<path d="M1316 452 C 1370 438, 1560 436, 1600 444 V 506 C 1540 514, 1380 510, 1316 494 Z" fill="url(#hz-water-g)" stroke="rgba(12,23,18,.25)"/>';
    res += '<path d="M1340 488 q6 -3 12 0 t12 0 M1500 496 q6 -3 12 0 t12 0 M1420 500 q6 -3 12 0 t12 0" stroke="rgba(255,255,255,.75)" fill="none" stroke-width="1.4"/>';
    for (r = 0; r < 2; r++) {
      var fy = 466 + r * 20, fx0 = 1350 - r * 12;
      res += '<g class="bob" style="--d:' + -r * 1.3 + 's"><rect x="' + (fx0 - 4) + '" y="' + fy + '" width="' + (1596 - fx0) + '" height="3" rx="1.5" fill="#eef2ec"/>';
      for (var fx = fx0; fx + 24 <= 1592; fx += 32) res += panel(fx, fy, 24, 7, 4);
      res += "</g>";
    }
    fr += '<g class="hz-build">' + res + "</g>";
    fr += tree(1300, 448, 14) + tree(1320, 454, 10);
    out += '<g class="px-front"><g class="hz-front">' + fr + "</g></g>";

    // Hotspots: each links to its solution page
    var pins = [
      { x: 300, y: 408, label: "Hybrid solar + wind", side: "l", href: "hybrid-solar-wind.html" },
      { x: 604, y: 400, label: "Battery storage", side: "l", href: "battery-storage.html" },
      { x: 812, y: 316, label: "C&I rooftop solar", side: "r", href: "commercial-industrial-solar.html" },
      { x: 1215, y: 290, label: "Public facilities", side: "r", href: "public-infrastructure.html" },
      { x: 1468, y: 458, label: "Floating solar", side: "l", href: "floating-solar.html" }
    ];
    var pinOut = "";
    pins.forEach(function (p) {
      var w = p.label.length * 8.2 + 30;
      var lx = p.side === "r" ? 16 : -16 - w;
      var label = p.label.replace(/&/g, "&amp;");
      pinOut += '<a class="hz-pin" href="' + p.href + '" aria-label="' + label + ': see this solution" transform="translate(' + p.x + " " + p.y + ')"><g class="hz-pin-in">' +
        '<circle r="9" fill="#c4dc66"><animate attributeName="r" values="8;22" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="2.2s" repeatCount="indefinite"/></circle>' +
        '<circle r="7" fill="#c4dc66" stroke="' + INK + '" stroke-width="1.6"/>' +
        '<rect class="lbl" x="' + lx + '" y="-15" width="' + w + '" height="30" rx="15"/>' +
        '<text x="' + (lx + 15) + '" y="5">' + label + "</text></g></a>";
    });
    out += '<g class="hz-pins">' + pinOut + "</g>";
    svg.innerHTML = out;


    // Short, wide area: crop the empty sky at the top (slice). Tall area: keep the
    // full width and let the hero sky show above the landscape (meet). Phones always crop.
    var wide = window.matchMedia("(min-width: 701px)");
    function fitScene() {
      var r = svg.getBoundingClientRect();
      var tall = wide.matches && r.width && r.height / r.width > 520 / 1600;
      svg.setAttribute("preserveAspectRatio", tall ? "xMidYMax meet" : "xMidYMax slice");
    }
    fitScene();
    window.addEventListener("resize", fitScene);

    if (reduced) { svg.pauseAnimations(); return; }
    if (hasGsap) {
      gsap.timeline({ delay: 0.15 })
        .from(".hz-sun", { y: 150, duration: 1.8, ease: "power2.out" }, 0)
        .from(".hz-back", { y: 90, duration: 1.4, ease: "power3.out" }, 0.1)
        .from(".hz-mid", { y: 120, duration: 1.4, ease: "power3.out" }, 0.22)
        .from(".hz-front", { y: 150, duration: 1.4, ease: "power3.out" }, 0.34)
        .from(".hz-build", { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.8)
        .from(".hz-pv", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.35, ease: "back.out(2)", stagger: 0.008 }, 1.1)
        .from(".hz-pin-in", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.5)", stagger: 0.1 }, 2.1);
    }
  })();

  /* ------------------------------------------------------------------
     About: statement word reveal + site plan fill
     ------------------------------------------------------------------ */
  var statement = $("#about-statement");
  var statementWords = [];
  if (statement) {
    var words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = words.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    statementWords = $$(".w", statement);
  }
  function setStatement(p) {
    var n = Math.round(p * statementWords.length);
    statementWords.forEach(function (w, i) { w.classList.toggle("on", i < n); });
  }

  var planPanels = [];
  (function buildPlan() {
    var g = $("#plan-panels");
    if (!g) return;
    var out = "";
    // rooftop: 8 x 8
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var x = 58 + c * 27, y = 64 + r * 26;
        out += '<g class="pp"><rect class="pv" x="' + x + '" y="' + y + '" width="23" height="20"/><path class="pv-lines" d="M' + x + " " + (y + 10) + " h23 M" + (x + 11.5) + " " + y + ' v20"/></g>';
      }
    }
    // land: rows of ground-mount modules
    for (var rr = 0; rr < 11; rr++) {
      for (var cc = 0; cc < 7; cc++) {
        var lx = 326 + cc * 28, ly = 72 + rr * 19;
        out += '<g class="pp"><rect class="pv" x="' + lx + '" y="' + ly + '" width="26" height="12"/><path class="pv-lines" d="M' + (lx + 13) + " " + ly + ' v12"/></g>';
      }
    }
    g.innerHTML = out;
    planPanels = $$(".pp", g);
  })();
  var genBar = $("#gen-bar"), genCount = $("#gen-count");
  var planBefore = $(".plan-lbl-before"), planAfter = $(".plan-lbl-after"), planCables = $(".plan-cables");
  function setPlan(p) {
    var n = Math.round(ramp(p, 0.05, 0.9) * planPanels.length);
    planPanels.forEach(function (el, i) { el.classList.toggle("on", i < n); });
    if (genBar) genBar.style.width = (n / planPanels.length) * 100 + "%";
    if (genCount) genCount.textContent = n;
    if (planBefore) planBefore.style.opacity = 1 - ramp(p, 0.08, 0.25);
    if (planAfter) planAfter.style.opacity = ramp(p, 0.88, 0.96);
    if (planCables) planCables.style.opacity = ramp(p, 0.88, 0.96);
  }

  /* ------------------------------------------------------------------
     Floating solar illustration
     ------------------------------------------------------------------ */
  (function buildFloat() {
    var waves = $("#float-waves"), rows = $("#float-rows");
    if (!waves || !rows) return;
    var w = "";
    [194, 232, 270, 306].forEach(function (y, i) {
      w += '<path class="wave" style="--d:' + (-i * 1.7) + 's" d="M-40 ' + y + " q10 -4 20 0" + new Array(28).join(" t20 0") + '"/>';
    });
    waves.innerHTML = w;
    var defs = [
      { y: 190, x0: 156, n: 9, w: 22, gap: 30 },
      { y: 224, x0: 136, n: 10, w: 26, gap: 32 },
      { y: 262, x0: 120, n: 10, w: 30, gap: 34 }
    ];
    var out = "";
    defs.forEach(function (d, ri) {
      var end = d.x0 + (d.n - 1) * d.gap + d.w;
      out += '<g class="bob" style="--d:' + (-ri * 0.9) + 's">';
      out += '<rect class="f" x="' + (d.x0 - 4) + '" y="' + (d.y + 4) + '" width="' + (end - d.x0 + 8) + '" height="4" rx="2"/>';
      for (var k = 0; k < d.n; k++) {
        var x = d.x0 + k * d.gap;
        out += '<rect class="pv glint" style="--d:' + (k * 0.12 + ri * 0.3).toFixed(2) + 's" width="' + d.w + '" height="' + (d.w * 0.3).toFixed(1) + '" transform="translate(' + x + " " + (d.y + 2) + ') rotate(-16)"/>';
      }
      out += '<path class="m d" d="M' + (end + 4) + " " + (d.y + 8) + " L" + (end + 16) + " " + (d.y + 40) + '"/>';
      out += "</g>";
    });
    rows.innerHTML = out;
  })();

  /* ------------------------------------------------------------------
     Solutions accordion
     ------------------------------------------------------------------ */
  (function solutions() {
    var items = $$("[data-sol]");
    if (!items.length) return;
    var tabs = items.map(function (it) { return $(".sol-tab", it); });
    var current = 0, timer = null, userTook = false, inView = false, hovering = false, hoverTimer = null;
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    var DURATION = 8000;

    function activate(i, focus) {
      current = (i + items.length) % items.length;
      items.forEach(function (it, k) {
        var on = k === current;
        it.classList.toggle("is-active", on);
        it.classList.remove("is-timing");
        tabs[k].setAttribute("aria-selected", on ? "true" : "false");
        tabs[k].setAttribute("tabindex", on ? "-1" : "0");
      });
      if (focus) {
        var link = $(".sol-text h3", items[current]);
        if (link) { link.setAttribute("tabindex", "-1"); link.focus({ preventScroll: true }); }
      }
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (userTook || hovering || !inView || reduced || !desktop.matches) return;
      var it = items[current];
      void it.offsetWidth;
      it.style.setProperty("--sol-time", DURATION + "ms");
      it.classList.add("is-timing");
      timer = setTimeout(function () { activate(current + 1); }, DURATION);
    }
    function stopAuto() {
      userTook = true;
      clearTimeout(timer);
      items.forEach(function (it) { it.classList.remove("is-timing"); });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { stopAuto(); activate(i, true); });
      tab.addEventListener("keydown", function (e) {
        var dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        stopAuto();
        var n = i;
        do { n = (n + dir + items.length) % items.length; } while (n === current && items.length > 1 && n !== i);
        tabs[n].focus();
      });
    });
    // The open card is one big link: a click anywhere on it (outside its own
    // controls) follows its "Learn more" link, page transition included
    items.forEach(function (it) {
      var body = $(".sol-body", it), more = $(".sol-more", it);
      if (!body || !more) return;
      body.addEventListener("click", function (e) {
        if (!it.classList.contains("is-active") || e.target.closest("a, button")) return;
        if (window.getSelection && String(window.getSelection()).length) return; // selecting text
        more.click();
      });
    });
    var list = $(".sol-list");
    list.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "mouse") return;
      hovering = true;
      clearTimeout(timer);
      items[current].classList.remove("is-timing");
    });
    list.addEventListener("pointerleave", function (e) {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      clearTimeout(hoverTimer);
      schedule();
    });
    // Desktop: hovering a collapsed column expands it. A short delay stops the
    // cards flickering open while the cursor sweeps across them.
    items.forEach(function (it, i) {
      it.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse" || !desktop.matches || !canHover.matches) return;
        clearTimeout(hoverTimer);
        if (i !== current) hoverTimer = setTimeout(function () { activate(i); }, 140);
      });
      it.addEventListener("pointerleave", function () { clearTimeout(hoverTimer); });
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) schedule(); else clearTimeout(timer);
      }, { threshold: 0.35 }).observe(list);
    }
    activate(0);
  })();

  /* ------------------------------------------------------------------
     Why: tangle of contractors -> one accountable partner
     ------------------------------------------------------------------ */
  var setWhy = function () {};
  (function buildWhy() {
    var svg = $("#why-diagram");
    if (!svg) return;
    var nodes = [
      { label: "Design consultant", x: 112, y: 60 },
      { label: "Panel supplier", x: 452, y: 66 },
      { label: "Civil contractor", x: 92, y: 220 },
      { label: "Electrical contractor", x: 462, y: 214 },
      { label: "Utility approvals", x: 116, y: 368 },
      { label: "O&M vendor", x: 446, y: 362 }
    ];
    var you = { x: 280, y: 438 }, hub = { x: 280, y: 214 };
    var out = "";

    // tangled "before" lines
    var tangle = '<g class="why-before">';
    var bends = [[60, -120], [-150, 90], [170, -60], [-80, -140], [130, 120], [-170, 40]];
    nodes.forEach(function (n, i) {
      var b = bends[i];
      tangle += '<path class="m d" style="stroke:var(--muted);opacity:.55" d="M' + you.x + " " + you.y + " C " + (you.x + b[0]) + " " + (you.y + b[1] - 120) + ", " + (n.x - b[0]) + " " + (n.y - b[1]) + ", " + n.x + " " + n.y + '"/>';
    });
    [[0, 3], [1, 2], [2, 5], [4, 1], [0, 5], [3, 4], [0, 2], [1, 3]].forEach(function (pair, k) {
      var a = nodes[pair[0]], c = nodes[pair[1]];
      var mx = (a.x + c.x) / 2 + (k % 2 ? 70 : -70), my = (a.y + c.y) / 2 + (k % 3 ? -50 : 60);
      tangle += '<path class="m d" style="stroke:var(--muted);opacity:.4" d="M' + a.x + " " + a.y + " Q " + mx + " " + my + ", " + c.x + " " + c.y + '"/>';
    });
    // friction markers
    tangle += '<g class="why-warn"><circle cx="300" cy="300" r="10" class="f"/><path class="l" d="M300 294 v7 M300 304.5 v.5" style="stroke:#c2412d"/></g>';
    tangle += '<g class="why-warn"><circle cx="210" cy="150" r="10" class="f"/><path class="l" d="M210 144 v6 l4 3" style="stroke:#c2412d"/></g>';
    tangle += '<g class="why-warn"><circle cx="372" cy="250" r="10" class="f"/><text x="372" y="253.5" text-anchor="middle" style="font-size:10px;fill:#c2412d">?</text></g>';
    tangle += "</g>";
    out += tangle;

    // "after" spokes
    var after = '<g class="why-after">';
    nodes.forEach(function (n, i) {
      var len = Math.hypot(n.x - hub.x, n.y - hub.y) + 40;
      after += '<path class="l g why-spoke" pathLength="1" style="stroke-dasharray:1 2;stroke-dashoffset:1" d="M' + hub.x + " " + hub.y + " Q " + ((hub.x + n.x) / 2) + " " + n.y + ", " + n.x + " " + n.y + '"/>';
    });
    after += '<path id="why-link" class="l g why-spoke" pathLength="1" style="stroke-width:2.5;stroke-dasharray:1 2;stroke-dashoffset:1" d="M' + hub.x + " " + (hub.y + 70) + " V" + (you.y - 18) + '"/>';
    after += '<circle r="4" class="gf why-pulse" style="opacity:0"><animateMotion dur="1.8s" repeatCount="indefinite" path="M' + hub.x + " " + (hub.y + 70) + " V" + (you.y - 18) + '"/></circle>';
    after += "</g>";
    out += after;

    // contractor nodes
    nodes.forEach(function (n) {
      var w = n.label.length * 6.6 + 26;
      out += '<g><rect class="f" x="' + (n.x - w / 2) + '" y="' + (n.y - 15) + '" width="' + w + '" height="30" rx="4"/>' +
        '<text x="' + n.x + '" y="' + (n.y + 3.5) + '" text-anchor="middle">' + n.label.replace("&", "&amp;") + "</text></g>";
    });

    // hub (appears)
    out += '<g class="why-hub" style="opacity:0;transform-box:fill-box;transform-origin:center">' +
      '<rect x="' + (hub.x - 62) + '" y="' + (hub.y - 62) + '" width="124" height="124" rx="10" fill="none" stroke="url(#hatch)" stroke-width="9"/>' +
      '<rect class="f" x="' + (hub.x - 52) + '" y="' + (hub.y - 52) + '" width="104" height="104" rx="8"/>' +
      logoMark(hub.x - 26, hub.y - 38, 52, "var(--green)") +
      '<text x="' + hub.x + '" y="' + (hub.y + 40) + '" text-anchor="middle" style="font-size:8px">One team</text>' +
      "</g>";

    // you
    out += '<g><rect x="' + (you.x - 34) + '" y="' + (you.y - 16) + '" width="68" height="32" rx="6" style="fill:var(--ink)"/>' +
      '<text x="' + you.x + '" y="' + (you.y + 4) + '" text-anchor="middle" style="fill:#fff;font-size:10px">You</text></g>';

    svg.innerHTML = out;

    var before = $(".why-before", svg), hubEl = $(".why-hub", svg), spokes = $$(".why-spoke", svg), pulse = $(".why-pulse", svg);
    var pin = $("#why-pin"), dot = $("#ba-dot"), btns = $$(".ba button");
    setWhy = function (p) {
      before.style.opacity = 1 - ramp(p, 0.1, 0.45);
      before.style.transform = "scale(" + (1 - 0.04 * ramp(p, 0.1, 0.45)) + ")";
      before.style.transformOrigin = "280px 230px";
      var h = ramp(p, 0.35, 0.6);
      hubEl.style.opacity = h;
      hubEl.style.transform = "scale(" + (0.7 + 0.3 * h) + ")";
      spokes.forEach(function (s, i) {
        s.style.strokeDashoffset = 1 - ramp(p, 0.5 + i * 0.03, 0.8 + i * 0.025);
      });
      pulse.style.opacity = ramp(p, 0.92, 1);
      if (dot) dot.style.left = p * 100 + "%";
      var isAfter = p > 0.55;
      pin.classList.toggle("is-after", isAfter);
      btns[0].classList.toggle("is-on", !isAfter);
      btns[1].classList.toggle("is-on", isAfter);
    };
    setWhy(0);
  })();

  /* ------------------------------------------------------------------
     Process: progress line + active steps
     ------------------------------------------------------------------ */
  var steps = $$(".step");
  var stepsLine = $(".steps-line i");
  function setSteps(p) {
    if (stepsLine) stepsLine.style.transform = desktop.matches ? "scaleX(" + p + ")" : "scaleY(" + p + ")";
    steps.forEach(function (s, i) { s.classList.toggle("is-on", p >= i / (steps.length - 1) - 0.02); });
  }

  /* ------------------------------------------------------------------
     World map
     ------------------------------------------------------------------ */
  (function buildMap() {
    var svg = $("#world-map");
    if (!svg) return;
    // Land mask derived from Natural Earth 110m land, sampled on a 2.4° grid
    // (lon -168..180, lat 74..-50). Each row: [startCol, length, ...].
    var MAP = {"step":2.4,"lonMin":-168,"latMax":74,"cols":145,"rows":52,"runs":[[19,3,31,1,47,15,93,2,107,10],[19,1,21,6,29,1,31,1,33,7,47,14,92,2,99,25,129,4],[2,11,14,7,23,5,29,4,35,2,39,4,49,11,78,7,96,2,99,42,142,3],[3,33,40,5,48,8,76,12,89,11,101,45],[3,31,35,1,38,1,40,3,49,5,61,3,75,4,80,5,86,59],[1,31,38,2,50,3,73,5,79,59,139,5],[3,5,12,19,38,4,43,1,73,5,82,53,137,2],[4,1,6,1,15,18,39,6,68,2,74,3,79,1,81,47,136,2],[2,1,16,20,37,9,67,3,74,1,79,48,135,3],[17,20,38,9,67,1,69,2,72,57],[17,26,46,1,71,58,130,1],[20,21,42,1,46,3,69,59],[19,24,44,1,70,13,84,6,92,36],[19,22,67,5,75,1,78,4,88,2,92,33,129,1],[19,21,67,4,74,1,77,1,79,12,92,32,129,1],[19,20,67,3,76,1,79,2,82,9,93,27,123,1,128,1],[20,19,70,5,86,34,123,1,126,3],[22,16,67,8,85,36,124,1],[22,15,66,12,79,42],[24,6,36,1,66,25,92,29],[25,5,36,1,64,21,86,5,94,26],[24,1,26,4,64,21,87,8,99,20],[27,3,33,1,38,1,63,23,87,8,100,7,109,6,116,1],[27,4,32,2,40,2,64,22,88,6,101,5,110,5],[29,5,64,23,88,4,101,4,110,5],[32,4,63,28,102,2,111,5,121,1],[35,1,40,1,64,24,91,1,102,2,113,3,121,1],[37,1,39,6,65,27,102,1,111,1,114,1],[38,8,66,25,104,1,112,1,122,1],[38,11,74,16,110,1,112,2,118,2],[38,11,74,15,111,3,117,3],[37,13,74,14,112,2,116,3,120,1],[37,16,75,12,113,2,116,3,120,1,126,3,133,1],[37,19,75,12,114,1,120,2,128,3,133,1],[37,19,76,11,115,3,128,4],[38,18,76,11,120,1,132,1],[38,17,76,11,125,3],[39,15,76,11,90,1,123,4,130,1],[41,13,75,11,89,2,121,7,129,2],[41,13,76,9,89,2,121,11],[41,12,76,9,89,2,118,15],[41,10,77,8,89,1,118,16],[41,9,77,7,118,16],[41,9,77,7,118,16],[41,8,78,5,119,5,125,9],[41,7,78,2,118,2,128,6],[40,7,129,4],[40,6,131,1,143,2],[40,3,131,1,142,2],[40,3,141,2],[39,3,140,2],[39,4],[39,3]]};
    var cell = 6, out = "";
    var lonToX = function (lon) { return ((lon - MAP.lonMin) / MAP.step) * cell + cell / 2; };
    var latToY = function (lat) { return ((MAP.latMax - lat) / MAP.step) * cell + cell / 2; };
    var india = { x: lonToX(79), y: latToY(22) };

    MAP.runs.forEach(function (row, r) {
      for (var k = 0; k < row.length; k += 2) {
        for (var c = row[k]; c < row[k] + row[k + 1]; c++) {
          var x = c * cell + cell / 2, y = r * cell + cell / 2;
          var dist = Math.hypot(x - india.x, y - india.y);
          var near = dist < 42;
          out += '<circle cx="' + x + '" cy="' + y + '" r="' + (near ? 1.9 : 1.6) + '" fill="' + (near ? "var(--lime)" : "rgba(207,224,213,.2)") + '"' + (near ? ' opacity="' + (1 - dist / 60).toFixed(2) + '"' : "") + "/>";
        }
      }
    });

    var targets = [
      { id: "uk", label: "United Kingdom", lon: -1.5, lat: 53, dx: -8, dy: -12, anchor: "end", strong: true },
      { id: "sg", label: "Asia-Pacific", lon: 104, lat: 1.3, dx: 10, dy: 14, anchor: "start", strong: true },
      { id: "au", label: "", lon: 147, lat: -32, strong: true },
      { id: "jp", label: "", lon: 139.7, lat: 35.7, strong: true },
      { id: "af", label: "", lon: 37, lat: -1.3, strong: false },
      { id: "us", label: "Other markets", lon: -77, lat: 39, dx: 0, dy: -14, anchor: "middle", strong: false }
    ];
    targets.forEach(function (t, i) {
      var x = lonToX(t.lon), y = latToY(t.lat);
      var mx = (india.x + x) / 2, my = Math.min(india.y, y) - Math.abs(x - india.x) * 0.28 - 20;
      var d = "M" + india.x.toFixed(1) + " " + india.y.toFixed(1) + " Q " + mx.toFixed(1) + " " + my.toFixed(1) + ", " + x.toFixed(1) + " " + y.toFixed(1);
      out += '<path id="arc-' + t.id + '" class="l map-arc" pathLength="1" d="' + d + '" style="stroke:' + (t.strong ? "var(--lime)" : "rgba(207,224,213,.35)") + ";stroke-dasharray:1 2;stroke-dashoffset:1;transition:stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1) " + (0.3 + i * 0.25) + 's"/>';
      if (t.strong) {
        out += '<circle r="2.6" fill="var(--lime)"><animateMotion dur="3.2s" begin="-' + (i * 0.6) + 's" repeatCount="indefinite"><mpath href="#arc-' + t.id + '"/></animateMotion></circle>';
      }
      out += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="var(--night)" stroke="' + (t.strong ? "var(--lime)" : "rgba(207,224,213,.5)") + '" stroke-width="1.5"/>';
      if (t.label) {
        out += '<text x="' + (x + t.dx) + '" y="' + (y + t.dy) + '" text-anchor="' + t.anchor + '" style="font-size:13px;fill:' + (t.strong ? "#e6efe9" : "var(--night-muted)") + '">' + t.label + "</text>";
      }
    });

    out += '<circle cx="' + india.x + '" cy="' + india.y + '" r="8" fill="none" stroke="var(--lime)"><animate attributeName="r" values="6;22" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="2.2s" repeatCount="indefinite"/></circle>';
    out += '<circle cx="' + india.x + '" cy="' + india.y + '" r="5.5" fill="var(--lime)"/>';
    out += '<text x="' + (india.x - 12) + '" y="' + (india.y + 22) + '" text-anchor="end" style="font-size:13px;fill:var(--lime)">India</text>';
    svg.innerHTML = out;

    var arcs = $$(".map-arc", svg);
    var draw = function () { arcs.forEach(function (a) { a.style.strokeDashoffset = 0; }); };
    if ("IntersectionObserver" in window && !reduced) {
      var mIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { draw(); mIO.disconnect(); }
      }, { threshold: 0.3 });
      mIO.observe(svg);
    } else {
      draw();
    }
  })();

  /* ------------------------------------------------------------------
     Scroll-driven scenes
     ------------------------------------------------------------------ */
  if (hasGsap && !reduced) {
    // Hero parallax: distant layers drift slower than the foreground
    if ($("#hero-scene")) {
      var heroST = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
      gsap.to(".px-sun", { y: 110, ease: "none", scrollTrigger: heroST });
      gsap.to(".px-back", { y: 70, ease: "none", scrollTrigger: heroST });
      gsap.to(".px-mid", { y: 35, ease: "none", scrollTrigger: heroST });
      gsap.to(".hero-sky", { y: 80, ease: "none", scrollTrigger: heroST });
      gsap.to(".hero-copy", { y: -60, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: true } });
    }
    // About statement
    if (statement) {
      ScrollTrigger.create({
        trigger: statement, start: "top 85%", end: "bottom 45%", scrub: true,
        onUpdate: function (st) { setStatement(st.progress); }
      });
    }
    // Site plan
    if (planPanels.length) {
      ScrollTrigger.create({
        trigger: ".about-grid", start: "top 55%", end: "bottom 75%", scrub: true,
        onUpdate: function (st) { setPlan(st.progress); }
      });
    }
    // Ghost word drift
    $$(".ghost-word").forEach(function (el) {
      gsap.fromTo(el, { xPercent: 6 }, { xPercent: -10, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
    // Why diagram (pinned on desktop)
    var whyST = null;
    if ($("#why-pin")) ScrollTrigger.matchMedia({
      "(min-width: 1021px)": function () {
        whyST = ScrollTrigger.create({
          trigger: "#why-pin", start: "top top", end: "+=110%", pin: true, scrub: 0.6,
          onUpdate: function (st) { setWhy(st.progress); }
        });
      },
      "(max-width: 1020px)": function () {
        whyST = ScrollTrigger.create({
          trigger: "#why-diagram", start: "top 70%", end: "bottom 45%", scrub: 0.6,
          onUpdate: function (st) { setWhy(st.progress); }
        });
      }
    });
    $$(".ba button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!whyST) return;
        var target = b.dataset.ba === "1" ? whyST.end - 2 : whyST.start + 1;
        window.scrollTo({ top: target, behavior: "smooth" });
      });
    });
    // Process
    if ($("#steps")) ScrollTrigger.create({
      trigger: "#steps", start: "top 70%", end: "bottom 65%", scrub: 0.4,
      onUpdate: function (st) { setSteps(st.progress); }
    });
    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  } else {
    setStatement(1);
    setPlan(1);
    setSteps(1);
    var whyState = 1;
    setWhy(whyState);
    $$(".ba button").forEach(function (b) {
      b.addEventListener("click", function () { setWhy(b.dataset.ba === "1" ? 1 : 0); });
    });
  }

  /* ------------------------------------------------------------------
     Pause illustrations that are off-screen
     ------------------------------------------------------------------ */
  if ("IntersectionObserver" in window) {
    var pIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target;
        el.classList.toggle("is-paused", !e.isIntersecting);
        if (el.pauseAnimations) {
          if (e.isIntersecting) el.unpauseAnimations(); else el.pauseAnimations();
        }
      });
    }, { rootMargin: "100px" });
    $$("svg.ill, .marquee, #hero-scene").forEach(function (el) { pIO.observe(el); });
  }

  /* ------------------------------------------------------------------
     Enquiry form
     ------------------------------------------------------------------ */
  (function form() {
    var formEl = $("#enquiry-form"), card = $("#form-card");
    if (!formEl) return;
    var rules = {
      name: function (v) { return v ? "" : "Please enter your name."; },
      company: function (v) { return v ? "" : "Please enter your company."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address."; },
      phone: function (v) { return v.replace(/[^\d]/g, "").length >= 7 ? "" : "Please enter a valid phone number."; },
      location: function (v) { return v ? "" : "Please tell us where the project is."; },
      energy: function (v) { return v ? "" : "Please share an approximate energy requirement."; }
    };
    function check(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var msg = rule(input.value.trim());
      var field = input.closest(".field");
      field.classList.toggle("has-error", !!msg);
      $(".err", field).textContent = msg;
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }
    $$("input", formEl).forEach(function (input) {
      input.addEventListener("blur", function () { if (input.value) check(input); });
      input.addEventListener("input", function () { if (input.closest(".has-error")) check(input); });
    });
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (name) {
        var input = formEl.elements[name];
        if (!check(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      var btn = $("button[type=submit]", formEl);
      var errorEl = $("#form-error");
      var setBusy = function (busy) {
        btn.disabled = busy;
        btn.style.opacity = busy ? 0.7 : "";
      };
      setBusy(true);
      if (errorEl) errorEl.hidden = true;
      var endpoint = formEl.getAttribute("data-endpoint");
      var done = function () { card.classList.add("is-sent"); };
      if (endpoint) {
        // URL-encoded body: a "simple" CORS request that Google Apps Script
        // (and services such as Formspree) read without a preflight.
        var body = new URLSearchParams(new FormData(formEl));
        body.append("page", location.href);
        fetch(endpoint, { method: "POST", body: body, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error(r.status);
            return r.json().catch(function () { return { ok: true }; });
          })
          .then(function (res) {
            if (res && res.ok === false) throw new Error(res.error || "rejected");
            done();
          })
          .catch(function () {
            setBusy(false);
            if (errorEl) errorEl.hidden = false;
          });
      } else {
        // No endpoint configured yet: show the confirmation state.
        setTimeout(done, 500);
      }
    });
  })();
})();
