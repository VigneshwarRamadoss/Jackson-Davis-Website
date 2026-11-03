# Jackson Davis — Courtside

A complete Astro website built around the supplied courtside hero. Typography follows Font.md Direction B: Familjen Grotesk, Geist, Geist Mono; self-hosted, variable fonts. The image and its teal, wood and ivory palette follow the user's current request, which overrides the older illustration prohibition and dark palette default in the briefs.

## Run

Requires Node 22.19+ (recommended) and npm.

```
npm install
node scripts/prepare-assets.mjs
npm run dev
npm test
npm run build
```

## Pages

Home, catalog, nine statically generated tool detail pages, Custom Apps, Blog, About, Contact, Privacy, 404 and a typography specimen at `/styleguide/`. `dist/` is the standalone static deployment. Main content and the complete tool catalog work without JavaScript. Filters, role personalization, consent controls, mobile dialog navigation and request preparation are progressive enhancements.

## Content and privacy

`src/data/tools.json` and `bundles.json` retain exact Stan URLs and supplied prices. No customer counts, testimonials, university marks or fabricated product screenshots. Product visuals are category artwork. Supplied article titles are the offline fallback; the build attempts the Substack RSS with a 7-second timeout. The page identifies the archive when the feed is unavailable. Rebuild to refresh the feed.

Role signals are held in memory unless preference consent is granted. Reset removes all `jd_*` keys. Request contents are never persisted. The request builder generates a copyable brief with a Stan handoff and never claims to send email.

## Remaining launch inputs

- Real product screenshots and a portrait without university marks.
- Contact email, verified sending domain, email provider and spam-protection credentials before direct form delivery can be enabled. No fake success or unconfigured email API is shipped.
- Coaches Bundle 2 contents; what the $30 custom-app item covers; support/refund policy.
- Confirm role-specific copy and permission to mention the university role.
- Optional analytics domain, custom domain and scheduled RSS rebuild configuration.
- Real testimonials with permission, if desired.

Publication is an owner-private design preview. Performance scores, cross-browser tests, automated accessibility audits and live outbound link availability must not be claimed without measurement.
