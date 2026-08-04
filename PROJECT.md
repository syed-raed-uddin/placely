# PROJECT: getplaced.ai — Server Error Modal for Buy Track

## Architecture
- **Frontend**: Vanilla JS / HTML / CSS web application (`c:/Users/DELL/getplaced.ai`).
- **Backend**: Python Flask backend (`c:/Users/DELL/getplaced - backend`) with POST `/create-order` endpoint returning JSON payloads `{"error": "..."}` on 403 Forbidden / 4xx errors.
- **UI Architecture**: Modal dialog overlay component `#error-modal` in Vanilla JS with fixed backdrop blur overlay, centered alert card, dynamic title & server error message text, top-right close icon (`×`), bottom "Dismiss" button, overlay click dismissal, and `Escape` keyboard dismissal.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Architecture Analysis | Locate `/create-order` calls, Buy Track handler, toast/modal scripts in frontend and backend | None | DONE |
| 2 | Vanilla JS Error Modal Implementation | Create `#error-modal` component in `dashboard.html` (and `index.html`), parse JSON `{"error": "..."}` on `/create-order` HTTP errors, display specific server error in modal | M1 | PLANNED |
| 3 | Review, Verification & Audit | Perform review with `teamwork_preview_reviewer`, empirical testing with `teamwork_preview_challenger`, and forensic audit with `teamwork_preview_auditor` | M2 | PLANNED |

## Interface Contracts
### `/create-order` Endpoint
- **Request**: `POST /create-order`
  - Body: `{ amount, skill_slug, name, whatsapp, college, year, role, skills }`
- **Response (403 Forbidden / Error)**:
  - Status: `403` (or `4xx`/`5xx`)
  - Header: `Content-Type: application/json`
  - Body: `{"error": "Complete <prerequisite_name> before purchasing <target_name>."}`
- **Frontend Handler (`dashboard.html` / `buyTrack`)**:
  - Intercepts `!res.ok`
  - Parses `await res.json()`
  - Calls `showErrorModal({ title: "Track Locked", message: errBody.error })`
  - Restores button state (`btn.disabled = false; btn.innerHTML = originalText;`) without crashing checkout flow.

## Code Layout
- Frontend files to update:
  - `c:/Users/DELL/getplaced.ai/dashboard.html` (lines 228-250 for modal CSS styles, lines 500-510 for modal DOM structure, lines 1838-1905 for `buyTrack` error parsing & modal invocation).
  - `c:/Users/DELL/getplaced.ai/index.html` (ensure modal or error handling compatibility if `proceedToCreateOrder` is invoked from landing page).
