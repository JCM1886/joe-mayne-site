# joe-mayne-site

Personal portfolio and personal-brand site for Joe Mayne — Bristol-based Senior
Digital Marketer, also a photographer/editor, videographer/editor, animator,
and SEO/AEO/GEO specialist. Built as a plain, dependency-light static site —
no build step, no framework, no npm install. Open any `.html` file in a
browser and it works.

## Editing the text on this site

The live site is **https://jcm1886.github.io/joe-mayne-site/**, built from
the `.html` files listed below, at the repo root. Each page edits the same
way — click a link, change the words, click the green **Commit changes**
button at the bottom. That commit *is* the publish step; the live site
updates within about a minute, no other action needed.

| Page | File | Direct edit link |
|---|---|---|
| Home | `index.html` | [edit](https://github.com/JCM1886/joe-mayne-site/edit/main/index.html) |
| My Process | `process.html` | [edit](https://github.com/JCM1886/joe-mayne-site/edit/main/process.html) |
| Branding | `branding.html` | [edit](https://github.com/JCM1886/joe-mayne-site/edit/main/branding.html) |
| Photography | `photography.html` | [edit](https://github.com/JCM1886/joe-mayne-site/edit/main/photography.html) |
| Strategy | `strategy.html` | [edit](https://github.com/JCM1886/joe-mayne-site/edit/main/strategy.html) |
| Personal | `personal.html` | [edit](https://github.com/JCM1886/joe-mayne-site/edit/main/personal.html) |
| Contact | `contact.html` | [edit](https://github.com/JCM1886/joe-mayne-site/edit/main/contact.html) |

**What's safe to change:** any plain words sitting *between* a `>` and the
next `<`. For example, in this line from `index.html`:

```html
<h1>I build marketing that performs — and I build most things myself.</h1>
```

only `I build marketing that performs — and I build most things myself.` is
text — safe to rewrite freely. `<h1>` and `</h1>` are structural tags, not
text — leave those alone, along with anything inside `<...>` angle brackets
generally (tag names, `class="..."`, `href="..."`, `src="..."`, `style="..."`).
A stray `<` or `>` left in the wrong place, or a missing closing `"` on an
attribute, is the most common way an edit breaks the page's layout.

One thing this format *can't* do: a `<br>` (line break) or any other HTML
tag typed as plain text inside a `<title>` or `<meta name="description"
content="...">` won't work — those two only ever show as plain text (in the
browser tab, and in search-engine/social-media previews), never as
formatted text on the page itself, so a `<br>` there just shows up as the
literal characters "`<br>`".

**Two folders to ignore** — they look like they might be where the content
lives, but neither is connected to the live site, and editing them won't
change anything you'll see:
- **`docs/`** — an earlier single-page version of the site that's no longer
  the one being deployed. Dead weight, not wired to anything.
- **`content/*.md`** — draft notes written early in this project, never
  actually read by any live page. If you want a durable copy of your
  wording somewhere other than the HTML, this folder's fine for that, but
  changing it alone won't update the site.

## Structure

```
index.html            Home
process.html           My Process — timeline, skills, tools, qualifications
branding.html          Branding — EcoAct / SE Advisory Services creative work
photography.html       Photography — event / wedding / corporate / travel
strategy.html          Strategy — case studies with real metrics
personal.html          Personal — renovation, van, outdoors, activism, music
contact.html           Contact — mailto form + direct links

content/                Early draft notes — NOT wired to the live site, see
                        "Editing the text on this site" above. Safe to
                        ignore.
docs/                   An earlier, abandoned single-page version of the
                        site — NOT the one being deployed. Safe to ignore.

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
- **13 Branding cover images** — drop them into
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

**Already live** on GitHub Pages at **https://jcm1886.github.io/joe-mayne-site/**
— Settings → Pages is set to deploy from `main` / root, and every push to
`main` (including a direct edit-and-commit on github.com) redeploys
automatically within about a minute. Nothing further to set up.

If you ever wanted to move host: Netlify's built-in form handling can
replace the `mailto:` contact form with a real submission backend (add
`data-netlify="true"` to the `<form>` in `contact.html`) — not needed on
GitHub Pages, just an option. Vercel/Cloudflare Pages also work fine for a
plain static site like this one.

## Credits

Built from `Joe_Mayne_Static_Site_Brief.docx` (v2).
