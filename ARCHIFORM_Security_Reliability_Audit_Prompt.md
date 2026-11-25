# ARCHIFORM --- Security and Reliability Audit Prompt

Act as a senior application security engineer and reliability-focused
Next.js developer. Perform a careful security and reliability audit of
the existing ARCHIFORM website. Identify and fix genuine issues where
safe, then provide evidence of what was tested.

## Project context

-   Website: ARCHIFORM Design Studio
-   Domain: `https://archiformdesign.me`
-   Stack: Next.js App Router, React, JavaScript, Sanity CMS
-   Contact form uses a Next.js API route and Resend for email delivery.
-   Sanity CMS is used for website content.
-   Work locally on the existing `client-preview` branch.

## Strict working constraints

1.  Check the current branch and working tree before making changes.
    Stay on `client-preview`; do not switch branches.
2.  Do not modify `main`, Hostinger production, DNS, domain settings,
    Vercel production settings, or deployment configuration.
3.  Do not deploy, publish, or push changes.
4.  Do not perform destructive, disruptive, load, stress, fuzzing, or
    denial-of-service tests against production or third-party services.
5.  Do not send test emails to real clients or contacts. Use a
    controlled test inbox only, and ask before any test that could send
    externally.
6.  Never print, expose, copy into source, or commit secrets from
    `.env.local` or deployment environments. Do not ask the user to
    paste secrets into chat.
7.  Do not run `npm audit fix --force`, broad dependency upgrades, or
    dependency downgrades. Do not make dependency changes without
    explaining why and checking compatibility.
8.  Preserve the existing design, animations, page content,
    functionality and integrations. Make the smallest safe changes
    necessary.
9.  Back up or inspect files before editing. Avoid broad rewrites. Do
    not delete existing functionality.
10. Distinguish confirmed vulnerabilities from best-practice
    recommendations and false positives. Do not claim a test passed
    unless it was actually performed.

## Audit scope

### 1. Final security audit

Review the application for common security risks relevant to this
codebase, including:

-   Unsafe handling of user input.
-   Injection risks in API routes, GROQ queries, and server-side code.
-   Cross-site scripting risks and unsafe HTML rendering.
-   Authentication or authorization gaps, if any protected functionality
    exists.
-   Overly permissive CORS or access configuration.
-   Unintended exposure of internal errors, stack traces, environment
    values or implementation details.
-   Unsafe redirects, URL handling, file handling or external links.
-   Security-sensitive actions that lack server-side validation.

Inspect the actual code and configuration. Do not add authentication or
other features that the website does not need.

### 2. API validation and rate limiting

Review every API route, especially `app/api/contact/route.js`.

-   Validate request method, content type, body shape, required fields,
    field types, lengths and formats on the server.
-   Reject malformed or unexpected input safely.
-   Normalize and trim appropriate values.
-   Prevent oversized request bodies.
-   Ensure server-side validation is authoritative; browser validation
    alone is insufficient.
-   Review email validation and recipient handling.
-   Add sensible rate limiting to public endpoints where appropriate.
-   Prefer a reliable approach compatible with the current hosting
    architecture. Do not add an in-memory limiter and claim it is
    production-safe in a multi-instance/serverless environment.
-   If reliable distributed rate limiting requires an external service
    or infrastructure change, explain the requirement and propose the
    safest option rather than silently adding an unsuitable solution.
-   Return appropriate HTTP status codes and safe, consistent error
    responses.

### 3. Contact form spam and abuse protection

Review the contact form and its API endpoint.

-   Check for honeypot, timing, duplicate submission and basic abuse
    protections.
-   Assess whether CAPTCHA or another challenge is genuinely needed; do
    not add one automatically if it harms usability.
-   Ensure spam protection is enforced server-side.
-   Prevent email header injection and unsafe interpolation into email
    content.
-   Apply reasonable field length limits and safe text handling.
-   Ensure the form does not reveal whether private email addresses or
    internal services exist.
-   Preserve the existing form UI, validation feedback, success state
    and failure state.

### 4. Environment variables and secret exposure

Inspect environment variable usage and repository tracking without
printing secret values.

-   Verify `.env.local` is ignored by Git and is not staged or
    committed.
-   Search source files, scripts, build output and client-side bundles
    for accidentally hardcoded secrets.
-   Confirm Resend API keys and Sanity write tokens are only accessed
    server-side.
-   Confirm no secret uses a `NEXT_PUBLIC_` prefix.
-   Confirm the public frontend uses only the intended public Sanity
    project ID, dataset and API version.
-   Check that logs and error messages do not reveal tokens, credentials
    or sensitive environment values.
-   Do not print secret values during checks. Report variable names and
    pass/fail status only.
-   Do not alter, rotate or revoke credentials without explicit
    approval.

### 5. HTTPS and security headers

Inspect the current Next.js and hosting configuration for:

-   HTTPS enforcement and canonical domain behaviour.
-   Strict-Transport-Security (HSTS), where appropriate for the actual
    deployment.
-   Content-Security-Policy (CSP), introduced carefully so existing
    GSAP, media, Sanity Studio, Resend and other required resources are
    not broken.
-   X-Content-Type-Options.
-   Referrer-Policy.
-   Permissions-Policy.
-   Frame protection using CSP `frame-ancestors` or a compatible header.
-   Secure cookie attributes if the application uses cookies.

Do not claim production headers are active based only on local
configuration. Do not change DNS, hosting settings or production
configuration. Report any deployment-side action that the owner must
perform.

### 6. Dependency vulnerability check

-   Inspect `package.json` and the lockfile.
-   Run `npm audit` and review the actual advisories, affected
    dependency paths, severity, exploitability and available compatible
    fixes.
-   Distinguish direct dependencies from transitive dependencies.
-   Do not blindly apply fixes or downgrade packages.
-   Do not use `npm audit fix --force`.
-   If a fix is safe and compatible, make the smallest targeted change
    and run the build.
-   If a vulnerability is in a transitive dependency with no safe
    compatible fix, document it and explain the practical risk and next
    action.
-   Do not claim zero vulnerabilities unless the audit confirms it.

### 7. Error handling and API failures

Test and review:

-   Invalid request bodies.
-   Missing required fields.
-   Incorrect content types and methods.
-   Resend API failures, timeouts and rejected requests.
-   Sanity read failures or missing CMS documents.
-   Unexpected server exceptions.
-   Rate-limit responses.
-   Network interruptions where they can be simulated safely.

Ensure: - Users receive clear, non-sensitive error messages. - Internal
logs retain useful diagnostic context without exposing secrets or
personal data unnecessarily. - Failures do not appear as false
success. - The UI remains usable after an error and allows a reasonable
retry. - No raw stack traces or secrets are returned to clients.

### 8. Production email delivery verification

Review the Resend integration and the current sender/recipient
configuration.

-   Confirm the server uses the intended verified sender identity and
    the configured site-owner recipient.
-   Confirm required environment variable names are referenced correctly
    without displaying their values.
-   Check error handling for provider rejection, authentication failure,
    rate limiting and network errors.
-   Check whether the sender domain and DNS verification are represented
    as configured in the application, but do not change DNS.
-   Do not send email to a real client or owner as part of this audit.
-   If a live delivery test is needed, ask for approval and use a
    controlled test inbox supplied by the owner.
-   Clearly distinguish code/configuration review from an actually
    completed live email delivery test.

## Safe testing procedure

1.  Inspect the repository, relevant API routes, contact form,
    environment variable references, Next.js configuration, middleware
    and package files.
2.  Check Git branch and status. Do not overwrite or discard the user's
    existing changes.
3.  Run static checks and local tests first.
4.  Use local development or a controlled test environment for malformed
    requests and API failure simulation.
5.  Do not run aggressive scans against the live website or third-party
    APIs.
6.  Do not send external emails without explicit approval.
7.  After any code changes, run the available project checks and
    `npm run build`.
8.  Review `git diff` and `git status` before reporting.
9.  Confirm `.env.local` and secrets are not staged.
10. Leave all changes local for review.

## Required final report

Provide a concise but specific report with these headings:

1.  **Overall result** --- security/reliability status and any
    high-priority blockers.
2.  **Final security audit** --- findings, severity, evidence and fixes.
3.  **API validation and rate limiting** --- routes checked, protections
    present/added, and limitations.
4.  **Contact form spam protection** --- controls checked and any
    remaining gaps.
5.  **Environment variables and secrets** --- pass/fail checks without
    revealing values.
6.  **HTTPS and security headers** --- code configuration checked and
    deployment-side items still requiring verification.
7.  **Dependency audit** --- actual audit result, important advisories
    and safe remediation status.
8.  **Error handling and API failures** --- scenarios tested and
    observed behaviour.
9.  **Email delivery** --- code/configuration review and whether a
    controlled live delivery test was actually performed.
10. **Files changed** --- list each file and why it changed.
11. **Build and test results** --- include actual command results.
12. **Remaining risks and recommended actions** --- separate urgent
    items from optional hardening.

For each check, label it as one of: - **PASS** --- tested and passed. -
**FIXED** --- issue found and corrected locally, with verification. -
**NEEDS OWNER ACTION** --- requires access, approval, DNS, hosting or
external service changes. - **NOT TESTED** --- not tested; explain why.

## Completion constraints

The audit is not complete merely because code was inspected. Perform
safe local checks, fix only verified issues, and provide evidence.
Explicitly confirm at the end:

-   No deployment or push was performed.
-   `main` was not changed.
-   Hostinger production, DNS and production settings were not changed.
-   No live destructive or load testing was performed.
-   No email was sent to a real client/contact without approval.
-   No secrets were exposed in output or committed to Git.
