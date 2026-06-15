# TODOS

Tracked here: deferred decisions and future work not yet in any sprint.
Each item includes enough context to pick it up cold.

---

## T-STORAGE — Decide StorageService backing implementation

**What:** Choose and implement the concrete `StorageService` — local filesystem,
Amazon S3, or Cloudflare R2.

**Why:** The `StorageService` interface is coded against an abstraction (by design),
but the backing implementation must be chosen before the first real client file is
delivered. Local FS breaks on ephemeral container platforms (Railway, Render restart
clears the disk). S3/R2 requires credentials, bucket setup, and IAM/API key policy.

**Pros of deciding now:**
- Unblocks the deployment target decision
- `GET /api/files/{token}/{deliverableId}` can be fully tested end-to-end
- No surprise on the day you try to deploy

**Cons of deciding now:**
- Adds ~2–4h if S3/R2: account setup, credentials, bucket policy, presigned URL vs.
  proxy decision
- Local FS is fast (30min) but only valid if the deployment target has a persistent
  volume add-on

**Context:** Cloudflare R2 has a generous free tier (~10GB free, no egress fees).
Railway and Render both support persistent volume add-ons for local FS. S3 is the
most portable but adds AWS account overhead for a v1 solo project. The controller
(`FileController`) already streams through the backend — the StorageService just
needs a `store(MultipartFile)` and `load(String fileUrl)` method.

**Depends on:** Deployment target decision (Railway / Render / AWS / VPS).

**Where to start:** `backend/src/main/java/com/prod/ploy/service/StorageService.java`
— write the interface first, then the impl.

---

## T-EXPIRY — Magic token expiry / revocation

**What:** Add soft expiry (e.g., 90 days) or revocation capability for magic tokens.

**Why:** Magic tokens don't expire in v1 — accepted trade-off. But a leaked tracking
link gives permanent read access to a client's project status and deliverable
downloads. As the client base grows, this becomes a meaningful risk.

**Mitigation already in place (v1):** Files are served through
`GET /api/files/{token}/{deliverableId}` which validates the token — no raw storage
URLs in responses. So a leaked link exposes project metadata + downloads, but not
underlying storage paths.

**Revisit trigger:** A client reports a link-sharing concern, or client volume
exceeds ~20 active projects.

**Where to start:** `Project.magicToken` — add a `tokenExpiresAt` field (nullable,
null = no expiry). The tracking endpoint checks expiry and returns a friendly
expired-link page if past.

---

## T-REVISIONS — Client revision history view

**What:** Allow clients to see all deliverable versions, not just the latest.

**Why:** The `Deliverable` entity already has a `version` field. The tracking page
shows only the highest-version deliverable. For a design service, revision comparison
is part of the client relationship — clients may want to revert or reference a
previous version.

**Revisit trigger:** First client asks "can I see the earlier version?"

**Where to start:** `GET /api/projects/track/{token}` — change to return all
deliverables sorted by version, not just the max. Client tracking page renders a
version list.

---
