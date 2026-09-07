/* Rotating hero headline for kubernetes.kylelaw.dev.
   Phrases are [prefix, underlined keyword, suffix] so the line lands on
   the keyword alone — "with Weekly meeting" underlines Weekly only. */
(function () {
  "use strict";

  var PHRASES = [
    ["for ",  "Free",            ""],
    ["with ", "Active Learning", ""],
    ["with ", "Visualization",   ""],
    ["with ", "Live Q&A",        ""],
    ["with ", "Weekly",          " meeting"],
    ["with ", "Kyle",            ""]
  ];

  var HOLD = 2600;

  var el = document.querySelector("[data-rot]");
  if (!el) return;

  function plain(p) { return p[0] + p[1] + p[2]; }

  // Screen readers get one static sentence rather than every swap.
  var title = el.closest(".hero-title");
  if (title) title.setAttribute("aria-label", "Learn Kubernetes — " + PHRASES.map(plain).join(", "));
  el.setAttribute("aria-hidden", "true");

  function measure(text) {
    var probe = document.createElement("span");
    probe.textContent = text;
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;";
    el.appendChild(probe);
    var w = probe.getBoundingClientRect().width;
    probe.remove();
    return w;
  }

  function setWidth(p) {
    var cs = getComputedStyle(el);
    var pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    el.style.width = (measure(plain(p)) + pad) + "px";
  }

  function makeWord(p) {
    var w = document.createElement("span");
    w.className = "word";
    if (p[0]) w.appendChild(document.createTextNode(p[0]));
    var kw = document.createElement("span");
    kw.className = "kw";
    kw.textContent = p[1];
    w.appendChild(kw);
    if (p[2]) w.appendChild(document.createTextNode(p[2]));
    return w;
  }

  var i = 0;
  el.textContent = "";                    // drop the no-JS first phrase
  var current = makeWord(PHRASES[0]);
  current.classList.add("is-current", "enter");
  el.appendChild(current);
  setWidth(PHRASES[0]);

  function next() {
    i = (i + 1) % PHRASES.length;

    var incoming = makeWord(PHRASES[i]);
    incoming.classList.add("from");
    el.appendChild(incoming);
    setWidth(PHRASES[i]);

    var outgoing = current;
    void incoming.offsetWidth;            // flush so the enter transition runs

    outgoing.classList.remove("is-current", "enter");
    outgoing.classList.add("exit");
    incoming.classList.remove("from");
    incoming.classList.add("is-current", "enter");

    current = incoming;
    setTimeout(function () { outgoing.remove(); }, 700);
  }

  var timer = setInterval(next, HOLD);

  // Don't animate in a background tab, and re-measure if the font loads
  // late or the window is resized.
  document.addEventListener("visibilitychange", function () {
    clearInterval(timer);
    if (!document.hidden) timer = setInterval(next, HOLD);
  });

  window.addEventListener("resize", function () { setWidth(PHRASES[i]); });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { setWidth(PHRASES[i]); });
  }
})();
