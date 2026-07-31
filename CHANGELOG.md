# Changelog

Notes on notable work done on this project, kept here since the repo has
no other running record of it. Newest first.

## 2026-07-31 — Site review + fix pass

A full read-through of the project turned up several gaps between how
the site looked and how it actually behaved. Fixed one at a time, each
committed separately (commit hashes below are current after a later
history rewrite — see that entry — so they won't match anything from
before 2026-08-01).

### Findings and fixes

1. **Repo bloat** — `.git` was 792MB because `assets/gallery/_source/`
   (290MB of raw camera `.mov`/`.JPG` exports) and `.history/` (VS Code
   local-history snapshots) were committed. No `.gitignore` existed.
   → Added `.gitignore`, untracked both (files kept on disk, just no
   longer in git). `61a71bf`

2. **Contact form had no real lead capture** — `#contactForm` only
   copied a composed message to the clipboard and expected the visitor
   to manually paste it into Telegram/WhatsApp/MAX. If they didn't
   complete that step, the lead was gone with no record anywhere.
   → Added a mailto: fallback to `domwomensspase@yandex.ru`
   (`1c8d1da`), then a proper fix: `send-contact.php`, a same-origin
   PHP `mail()` endpoint with a honeypot field. Every CTA click now
   also fires a background POST to it, so the lead is captured
   server-side regardless of what happens in the external app
   afterward. `c65c815`
   **Still needs a live test on SpaceWeb** — `mail()` deliverability
   varies by host; check `domwomensspase@yandex.ru` (incl. spam) after
   submitting the form for real once deployed.

3. **No SEO crawl aids** — despite thorough per-page SEO (canonical
   URLs, OG tags, `Service` JSON-LD with pricing on all 21 program
   pages), there was no `robots.txt` or `sitemap.xml`.
   → Added both, listing all 23 public pages. `e26e61b`

4. **Nav drift across pages** — `gallery.html` still had the
   pre-social-icons nav (no Telegram/WhatsApp, mismatched mobile menu)
   because nav markup is duplicated per file with no shared template;
   the last nav update had only touched `index.html`. All 21
   `programs/*.html` pages had **no nav and no footer at all** — just
   a single back-link, so a visitor arriving via search had no way to
   reach Home, Gallery, Contact, or the phone number.
   → Synced `gallery.html`'s nav to match `index.html`. Injected the
   same nav + footer into all 21 program pages (relative-path
   adjusted), and added top padding to `.pg-shell` at each breakpoint
   so content clears the now-fixed nav bar. `8049884`

5. **Zero analytics** — the site's own cookie policy stated outright
   that no Metrika/GA was installed (true at the time).
   → Wired up Yandex Metrika, counter ID `111198517`. Deliberately
   **not** an unconditional snippet — it only loads once the visitor
   accepts the existing cookie-consent banner, matching the 152-ФЗ
   consent flow the site already had. Updated the privacy/cookie
   policy text to disclose it and bumped the "last updated" date.
   `b5d2960`, params corrected to match Yandex's actual generated
   snippet in `064e0dd`.
   Deliberately **excluded** the `<noscript>` fallback pixel: the
   consent banner is JS-rendered, so a JS-disabled visitor never sees
   it or gets asked — an unconditional noscript pixel would track them
   with no consent flow having run at all.

6. **Homepage video load** — 8 videos autoplay simultaneously on load
   (4 looping logo clips reused across nav/hero/contact/footer + 4
   hero-card videos), all decoding continuously regardless of scroll
   position.
   → Added an `IntersectionObserver` that pauses any `video[autoplay]`
   once it leaves the viewport and resumes it on re-entry. No visual
   change above the fold. `4c5d80b`

### Git history rewrite (2026-07-31, after the above)

`.gitignore`-ing `assets/gallery/_source` only stopped tracking it
*going forward* — the 290MB was still sitting in every historical
commit, keeping `.git` at 728MB. Ran `git filter-repo --path
assets/gallery/_source --invert-paths` to strip it from all history.

- **Result:** `.git` 728MB → 25MB.
- This rewrote every commit hash. A pre-rewrite mirror-clone backup
  was made first at `Desktop\dom.web-backup-before-history-rewrite\`
  before touching anything (safe to delete once you've confirmed
  everything on GitHub looks right).
- Rewritten history was force-pushed to `origin/main` — GitHub now
  matches local.
- **If you have this repo cloned anywhere else**, that clone's history
  no longer matches. Either re-clone it, or run
  `git fetch origin && git reset --hard origin/main` in it.

### Deployment

A zip matching the SpaceWeb `public_html` structure (root files +
`programs/`) was built with everything new/changed:
`index.html`, `main.js`, `gallery.html`, `programs.css`, `robots.txt`,
`sitemap.xml`, `send-contact.php`, and all 21 `programs/*.html` files.
`assets/`, `cgi-bin/`, and `programs-related.js` were unchanged and
don't need re-uploading.

### Deliberately deferred (not bugs, just not done)

- **SpaceWeb canonical-domain redirect** — non-canonical origins
  (bare-domain/www variants) still return 200 instead of redirecting
  to the canonical `https://domwomenspace.ru/`. Needs nginx-level
  config via SpaceWeb's control panel or support (`.htaccess` doesn't
  work there since the backing server is nginx, not Apache). Also
  worth confirming the TLS cert covers all non-canonical hostnames, or
  the browser's TLS handshake fails before any redirect rule can run.
- **Third-party form backend** (Web3Forms/Formspree) — passed over in
  favor of the same-origin PHP endpoint, since SpaceWeb hosting
  supports PHP and it avoids a third-party dependency.
