# Backend Integration Guide — The Block Indexer SDK

Purpose

- Provide a concise, operational checklist for backend teams to run a daily data-collection job that uses the SDK and caches results in Redis for the remainder of the day.

What to collect (daily snapshot)

- Token metadata: name, symbol, decimals, total supply for tracked tokens.
- Token price history for the day or configured date ranges.
- Token balances for monitored wallets.
- Pair discovery and reserves for tracked tokens vs configured bases (used to compute prices/liquidity).
- Address metadata for monitored addresses: balance, isContract, codehash.
- Optional: token holders pages and other historical datasets needed for analytics.

Job cadence and scheduling

- Run a daily job as a baseline (suggested: 02:00 UTC). Raise frequency (hourly/15m) only if your use case demands fresher data.
- Use a scheduler that fits your infrastructure: cron (Linux), Task Scheduler (Windows), Kubernetes CronJob, or a managed cloud scheduler.

Operational contract (inputs / outputs / success criteria)

- Inputs: network config (chainId, chainName, RPC URL(s)), tracked token list, factories/bases, monitored wallets/addresses, API keys for third-party services.
- Outputs: Redis keys containing snapshots and live cache objects; daily snapshot files or keys for auditing.
- Success: the job writes the required Redis keys and records a success marker (timestamp and status). On partial failure, record error details and do not overwrite previous successful snapshots without explicit intent.

Redis key design and TTLs

- Use a consistent namespace: `indexer:<chainName>:<type>:<id or date>`
- Recommended key patterns and retention:
  - Daily snapshot (archival): `indexer:<chainName>:tokens:snapshot:<YYYY-MM-DD>` — retain for 30 days (no short TTL).
  - Per-token metadata: `indexer:<chainName>:token:<tokenAddress>:meta` — TTL: 24h (or refresh daily).
  - Pair view + reserves: `indexer:<chainName>:pair:<pairAddress>:view` — TTL: 1h (refresh more often if needed).
  - Address metadata: `indexer:<chainName>:address:<address>` — TTL: 24h.
  - Holders pages: `indexer:<chainName>:holders:<tokenAddress>:page:<n>` — TTL: 24h.
- Use Redis Hashes for small structured objects to reduce memory overhead and make partial updates cheaper.
- Use date-suffixed keys for snapshots to preserve historical context and avoid accidental overwrite.

Error handling and retries (best practices)

- Classify errors: transient (network, 5xx), rate-limited, and fatal (invalid config, missing secrets).
- Transient errors: retry with exponential backoff (e.g., 3 attempts). Implement jitter to reduce thundering herds.
- Rate limits: detect provider rate-limit responses and back off; consider provider-side rate buckets and reduce concurrency.
- Fatal errors: fail fast and surface alerts (missing API key, invalid config).
- For partial results: write a status key (`indexer:<chainName>:snapshot:<date>:status`) with success=false and error details, then abort overwrite of the previous complete snapshot.

Concurrency and provider resilience

- Batch work where supported to reduce RPC calls (use batch/indexer contract endpoints rather than per-item RPC queries).
- Limit concurrent RPC calls to each provider to a safe value derived from your provider's rate limits.
- Use provider fallbacks: configure multiple RPC endpoints and switch to a healthy fallback when the primary is rate-limited or down.

Data validation and canonicalization

- Validate numeric values (balances, reserves) and convert to canonical types (strings or big integers) before writing to Redis.
- Normalize addresses using a single canonical format used by your stack (checksummed or lowercase consistently).
- Include timestamps in ISO 8601 UTC for any time-based records and snapshots.

Monitoring, metrics, and alerting

- Emit these metrics for each job run: job_duration_seconds, job_success (0/1), rpc_errors_total, redis_writes_total, redis_write_errors_total.
- Health checks: record last_success_timestamp in Redis for quick operational checks.
- Alerts: trigger when consecutive failures exceed a threshold (e.g., 3), or when RPC error rates or Redis write errors spike.

Security and secrets

- Keep API keys and RPC credentials in a secrets manager or environment variables; never commit them to source control.
- Limit network access and host permissions for the job runner to reduce blast radius.
- Sanitize logs to avoid exposing secrets.

Observability and debugging tips

- Assign a request ID (UUID) to each job run and include it in logs, Redis writes, and downstream traces.
- When investigating stale or missing data:
  - Check the last snapshot key and the job status key.
  - Review logs scoped by the job request ID.
  - Verify RPC provider health and rate-limit headers.
- Keep daily snapshots for at least 30 days for auditing/debugging.

Retention and TTL summary

- Live, frequently-updated objects (pairs, prices for hot endpoints): TTL ~1 hour.
- Per-day snapshots and holders pages: TTL 24 hours (or archive snapshots for 30 days if you need history).
- Long-term audit snapshots: retain for 30+ days as required by your compliance or debugging needs.

Minimal operational checklist (pre-run)

1. Ensure environment variables/secrets are present: RPC_URL(s), Goldrush API key (if used), Redis connection string.
2. Confirm Redis has enough memory and a predictable eviction policy.
3. Verify outbound network access to RPC providers and any third-party APIs.
4. Validate the job with a one-off manual run before scheduling.
5. Ensure metrics and alerting are configured for job runs.

Next steps (non-code)

- Decide snapshot retention policy and TTLs aligned with storage and regulatory needs.
- Choose job host and scheduler (k8s CronJob, VM Task Scheduler, or managed cloud scheduler).
- Choose RPC provider concurrency limits and fallback order.
- Configure dashboards and alerts for job success/failure and Redis health.

If you want, I can produce a one-page printable checklist for ops, or tailor retention/TTL recommendations to your traffic profile and token list.
