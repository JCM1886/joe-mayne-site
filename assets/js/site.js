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
  // closest to centre. On top of that: auto-advances every 2s (paused
  // on hover/focus/drag), the arrow buttons step to the prev/next
  // slide, and the track can be click-and-dragged with a mouse — the
  // native scrollbar is hidden in CSS since dragging/arrows/auto-play
  // are the intended way to move through it.
  (function () {
    var track = document.getElementById("curveTrack");
    if (!track) return;
    var carousel = track.parentElement;
    var slides = Array.prototype.slice.call(track.querySelectorAll(".curve-carousel__slide"));
    var caption = document.getElementById("curveCaption");
    var prevBtn = document.getElementById("curvePrev");
    var nextBtn = document.getElementById("curveNext");
    var reduceMotionCurve = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var MAX_ROTATE = 16; // degrees, at the edge of the carousel
    var MAX_LIFT = 46; // px, upward shift at the edge
    var MAX_SHRINK = 0.12; // fraction smaller at the edge
    var currentIndex = 0;
    var autoTimer = null;
    var isDragging = false;

    function applyCurve() {
      var carouselRect = carousel.getBoundingClientRect();
      var centerX = carouselRect.left + carouselRect.width / 2;
      var closestIndex = 0;
      var closestDist = Infinity;

      slides.forEach(function (slide, i) {
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
          closestIndex = i;
        }
      });

      currentIndex = closestIndex;
      var slide = slides[currentIndex];
      if (slide && caption) {
        var label = slide.getAttribute("data-label");
        var href = slide.getAttribute("data-href");
        if (label && caption.textContent !== label) caption.textContent = label;
        if (href) caption.setAttribute("href", href);
      }
    }

    function scrollToIndex(i) {
      i = ((i % slides.length) + slides.length) % slides.length;
      var slide = slides[i];
      var target = slide.offsetLeft + slide.offsetWidth / 2 - carousel.clientWidth / 2;
      carousel.scrollTo({ left: target, behavior: reduceMotionCurve ? "auto" : "smooth" });
    }

    var ticking = false;
    carousel.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          applyCurve();
          ticking = false;
        });
        ticking = true;
      }
    });
    window.addEventListener("resize", applyCurve);
    applyCurve();

    // Auto-advance every 2s. Paused whenever the pointer or keyboard
    // focus is on the carousel, or while it's being dragged, and
    // skipped entirely for reduced-motion.
    function startAuto() {
      stopAuto();
      if (slides.length > 1 && !reduceMotionCurve) {
        autoTimer = setInterval(function () {
          scrollToIndex(currentIndex + 1);
        }, 2000);
      }
    }
    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }
    startAuto();
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", function () {
      if (!isDragging) startAuto();
    });
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", function () {
      if (!isDragging) startAuto();
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        stopAuto();
        scrollToIndex(currentIndex - 1);
        startAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        stopAuto();
        scrollToIndex(currentIndex + 1);
        startAuto();
      });
    }

    // Click-and-drag (mouse only — touch already scrolls natively).
    // Tracks how far the pointer has moved so a drag doesn't also
    // fire the slide's link click when the pointer is released.
    var dragStartX = 0;
    var dragStartScroll = 0;
    var dragMoved = 0;
    carousel.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      isDragging = true;
      dragMoved = 0;
      dragStartX = e.clientX;
      dragStartScroll = carousel.scrollLeft;
      carousel.classList.add("is-dragging");
      stopAuto();
      carousel.setPointerCapture(e.pointerId);
    });
    carousel.addEventListener("pointermove", function (e) {
      if (!isDragging) return;
      var dx = e.clientX - dragStartX;
      dragMoved = Math.max(dragMoved, Math.abs(dx));
      carousel.scrollLeft = dragStartScroll - dx;
    });
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      carousel.classList.remove("is-dragging");
      scrollToIndex(currentIndex);
      startAuto();
    }
    carousel.addEventListener("pointerup", endDrag);
    carousel.addEventListener("pointercancel", endDrag);
    carousel.addEventListener(
      "click",
      function (e) {
        if (dragMoved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
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

  // ---- qualifications: overlapping certificate scroller ----
  // Same click-vs-drag distinction as the homepage's curved carousel:
  // a plain click opens the certificate's PDF (the card is a real
  // link), but a drag past a small threshold scrolls the strip
  // instead and is prevented from also firing that navigation.
  (function () {
    var scroller = document.getElementById("certScroller");
    if (!scroller) return;

    var dragStartX = 0;
    var dragStartScroll = 0;
    var dragMoved = 0;
    var isDragging = false;

    scroller.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse") return;
      isDragging = true;
      dragMoved = 0;
      dragStartX = e.clientX;
      dragStartScroll = scroller.scrollLeft;
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener("pointermove", function (e) {
      if (!isDragging) return;
      var dx = e.clientX - dragStartX;
      dragMoved = Math.max(dragMoved, Math.abs(dx));
      scroller.scrollLeft = dragStartScroll - dx;
    });
    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      scroller.classList.remove("is-dragging");
    }
    scroller.addEventListener("pointerup", endDrag);
    scroller.addEventListener("pointercancel", endDrag);
    scroller.addEventListener(
      "click",
      function (e) {
        if (dragMoved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true
    );
  })();

  // ---- photography lightbox (click-to-enlarge) ----
  // Each .lightbox-img is grouped with the other .lightbox-img
  // elements inside the same .grid it lives in, so prev/next cycles
  // within that photo category only (e.g. Corporate photos never
  // spill into Travel). Closes on the close button, Escape, or a
  // click on the dark backdrop itself (not the image).
  (function () {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var lightboxImage = document.getElementById("lightboxImage");
    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    var nextBtn = lightbox.querySelector(".lightbox__nav--next");

    var currentGroup = [];
    var currentIndex = 0;

    function groupFor(img) {
      var grid = img.closest(".grid");
      var scope = grid || document;
      return Array.prototype.slice.call(scope.querySelectorAll(".lightbox-img"));
    }

    function show(index) {
      currentIndex = ((index % currentGroup.length) + currentGroup.length) % currentGroup.length;
      var img = currentGroup[currentIndex];
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "";
      var multiple = currentGroup.length > 1;
      prevBtn.hidden = !multiple;
      nextBtn.hidden = !multiple;
    }

    function open(img) {
      currentGroup = groupFor(img);
      show(currentGroup.indexOf(img));
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      lightbox.hidden = true;
      lightboxImage.src = "";
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".lightbox-img").forEach(function (img) {
      img.addEventListener("click", function () {
        open(img);
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () {
      show(currentIndex - 1);
    });
    nextBtn.addEventListener("click", function () {
      show(currentIndex + 1);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(currentIndex - 1);
      else if (e.key === "ArrowRight") show(currentIndex + 1);
    });
  })();

  // ---- photography index: scroll-velocity image drift ----
  // Each .photo-index__float image's base position/rotation is fixed
  // via inline --base-x/--rotation custom properties in the HTML;
  // this only ever nudges a separate --drift property in the same
  // translateX() expression (see .photo-index__float in styles.css),
  // so it adds a sideways push proportional to how fast the page is
  // scrolling without fighting the base layout. Velocity is damped
  // each frame so the images drift back to rest shortly after
  // scrolling stops, and each image is staggered slightly (by index)
  // so they don't all move in lockstep. Skipped entirely under
  // prefers-reduced-motion - the CSS base position is enough there.
  (function () {
    var floats = Array.prototype.slice.call(document.querySelectorAll(".photo-index__float"));
    if (!floats.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var lastScrollY = window.scrollY;
    var velocity = 0;

    function tick() {
      var currentY = window.scrollY;
      var delta = currentY - lastScrollY;
      lastScrollY = currentY;
      velocity += (delta - velocity) * 0.2;
      var drift = Math.max(-40, Math.min(40, velocity * 2.2));
      floats.forEach(function (el, i) {
        var eased = drift * (1 - i * 0.12);
        el.style.setProperty("--drift", eased.toFixed(2));
      });
      window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  })();

  // ---- process page: animated timeline (scroll-reveal + progress line) ----
  // Each .timeline__item fades/slides in (and its dot pops in) the
  // first time it enters the viewport, via IntersectionObserver. A
  // .timeline__progress bar is added down the base line and grows as
  // the timeline scrolls through view, giving a sense of "how far
  // along" independent of the reveal animation. Falls back to
  // everything visible, no animation, under prefers-reduced-motion or
  // if IntersectionObserver isn't supported.
  (function () {
    var timeline = document.querySelector(".timeline");
    if (!timeline) return;
    var items = Array.prototype.slice.call(timeline.querySelectorAll(".timeline__item"));
    var reduceMotionTimeline = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var progress = document.createElement("div");
    progress.className = "timeline__progress";
    timeline.appendChild(progress);

    function updateProgress() {
      var rect = timeline.getBoundingClientRect();
      var viewportH = window.innerHeight;
      // Starts filling a bit before the timeline reaches the vertical
      // centre of the screen, finishes once its bottom nears the top
      // third - so it doesn't sit at 0% or 100% for most of the scroll.
      var start = viewportH * 0.85;
      var end = viewportH * 0.25;
      var total = rect.height + (start - end);
      var scrolled = start - rect.top;
      var fraction = Math.max(0, Math.min(1, total > 0 ? scrolled / total : 1));
      progress.style.height = fraction * 100 + "%";
    }

    if (reduceMotionTimeline || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      progress.style.height = "100%";
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    items.forEach(function (item) {
      observer.observe(item);
    });

    var timelineTicking = false;
    window.addEventListener("scroll", function () {
      if (!timelineTicking) {
        window.requestAnimationFrame(function () {
          updateProgress();
          timelineTicking = false;
        });
        timelineTicking = true;
      }
    });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  })();

  // ---- contact form (submits to Formspree via fetch, no page leave) ----
  // Progressive enhancement: without JS the form still works as a plain
  // POST and Formspree shows its own hosted thank-you page. With JS, we
  // intercept the submit, POST it in the background, and show a status
  // message right here instead.
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var formStatus = document.getElementById("formStatus");
    var submitBtn = contactForm.querySelector("button[type=submit]");

    function setStatus(text, kind) {
      if (!formStatus) return;
      formStatus.hidden = false;
      formStatus.textContent = text;
      formStatus.className = "form-status" + (kind ? " is-" + kind : "");
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      setStatus("Sending…");
      if (submitBtn) submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.reset();
            setStatus("Thanks — I've got your message and will be in touch soon.", "success");
          } else {
            return response.json().then(function (body) {
              var detail =
                body && body.errors && body.errors.length
                  ? body.errors.map(function (err) { return err.message; }).join(", ")
                  : null;
              setStatus(detail || "Something went wrong sending that — please try emailing me directly instead.", "error");
            });
          }
        })
        .catch(function () {
          setStatus("Something went wrong sending that — please try emailing me directly instead.", "error");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
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
