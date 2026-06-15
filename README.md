# Dhaka Safety Map

Static MVP for the Public Crime Reporting and Emergency Assistance addendum.

## Included

- Public dashboard with prominent 999 emergency assistance notices
- Multi-step public crime report form at the report view
- Incident details, location, evidence metadata, reporter anonymity, and consent checks
- Client-side evidence validation for JPG, JPEG, PNG, WEBP, and PDF limits
- Private submission queue separate from published public incidents
- Reporter-safe tracking view
- Administration review queue with filters, identity permission gate, audit messages, status changes, follow-up requests, verification, rejection, duplicate marking, and sanitized incident conversion
- LocalStorage-backed demo state, so submissions persist in the same browser

## How to run

Open `index.html` in a browser.

No install step is required.

## Deployment

GitHub Pages deploys from `main` using the workflow in `.github/workflows/pages.yml`.

Expected site URL:

https://sharifalmusfique.github.io/dhk-safety-map/

## Notes

This is a frontend prototype. It models the addendum's required product behavior, privacy separation, and review workflow, but it does not replace the required backend work for encryption, signed uploads, malware scanning, PostGIS storage, rate limiting, CAPTCHA, authentication, authorization, or production audit logging.
