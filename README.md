# Apna Food — Free starter prototype

A mobile-friendly food ordering demo that can be installed on Android as a PWA. It uses HTML, CSS and JavaScript so it is easy to run and edit.

## What works in this prototype
- Responsive customer-facing menu
- Sample local restaurant dishes and category filters
- Add/remove cart items and subtotal
- Checkout form validation
- Demo order reference saved locally in the browser
- PWA manifest and service worker for install/offline shell

## Important limitations
- This is a front-end demo, not a live delivery service.
- Demo orders are saved only in the current browser/device using localStorage.
- No restaurant receives orders. No payment, SMS, login, live tracking, or shared database is connected.
- Sample restaurant names and prices are placeholders. Replace them with confirmed information and permission from real restaurants before launch.
- Do not collect real customer details until a secure backend, privacy notice, and access controls are implemented.

## Run it
### Easiest
Open `index.html` in a browser. The main menu and cart work; service-worker/PWA installation generally requires localhost or HTTPS.

### Run locally with Python
From this folder, run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

### Free hosting
1. Create a GitHub account and a new repository.
2. Upload the files in this folder.
3. Import the repository into a hosting provider that offers a free static-site tier, such as Vercel.
4. Deploy and open the HTTPS URL on Android Chrome.
5. Use Chrome's menu and choose **Install app** or **Add to Home screen** (wording varies).

## Suggested next milestones
1. Choose the real app name, city/town and delivery area.
2. Confirm 2–3 restaurants willing to participate.
3. Add a secure shared backend (for example Firebase with rules) so orders reach an admin dashboard.
4. Add restaurant order management and delivery status updates.
5. Add payments only after the order flow is tested; cash on delivery/manual confirmation can be used for an initial pilot if operationally appropriate.
6. Review local business, food-safety, tax, privacy and consumer requirements before public launch.
