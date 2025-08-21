# Product Mission

## Pitch

GOATS (Ultra‑Lean AWS) is a serverless roster web app that helps admins manage players and fans browse the team by providing a cost‑optimized AWS stack, an admin console with CRUD, and a fast CDN‑backed site.

## Users

### Primary Customers

- Fans/visitors: Browse the roster, search and filter by position.
- Admins: Manage roster data and images; publish updates quickly and safely.

### User Personas

**Admin** (25-55 years old)
- **Role:** Team site administrator
- **Context:** Updates player info periodically from desktop; limited engineering time
- **Pain Points:** Manual edits, no auth, slow publish, image handling complexity
- **Goals:** Publish a new player in under 2 minutes; maintain accuracy and uptime

**Fan** (16-60 years old)
- **Role:** Supporter/visitor
- **Context:** Mobile-first browsing on 4G/5G; quick lookups on match day
- **Pain Points:** Hard to find players by position/name; slow initial load on mobile
- **Goals:** Fast load time; intuitive filtering and search; stable URLs

## The Problem

### Static updates are slow and error‑prone
Manual HTML edits and commits are required to publish roster changes, taking ~30–60 minutes and risking mistakes. This increases time‑to‑publish and discourages frequent updates.  
**Our Solution:** An authenticated admin console with validated forms and automated CI/CD, reducing publish time to under 2 minutes.

### No dynamic search or filters
Visitors cannot filter by position or search by name/number, limiting discoverability and engagement.  
**Our Solution:** Client‑side search and filters in the frontend, listing players from DynamoDB with position groupings and fast UI updates.

### Image management and global delivery
Images are handled manually with no validation or consistent CDN delivery, which hurts performance and reliability.  
**Our Solution:** S3 uploads via presigned URLs and delivery via CloudFront with Origin Access Control (OAC) and long‑TTL caching.

## Differentiators

### Ultra‑lean, fully serverless
Unlike traditional server‑based stacks, GOATS uses S3, CloudFront, DynamoDB On‑Demand, and Lambda, minimizing ops and achieving low single‑digit USD/month at light traffic.

### Secure, least‑privilege CI/CD via OIDC
Unlike access‑key based pipelines, deployments use GitHub OIDC to assume an IAM role, with all infrastructure managed in Terraform for reproducibility and review.

### Performance‑first delivery
S3+CloudFront with PriceClass_100, long‑TTL assets, and compression target p95 LCP under 2.5s. CloudFront invalidations happen only on deploy to control costs.

## Key Features

### Core Features

- **Public roster grouped by position:** Defender/Midfielder/Forward/Goalkeeper views
- **Player detail and bio:** Name, number, position, bio/markdown, image
- **Client‑side search and filters:** Quick find by name/number/position
- **Fast static delivery:** S3 + CloudFront with OAC and TLS

### Admin Features

- **Cognito admin login:** Admin group required for protected routes
- **Player CRUD with validation:** Add/edit/delete players with form rules
- **Image uploads via presigned URLs:** Private uploads bucket; validated types
- **HTTP API on Lambda:** Node.js 20, ARM64, 256MB, 5s timeouts
- **CI/CD pipeline:** GitHub → OIDC → Terraform → build → S3 sync → CloudFront invalidation
- **Optional SonarCloud:** Keep security scanners like Snyk/Nexus excluded by design


