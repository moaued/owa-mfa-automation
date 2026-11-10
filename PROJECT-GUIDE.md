# OWA MFA Automation - Complete Project Guide

This is the canonical guide for the project's structure, setup, test execution, manual MFA entry, security practices, validation results, and supplied manual assessment baseline.

## Project overview

The project is a JavaScript-only end-to-end automation framework for the OWA MFA application. It uses Playwright for browser automation, Cucumber/Gherkin for behavior scenarios, and Page Objects for application-specific locators and actions.

The framework does not bypass MFA or generate OTPs. If automated OTP configuration is blank, you must enter the OTP yourself in the visible browser when the MFA challenge appears.

## Project structure

```text
owa-mfa-automation/
|-- features/
|   |-- authentication.feature       # Login page and credential-to-MFA scenarios
|   |-- mfa.feature                  # OTP validation and return-to-login scenarios
|   `-- session.feature              # Logout and post-logout navigation
|-- src/
|   |-- pages/
|   |   |-- LoginPage.js             # Login locators and actions
|   |   |-- MfaPage.js               # MFA locators and actions
|   |   `-- MailboxPage.js           # Mailbox, sign-out, and navigation actions
|   |-- step-definitions/
|   |   |-- authentication.steps.js  # Gherkin steps for authentication
|   |   |-- mfa.steps.js             # Gherkin steps for MFA
|   |   `-- session.steps.js         # Gherkin steps for session behavior
|   |-- support/
|   |   |-- hooks.js                 # Browser, context, page, screenshot lifecycle
|   |   |-- load-env.js              # Loads .env and handles Windows USERNAME collision
|   |   `-- world.js                 # Scenario-scoped browser and Page Object references
|   `-- utils/
|       `-- test-data.js             # Environment value and numeric OTP validation
|-- tests/
|   `-- test-data.test.js             # Credential-free utility tests
|-- reports/                          # Generated Cucumber HTML report
|-- screenshots/                      # Screenshots for failed scenarios
|-- .env.example                      # Blank environment variable template
|-- .gitignore                        # Excludes local secrets and generated files
|-- cucumber.js                       # Cucumber paths, support code, and report setup
|-- package.json                      # Dependencies, Node requirement, and npm scripts
|-- package-lock.json                 # Locked dependency versions
|-- README.md                         # Short link to this guide
|-- PROJECT-GUIDE.md                  # This complete guide
`-- EXECUTION-RESULTS.md              # Short link to execution history in this guide
```

### How the framework works

1. Cucumber reads a feature file and selects scenarios by tags.
2. Step definitions map the Gherkin steps to Page Object actions.
3. Page Objects own the observed application locators and user actions.
4. Cucumber hooks launch one browser for the run and create a fresh context and page for each scenario.
5. The custom World stores that scenario's page and Page Objects.
6. On failure, a screenshot is attached to the Cucumber report and saved with the username, password, and numeric OTP fields masked.
7. `test-data.js` validates configuration values. It never generates OTPs.

The automation selectors were based on Playwright MCP inspection of the live application.

## Requirements

- Node.js 22, 24, or 26 and newer.
- npm.
- Network access to the approved OWA environment.
- An approved OWA test account.
- Chromium for Playwright.
- The mPass mobile application for manual OTP entry, unless an approved test-only OTP mechanism is available.

Cucumber 13.3.0 is used to resolve the reported transitive `glob`/`minimatch` advisories. Cucumber 13 does not support Node 20; the package engine range reflects this.

## Initial setup

Open PowerShell in the project directory:

```powershell
npm install
npx playwright install chromium
```

Create `.env` only if it does not already exist. This avoids overwriting local settings:

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
```

Edit `.env` locally:

```dotenv
BASE_URL=https://webmail.local.cerebra.sa/owa
USERNAME=
PASSWORD=
MFA_TEST_OTP=
MFA_INVALID_OTP=
HEADLESS=true
```

Set the approved domain-qualified account username and password. Leave OTP variables blank for manual browser entry. Do not copy real values into source files, command-line arguments, chat, or reports.

### Windows username handling

Windows commonly supplies a process-level `USERNAME` variable for the signed-in desktop account. `src/support/load-env.js` loads the project `.env` and makes its `USERNAME` value take precedence, preventing the desktop account name from being used by mistake.

## Running tests

Run the credential-free utility tests:

```powershell
npm run test:unit
```

Parse all features and check step-definition discovery without running browser actions:

```powershell
npm run test:dry-run
```

Run the login-page smoke test. It opens the app but does not submit credentials:

```powershell
npm run test:smoke
```

Run all scenarios tagged `@regression`:

```powershell
npm run test:regression
```

Run the complete browser suite:

```powershell
npm test
```

The regression and full browser suites sign in to OWA and require an authorized test account. The smoke and utility tests do not require authentication. A dry run only checks Gherkin/step wiring; it does not test application behavior.

The test runner shares one browser per run but creates a new isolated browser context for every scenario. `HEADLESS=false` requests a visible browser.

## Manual MFA: enter the OTP in the browser

**When `MFA_TEST_OTP` is blank, you must manually enter the current mPass OTP in the browser.**

1. Start `npm run test:regression` or `npm test` in PowerShell.
2. The test signs in using the local `.env` values.
3. When the MFA challenge appears, get the current OTP from the mPass mobile application.
4. Type the OTP directly into the OTP input in the visible Chromium window and click **Validate**.
5. The valid-OTP step waits up to five minutes for the mailbox to appear. The scenario continues automatically after that.

Do not paste OTPs into chat, PowerShell commands, source files, or reports. The framework does not read the manually entered OTP from the page to log or store it.

Each scenario gets a fresh context, so a regression run may prompt for a new OTP more than once (for example, once in the MFA feature and again in the logout/session scenario). Complete every challenge when it appears.

### Invalid OTP scenario

The invalid-OTP scenario requires an approved numeric invalid test value. If `MFA_INVALID_OTP` is blank, the browser opens visibly: enter the approved invalid value in the OTP input and click **Validate**. The test waits up to five minutes for the invalid-OTP message. Never enter a real valid OTP in this scenario, and do not invent a value if policy requires an approved test value.

The empty-OTP scenario needs no manual input; automation submits the empty field and checks the application's validation response.

### Automated OTP configuration (optional)

For unattended runs only, an approved test-only mechanism may provide `MFA_TEST_OTP`. An approved numeric invalid test value may be set as `MFA_INVALID_OTP`. Do not hardcode these values or use personal production OTPs. The OTP variables are blank in `.env.example`.

If either OTP variable is blank, the browser is launched visibly so manual entry can be performed.

## Observed application controls

Playwright MCP inspection confirmed these controls and responses:

- Login textboxes: `Domain\user name:` and `Password:`.
- Login button: `sign in`.
- MFA text: `Please enter OTP generated via mobile app`.
- MFA OTP input type: `number`.
- MFA buttons: `Validate` and `Go back to Login`.
- Empty OTP response: `OTP. It cannot be empty.`
- Mailbox main region accessible name: `Mail`.
- Account menu contains `Sign out`.
- Sign out returned to the OWA login form. Opening the base URL and using browser Back after logout also showed the login form during exploration.

## Reports, screenshots, and security

- Cucumber HTML report: `reports/cucumber-report.html`.
- Failed scenario screenshots: `screenshots/`.
- Screenshots mask username, password, and numeric OTP inputs. Review generated artifacts before sharing them.
- `.env` is excluded by `.gitignore`; do not commit it.
- `.env.example` contains placeholders only.
- Do not log or publish passwords, OTPs, cookies, tokens, or session data.
- This framework does not bypass MFA, generate OTPs, or claim results that were not executed.

## Verified execution results

**Validation date:** 2026-11-10  
**Runtime:** Node.js 24.21.0, npm 12.2.0

| Validation | Result | Recorded details |
|---|---|---|
| JavaScript syntax checks | PASS | All files under `src/` and `tests/` passed `node --check`. |
| Utility unit tests | PASS | `npm run test:unit`: 8 passed, 0 failed. |
| Cucumber dry run | PASS | `npm run test:dry-run`: 7 scenarios and 44 steps discovered; browser steps/hooks skipped as expected. |
| Browser smoke test | PASS | `npm run test:smoke`: 1 scenario and 4 steps passed. Checks login form only. |
| Dependency audit | PASS | `npm audit` and `npm audit --omit=dev` reported 0 vulnerabilities after the Cucumber upgrade. |
| Focused valid-MFA scenario | PASS | `npm run test:regression -- --name "A valid OTP grants mailbox access"`: 1 scenario and 6 steps passed with manual OTP entry in the visible browser. OTP was not recorded. |
| Initial full regression run | FAILED / INCOMPLETE | Before the Windows `.env` username fix: 7 scenarios, 1 passed and 6 failed. This initial result is not representative of a post-fix full run. |
| Full post-fix regression suite | NOT RUN | No full-suite pass is claimed. Run it when ready and complete each manual MFA challenge. |

### Initial regression failure detail

The initial regression run happened before `load-env.js` fixed Windows `USERNAME` precedence. The login page showed the application's invalid-credentials message, and three flows timed out waiting for the MFA interaction/challenge. OTP-dependent flows could not complete because OTP values were not configured. Cucumber printed a failure summary but did not exit normally, so the process was stopped. This was an incomplete failed run.

The later focused valid-MFA scenario loaded the `.env` username correctly and passed when the user manually entered the OTP and clicked **Validate**. This focused pass does not prove that the entire regression suite passes.

## Troubleshooting

- **Login page reports invalid credentials:** Verify the approved username/password in `.env` locally. On Windows, the Cucumber loader now prioritizes the project `.env` username. Do not paste passwords into shell commands or chat.
- **MFA challenge does not appear:** Authentication did not reach MFA; check the visible login-page message before entering or expecting an OTP.
- **Manual OTP step times out:** The step allows up to five minutes. Confirm the MFA page was visible, enter the current OTP in the browser, and click **Validate**.
- **Invalid OTP scenario cannot be completed manually:** Use only an approved invalid numeric test value; do not make one up if approval is required.
- **Browser does not appear:** If either OTP variable is blank the hooks force a visible browser. Otherwise set `HEADLESS=false` in `.env`.
- **Missing Playwright browser:** Install it with `npx playwright install chromium`.

## Supplied manual assessment baseline

These are the provided assessment findings. They are separate from the automation results above and must not be presented as newly executed tests.

| Scenario / observation | Existing result |
|---|---|
| Login page accessibility | PASS |
| MFA challenge displayed | PASS |
| Valid OTP grants mailbox access | PASS |
| Invalid OTP rejected | PASS |
| Expired OTP accepted | FAIL - DEF-001 |
| OTP replay | BLOCKED |
| Logout redirect | PARTIAL |
| Browser Back after logout | PASS |
| Go back to Login from MFA | PASS |
| Empty OTP validation | PASS |
| Alphabetic OTP | NOT EXECUTABLE - input type number |
| Invalid numeric OTP | PASS |
| Five consecutive invalid OTP attempts | Security Observation |
| Refresh during MFA | FAIL - DEF-002 |
| Re-authentication after refresh error | PASS |
| Seven-minute inactivity check | Session remained active; timeout policy unknown |
| Direct mailbox URL after logout | PASS |

### Open defects

- **DEF-001 - Critical (proposed), P0 (proposed), OPEN:** An expired OTP was accepted and OWA mailbox access was granted.
- **DEF-002 - Major (proposed), High (proposed), OPEN - pending triage:** Refreshing the MFA challenge led to a 404 system error page.

### Security observation

Five consecutive invalid OTP attempts did not trigger visible lockout, CAPTCHA, temporary blocking, or an additional warning. This requires further investigation; it is not proof that server-side rate limiting is absent.

## Next steps

1. Confirm the approved test account is configured locally in `.env`.
2. Run `npm run test:smoke` to check OWA login-page availability.
3. Start `npm run test:regression` when ready to sign in.
4. Manually enter each current mPass OTP in the visible browser and click **Validate** when challenged.
5. Review the Cucumber report and record the actual post-fix full-suite results; do not infer them from the dry run or focused MFA pass.
