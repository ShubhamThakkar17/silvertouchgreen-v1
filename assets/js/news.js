/* Silver Touch Green RE: Watt's Up (news & PR)
   Motion graphics for each story (data-vis), filter chips, count-up stats.
   Every visual is decorative (aria-hidden); the story text is in the HTML. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cards = $$(".wu-vis");
  if (!cards.length) return;

  var GJ = window.STG_GJ || "";

  var fit = "slice";
  function wrap(inner, extra) {
    return '<svg class="wu-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid ' + fit + '"' + (extra || "") + ">" + inner + "</svg>";
  }
  function sparkles(n, seed) {
    var s = "", r = seed || 7;
    for (var i = 0; i < n; i++) {
      r = (r * 9301 + 49297) % 233280;
      var x = 12 + (r / 233280) * 296;
      r = (r * 9301 + 49297) % 233280;
      var y = 10 + (r / 233280) * 70;
      s += '<path class="wu-spark" style="--d:' + (-i * 0.37).toFixed(2) + 's" d="M' + x.toFixed(1) + " " + (y - 4).toFixed(1) + "v8M" + (x - 4).toFixed(1) + " " + y.toFixed(1) + 'h8"/>';
    }
    return s;
  }
  function container(x, y, w, h, i) {
    var o = '<rect class="wu-ctr" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3"/>';
    var cells = 4, cw = (w - 12) / cells;
    for (var c = 0; c < cells; c++) {
      o += '<rect class="wu-cellbg" x="' + (x + 6 + c * cw + 1) + '" y="' + (y + 6) + '" width="' + (cw - 2) + '" height="' + (h - 12) + '" rx="1.5"/>' +
        '<rect class="wu-cell" style="--d:' + (-(i * 0.5 + c * 0.15)).toFixed(2) + 's" x="' + (x + 6 + c * cw + 1) + '" y="' + (y + 6) + '" width="' + (cw - 2) + '" height="' + (h - 12) + '" rx="1.5"/>';
    }
    return o;
  }
  function panelRow(x, y, n, w, gap, cls) {
    var o = "";
    for (var i = 0; i < n; i++) o += '<path class="wu-pv ' + (cls || "") + '" style="--d:' + (-i * 0.2).toFixed(2) + 's" d="M' + (x + i * (w + gap)) + " " + y + " l" + w + " 0 l4 -9 l-" + w + ' 0 Z"/>';
    return o;
  }
  function turbine(x, base, h, dur) {
    var hub = base - h, L = h * 0.48;
    return '<path class="wu-tower" d="M' + (x - 2.5) + " " + base + " L" + (x - 1) + " " + hub + " L" + (x + 1) + " " + hub + " L" + (x + 2.5) + " " + base + ' Z"/>' +
      '<g class="wu-rotor" style="transform-origin:' + x + "px " + hub + "px;animation-duration:" + dur + 's">' +
      [0, 120, 240].map(function (a) { return '<path class="wu-blade" transform="rotate(' + a + " " + x + " " + hub + ')" d="M' + x + " " + hub + " q4 -" + (L * 0.4) + " 0 -" + L + " q-2 " + (L * 0.5) + ' 0 ' + L + 'Z"/>'; }).join("") +
      '</g><circle class="wu-hub" cx="' + x + '" cy="' + hub + '" r="2.6"/>';
  }

  var VIS = {
    hero: function () {
      var o = '<defs><radialGradient id="wu-hg"><stop offset="0" stop-color="#ffb100" stop-opacity=".55"/><stop offset="1" stop-color="#ffb100" stop-opacity="0"/></radialGradient></defs>';
      o += '<circle cx="160" cy="92" r="90" fill="url(#wu-hg)" class="wu-breathe"/>';
      o += '<g class="wu-orbit"><circle class="wu-ring" cx="160" cy="92" r="70"/>' +
        '<g class="wu-orb" style="--a:0deg"><circle cx="230" cy="92" r="13" class="wu-sunc"/></g>' +
        '<g class="wu-orb" style="--a:120deg"><g transform="translate(230 92)"><path class="wu-wave" d="M-12 -2 q3 -4 6 0 t6 0 t6 0 t6 0 M-12 5 q3 -4 6 0 t6 0 t6 0 t6 0"/></g></g>' +
        '<g class="wu-orb" style="--a:240deg"><g transform="translate(230 92)"><path class="wu-boltp" d="M2 -12 -6 2h6l-2 10 8 -14h-6Z"/></g></g></g>';
      o += '<rect class="wu-batt" x="124" y="62" width="72" height="60" rx="8"/><rect class="wu-batt" x="196" y="80" width="7" height="24" rx="2"/>';
      for (var i = 0; i < 4; i++) o += '<rect class="wu-cell" style="--d:' + (-i * 0.25) + 's" x="' + (131 + i * 16) + '" y="70" width="12" height="44" rx="2"/>';
      o += sparkles(9, 3);
      return wrap(o);
    },
    dholera: function () {
      var o = '<g class="wu-gj" transform="translate(18 26) scale(1.18)"><path class="wu-gj-land" d="' + GJ + '"/><path class="wu-gj-line" d="' + GJ + '"/></g>';
      o += '<g transform="translate(117 95)"><circle class="wu-ping" r="6"/><circle class="wu-ping" r="6" style="animation-delay:-1s"/><circle class="wu-pin" r="5"/></g>';
      o += '<path class="wu-arc" d="M122 92 C 160 40, 200 50, 226 86"/>';
      o += '<g class="wu-drop">' + container(214, 92, 84, 44, 0) + '<rect class="wu-stripe" x="214" y="132" width="84" height="4"/></g>';
      o += '<text class="wu-big" x="300" y="40" text-anchor="end">2027</text><text class="wu-small" x="300" y="56" text-anchor="end">DHOLERA &#183; GJ</text>';
      return wrap(o);
    },
    tender: function () {
      var o = '<path class="wu-ground" d="M10 150 H310"/>';
      for (var i = 0; i < 4; i++) o += '<g class="wu-pop" style="--d:' + i * 0.18 + 's">' + container(18 + i * 74, 96, 64, 46, i) + "</g>";
      o += '<g class="wu-doc"><rect x="214" y="16" width="70" height="62" rx="5"/><path d="M224 32h50M224 42h40M224 52h46M224 62h30"/></g>';
      o += '<g class="wu-stampg"><circle cx="270" cy="66" r="15"/><text x="270" y="70" text-anchor="middle">BID</text></g>';
      o += '<text class="wu-big" x="22" y="56">16</text><text class="wu-small" x="70" y="56">GWH</text><text class="wu-small dim" x="22" y="74">RAJASTHAN + GUJARAT</text>';
      return wrap(o);
    },
    colocated: function () {
      var o = '<g class="wu-sky-day"><g class="wu-sunpath"><circle class="wu-sunc" cx="0" cy="0" r="11"/></g></g>';
      o += '<g class="wu-moonpath"><path class="wu-moon" d="M4 -10 A11 11 0 1 0 12 6 A8.5 8.5 0 1 1 4 -10 Z"/></g>';
      o += '<path class="wu-ground" d="M10 150 H310"/>' + panelRow(18, 148, 5, 26, 6);
      o += '<path class="wu-flowp" d="M176 136 H206"/>';
      o += '<rect class="wu-batt" x="208" y="92" width="96" height="56" rx="6"/>';
      o += '<rect class="wu-cellbg" x="216" y="100" width="80" height="40" rx="3"/><rect class="wu-daynight" x="216" y="100" width="80" height="40" rx="3"/>';
      o += '<text class="wu-small" x="304" y="84" text-anchor="end">CHARGE BY DAY &#183; DISCHARGE AT NIGHT</text>';
      return wrap(o);
    },
    policy: function () {
      var o = '<g transform="translate(176 20) scale(1.02)" class="wu-gj-bg"><path d="' + GJ + '"/></g>';
      o += '<g class="wu-paper"><rect x="34" y="20" width="118" height="146" rx="6"/>';
      for (var i = 0; i < 8; i++) o += '<path class="wu-write" style="--d:' + (i * 0.22) + 's" d="M48 ' + (44 + i * 13) + " h" + (60 + ((i * 37) % 30)) + '"/>';
      o += '<text class="wu-small" x="48" y="36">GERC &#183; BESS REGS</text></g>';
      o += '<g class="wu-slam"><g transform="translate(122 128) rotate(-14)"><rect x="-38" y="-16" width="76" height="32" rx="4"/><text x="0" y="5" text-anchor="middle">NOTIFIED</text></g></g>';
      return wrap(o);
    },
    bars: function () {
      var o = '<path class="wu-ground" d="M20 150 H300"/>', vals = [30, 38, 52, 46, 58, 64, 70, 78, 92], pts = [];
      vals.forEach(function (v, i) {
        var x = 30 + i * 30, h = v;
        o += '<rect class="wu-bar" style="--d:' + (i * 0.08) + 's" x="' + x + '" y="' + (150 - h) + '" width="18" height="' + h + '" rx="3"/>';
        pts.push((x + 9) + " " + (150 - h - 8));
      });
      o += '<path class="wu-trend" d="M' + pts.join(" L") + '"/>';
      o += '<text class="wu-big" x="24" y="40">35.2</text><text class="wu-small" x="102" y="40">GW &#183; JAN&#8211;SEP</text>';
      return wrap(o);
    },
    hybrid: function () {
      var o = '<circle class="wu-sunc wu-breathe" cx="62" cy="44" r="16"/>';
      o += '<g class="wu-gusts"><path d="M120 46 q20 -8 40 0 t40 0"/><path d="M140 62 q20 -8 40 0 t40 0" style="animation-delay:-.8s"/><path d="M110 78 q20 -8 40 0 t40 0" style="animation-delay:-1.6s"/></g>';
      o += turbine(236, 150, 104, 3.2) + turbine(286, 150, 78, 2.5);
      o += '<path class="wu-ground" d="M10 150 H310"/>' + panelRow(16, 148, 5, 24, 6);
      o += '<text class="wu-small" x="16" y="172">SUN BY DAY &#183; WIND AFTER DARK</text>';
      return wrap(o);
    },
    openaccess: function () {
      var o = '<path class="wu-ground" d="M10 150 H310"/>' + panelRow(14, 148, 3, 22, 5);
      o += '<path class="wu-pylon" d="M118 150 L126 74 L134 150 M114 92 H138 M120 112 H132 M196 150 L204 74 L212 150 M192 92 H216 M198 112 H210"/>';
      o += '<path class="wu-wire" d="M100 132 Q 114 90, 126 86 Q 165 100, 204 86 Q 232 96, 244 108"/>';
      o += '<path class="wu-flowp" d="M100 132 Q 114 90, 126 86 Q 165 100, 204 86 Q 232 96, 244 108"/>';
      o += '<path class="wu-fac" d="M236 150 V108 l14 -10 v10 l14 -10 v10 l14 -10 v10 h18 V150 Z"/>';
      for (var i = 0; i < 3; i++) o += '<rect class="wu-win" style="--d:' + (i * 0.3) + 's" x="' + (246 + i * 16) + '" y="122" width="9" height="9"/>';
      o += '<text class="wu-big" x="20" y="44">3 GW</text><text class="wu-small" x="20" y="62">OPEN ACCESS &#183; Q2</text>';
      return wrap(o);
    },
    floating: function () {
      var o = '<circle class="wu-sunc wu-breathe" cx="270" cy="38" r="14"/>';
      o += '<rect class="wu-water" x="0" y="112" width="320" height="68"/>';
      o += '<g class="wu-bob">' + panelRow(26, 114, 6, 26, 8, "wu-pv-float") + '<path class="wu-float" d="M24 116 H232"/></g>';
      o += '<g class="wu-waves"><path d="M-40 132 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0"/>' +
        '<path d="M-40 150 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" style="animation-delay:-1.5s"/></g>';
      o += '<rect class="wu-batt" x="250" y="74" width="50" height="34" rx="4"/><rect class="wu-cell" x="256" y="80" width="38" height="22" rx="2"/>';
      o += '<text class="wu-big" x="20" y="44">5 GW</text><text class="wu-small" x="20" y="62">+ 2 HRS STORAGE</text>';
      return wrap(o);
    },
    record: function () {
      var o = '<g class="wu-rays" style="transform-origin:160px 104px">';
      for (var i = 0; i < 16; i++) o += '<path transform="rotate(' + i * 22.5 + ' 160 104)" d="M160 30 V52"/>';
      o += '</g><circle class="wu-sunc" cx="160" cy="104" r="40"/>';
      o += '<text class="wu-num" x="160" y="114" text-anchor="middle" data-to="44.6">44.6</text>';
      o += '<text class="wu-small" x="160" y="168" text-anchor="middle">GW OF SOLAR IN ONE YEAR</text>';
      for (var c = 0; c < 14; c++) o += '<rect class="wu-confetti" style="--x:' + ((c * 47) % 300 - 150) + "px;--d:" + (-c * 0.21).toFixed(2) + 's" x="158" y="100" width="5" height="9" rx="1"/>';
      return wrap(o);
    }
  };

  cards.forEach(function (el) {
    var fn = VIS[el.getAttribute("data-vis")];
    // Big panels with odd proportions show the whole drawing instead of cropping it
    fit = el.closest(".wu-card--featured") || el.classList.contains("wu-vis--hero") ? "meet" : "slice";
    if (fn) el.innerHTML = fn();
  });

  // Pause each visual while it is off-screen
  var svgs = $$(".wu-svg");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target.closest(".wu-vis");
        if (v) v.classList.toggle("is-off", !e.isIntersecting);
        if (e.isIntersecting && !reduced) countUp(e.target);
      });
    }, { rootMargin: "60px" });
    svgs.forEach(function (s) { io.observe(s); });
  }

  // Big numbers count up the first time they appear
  function countUp(svg) {
    var t = $(".wu-num", svg);
    if (!t || t.dataset.done) return;
    t.dataset.done = "1";
    var to = parseFloat(t.getAttribute("data-to")), start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / 1400), e = 1 - Math.pow(1 - p, 3);
      t.textContent = (to * e).toFixed(1);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Filters
  var chips = $$(".wu-chip");
  var grid = $("#wu-grid");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      $$(".wu-card", grid).forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-tag") === f;
        card.hidden = !show;
        if (show && !reduced) { card.classList.remove("wu-in"); void card.offsetWidth; card.classList.add("wu-in"); }
      });
    });
  });
})();
