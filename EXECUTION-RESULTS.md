# Execution Results

**Project:** OWA MFA Automation  
**Validation date:** 2026-11-10  
**Runtime:** Node.js 24.21.0, npm 12.2.0

## Latest focused manual-MFA execution

| Validation | Result | Details |
|---|---|---|
| Valid OTP grants mailbox access | PASS | `npm run test:regression -- --name "A valid OTP grants mailbox access"` — 1 scenario and 6 steps passed. The test used the visible-browser manual MFA flow; the OTP was entered by the user and was not captured in this report. |

The run followed a fix for Windows' built-in `USERNAME` environment variable overriding the account name from `.env`. Cucumber now loads the project `.env` username on Windows. The focused result does not establish that the full regression suite passed.

## Summary

| Validation | Result | Details |
|---|---|---|
| JavaScript syntax checks | PASS | All JavaScript files under `src/` and `tests/` passed `node --check`. |
| Utility unit tests | PASS | `npm run test:unit` — 8 passed, 0 failed. |
| Cucumber dry run | PASS | `npm run test:dry-run` — 7 scenarios and 44 steps discovered; steps and hooks were skipped as expected in dry-run mode. |
| Browser smoke test | PASS | `npm run test:smoke` — 1 scenario and 4 steps passed. The test verified that the login form is displayed. |
| Dependency audit | PASS | `npm audit` and `npm audit --omit=dev` reported 0 vulnerabilities. |
| Regression suite using local `.env` (initial run) | BLOCKED / FAILED | `npm run test:regression` — 7 scenarios: 1 passed, 6 failed. That run used the Windows desktop `USERNAME`, rather than the project `.env` username; see the run details below. |

## Test Scope

The smoke scenario only opens the OWA login page and checks the observed username and password fields. It does not submit credentials, generate or enter an OTP, or access an authenticated mailbox.

The eight utility tests cover:

- Accepting an absolute HTTP(S) base URL and rejecting unsupported protocols or missing values.
- Reading configured credentials without logging them.
- Preserving leading zeroes in numeric OTPs and rejecting non-numeric OTP input.
- Detecting configured versus manual OTP mode without exposing the OTP value.

The Cucumber dry run validates feature parsing and step-definition discovery; it does not execute browser actions or validate application behavior.

## Initial regression run using local environment

The initial regression suite ran before the Windows environment precedence fix. No environment values are printed in this report.

- Cucumber summary: **7 scenarios — 1 passed, 6 failed; 44 steps — 28 passed, 6 failed, 10 skipped.**
- Three flows timed out waiting for the MFA interaction/challenge. The login form showed the application's invalid-credentials message. The Windows process `USERNAME` value had taken precedence over the account name in `.env`.
- OTP-dependent scenarios could not be completed because `MFA_TEST_OTP` and `MFA_INVALID_OTP` are not configured in the local environment.
- Cucumber printed its failure summary, but the command did not exit normally; it was stopped after remaining active. This initial regression execution is failed/incomplete, not a passing suite.
- No result is claimed for successful MFA, mailbox access, invalid OTP handling, or authenticated logout/session behavior.

## Security Notes

- The regression suite used locally configured username/password values, but those values are not included here.
- No OTP value was included in this report. During the latest focused manual-MFA run, the user entered the current OTP directly in the visible browser; it was not logged or stored by the framework.
- Credential and OTP values were not included in this report.
- Failure screenshots are configured to mask username, password, and numeric OTP inputs. Screenshots from the regression run occurred before username masking was added.
- The full npm audit includes development dependencies.

## Limitations

The focused manual-MFA run validated successful OTP submission and mailbox access. These results do not validate invalid OTP handling, logout, authenticated session behavior, OTP expiry/replay, or the recorded application defects. Those scenarios require an approved test account and, for invalid-OTP checks, an approved invalid numeric test value. Refer to the manual assessment baseline in [README.md](./README.md); it remains separate from these automation results.
