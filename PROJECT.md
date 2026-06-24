# PROJECT BRIEF — Studio406 site rebuild

Working brief for the project. In the Claude desktop app, open the Code tab,
point it at this folder, and have it read this file first.

## What this is

Studio406's website, originally built on Cargo (cargo.site) by REDTEAM, rebuilt
as a plain static site with no Cargo dependency. All page content (services, the
55-item gear list, the 30-image gallery, contact email, footer) was recovered
from the original site's embedded data; all images were extracted from SingleFile
captures of the live site. Deployed as a Cloudflare Worker (static assets, via
Wrangler), connected to GitHub, live at studio406.co.

## Current state

Done:
- Four pages (home, services, gear, gallery) — content complete, design-matched
  against the /reference SingleFile captures.
- Typeface: Manrope (free, license-free stand-in for Cargo's licensed Diatype).
- Mobile-responsive; image fade-in on the gallery.
- Deployed: GitHub -> Cloudflare Worker -> studio406.co (cut over from Cargo).
- Two-branch workflow: `staging` (preview deploys) -> `main` (production),
  to avoid pushing untested changes straight to the live domain.
- Access control: the site is invite-only. The public root `/` is just a
  "Request access" mailto gate (self-contained, no dependency on `/studio/`);
  the real site lives under `/studio/`, protected by a Cloudflare Access
  Application (email one-time-PIN, no passwords). See README's "Access
  control" section for how to grant access.

Pending:
- [ ] Contact form (currently a plain mailto: link on Services) — possible
      Cloudflare Pages/Worker Function + a transactional email API (e.g.
      Resend) if/when this becomes worth building.
- [ ] Decide whether `www.studio406.co` should also resolve (currently only
      the root domain is configured).

## Design intent

Faithful to the original, not a redesign: the background photo on every page,
dark type with a soft drop-shadow on the home page, a translucent warm-cream
card over a lightly-blurred photo on inner pages, one red accent (the REDTEAM
red), generous space, neo-grotesque type. The captures in /reference are the
ground truth — when in doubt, match them.

## Conventions

- Static only. No framework, no build step (the Worker serves the repo as-is
  via wrangler.jsonc's `assets.directory`).
- Keep the existing filenames so internal links stay stable.
- Edit content in the HTML under `/studio/`; edit all styling in
  `studio/css/styles.css`.
- The root `index.html` (the access-request landing page) must stay fully
  self-contained — no reference to anything under `/studio/`, since that path
  is gated and an unauthenticated visitor still needs this page to render.
- Plain, clean punctuation in any copy.

## How to work this in the Code tab

1. Open the desktop app -> Code tab -> open this folder.
2. The /reference folder (gitignored) holds the original SingleFile captures —
   the visual ground truth for the `/studio/` pages.
3. Preview with a local server (see README's "Preview locally").
4. Work one page at a time; review each diff before accepting; commit in
   small steps. Push to `staging` first, verify on its preview URL, then
   merge `staging` into `main` to go live.
