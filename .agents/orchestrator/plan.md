# Placely Dashboard Migration Plan

## Objectives
Migrate Placely student platform's legacy HTML dashboard into Next.js App Router codebase (`app/dashboard/*`).
Fulfill requirements R1-R6 with strict adherence to design, layout, dark glassmorphism styling, authentication, routing, and clean build.

## Orchestration Strategy
- Pattern: Project Pattern (Top-level Orchestrator)
- Dual Track:
  1. Implementation Track (Milestones M1 to M6)
  2. E2E Testing Track (Requirement-driven test infra & tier 1-4 tests)

## Phased Approach
Phase 0: Survey & Specification Mining (Parallel Explorers / Spec Miners)
Phase 1: Build PROJECT.md Feature Inventory & TEST_INFRA.md
Phase 2: Milestone Execution & E2E Test Suite Creation
- M1: Layout & Persistent Navbar
- M2: Roadmap Page
- M3: Projects Page
- M4: AI Mentor Page
- M5: Settings Page
- M6: Navigation Wiring & Redirects
Phase 3: Integration & Tier 1-5 Verification (Forensic Auditor & Adversarial Testing)
Phase 4: Final Handover & Report
