# Studio406 — website

A plain, static rebuild of the Studio406 site, recovered from the original
Cargo site and rebuilt with no platform dependency. Just HTML, one CSS file,
and a few KB of vanilla JavaScript for the gallery lightbox. Designed for
**GitHub + Cloudflare Pages**.

Everything it needs is in this folder — including all images, which were
extracted from the SingleFile captures of the live site. There is no Cargo
dependency and nothing to download.

## Structure

```
studio406-site/
├── index.html          Home (wordmark over the background photo)
├── service-menu.html   Services
├── gear-list.html      Gear inventory (6 categories, 55 items)
├── gallery.html        Image grid + lightbox
├── css/styles.css      All styling (one --scrim variable tunes legibility)
├── js/gallery.js       Lightbox behaviour
├── images/             home-background.jpg + gallery-01..30.png
├── assets/             favicon.ico
├── _headers            Cloudflare Pages cache rules
├── _recovered/         The original Cargo data this was rebuilt from (reference)
├── PROJECT.md          Working brief / task board
└── .gitignore
```

## Image resolution

The gallery images are 1000x1000 and the background is 3000x2012 -- the
web-resolution copies embedded in the captures, which is ideal page weight for
the web. To go higher-res later, drop your own originals into images/ using the
same filenames and they'll be picked up automatically.

## Preview locally

Run a tiny local server (better than opening the file directly):

    python3 -m http.server 8000
    # then visit http://localhost:8000

## Publish with Cloudflare Pages

1. Push this folder to a GitHub repo.
2. Cloudflare dashboard: Workers & Pages -> Create -> Pages -> Connect to Git,
   pick the repo.
3. Build settings: Framework preset = None, Build command = (blank),
   Output directory = /. It's already static -- no build step.
4. Deploy, then add your custom domain under the project's Custom domains tab.

## Notes

- The original face was Cargo's "Diatype"; this uses a license-free
  neo-grotesque stack. Swap the --font variable in css/styles.css to change it.
- --scrim in css/styles.css controls how much the background photo is dimmed
  behind text (0 = none, 1 = black). Home uses a lighter scrim than content pages.
- The red accent (--accent) is the "REDTEAM" red from the original footer.
