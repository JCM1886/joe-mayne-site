// Joe Mayne site — small vanilla-JS helpers. No build step, no
// dependencies. Safe to open in any browser as-is.

document.addEventListener("DOMContentLoaded", function () {
  // ---- mobile nav toggle ----
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // ---- quote carousel (home) ----
  var carousel = document.getElementById("quoteCarousel");
  if (carousel) {
    var items = Array.prototype.slice.call(carousel.querySelectorAll(".quote-carousel__item"));
    var dotsWrap = document.getElementById("quoteDots");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = items.findIndex(function (el) { return el.classList.contains("is-active"); });
    if (current === -1) current = 0;
    var timer = null;

    if (items.length > 1 && dotsWrap) {
      items.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show quote " + (i + 1));
        if (i === current) dot.classList.add("is-active");
        dot.addEventListener("click", function () {
          show(i);
          restart();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function show(index) {
      items[current].classList.remove("is-active");
      if (dotsWrap && dotsWrap.children[current]) dotsWrap.children[current].classList.remove("is-active");
      current = index;
      items[current].classList.add("is-active");
      if (dotsWrap && dotsWrap.children[current]) dotsWrap.children[current].classList.add("is-active");
    }

    function next() { show((current + 1) % items.length); }
    function start() { if (items.length > 1 && !reduceMotion) timer = setInterval(next, 6000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    start();
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);
  }

  // ---- click-to-load video embeds ----
  // Keeps pages fast and avoids loading YouTube's player until someone
  // actually wants to watch. Works for both a YouTube ID and a local
  // file dropped in assets/video/.
  document.querySelectorAll(".video-embed[data-youtube], .video-embed[data-src]").forEach(function (el) {
    var thumb = el.querySelector(".video-embed__thumb");
    if (!thumb) return;
    thumb.addEventListener("click", function () {
      var youtubeId = el.getAttribute("data-youtube");
      var localSrc = el.getAttribute("data-src");
      var frame;
      if (youtubeId) {
        frame = document.createElement("iframe");
        frame.src = "https://www.youtube-nocookie.com/embed/" + youtubeId + "?autoplay=1&rel=0";
        frame.title = el.getAttribute("data-title") || "Video";
        frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        frame.allowFullscreen = true;
      } else if (localSrc) {
        frame = document.createElement("video");
        frame.src = localSrc;
        frame.controls = true;
        frame.autoplay = true;
        frame.playsInline = true;
      }
      if (frame) {
        thumb.remove();
        el.appendChild(frame);
      }
    });
  });
});
