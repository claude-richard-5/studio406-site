# Studio406 — website

A plain, static rebuild of the Studio406 site, recovered from the original
Cargo site and rebuilt with no platform dependency. Just HTML, one CSS file,
and a few KB of vanilla JavaScript for the gallery lightbox. Deployed as a
**Cloudflare Worker** (static assets, via Wrangler) connected to this GitHub
repo.

Everything it needs is in this folder — including all images, which were
extracted from the SingleFile captures of the live site. There is no Cargo
dependency and nothing to download.

The site is invite-only. The public root page is just a "request access"
gate; the real site lives under `/studio/` and is gated by Cloudflare Access
(email one-time-PIN) at the edge — see "Access control" below.

## Structure

```
studio406-site/
├── index.html           Public landing page — just a "Request access" mailto
│                        link, fully self-contained (inline CSS, no /studio/
│                        dependency, since it must render for anyone)
├── assets/              favicon.ico (shared by both the landing page and /studio/)
├── studio/              The real site — gated by Cloudflare Access
│   ├── index.html       Home (wordmark over the background photo)
│   ├── service-menu.html  Services
│   ├── gear-list.html   Gear inventory (6 categories, 55 items)
│   ├── gallery.html     Image grid + lightbox
│   ├── css/styles.css   All styling (one --scrim variable tunes legibility)
│   ├── js/gallery.js    Lightbox behaviour
│   └── images/          home-background.jpg + gallery-01..30.png
├── wrangler.jsonc        Worker config (serves the whole repo as static assets)
├── .assetsignore         Excludes .git/.wrangler from what gets served publicly
├── _headers              Cloudflare cache rules
├── _recovered/           The original Cargo data this was rebuilt from (reference)
├── PROJECT.md            Working brief / task board
└── .gitignore
```

## Access control

`/studio/*` is protected by a Cloudflare Access Application (email one-time
PIN, no passwords). To grant someone access: add their email to the Access
policy's allow-list in the Cloudflare dashboard (Zero Trust → Access →
Applications), then reply to their request with the `/studio/` URL. Nothing
under `/studio/` — including its CSS/JS/images — is reachable by an
unauthenticated visitor, which is why the root landing page never references
anything inside `/studio/`.

## Image resolution

The gallery images are 1000x1000 and the background is 3000x2012 -- the
web-resolution copies embedded in the captures, which is ideal page weight for
the web. To go higher-res later, drop your own originals into images/ using the
same filenames and they'll be picked up automatically.

## Preview locally

Run a tiny local server (better than opening the file directly), e.g. with
Node installed:

    npx serve .
    # then visit http://localhost:3000

## Deploying

Push to GitHub: the repo is connected to a Cloudflare Worker
(`studio406-site`) with git integration. Pushing to `staging` deploys to a
preview URL; merging `staging` into `main` deploys to production
(studio406.co). See `COLLABORATOR_SETUP.md` (not committed — ask the project
owner) for the full workflow, or `PROJECT.md` for the working brief.

## Notes

- The original face was Cargo's "Diatype"; this uses a license-free
  neo-grotesque stack. Swap the --font variable in studio/css/styles.css to
  change it.
- --scrim in studio/css/styles.css controls how much the background photo is
  dimmed behind text (0 = none, 1 = black). Home uses a lighter scrim than
  content pages.
- The red accent (--accent) is the "REDTEAM" red from the original footer.
