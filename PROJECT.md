# PROJECT BRIEF — Studio406 site rebuild

Working brief for the project. In the Claude desktop app, open the Code tab,
point it at this folder, and have it read this file first.

## What this is

Studio406's website, originally built on Cargo (cargo.site) by REDTEAM, rebuilt
as a plain static site with no Cargo dependency. All page content (services, the
55-item gear list, the 30-image gallery, contact email, footer) was recovered
from the original site's embedded data; all images were extracted from SingleFile
captures of the live site. Endpoint: a GitHub repo published via Cloudflare Pages
on the studio's own domain.

## Current state

Done:
- Four pages: index, service-menu, gear-list, gallery -- content complete.
- All assets embedded locally: home-background.jpg, gallery-01..30.png, favicon.
- Site-wide background photo with a tunable --scrim for legibility.
- One stylesheet, one small JS lightbox, Cloudflare cache headers.

Pending:
- [ ] Compare each page to the SingleFile captures / screenshots and fine-tune
      layout, spacing, type, and scrim to match the original (main design pass).
- [ ] Decide on the typeface (keep license-free stack or substitute).
- [ ] Confirm gallery image ORDER matches the original (they're in capture order,
      named gallery-01..30; reorder filenames if needed).
- [ ] git init -> push to GitHub -> connect Cloudflare Pages -> attach domain.

## Design intent

Faithful to the original, not a redesign: the background photo on every page,
white type with a soft drop-shadow, one red accent (the REDTEAM red), generous
space, neo-grotesque type. The captures in /reference are the ground truth --
when in doubt, match them.

## Conventions

- Static only. No framework, no build step (Cloudflare Pages serves as-is).
- Keep the four original filenames so internal links stay stable.
- Edit content in the HTML; edit all styling in css/styles.css.
- Plain, clean punctuation in any copy.

## How to work this in the Code tab

1. Open the desktop app -> Code tab -> open this folder.
2. Make a /reference folder and drop the SingleFile captures + screenshots in it
   (it's gitignored, so it won't publish). That's the visual ground truth.
3. Preview with a local server: python3 -m http.server 8000
4. Work one page at a time; review each diff before accepting; commit in small steps.

## Deploy (full steps in README)

GitHub repo -> Cloudflare Pages (preset None, no build command, output dir /)
-> Custom domain.
