# E2E Test Infra: Placely Student Platform Dashboard Migration

## Test Philosophy
- Opaque-box, requirement-driven E2E testing for Next.js App Router dashboard routes.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinations + Real-World Workload Testing.

## Feature Inventory & Test Coverage
| # | Feature | Source | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Real-World) |
|---|---------|--------|:----------------:|:-----------------:|:-----------------:|:------------------:|
| 1 | Persistent Dashboard Layout | R1 | 5 | 5 | ✓ | ✓ |
| 2 | Main Dashboard Refactor | R1 | 5 | 5 | ✓ | ✓ |
| 3 | Roadmap Hero & Progress | R2 | 5 | 5 | ✓ | ✓ |
| 4 | Roadmap Badge Shelf | R2 | 5 | 5 | ✓ | ✓ |
| 5 | Roadmap AI Checkpoint | R2 | 5 | 5 | ✓ | ✓ |
| 6 | Roadmap Accordion & Code Review | R2 | 5 | 5 | ✓ | ✓ |
| 7 | Projects Hero Recommendation | R3 | 5 | 5 | ✓ | ✓ |
| 8 | Projects Portfolio Insights | R3 | 5 | 5 | ✓ | ✓ |
| 9 | Projects Journey Stepper | R3 | 5 | 5 | ✓ | ✓ |
| 10 | Projects Currently Building & Ring | R3 | 5 | 5 | ✓ | ✓ |
| 11 | Projects Analytics Grid | R3 | 5 | 5 | ✓ | ✓ |
| 12 | Projects Catalog Grids & Modal | R3 | 5 | 5 | ✓ | ✓ |
| 13 | AI Mentor Header & Status | R4 | 5 | 5 | ✓ | ✓ |
| 14 | AI Mentor Streaming SSE Chat | R4 | 5 | 5 | ✓ | ✓ |
| 15 | AI Mentor Quick Prompt Chips | R4 | 5 | 5 | ✓ | ✓ |
| 16 | AI Mentor Focus Mode Pomodoro | R4 | 5 | 5 | ✓ | ✓ |
| 17 | Settings Profile & Track Management | R5 | 5 | 5 | ✓ | ✓ |
| 18 | Settings Local Notes & Tasks | R5 | 5 | 5 | ✓ | ✓ |
| 19 | Settings Log Out Action | R5 | 5 | 5 | ✓ | ✓ |
| 20 | Navigation Wiring Navbar Links | R6 | 5 | 5 | ✓ | ✓ |
| 21 | Navigation Wiring Mobile Bottom Bar | R6 | 5 | 5 | ✓ | ✓ |
| 22 | Navigation Wiring Legacy Redirects | R6 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Node.js test script / `npm run build` TypeScript validation + E2E route verification runner script (`scripts/e2e-test-runner.js`).
- **Pass / Fail Semantics**: Zero HTTP errors, 200 OK on auth sub-routes, 307 redirect on unauth requests, clean production `npm run build` output.

## Coverage Summary
| Tier | Count Target | Description |
|------|-------------:|-------------|
| 1. Feature Coverage | 110 | 5 test cases per feature across all 22 features |
| 2. Boundary & Corner | 110 | 5 boundary/corner cases per feature (e.g. unauthenticated, network fail, empty state) |
| 3. Cross-Feature Pairwise | 22 | Key feature interaction scenarios (e.g. navbar tab switch during SSE chat) |
| 4. Real-World Application | 11 | End-to-end student workflows (login -> dashboard -> roadmap -> mentor -> settings -> logout) |
| **Total Target** | **253** | Full E2E Test Suite Coverage |
