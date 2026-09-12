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

  // ---- featured work: curved scroll carousel (home) ----
  // On every scroll frame, work out each slide's horizontal distance
  // from the carousel's own centre, normalise it to -1..1, and turn
  // that into a rotate + upward lift + slight scale-down — the
  // centred slide ends up upright, largest and lowest, and the rest
  // fan away either side the further they've scrolled from centre.
  // The caption pill below tracks whichever slide is currently
  // closest to centre.
  (function () {
    var track = document.getElementById("curveTrack");
    if (!track) return;
    var carousel = track.parentElement;
    var slides = Array.prototype.slice.call(track.querySelectorAll(".curve-carousel__slide"));
    var caption = document.getElementById("curveCaption");
    var reduceMotionCurve = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var MAX_ROTATE = 16; // degrees, at the edge of the carousel
    var MAX_LIFT = 46; // px, upward shift at the edge
    var MAX_SHRINK = 0.12; // fraction smaller at the edge

    function update() {
      var carouselRect = carousel.getBoundingClientRect();
      var centerX = carouselRect.left + carouselRect.width / 2;
      var closestSlide = null;
      var closestDist = Infinity;

      slides.forEach(function (slide) {
        var r = slide.getBoundingClientRect();
        var slideCenter = r.left + r.width / 2;
        var dist = slideCenter - centerX;
        var norm = Math.max(-1, Math.min(1, dist / (carouselRect.width / 2)));

        if (!reduceMotionCurve) {
          var rotate = norm * MAX_ROTATE;
          var lift = -Math.abs(norm) * MAX_LIFT;
          var scale = 1 - Math.abs(norm) * MAX_SHRINK;
          slide.style.transform = "translateY(" + lift + "px) rotate(" + rotate + "deg) scale(" + scale + ")";
        }

        var absDist = Math.abs(dist);
        if (absDist < closestDist) {
          closestDist = absDist;
          closestSlide = slide;
        }
      });

      if (closestSlide && caption) {
        var label = closestSlide.getAttribute("data-label");
        var href = closestSlide.getAttribute("data-href");
        if (label && caption.textContent !== label) caption.textContent = label;
        if (href) caption.setAttribute("href", href);
      }
    }

    var ticking = false;
    carousel.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          update();
          ticking = false;
        });
        ticking = true;
      }
    });
    window.addEventListener("resize", update);
    update();
  })();

  // ---- hero floating-image parallax (home) ----
  // Subtle depth effect: floating work tiles drift slightly toward
  // the cursor. Skipped entirely on touch devices (no meaningful
  // "cursor") and for reduced-motion, so it's a pure enhancement.
  var heroImages = document.querySelectorAll(".hero__image");
  var reduceMotionForParallax = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouchDevice = window.matchMedia("(hover: none)").matches;
  if (heroImages.length && !reduceMotionForParallax && !isTouchDevice) {
    document.addEventListener("mousemove", function (e) {
      var xPct = e.clientX / window.innerWidth - 0.5;
      var yPct = e.clientY / window.innerHeight - 0.5;
      heroImages.forEach(function (el, i) {
        var strength = 10 + (i % 3) * 6;
        el.style.transform = "translate(" + (xPct * strength) + "px, " + (yPct * strength) + "px)";
      });
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
    function start() { if (items.length > 1 && !reduceMotion) timer = setInterval(next, 3000); }
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
