# PROJECT BRIEF — Studio 406 website

Working brief for the project. In the Claude desktop app, open the Code tab,
point it at this folder, and have it read this file and README.md first.

## What this is

The public website for Studio 406 (Max Richard's recording space in Kensington
Market, Toronto): a single static page — hero, Projects, Services, Gear,
Contact. Deployed as a Cloudflare Worker connected to GitHub, live at
studio406.co. Replaced the earlier invite-only site in November 2026.

## Current state

Done:
- Public single-page site: white ground, hairline rules, Manrope, one red accent.
- Projects: 17 release cards (cover, title, artist, optional tag, Listen link).
- Gear list (curated) with six approved gear photos; full-width live-room hero.
- Circular "406" favicon set; link-preview (og:) tags; search-indexable.
- Old invite-only site and gate retired: archived in `studio/`, not published,
  old URLs 301 to the homepage. Cloudflare Access no longer used.
- Two-branch workflow: `staging` (preview) → `main` (production).

Pending:
- [ ] "Request Quote" form replacing the mailto on Contact — modal → Worker
      POST endpoint → Resend → max@studio406.co. Reuse the RESEND_API_KEY
      secret, send.studio406.co sender and the ACCESS_RL rate limit.
- [ ] Possible layout tweaks for Projects as it grows (phone shows 2 per row).

## Conventions

- Static only. No framework, no build step.
- All content in `index.html`; all styling in `css/site.css`.
- Anything not meant for the public must be listed in `.assetsignore`.
- Only approved photos (see README). Never publish photos of the house.
- Plain, clean punctuation in any copy. The name is written "Studio 406".

## How to work this in the Code tab

1. Open the desktop app → Code tab → open this folder.
2. Preview locally (see README) or on the staging URL.
3. Commit in small steps. Push to `staging`, check it on the staging URL at
   desktop and phone width, then merge `staging` into `main` to go live.
