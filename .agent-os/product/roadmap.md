# Product Roadmap

## Phase 1: P0 — S3 + CloudFront live with current static site

**Goal:** Serve the current site via CloudFront with TLS and caching.
**Success Criteria:** 200 OK, p95 LCP < 2.5s, CDN configured with OAC, no origin public access.

### Features

- [ ] Provision S3 site bucket with OAC and CloudFront `[S]`
- [ ] Issue ACM certificate in us‑east‑1 and attach to CloudFront `[S]`
- [ ] Route 53 records for apex and www to CloudFront `[S]`
- [ ] GitHub Actions minimal deploy workflow (build → sync → invalidation) `[S]`
- [ ] Migrate current static assets and verify URLs/redirects `[S]`

### Dependencies

- AWS account 886108961664; Route 53 hosted zone for fg‑goats.com

## Phase 2: P1 — Read‑only API and UI lists players from DynamoDB

**Goal:** Replace hardcoded roster with API‑backed data.
**Success Criteria:** GET /players and /players/{id} return data; UI renders grouped by position.

### Features

- [ ] Create DynamoDB table (pk/sk + GSI1; optional GSI2) `[S]`
- [ ] Implement Lambda handlers for GET /players and GET /players/{id} `[M]`
- [ ] Seed `players.seed.json` into DynamoDB (one‑off script/Action) `[S]`
- [ ] Frontend fetch and render roster; client‑side search/filters `[S]`

### Dependencies

- Phase 1 complete; IAM roles for Lambda and DynamoDB access

## Phase 3: P2 — Cognito + admin console + CRUD + uploads

**Goal:** Enable authenticated admins to manage roster and images.
**Success Criteria:** New player published in < 2 minutes; protected routes enforce admin group.

### Features

- [ ] Cognito User Pool with admin group and hosted UI (optional) `[S]`
- [ ] Admin UI with form validation for player CRUD `[M]`
- [ ] Admin‑secured POST/PUT/DELETE /players `[M]`
- [ ] POST /uploads/sign for S3 presigned URLs; private uploads bucket `[S]`
- [ ] Validation of image types/sizes; store `imageKey` on player `[XS]`

### Dependencies

- Phase 2 complete; Cognito configured; IAM for presign and S3 access

## Phase 4: P3 — CI/CD wired; DNS cutover; alarms + dashboards

**Goal:** Reliable, auditable deployments with monitoring and domain cutover.
**Success Criteria:** OIDC deploys without long‑lived keys; basic alarms in place; fg‑goats.com pointing to CloudFront.

### Features

- [ ] Terraform state and OIDC role `goats-deploy-role` `[S]`
- [ ] CloudFront invalidation step on deploy `[XS]`
- [ ] Basic CloudWatch alarms (5xx rate, Lambda errors) `[XS]`
- [ ] DNS cutover to Route 53/CloudFront with lowered TTL and 48h monitor `[XS]`

### Dependencies

- Phases 1–3 complete

## Phase 5: P4 — Optional backups/export; image resizing later

**Goal:** Add data export and media improvements without increasing baseline cost.
**Success Criteria:** On‑demand exports succeed; optional resize pipeline improves media UX.

### Features

- [ ] Backup/export players to S3 (on‑demand Action) `[S]`
- [ ] Image resizing/thumbnails pipeline (future) `[M]`

### Dependencies

- Earlier phases complete; budget approved for advanced features

### Effort Scale

- XS: 1 day; S: 2–3 days; M: 1 week; L: 2 weeks; XL: 3+ weeks


