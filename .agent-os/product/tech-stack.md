# Technical Stack

- **application_framework:** Node.js 20 (AWS Lambda, ARM64)
- **database_system:** Amazon DynamoDB (On‑Demand, PAY_PER_REQUEST)
- **javascript_framework:** React 18 + Vite
- **import_strategy:** node (bundled via Vite)
- **css_framework:** Tailwind CSS v3
- **ui_component_library:** None (Tailwind + lightweight custom components)
- **fonts_provider:** System UI font stack (no external dependency)
- **icon_library:** Heroicons (free)
- **application_hosting:** Amazon S3 (static site bucket) + Amazon CloudFront (PriceClass_100, OAC)
- **database_hosting:** Amazon DynamoDB (regional: eu‑west‑1 or eu‑central‑1)
- **asset_hosting:** Amazon S3 (site bucket public via OAC; uploads bucket private)
- **deployment_solution:** GitHub Actions (OIDC) → Terraform → Build → S3 sync → CloudFront invalidation
- **code_repository_url:** https://github.com/{org_or_user}/GOATS

Additional configuration:

- **Auth:** Amazon Cognito User Pool with admin group (for protected routes)
- **API:** Amazon API Gateway HTTP API → AWS Lambda (Node.js 20, ARM64, 256MB, 5s)
- **DNS:** Amazon Route 53 (apex + www for fg‑goats.com)
- **TLS:** ACM certificate in us‑east‑1 for CloudFront
- **Observability:** CloudWatch Logs (7–14 day retention) + basic alarms
- **Regions:** Workloads in eu‑west‑1 or eu‑central‑1; CloudFront ACM in us‑east‑1
- **Security:** Least‑privilege IAM, S3 OAC for public reads, uploads bucket private, Cognito JWT verification on admin endpoints, config in SSM Parameter Store

Cost guardrails:

- Fully serverless; no EC2/RDS
- CloudFront PriceClass_100; long TTL for assets; invalidate only on deploy
- DynamoDB On‑Demand; PITR off initially
- Minimal log retention; compress responses; avoid chatty APIs
- Single environment (prod) initially; staging added only if needed


