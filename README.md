# joe-mayne-site

Personal portfolio and personal-brand site for Joe Mayne — Bristol-based Senior
Digital Marketer, also a photographer/editor, videographer/editor, animator,
and SEO/AEO/GEO specialist. Built as a plain, dependency-light static site —
no build step, no framework, no npm install. Open any `.html` file in a
browser and it works.

## Structure

```
index.html            Home
process.html           My Process — timeline, skills, tools, qualifications
branding.html          Branding — EcoAct / SE Advisory Services creative work
photography.html       Photography — event / wedding / corporate / travel
strategy.html          Strategy — case studies with real metrics
personal.html          Personal — renovation, van, outdoors, activism, music
contact.html           Contact — mailto form + direct links

content/                Plain-text/Markdown copy for every page (the source
                        of truth for wording — HTML pages currently have this
                        copy baked in directly, since there's no build step
                        to render Markdown; edit the .md file first if you
                        want a durable record of a change, then mirror it
                        into the matching .html file)

assets/css/styles.css   All styling. One file, CSS custom properties for the
                        palette (see :root) so re-theming is a find-and-replace.
assets/js/site.js       Mobile nav toggle + click-to-load video embeds. No
                        dependencies.
assets/images/          Organised by section/project — see below.
assets/video/           Drop local video files here if you're not using
                        YouTube embeds.
```

## Adding photos

Each photography/personal/branding placeholder tile is a plain `<div
class="media-placeholder">` in the HTML. To swap one for a real photo:

1. Save the image into the matching folder, e.g. `assets/images/photography/wedding/`.
2. Replace the placeholder `<div>` with `<img src="assets/images/photography/wedding/your-file.jpg" alt="...">`.

## Adding video

Two options are wired up in `assets/js/site.js` — both render a click-to-load
thumbnail so nothing loads until a visitor actually wants to watch:

- **YouTube (or YouTube-nocookie):** set `data-youtube="VIDEO_ID"` on the
  `.video-embed` div.
- **A file stored in this repo:** drop the file into `assets/video/` and set
  `data-src="assets/video/your-file.mp4"` instead.

Two placeholders are already in the markup — one on `process.html` (showreel)
and one on `personal.html` (motion graphics side-projects) — just fill in the
`data-youtube` or `data-src` attribute.

## Open items — needs Joe's input

These are flagged directly on the page (look for the small "Needs your
input" badges) as well as here:

- **13 Branding project descriptions** — what each was, your role, the
  outcome. See `branding.html` / `content/branding.md`.
- **13 Branding cover images** — these already exist as public files from
  earlier Wix Media Manager work. Direct links are listed in
  `content/branding.md`. **They could not be downloaded automatically** —
  this build environment's network policy blocks `static.wixstatic.com` — so
  download them yourself and drop them into
  `assets/images/branding/<project>/`, matching the filenames referenced in
  `branding.html`.
- **Photography** — real photos sorted into event / wedding / corporate /
  travel.
- **Personal photos** — renovation, van, outdoors, travel.
- **Music section** (Personal page) — do you play, DJ, collect, go to a lot
  of gigs/festivals?
- **Showreel / motion graphics clip** — a YouTube link or local file for the
  two video placeholders.
- **Contact details** — real email address and LinkedIn URL (currently
  placeholders in `contact.html`, clearly marked).
- **Portrait photo** — for the Home page hero.

## Deploying

Four real options (see the original brief for the full comparison):

- **GitHub Pages** (simplest, this repo already lives here) — repo
  Settings → Pages → Deploy from a branch → `main` / root. A `.nojekyll`
  file is already included so GitHub doesn't try to run Jekyll over it.
- **Netlify** (recommended in the brief) — connects to this repo, deploys on
  every push, and its built-in form handling can replace the `mailto:`
  contact form with a real submission backend (add `data-netlify="true"` to
  the `<form>` in `contact.html`).
- **Vercel** or **Cloudflare Pages** — also work fine for a plain static
  site.

## Credits

Built from `Joe_Mayne_Static_Site_Brief.docx` (v2).
