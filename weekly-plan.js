/* Weekly Meeting spotlight for kubernetes.kylelaw.dev.
   Picks "this week" from the real calendar date rather than a hand-edited
   pointer, and loops silently back to the first topic once it runs past
   the last one -- the page never states a week count or an end. */
(function () {
  "use strict";

  var dataEl = document.getElementById("weekly-plan-data");
  var spot = document.getElementById("week-spotlight");
  if (!dataEl || !spot) return;

  var WEEKS;
  try {
    WEEKS = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }
  if (!WEEKS || !WEEKS.length) return;

  // Anchor: the Monday this rotation began (2026-09-07). Advances by one
  // topic every real week from here on, forever.
  var EPOCH = Date.UTC(2026, 8, 7);
  var WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  var elapsed = Math.floor((Date.now() - EPOCH) / WEEK_MS);
  var i = ((elapsed % WEEKS.length) + WEEKS.length) % WEEKS.length;

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function chips(labs) {
    return labs
      .map(function (l) {
        return (
          '<a class="chip" href="https://killercoda.com/kylelaw/scenario/' +
          esc(l.leaf) + '">' + esc(l.title) +
          '<span class="st">' + l.steps + "</span></a>"
        );
      })
      .join("");
  }

  function labWord(n) {
    return n + " lab" + (n === 1 ? "" : "s");
  }

  var cur = WEEKS[i];
  spot.innerHTML =
    '<span class="spot-kicker">This week</span>' +
    '<h3 class="spot-title">' + esc(cur.title) + "</h3>" +
    '<div class="chips">' + chips(cur.labs) + "</div>" +
    '<p class="spot-meta">Live walkthrough, then we work the labs together. ' +
    '<span class="tbc">day &amp; time TBC</span></p>';

  var upnext = document.getElementById("week-upnext");
  if (upnext) {
    var rows = "";
    for (var n = 1; n <= 3; n++) {
      var w = WEEKS[(i + n) % WEEKS.length];
      rows +=
        '<div class="up-row"><span class="up-t">' + esc(w.title) + "</span>" +
        '<span class="up-n">' + labWord(w.labs.length) + "</span></div>";
    }
    upnext.innerHTML = rows;
  }
})();
