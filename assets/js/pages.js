/* SilverTouch Green: subpage modules (charts, scroll stories, word reveals, roadmap) */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NS = "http://www.w3.org/2000/svg";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var mobile = window.matchMedia("(max-width: 700px)");

  /* ------------------------------------------------------------------
     Illustrative chart data (relative units, 0 = midnight ... 24 = midnight).
     These are shapes that explain an idea, not measurements from a site.
     ------------------------------------------------------------------ */
  var H = []; for (var h = 0; h <= 24; h++) H.push(h);
  var pts = function (arr) { return arr.map(function (v, i) { return [i, v]; }); };
  var bell = function (peak, from, to) {
    return H.map(function (x) { return [x, x <= from || x >= to ? 0 : Math.round(peak * Math.sin(Math.PI * (x - from) / (to - from)))]; });
  };
  var at = function (series, x) {
    for (var i = 0; i < series.length - 1; i++) {
      var a = series[i], b = series[i + 1];
      if (x >= a[0] && x <= b[0]) return b[0] === a[0] ? b[1] : a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    }
    return series[series.length - 1][1];
  };

  // Battery: peak shaving
  var peakLoad = [34, 33, 32, 32, 33, 36, 45, 58, 68, 74, 80, 86, 90, 94, 96, 95, 90, 82, 72, 62, 52, 44, 39, 36, 34];
  var CAP = 72;
  var peakDischarge = peakLoad.map(function (v) { return Math.max(0, v - CAP); });
  var peakGrid = peakLoad.map(function (v, i) { return (i <= 5 ? v + 14 : 0) || Math.min(v, CAP); });

  // Battery: backup during an outage (grid drops out 11:00 to 14:00)
  var crit = [52, 51, 50, 50, 51, 53, 58, 62, 64, 65, 66, 66, 65, 66, 66, 65, 64, 62, 60, 58, 56, 55, 54, 53, 52];
  var backupGrid = [], backupBatt = [];
  H.forEach(function (x) {
    if (x === 11) { backupGrid.push([10.95, at(pts(crit), 10.95)], [11, 0]); backupBatt.push([10.95, 0], [11, crit[11]]); }
    else if (x === 14) { backupGrid.push([13.95, 0], [14, crit[14]]); backupBatt.push([13.95, at(pts(crit), 13.95)], [14, 0]); }
    else if (x > 11 && x < 14) { backupGrid.push([x, 0]); backupBatt.push([x, crit[x]]); }
    else { backupGrid.push([x, crit[x]]); backupBatt.push([x, 0]); }
  });

  // Battery: solar self-consumption
  var selfLoad = [32, 31, 30, 30, 31, 34, 42, 52, 56, 58, 58, 57, 56, 57, 58, 60, 64, 72, 80, 84, 80, 66, 50, 40, 34];
  var selfSolar = bell(100, 6, 18);
  var selfBatt = H.map(function (x) { return [x, { 18: 34, 19: 44, 20: 46, 21: 40, 22: 30, 23: 10 }[x] || 0]; });
  var selfGrid = H.map(function (x) { return [x, Math.max(0, selfLoad[x] - selfSolar[x][1] - selfBatt[x][1])]; });

  // Public infrastructure: daytime-heavy treatment plant
  var plantLoad = [48, 47, 46, 46, 48, 55, 66, 76, 82, 84, 85, 85, 84, 85, 85, 84, 82, 76, 68, 60, 55, 52, 50, 49, 48];
  var plantSolar = bell(80, 6, 18);
  var plantMet = H.map(function (x) { return [x, Math.min(plantLoad[x], plantSolar[x][1])]; });
  var plantGrid = H.map(function (x) { return [x, plantLoad[x] - plantMet[x][1]]; });

  // Hybrid scenarios
  var HYBRID = {
    calm: { solar: bell(100, 6, 18), wind: pts([22, 20, 18, 18, 16, 14, 12, 10, 10, 12, 14, 16, 18, 18, 16, 14, 14, 16, 20, 24, 26, 26, 24, 22, 22]) },
    windy: { solar: bell(35, 6.5, 17.5), wind: pts([70, 74, 76, 78, 76, 72, 66, 60, 56, 54, 52, 50, 50, 52, 56, 60, 64, 68, 72, 74, 76, 76, 74, 72, 70]) },
    mixed: {
      solar: bell(72, 6, 18).map(function (p) { return [p[0], p[0] === 13 || p[0] === 14 ? Math.round(p[1] * 0.55) : p[1]]; }),
      wind: pts([40, 44, 48, 46, 42, 38, 34, 30, 28, 32, 36, 40, 44, 46, 42, 38, 36, 40, 46, 52, 56, 54, 50, 46, 42])
    }
  };
  Object.keys(HYBRID).forEach(function (k) {
    var s = HYBRID[k];
    s.combined = s.solar.map(function (p, i) { return [p[0], p[1] + s.wind[i][1]]; });
  });

  var C = {
    ref: "var(--series-ref)", grid: "var(--series-grid)", batt: "var(--series-battery)", solar: "var(--series-solar)"
  };

  var CHARTS = {
    "bess-peak": {
      yMax: 100, yTitle: "Share of daily peak load (%)",
      series: [
        { key: "load", label: "Facility load", color: C.ref, dash: "5 4", data: pts(peakLoad) },
        { key: "grid", label: "Grid import with BESS", color: C.grid, data: pts(peakGrid) },
        { key: "batt", label: "Battery discharge", color: C.batt, area: true, data: pts(peakDischarge) }
      ],
      annots: [{ type: "hline", y: CAP, label: "Peak demand cap" }, { type: "band", x0: 0, x1: 5.5, label: "Charges off-peak" }]
    },
    "bess-backup": {
      yMax: 100, yTitle: "Share of daily peak load (%)",
      series: [
        { key: "load", label: "Critical load", color: C.ref, dash: "5 4", data: pts(crit) },
        { key: "grid", label: "Grid supply", color: C.grid, data: backupGrid },
        { key: "batt", label: "Battery output", color: C.batt, area: true, data: backupBatt }
      ],
      annots: [{ type: "band", x0: 11, x1: 14, label: "Grid outage" }, { type: "vline", x: 11, label: "Switchover" }]
    },
    "bess-self": {
      yMax: 100, yTitle: "Share of daily peak (%)",
      series: [
        { key: "load", label: "Facility load", color: C.ref, dash: "5 4", data: pts(selfLoad) },
        { key: "solar", label: "Solar generation", color: C.solar, data: selfSolar },
        { key: "batt", label: "Battery discharge", color: C.batt, area: true, data: selfBatt },
        { key: "grid", label: "Grid import", color: C.grid, data: selfGrid }
      ],
      annots: [{ type: "band", x0: 9, x1: 15, label: "Surplus solar stored" }]
    },
    "public-load": {
      yMax: 100, yTitle: "Share of daily peak (%)",
      series: [
        { key: "load", label: "Plant load", color: C.ref, dash: "5 4", data: pts(plantLoad) },
        { key: "solar", label: "Solar generation", color: C.solar, data: plantSolar },
        { key: "met", label: "Load met by solar", color: C.batt, area: true, data: plantMet },
        { key: "grid", label: "Grid import", color: C.grid, data: plantGrid }
      ],
      annots: [{ type: "band", x0: 7, x1: 18, label: "Treatment shift" }]
    }
  };
  ["calm", "windy", "mixed"].forEach(function (k) {
    CHARTS["hybrid-" + k] = {
      yMax: 125, yTitle: "Relative output",
      series: [
        { key: "combined", label: "Combined output", color: C.ref, dash: "5 4", data: HYBRID[k].combined },
        { key: "solar", label: "Solar", color: C.solar, data: HYBRID[k].solar },
        { key: "wind", label: "Wind", color: C.grid, data: HYBRID[k].wind }
      ],
      annots: []
    };
  });

  /* ------------------------------------------------------------------
     Chart renderer
     ------------------------------------------------------------------ */
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  var hourLabel = function (x) {
    var hh = Math.floor(x), mm = Math.round((x - hh) * 60);
    return (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
  };

  function Chart(host) {
    this.host = host;
    this.svg = el("svg", { role: "img" }, host);
    this.size();
    this.tip = document.createElement("div");
    this.tip.className = "chart-tip";
    host.appendChild(this.tip);
    this.table = document.createElement("table");
    this.table.className = "sr-only";
    host.appendChild(this.table);
    this.legend = host.parentElement.querySelector(".legend");
    this.cfg = null;
    this.bindHover();
  }
  // Draw at the real pixel width so labels stay at their true size
  Chart.prototype.size = function () {
    var w = Math.max(300, Math.round(this.host.clientWidth || 720));
    var narrow = w < 560;
    this.W = w;
    this.Hh = Math.round(Math.max(250, Math.min(380, w * 0.42)));
    this.m = { l: 40, r: narrow ? 14 : 150, t: 34, b: 30 };
    this.narrow = narrow;
    this.svg.setAttribute("viewBox", "0 0 " + this.W + " " + this.Hh);
  };
  Chart.prototype.x = function (v) { return this.m.l + (v / 24) * (this.W - this.m.l - this.m.r); };
  Chart.prototype.y = function (v) { return this.Hh - this.m.b - (v / this.cfg.yMax) * (this.Hh - this.m.t - this.m.b); };
  Chart.prototype.linePath = function (data) {
    var self = this;
    return data.map(function (p, i) { return (i ? "L" : "M") + self.x(p[0]).toFixed(1) + " " + self.y(p[1]).toFixed(1); }).join(" ");
  };
  Chart.prototype.areaPath = function (data) {
    var base = this.y(0).toFixed(1);
    return this.linePath(data) + " L" + this.x(data[data.length - 1][0]).toFixed(1) + " " + base + " L" + this.x(data[0][0]).toFixed(1) + " " + base + " Z";
  };
  Chart.prototype.render = function (cfg, animate) {
    var self = this;
    this.cfg = cfg;
    var svg = this.svg;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute("aria-label", "Illustrative chart: " + cfg.series.map(function (s) { return s.label; }).join(", ") + " over a 24-hour day.");

    var grid = el("g", { "class": "grid" }, svg);
    var axis = el("g", { "class": "axis" }, svg);
    var step = cfg.yMax > 100 ? 25 : 25;
    for (var v = 0; v <= cfg.yMax; v += step) {
      el("line", { x1: this.m.l, x2: this.W - this.m.r, y1: this.y(v), y2: this.y(v) }, grid);
      var t = el("text", { x: this.m.l - 8, y: this.y(v) + 4, "text-anchor": "end" }, axis);
      t.textContent = v;
    }
    [0, 6, 12, 18, 24].forEach(function (hh) {
      var t = el("text", { x: self.x(hh), y: self.Hh - 12, "text-anchor": hh === 0 ? "start" : hh === 24 ? "end" : "middle" }, axis);
      t.textContent = (hh < 10 ? "0" : "") + hh + ":00";
    });
    var yt = el("text", { x: this.m.l, y: this.m.t - 6 }, axis);
    yt.textContent = cfg.yTitle;

    // annotations (behind data)
    var an = el("g", { "class": "annot" }, svg);
    (cfg.annots || []).forEach(function (a) {
      if (a.type === "band") {
        el("rect", { x: self.x(a.x0), y: self.m.t, width: self.x(a.x1) - self.x(a.x0), height: self.Hh - self.m.t - self.m.b, rx: 6 }, an);
        var t = el("text", { x: (self.x(a.x0) + self.x(a.x1)) / 2, y: self.m.t + (self.narrow ? 26 : 16), "text-anchor": "middle" }, an);
        t.textContent = a.label;
      } else if (a.type === "hline") {
        el("line", { x1: self.m.l, x2: self.W - self.m.r, y1: self.y(a.y), y2: self.y(a.y) }, an);
        var t2 = el("text", self.narrow ? { x: self.W - self.m.r, y: self.y(a.y) - 6, "text-anchor": "end" } : { x: self.W - self.m.r + 6, y: self.y(a.y) + 4 }, an);
        t2.textContent = a.label;
      } else if (a.type === "vline") {
        el("line", { x1: self.x(a.x), x2: self.x(a.x), y1: self.m.t + 22, y2: self.y(0) }, an);
      }
    });

    // series: areas first, then lines
    this.nodes = {};
    var data = el("g", {}, svg);
    cfg.series.filter(function (s) { return s.area; }).forEach(function (s) {
      self.nodes[s.key] = { area: el("path", { "class": "s-area", d: self.areaPath(s.data), fill: s.color }, data) };
    });
    cfg.series.forEach(function (s) {
      var n = self.nodes[s.key] || (self.nodes[s.key] = {});
      n.line = el("path", { "class": "s-line", d: self.linePath(s.data), stroke: s.color }, data);
      if (s.dash) n.line.setAttribute("stroke-dasharray", s.dash);
    });

    // direct labels at the right edge, nudged apart so they never collide
    // (on narrow screens the legend above the chart carries identity instead)
    var labels = this.narrow ? [] : cfg.series.map(function (s) {
      var last = s.data[s.data.length - 1][1];
      if (s.area) { // label an area at its peak instead of its (zero) end
        var peak = s.data.reduce(function (m, p) { return p[1] > m[1] ? p : m; }, s.data[0]);
        var tall = self.y(0) - self.y(peak[1]) > 48; // inside the fill when there is room, else above it
        return { s: s, x: self.x(peak[0]), y: tall ? self.y(peak[1] / 2) + 4 : self.y(peak[1]) - 10, anchor: "middle", free: true };
      }
      return { s: s, x: self.W - self.m.r + 8, y: self.y(last) + 4, anchor: "start" };
    });
    var right = labels.filter(function (l) { return !l.free; }).sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < right.length; i++) if (right[i].y - right[i - 1].y < 15) right[i].y = right[i - 1].y + 15;
    labels.forEach(function (l) {
      var t = el("text", { "class": "s-label", x: l.x, y: l.y, "text-anchor": l.anchor }, svg);
      t.textContent = l.s.label;
      self.nodes[l.s.key].label = t;
    });

    // hover layer
    this.xhair = el("line", { "class": "xhair", y1: this.m.t, y2: this.y(0) }, svg);
    this.dots = cfg.series.map(function (s) { return el("circle", { "class": "xdot", r: 4.5, fill: s.color }, svg); });
    this.hit = el("rect", { x: this.m.l, y: this.m.t, width: this.W - this.m.l - this.m.r, height: this.Hh - this.m.t - this.m.b, fill: "transparent" }, svg);

    this.renderLegend();
    this.renderTable();
    if (animate) this.animateIn();
  };
  Chart.prototype.renderLegend = function () {
    if (!this.legend) return;
    this.legend.innerHTML = this.cfg.series.map(function (s) {
      return '<span><i class="' + (s.area ? "area" : s.dash ? "dash" : "") + '" style="--c:' + s.color + '"></i>' + s.label + "</span>";
    }).join("");
  };
  Chart.prototype.renderTable = function () {
    var cfg = this.cfg;
    var rows = [0, 3, 6, 9, 12, 15, 18, 21].map(function (hh) {
      return "<tr><th scope=\"row\">" + hourLabel(hh) + "</th>" + cfg.series.map(function (s) { return "<td>" + Math.round(at(s.data, hh)) + "</td>"; }).join("") + "</tr>";
    }).join("");
    this.table.innerHTML = "<caption>Illustrative values, " + cfg.yTitle + "</caption><thead><tr><th scope=\"col\">Time</th>" +
      cfg.series.map(function (s) { return "<th scope=\"col\">" + s.label + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + "</tbody>";
  };
  Chart.prototype.animateIn = function () {
    if (reduced) return;
    var self = this;
    Object.keys(this.nodes).forEach(function (k, idx) {
      var n = self.nodes[k];
      if (n.line) {
        var len = n.line.getTotalLength();
        var dash = n.line.getAttribute("stroke-dasharray");
        n.line.style.strokeDasharray = len + " " + len;
        n.line.style.strokeDashoffset = len;
        n.line.getBoundingClientRect();
        n.line.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1) " + idx * 0.15 + "s";
        n.line.style.strokeDashoffset = 0;
        setTimeout(function () { n.line.style.transition = ""; n.line.style.strokeDasharray = dash || ""; n.line.style.strokeDashoffset = ""; }, 1500 + idx * 150);
      }
      if (n.area) {
        n.area.style.opacity = 0;
        n.area.style.transition = "opacity .9s ease " + (0.5 + idx * 0.1) + "s";
        n.area.getBoundingClientRect();
        n.area.style.opacity = "";
      }
      if (n.label) {
        n.label.style.opacity = 0;
        n.label.style.transition = "opacity .6s ease " + (0.9 + idx * 0.12) + "s";
        n.label.getBoundingClientRect();
        n.label.style.opacity = "";
      }
    });
  };
  // Smoothly morph to a config with the same series keys
  Chart.prototype.morph = function (cfg) {
    var self = this, from = this.cfg;
    if (reduced || !from) { this.render(cfg, false); return; }
    var t0 = performance.now(), dur = 700;
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    this.cfg = cfg;
    this.renderLegend();
    this.renderTable();
    (function frame(now) {
      var t = ease(Math.min(1, (now - t0) / dur));
      cfg.series.forEach(function (s, si) {
        var a = from.series[si].data;
        var mixed = s.data.map(function (p) { var v0 = at(a, p[0]); return [p[0], v0 + (p[1] - v0) * t]; }); // by x: point counts can differ
        var n = self.nodes[s.key];
        if (n.line) n.line.setAttribute("d", self.linePath(mixed));
        if (n.area) n.area.setAttribute("d", self.areaPath(mixed));
        if (n && n.label && !s.area) n.label.setAttribute("y", self.y(mixed[mixed.length - 1][1]) + 4);
      });
      if (t < 1) requestAnimationFrame(frame);
      else self.render(cfg, false);
    })(t0);
  };
  Chart.prototype.bindHover = function () {
    var self = this;
    var move = function (e) {
      if (!self.cfg) return;
      var r = self.svg.getBoundingClientRect();
      var sx = (e.clientX - r.left) * (self.W / r.width);
      var xv = Math.max(0, Math.min(24, ((sx - self.m.l) / (self.W - self.m.l - self.m.r)) * 24));
      xv = Math.round(xv * 2) / 2;
      var px = self.x(xv);
      self.xhair.setAttribute("x1", px); self.xhair.setAttribute("x2", px);
      var rows = self.cfg.series.map(function (s, i) {
        var v = at(s.data, xv);
        self.dots[i].setAttribute("cx", px); self.dots[i].setAttribute("cy", self.y(v));
        return '<div style="--c:' + s.color + '"><span>' + s.label + "</span><span>" + Math.round(v) + "</span></div>";
      }).join("");
      self.tip.innerHTML = "<b>" + hourLabel(xv) + "</b>" + rows;
      var scale = r.width / self.W || 1;
      var left = px * scale, top = self.m.t * scale + 4;
      var tw = self.tip.offsetWidth;
      left = Math.max(tw / 2, Math.min(r.width - tw / 2, left));
      self.tip.style.left = left + "px";
      self.tip.style.top = top + "px";
      self.tip.style.transform = "translate(-50%, 0)";
      self.host.classList.add("is-hover");
    };
    this.host.addEventListener("pointermove", move);
    this.host.addEventListener("pointerdown", move);
    this.host.addEventListener("pointerleave", function () { self.host.classList.remove("is-hover"); });
  };

  // Mount every [data-chart] host; [data-chart-switch] buttons swap configs
  $$("[data-chart]").forEach(function (host) {
    var chart = new Chart(host);
    var first = host.getAttribute("data-chart");
    var shown = false;
    var show = function () { if (!shown) { shown = true; chart.render(CHARTS[first], true); } };
    chart.render(CHARTS[first], false);
    if ("ResizeObserver" in window) {
      var lastW = host.clientWidth;
      new ResizeObserver(function () {
        if (Math.abs(host.clientWidth - lastW) < 8) return;
        lastW = host.clientWidth;
        chart.size();
        chart.render(chart.cfg, false);
      }).observe(host);
    }
    if ("IntersectionObserver" in window && !reduced) {
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { chart.render(CHARTS[first], true); shown = true; io.disconnect(); } }, { threshold: 0.35 });
      io.observe(host);
    } else show();

    var card = host.closest(".chart-card");
    var buttons = card ? $$("[data-chart-switch]", card) : [];
    var descs = card ? $$("[data-chart-desc]", card) : [];
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var key = b.getAttribute("data-chart-switch");
        buttons.forEach(function (o) { o.setAttribute("aria-selected", o === b ? "true" : "false"); });
        descs.forEach(function (d) { d.hidden = d.getAttribute("data-chart-desc") !== key; });
        var same = chart.cfg && CHARTS[key].series.map(function (s) { return s.key; }).join() === chart.cfg.series.map(function (s) { return s.key; }).join();
        if (same) chart.morph(CHARTS[key]); else chart.render(CHARTS[key], true);
      });
    });
  });

  /* ------------------------------------------------------------------
     Scroll stories: the stage builds up one layer per step
     ------------------------------------------------------------------ */
  $$("[data-story]").forEach(function (story) {
    var steps = $$(".story-step", story);
    var layers = $$("[data-layer]", story);
    var bar = $(".stage-bar i", story);
    var label = $("[data-stage-label]", story);
    var count = $("[data-stage-count]", story);
    var current = -1;
    function set(i) {
      if (i === current) return;
      current = i;
      steps.forEach(function (s, k) { s.classList.toggle("is-on", k === i); });
      layers.forEach(function (l) {
        var k = Number(l.getAttribute("data-layer"));
        l.classList.toggle("on", k <= i);
      });
      if (bar) bar.style.width = ((i + 1) / steps.length) * 100 + "%";
      if (label && steps[i]) label.textContent = $("h3", steps[i]).textContent;
      if (count) count.textContent = (i + 1 < 10 ? "0" : "") + (i + 1) + " / " + (steps.length < 10 ? "0" : "") + steps.length;
    }
    if (!("IntersectionObserver" in window) || reduced) { set(steps.length - 1); return; }
    set(0);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) set(steps.indexOf(e.target));
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { io.observe(s); });
  });

  /* ------------------------------------------------------------------
     Word-by-word reveal for big statements
     ------------------------------------------------------------------ */
  $$("[data-words]").forEach(function (node) {
    var words = node.textContent.trim().split(/\s+/);
    node.innerHTML = words.map(function (w) { return '<span class="w">' + w.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</span>"; }).join(" ");
    var spans = $$(".w", node);
    var set = function (p) { var n = Math.round(p * spans.length); spans.forEach(function (s, i) { s.classList.toggle("on", i < n); }); };
    if (hasGsap && !reduced) {
      ScrollTrigger.create({ trigger: node, start: "top 85%", end: "bottom 50%", scrub: true, onUpdate: function (st) { set(st.progress); } });
    } else set(1);
  });

  /* ------------------------------------------------------------------
     Roadmap line draws as you scroll
     ------------------------------------------------------------------ */
  $$(".roadmap").forEach(function (rm) {
    var fill = $(".roadmap-fill", rm);
    if (!fill) return;
    var set = function (p) { fill.style.transform = mobile.matches ? "scaleY(" + p + ")" : "scaleX(" + p + ")"; };
    if (hasGsap && !reduced) {
      ScrollTrigger.create({ trigger: rm, start: "top 80%", end: "bottom 55%", scrub: 0.4, onUpdate: function (st) { set(st.progress); } });
    } else set(1);
  });

  if (hasGsap) window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
