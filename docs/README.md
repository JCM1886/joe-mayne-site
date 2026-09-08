# Joe Mayne — Portfolio Site

A single-page static site: no build step, no framework, no dependencies.
Open `index.html` in a browser and it works as-is.

Structure and interaction patterns are modeled on 4change.marketing's actual
build (you shared their page source, so this is based on the real thing, not
a guess): a video-capable hero with a scroll cue, hover-flip service cards,
a two-column layout with an accordion, an auto-scrolling logo/work strip,
and a real contact form. All content, copy, and the earthy/sustainability
colour palette are your own — nothing here is 4change's actual text.

What's the same mechanic, different content:
- Hero: bold headline + subheading + a "scroll down" cue (their hero uses a
  looping background video — yours is static for now; see "Adding a hero
  video" below to add one).
- "What I do": four hover-flip cards (front = title, back = detail) instead
  of their three "Being Smart / Unique / Seen" flip boxes.
- "My Process" → "Personal": an accordion (native `<details>`, no JS) in the
  same style as their Vision/Mission and sustainability-practice toggles.
- Branding: a project grid plus an auto-scrolling strip of every project
  name, echoing their "Cool Brands We've Worked With" logo carousel — pure
  CSS, no library.
- Contact: a real Name / Email / Message form in the same field layout as
  theirs, wired to Formspree (needs your form ID — see below) with a
  `mailto:` fallback since a static site has no backend of its own.

## Files

```
index.html              — the whole site (one page, anchor-linked sections)
assets/css/styles.css   — all styling; palette variables are at the top
assets/js/main.js       — small script: mobile nav toggle + footer year
assets/images/          — drop your photos/exports in here (see below)
```

## How to edit

Everything is plain HTML — no templating, no content file to sync. Open
`index.html` in any editor and look for the comment blocks like:

```html
<!-- =========================================================
     BRANDING
     ========================================================= -->
```

Each one marks a section. Edit the text between the tags directly.

### Adding real images

Folders already exist under `assets/images/` matching your named categories:

```
assets/images/branding/ibex/
assets/images/branding/cac/
assets/images/branding/dow/
assets/images/branding/ftse-srp/
assets/images/branding/seed/
assets/images/branding/a-to-zero/
assets/images/branding/eclr/
assets/images/branding/climate-risk-factsheet/
assets/images/branding/digital-decarbonisation-factsheet/
assets/images/branding/climate-adaptation-factsheet-es/
assets/images/branding/sustainability-report-fr/
assets/images/branding/ecoact-website-rebrand/
assets/images/branding/retargeting-ad-campaign/

assets/images/photography/event/
assets/images/photography/wedding/
assets/images/photography/corporate/
assets/images/photography/travel/

assets/images/personal/renovation/
assets/images/personal/van/
assets/images/personal/outdoors/
assets/images/personal/travel/
```

To swap a placeholder for a real image, drop the file into the matching
folder, then in `index.html` replace the placeholder `<div class="work-thumb">`
block for that project with:

```html
<div class="work-thumb">
  <img src="assets/images/branding/ibex/cover.jpg" alt="IBEX project cover">
</div>
```

If you've already got exports of these covers saved locally, just drop them
straight into the matching folder above.

### Adding a hero video

Their hero uses a looping muted background video. To do the same: drop an
`.mp4` (and ideally a `.webm` for smaller file size) into `assets/video/`,
then in `index.html` add this inside `<section class="hero">`, before the
`<div class="wrap">`:

```html
<video class="hero-video" autoplay muted loop playsinline>
  <source src="assets/video/hero.mp4" type="video/mp4">
</video>
```

and in `styles.css` add a `.hero-video` rule that positions it absolute,
`width:100%; height:100%; object-fit:cover; z-index:-1` inside a `.hero`
with `position:relative`.

### Making the contact form actually send

The form is now wired for **Netlify's built-in form handling** —
`data-netlify="true"` plus a matching hidden `form-name` field are already
on the `<form>` tag, along with a hidden honeypot field for basic spam
protection. Nothing further to do: the moment this deploys on Netlify, the
form works, no signup or form ID required.

Deploying somewhere other than Netlify (GitHub Pages, Vercel, Cloudflare
Pages)? None of those run your form for you, so swap it for
[Formspree](https://formspree.io) instead: sign up free, create a form, and
change the `<form>` tag back to
`<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`
(the Name/Email/Message fields underneath don't need to change). Until
either is live, the `mailto:` link under the form is the reliable fallback.

### Things still flagged as "Needs your input"

Search the page for `editor-flag` — each one is a placeholder that needs
your real content:

- Branding project descriptions (13 projects) — currently just titles
- Photography — needs real images sorted into the four categories
- Strategy — two old screenshots need matching to a case study, or dropping
- Personal → Music — no content yet, needs a couple of lines from you
- Contact — LinkedIn URL is still a placeholder (GitHub is filled in)

## Deploying

This is a plain static site, so any static host works. This folder lives at
`docs/` inside the `joe-mayne-site` GitHub repo — named that deliberately so
GitHub Pages' native "serve from `/docs`" option works with zero extra
config. Two solid options:

**Netlify (recommended)** — connect the GitHub repo (`JCM1886/joe-mayne-site`)
at app.netlify.com and set **Base directory** to `docs`, or drag-and-drop
this `docs/` folder directly at app.netlify.com/drop for a one-off deploy.
Free tier includes the working contact form above with zero backend code,
plus a free subdomain and HTTPS.

**GitHub Pages** — in the repo's Settings → Pages, set Source to the `main`
branch, folder `/docs`. Free, and it's the same GitHub account you're
already pushing to. No built-in form handling — swap the contact form for
Formspree first (see above), or rely on the `mailto:` link as-is.

Either way: push changes to `main` (or re-connect/re-drop on Netlify) and
the live site updates.
