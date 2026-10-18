# Apna Food V2: shared orders + admin dashboard

## Included
- `firebase-config.js`: paste your Firebase web app config here.
- `firebase.js`: initializes Firebase Authentication and Firestore.
- `firebase-orders.js`: helper to create a shared order.
- `admin.html`: email/password sign-in and live incoming-order dashboard.
- `firestore.rules`: restrictive starter rules.

## Firebase setup (free-tier starting point)
1. Go to https://console.firebase.google.com/ and create a project named Apna Food.
2. Register a Web app in Project Overview and copy the web config into `firebase-config.js`.
3. In Authentication > Sign-in method, enable Email/Password and Anonymous.
4. In Authentication > Users, add the trusted admin account using Email/Password. Copy its UID.
5. Replace `REPLACE_WITH_ADMIN_UID` in `firestore.rules` with that exact UID. Do not use an email address in the UID field.
6. In Firestore Database, create the database in production/locked mode, then paste and publish `firestore.rules`.
7. Serve/deploy the files over HTTPS (or use a local development server). ES modules do not reliably work from `file://`.
8. Test with a throwaway order and confirm the admin dashboard receives it. Confirm a normal user cannot read or update orders.

## Connecting checkout
Import `createSharedOrder` from `firebase-orders.js` into the customer app. Map cart items to `{ itemId: <stable integer from 1 to 6>, qty: <integer> }`, and pass the form fields. The helper signs in anonymously if needed and writes to Firestore. It returns an order document ID.
This is a reference helper, not yet wired into the previous `app.js`; merge it carefully after testing.

## Security and launch warnings
- Never paste a Firebase service-account JSON or private key into browser files.
- Rules only let the configured UID administer orders. Keep that UID private and never let customers choose it.
- These rules check the basic order schema and status, but a production launch should add App Check/rate limiting and stronger item validation. The dashboard shows item IDs, not trusted totals.
- For production, calculate menu prices on a trusted backend and validate the selected items server-side. Do not accept totals supplied by the browser.
- UPI is only a selected payment method here; no UPI collect/QR or payment verification is implemented. Keep paymentStatus `unverified` until a real provider's server-side webhook verifies it. Never store UPI PINs or OTPs.
- Firebase Spark has daily Firestore quotas. If quota is exceeded, service can stop until the quota resets; enabling billing can lead to charges. Do not add a billing account if maintaining ₹0 is required.
- Before a public pilot, review local business/food safety, consumer, privacy and tax requirements, and get participating restaurants' consent.
