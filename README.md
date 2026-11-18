# Studio 406 — website

The public website for Studio 406, a recording space in Kensington Market,
Toronto. A plain static site — one HTML page, one CSS file, no JavaScript, no
build step — deployed as a **Cloudflare Worker** (static assets, via Wrangler)
connected to this GitHub repo.

The site is fully public. (Until November 2026 it was an invite-only site
behind Cloudflare Access; that version is archived in `studio/` — see below.)

## Structure

```
studio406-site/
├── index.html            The site: hero, Projects, Services, Gear, Contact
├── css/site.css          All styling (white, hairline rules, Manrope, red accent)
├── img/
│   ├── hero-live-room.jpg  Hero photo
│   ├── photo-*.jpg         Gear photos (approved set only — see below)
│   └── releases/           Project cover art, 600px squares
├── assets/               favicon.ico, apple-touch-icon.png, icon-192.png
├── src/worker.js         Worker: currently just serves the static assets
├── wrangler.jsonc        Worker config
├── _headers              Cache rules (everything revalidates for now)
├── _redirects            Old /studio/* and /v2/* links → homepage (301)
├── .assetsignore         What is NOT published (see below)
│
├── studio/               ARCHIVE — the old invite-only site + old gate page.
│                         Kept in git, never published.
└── _recovered/           ARCHIVE — original Cargo data. Never published.
```

## What gets published

The Worker publishes the repo folder as-is, **minus** everything listed in
`.assetsignore`. Because the site is public, anything not meant for visitors
must be listed there. Currently excluded: `studio/` (the old site, including
photos of the house/basement studio), the old gate art in `assets/`,
`_recovered/`, all `*.md` docs and `wrangler.jsonc`.

**Photos:** only the approved set may be used — the old gallery's #1, 2, 17, 18,
20, 22, 24, plus the live-room hero. The rest show the house; don't publish them.

## Adding a project

Each card in the Projects section is one `<li>` in `index.html`. Copy one,
then swap the link, title, artist and cover. Covers come from the release
link itself: song.link / album.link pages expose title, artist, type, cover
(`og:image`) and release date in their page data — note that the release
date's month is 0-based. Save the cover to `img/releases/` at 600×600.
Order: the two too.fm releases first, then newest to oldest.

## Preview locally

Any static file server works, e.g. with Node installed:

    npx serve .
    # then visit http://localhost:3000

## Deploying

Push to `staging` → it deploys to
https://staging-studio406-site.claude-richard.workers.dev for review. Merge
`staging` into `main` → it deploys to production at https://studio406.co.
See `PROJECT.md` for the working brief.

## Email

Outbound email (for the planned "Request Quote" form) uses **Resend**, sending
from `send.studio406.co`, because studio406.co's own mail runs on Microsoft
365. The API key is the `RESEND_API_KEY` Worker secret (dashboard only — never
in this public repo). `src/worker.js` explains what is kept for it.
