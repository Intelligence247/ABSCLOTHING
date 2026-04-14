# ABS Clothing — production readiness

Use this as a **pre-launch and deploy** checklist. Keep secrets in `.env` only; never commit real credentials.

## 1. Environment variables

### Backend (`backend/.env`)

Copy from `backend/env.example` and set every key required by `backend/config/validateEnv.js`:

| Variable | Purpose |
|----------|---------|
| `MONGO_URI` | Atlas (or local) MongoDB connection string |
| `JWT_SECRET` | Long random string for JWT signing |
| `JWT_EXPIRES_IN` | Optional; default used if unset in code paths |
| `CORS_ORIGIN` | Storefront origin(s). **Comma-separated** for multiple, e.g. `https://shop.example.com,https://www.shop.example.com` |
| `CLOUDINARY_*` | Product images + receipt uploads |
| `ADMIN_REGISTRATION_SECRET` | Bootstrap admin registration; rotate or restrict after first admin exists |
| `EMAIL_*` | SMTP for transactional mail |
| `PORT` / `NODE_ENV` | `production` in prod |
| `BACKEND_PUBLIC_URL` | Public API base (OpenAPI, links) |
| Bank fields | `BANK_NAME`, `BANK_ACCOUNT_NAME`, `BANK_ACCOUNT_NUMBER` (checkout copy) |

Optional: `PAYMENT_WEBHOOK_SECRET` if you use webhook-style pay updates.

### Frontend (`frontend/.env` or host env)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | **HTTPS** URL of the deployed API (no trailing slash) |

**CORS:** every origin where the Next app is served must appear in backend `CORS_ORIGIN`.

## 2. Deploy order

1. **Database** — Atlas cluster up; network access allows your API host (or `0.0.0.0/0` only if you accept that risk).
2. **Backend** — Deploy Node app; set env; start with `node server.js` (or your process manager). Confirm `GET /health-check` returns JSON `ok`.
3. **Frontend** — Build with `NEXT_PUBLIC_API_URL` pointing at that API; deploy static/host output.
4. **Smoke** — Run section 4 below against **production** URLs.

**Rollback:** Redeploy previous backend/frontend artifact or revert env; Mongo data is not auto-rolled back—avoid destructive migrations without backup.

## 3. Data: seed and local reset

- From `backend/`: run `npm run seed` (requires valid `MONGO_URI` and `.env`). This creates sample products, collections, and users per `scripts/seed.js` and `seeds/catalog.js`.
- **Production:** run seed only if you intend to load demo data; prefer a clean catalog or a dedicated import process.

## 4. Smoke tests (production or staging)

Run these after deploy (replace base URLs):

- `GET {API}/health-check` → `200`, `{ "status": "ok" }`
- `GET {API}/api/products` → `200`, JSON array
- `GET {API}/api/collections` → `200`
- `GET {API}/api/store/payment-info` → `200`, bank fields present
- **Storefront:** home, shop, product detail, cart, checkout (signed-in customer), receipt upload if testing bank flow
- **Admin:** login → products list loads from API → optional create/edit product → orders list → payment verify flow if applicable

**API docs:** `{API}/api-docs/` (useful for contract sanity).

## 5. Security reminders

- Rotate any credentials that ever appeared in `env.example` or chat logs.
- Use strong `JWT_SECRET` and `ADMIN_REGISTRATION_SECRET` in production.
- `NODE_ENV=production` enables stricter headers (e.g. HSTS) on the API—ensure HTTPS terminates correctly in front of Node.

## 6. Monitoring (recommended next steps)

- Uptime check on `/health-check`
- Log aggregation for API errors
- Atlas alerts (connections, disk)
- Optional: `express-rate-limit` on auth and upload routes if abuse is a concern

---

**10-task pipeline:** Tasks 1–9 cover integration and hardening; this file completes **Task 10** (QA + deploy readiness). Re-run the smoke section after any infrastructure or env change.
