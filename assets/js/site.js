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
