/* 星脈智能 NOVA SYNAPSE — interactions */
(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  // ---- Reveal on scroll ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  var reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) { io.observe(el); });
  // Failsafe: never leave content hidden if the observer doesn't fire
  // (e.g. observer unsupported, or tab restored from a frozen background state).
  function revealAll() { reveals.forEach(function (el) { el.classList.add("in"); }); }
  setTimeout(revealAll, 1600);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) revealAll();
  });

  // ---- Contact form (no backend; graceful UX) ----
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var note = document.getElementById("form-note");
      if (note) {
        note.textContent = "感謝您的來訊!我們已收到需求,團隊將於一個工作天內與您聯繫。";
        note.style.display = "block";
      }
      form.reset();
    });
  }

  // ---- Neon particle network background ----
  var canvas = document.getElementById("bg-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var w, h, pts, dpr;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    var n = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        vy: (Math.random() - 0.5) * 0.25 * dpr,
        c: Math.random() > 0.5 ? "45,226,230" : "246,55,236"
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    var max = 140 * dpr;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
        if (d < max) {
          ctx.strokeStyle = "rgba(123,140,210," + (0.16 * (1 - d / max)) + ")";
          ctx.lineWidth = dpr;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(" + p.c + ",0.85)";
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.4 * dpr, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  size();
  draw();
  var t;
  addEventListener("resize", function () { clearTimeout(t); t = setTimeout(size, 200); });
})();
