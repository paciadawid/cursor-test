---
name: debug-ci
description: Debug and fix the latest failing GitHub Actions run for this repository. Fetches the most recent run, inspects failed jobs and steps, reads logs, diagnoses the root cause, applies a fix to the codebase, and pushes the changes.
---

# Debug and Fix Latest CI Run

## Goal
Investigate the most recent GitHub Actions run for `paciadawid/cursor-test`, identify what failed, fix it, and push the fix.

## Steps

### 1. Fetch the latest run
Use the GitHub API to get the most recent workflow run:
```
GET /repos/paciadawid/cursor-test/actions/runs?per_page=1
```
Note the `id`, `conclusion`, `run_number`, and `html_url`.

If `conclusion` is `success`, report that no fix is needed and stop.

### 2. Get failed jobs
```
GET /repos/paciadawid/cursor-test/actions/runs/{run_id}/jobs
```
Find all jobs where `conclusion` is `failure`. For each failed job, note its `id`, `name`, and which `steps` have `conclusion: failure`.

### 3. Read the annotations
```
GET /repos/paciadawid/cursor-test/check-runs/{job_id}/annotations
```
Annotations often contain the clearest error message. Read them for each failed job.

### 4. Diagnose the root cause
Based on the failed step names and annotation messages, identify what went wrong. Common categories:

- **Workflow/YAML error** — fix `.github/workflows/playwright.yml`
- **Test failure** — inspect the test file and application code; fix the assertion or the implementation
- **Missing file or env var** — add the missing resource or guard the step
- **Dependency/install error** — update `package.json` or lock file
- **Git/deploy error** — fix the shell commands in the deploy job

Use `codebase-retrieval` and `view` to read relevant source files before making changes.

### 5. Apply the fix
Edit only the files necessary to resolve the root cause. Do not make unrelated changes.

### 6. Commit and push
```bash
git add <changed files>
git commit -m "Fix CI: <short description of what was broken>"
git push
```

## Rules
- Always read the actual logs/annotations before guessing the cause.
- Fix only what is broken; do not refactor unrelated code.
- If the failure is a flaky test (network timeout, etc.) and there is no code fix possible, explain why and suggest re-running instead of pushing an empty commit.
- If the root cause is unclear after reading logs, ask the user for clarification before making changes.
