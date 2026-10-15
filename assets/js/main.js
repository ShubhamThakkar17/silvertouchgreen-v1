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

  var S_PATH = "M 467 234 C 330 255, 190 300, 183 396 C 178 470, 300 500, 440 520 C 570 540, 660 575, 664 640 C 668 705, 590 748, 520 770";

  /* ------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------ */
  function logoMark(x, y, w, color, pulse) {
    var h = w * 772 / 836;
    return '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" viewBox="0 0 836 772" style="color:' + color + '">' +
      '<use href="#logo-shape"/>' +
      (pulse ? '<path class="s-pulse" pathLength="100" d="' + S_PATH + '" fill="none" stroke="' + pulse + '" stroke-width="44" stroke-linecap="round"/>' : "") +
      "</svg>";
  }

  function fileTag(x, y, w, h, label, icon, opts) {
    opts = opts || {};
    var fold = 9;
    var d = "M" + x + " " + y + " h" + (w - fold) + " l" + fold + " " + fold + " v" + (h - fold) + " h" + -w + " Z";
    return '<g class="ftag ' + (opts.cls || "") + '">' +
      '<path class="f" d="' + d + '"/>' +
      '<path class="l" d="M' + (x + w - fold) + " " + y + " v" + fold + " h" + fold + '"/>' +
      '<g transform="translate(' + (x + 12) + " " + (y + h / 2 - 10) + ')">' + icon + "</g>" +
      '<text x="' + (x + 40) + '" y="' + (y + h / 2 + 3.5) + '" style="font-size:9.5px;letter-spacing:.06em">' + label + "</text>" +
      "</g>";
  }

  var ICONS = {
    sun: '<circle cx="10" cy="10" r="4" class="yf"/><path class="l y" d="M10 1.5v2.5M10 16v2.5M1.5 10H4M16 10h2.5M4 4l1.8 1.8M14.2 14.2 16 16M4 16l1.8-1.8M14.2 5.8 16 4"/>',
    wind: '<path class="l" d="M10 19.5V9"/><g class="l"><path d="M10 9V1.5M10 9l6.5 3.7M10 9l-6.5 3.7"/><animateTransform attributeName="transform" type="rotate" from="0 10 9" to="360 10 9" dur="3s" repeatCount="indefinite"/></g>',
    battery: '<rect class="l" x="1.5" y="5" width="15" height="10" rx="1.5"/><path class="l" d="M16.5 8.2h2v3.6h-2"/><rect class="gf" x="3.5" y="7" width="11" height="6" rx=".8"><animate attributeName="width" values="2;11;2" dur="4s" repeatCount="indefinite"/></rect>',
    floating: '<rect class="pv" width="13" height="4" transform="translate(3 9) rotate(-15)"/><path class="l w" d="M1 15q2.25-2 4.5 0t4.5 0 4.5 0 4.5 0M1 19q2.25-2 4.5 0t4.5 0 4.5 0 4.5 0"/>',
    factory: '<path class="l" d="M1 19V9l5 3V9l5 3V9l5 3V3h3v16Z"/>',
    office: '<rect class="l" x="4" y="1.5" width="12" height="17.5" rx="1"/><path class="l" d="M7.5 5.5h1M11.5 5.5h1M7.5 9.5h1M11.5 9.5h1M7.5 13.5h1M11.5 13.5h1"/>',
    gov: '<path class="l" d="M1 7.5 10 2.5l9 5ZM3 19.5h14M4 9.5v8M8 9.5v8M12 9.5v8M16 9.5v8"/>',
    utility: '<path class="l" d="M4 3h12v7H4ZM6 10l-2 9.5M14 10l2 9.5M5.2 15h9.6"/><path class="l w" d="M6 7q2-1.5 4 0t4 0"/>'
  };

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
     Counters (digit roll)
     ------------------------------------------------------------------ */
  $$("[data-count]").forEach(function (el) {
    var value = String(el.getAttribute("data-count"));
    el.textContent = "";
    value.split("").forEach(function (ch) {
      var digit = document.createElement("span");
      digit.className = "digit";
      var col = document.createElement("span");
      for (var n = 0; n < 10; n++) {
        var s = document.createElement("span");
        s.textContent = n;
        col.appendChild(s);
      }
      col.dataset.to = ch;
      digit.appendChild(col);
      el.appendChild(digit);
    });
  });
  function rollCounters(root) {
    $$(".digit > span", root).forEach(function (col, idx) {
      setTimeout(function () { col.style.transform = "translateY(-" + Number(col.dataset.to) * 10 + "%)"; }, idx * 120);
    });
  }
  var statsEl = $(".stats");
  if (statsEl) {
    if ("IntersectionObserver" in window && !reduced) {
      var cIO = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { rollCounters(statsEl); cIO.disconnect(); }
      }, { threshold: 0.4 });
      cIO.observe(statsEl);
    } else {
      rollCounters(statsEl);
    }
  }

  /* ------------------------------------------------------------------
     Hero diagram: sources -> STG -> facilities
     ------------------------------------------------------------------ */
  (function buildHero() {
    var svg = $("#hero-diagram");
    if (!svg) return;
    var W = 178, H = 44, hubX = 340, hubY = 222;
    var left = [
      { label: "Solar PV", icon: ICONS.sun, color: "var(--sun)" },
      { label: "Wind", icon: ICONS.wind, color: "var(--wind)" },
      { label: "Battery storage", icon: ICONS.battery, color: "var(--green)" },
      { label: "Floating solar", icon: ICONS.floating, color: "var(--water)" }
    ];
    var right = [
      { label: "Industrial plant", icon: ICONS.factory },
      { label: "Commercial building", icon: ICONS.office },
      { label: "Government facility", icon: ICONS.gov },
      { label: "Public utility", icon: ICONS.utility }
    ];
    var ys = [72, 172, 272, 372];
    var out = "";

    out += '<text x="0" y="28" class="mut">// Generation &amp; storage</text>';
    out += '<text x="680" y="28" class="mut" text-anchor="end">// Your facility</text>';

    // connectors
    ys.forEach(function (y, i) {
      var ty = hubY + (y - hubY) * 0.28;
      var dl = "M" + W + " " + y + " C 226 " + y + ", 226 " + ty + ", 266 " + ty;
      var dr = "M414 " + ty + " C 454 " + ty + ", 454 " + y + ", 502 " + y;
      out += '<path id="hc-l' + i + '" class="m d" d="' + dl + '"/>';
      out += '<path id="hc-r' + i + '" class="m d" d="' + dr + '"/>';
      out += '<circle r="3.2" fill="' + left[i].color + '"><animateMotion dur="2.6s" begin="-' + i * 0.45 + 's" repeatCount="indefinite"><mpath href="#hc-l' + i + '"/></animateMotion></circle>';
      out += '<circle r="3.2" class="gf"><animateMotion dur="2.6s" begin="-' + (1.3 + i * 0.45) + 's" repeatCount="indefinite"><mpath href="#hc-r' + i + '"/></animateMotion></circle>';
    });

    // tags
    ys.forEach(function (y, i) {
      out += fileTag(0, y - H / 2, W, H, left[i].label, left[i].icon);
      out += fileTag(502, y - H / 2, W, H, right[i].label, right[i].icon);
    });


    // hub
    var x0 = hubX - 66, y0 = hubY - 66;
    out += '<rect x="' + (x0 - 2) + '" y="' + (y0 - 2) + '" width="136" height="136" rx="10" fill="none" stroke="url(#hatch)" stroke-width="10"/>';
    out += '<rect class="f" x="' + (x0 + 8) + '" y="' + (y0 + 8) + '" width="116" height="116" rx="8"/>';
    out += logoMark(hubX - 34, hubY - 34, 68, "var(--ink)", "var(--green)");
    // corner brackets
    var b = 10, bx0 = x0 - 14, by0 = y0 - 14, bx1 = x0 + 146, by1 = y0 + 146;
    out += '<path class="l g" d="M' + bx0 + " " + (by0 + b) + " V" + by0 + " H" + (bx0 + b) +
      " M" + (bx1 - b) + " " + by0 + " H" + bx1 + " V" + (by0 + b) +
      " M" + bx1 + " " + (by1 - b) + " V" + by1 + " H" + (bx1 - b) +
      " M" + (bx0 + b) + " " + by1 + " H" + bx0 + " V" + (by1 - b) + '"/>';
    out += '<g class="spin" style="animation-duration:40s"><circle cx="' + hubX + '" cy="' + hubY + '" r="104" class="m d" /></g>';
    out += '<text x="' + hubX + '" y="' + (by0 - 12) + '" text-anchor="middle">Silver Touch Green RE</text>';
    out += '<text x="' + hubX + '" y="' + (by1 + 22) + '" text-anchor="middle" class="mut">// Engineered &middot; Installed &middot; Commissioned</text>';
    svg.innerHTML = out;
  })();

  /* ------------------------------------------------------------------
     Hero dot field (canvas): a gently undulating solar field
     ------------------------------------------------------------------ */
  (function heroField() {
    var canvas = $(".hero-field");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, running = true, t = 0, raf;

    function size() {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var rows = 26, cols = 46, horizon = H * 0.02, spacing = 34;
      for (var i = 0; i < rows; i++) {
        var z = 1 + i * 0.42;
        var baseY = horizon + (H * 1.05 - horizon) / z;
        for (var j = -cols; j <= cols; j++) {
          var wave = Math.sin(j * 0.32 + t) * Math.cos(i * 0.45 + t * 0.7) * 10;
          var px = W / 2 + (j * spacing) / z;
          if (px < -4 || px > W + 4) continue;
          var py = baseY + wave / z;
          var a = clamp(0.55 / z, 0, 0.5) * (0.6 + 0.4 * Math.sin(j * 0.32 + t));
          var s = 1.8 / Math.sqrt(z);
          ctx.fillStyle = "rgba(14,159,87," + a.toFixed(3) + ")";
          ctx.fillRect(px - s / 2, py - s / 2, s, s);
        }
      }
    }
    function loop() {
      if (!running) return;
      t += 0.012;
      draw();
      raf = requestAnimationFrame(loop);
    }
    size();
    window.addEventListener("resize", function () { size(); draw(); });
    if (reduced) { draw(); return; }
    loop();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var vis = entries[0].isIntersecting;
        if (vis && !running) { running = true; loop(); }
        if (!vis) { running = false; cancelAnimationFrame(raf); }
      }).observe(canvas);
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
    var current = 0, timer = null, userTook = false, inView = false;
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
      if (userTook || !inView || reduced || !desktop.matches) return;
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
    var list = $(".sol-list");
    list.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { clearTimeout(timer); items[current].classList.remove("is-timing"); } });
    list.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") schedule(); });

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
      logoMark(hub.x - 30, hub.y - 34, 60, "var(--ink)", "var(--green)") +
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
    ScrollTrigger.matchMedia({
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
    ScrollTrigger.create({
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
    $$("svg.ill, .marquee").forEach(function (el) { pIO.observe(el); });
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
      btn.disabled = true;
      btn.style.opacity = 0.7;
      var endpoint = formEl.getAttribute("data-endpoint");
      var done = function () { card.classList.add("is-sent"); };
      if (endpoint) {
        fetch(endpoint, { method: "POST", body: new FormData(formEl), headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
          .catch(function () {
            btn.disabled = false;
            btn.style.opacity = "";
            alert("Sorry, something went wrong sending your enquiry. Please try again.");
          });
      } else {
        // No endpoint configured yet: show the confirmation state.
        setTimeout(done, 500);
      }
    });
  })();
})();
