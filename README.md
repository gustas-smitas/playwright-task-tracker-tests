# Playwright + TypeScript practice

A 100–120 minute guided lab. The local Task Tracker app is provided; your job is to test it. Start in `tests/tasks.spec.ts`. Solutions are in a separate folder so the normal test run never includes them.

## Start here — 15 minutes

Run these in the dev container terminal at `/workspaces/playwright-practice`:

```bash
npm test
npm run typecheck
```

Expect one passing example and ten exercises marked `test.fixme` (reported as skipped). Read the example, then run just that test:

```bash
npm test -- -g "adds a task"
```

Playwright starts the app automatically through `webServer`. To explore it yourself, run `npm start`, forward port 3000 in VS Code's Ports panel, and open that forwarded URL. Tasks live in page memory and reset on reload. There is no login or database.

Read `playwright.config.ts`: find `baseURL`, the Chromium project, screenshots, and traces. Tests run headlessly by default, so the container does not need a desktop.

## Understand the example

```ts
test('adds a task', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'New task' }).fill('Read docs');
  await page.getByRole('button', { name: 'Add task', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Read docs' })).toBeVisible();
});
```

- `test` registers a test; the callback describes what it does.
- `{ page }` receives Playwright's page fixture: a browser tab in a fresh context for each test.
- `async` makes a function return a Promise; `await` waits for an asynchronous operation to finish. Missing an `await` can let a test finish too early.
- A locator describes how to find an element. `getByRole` uses accessible roles and names; `getByLabel('New task')` is another good option here.
- Actions wait for elements to be actionable. Web assertions such as `toHaveText` retry until the expected state appears. Avoid `waitForTimeout` and arbitrary sleeps.
- `beforeEach` opens the app for each test. Tests must work in any order.
- Playwright runs TypeScript tests; `npm run typecheck` separately checks types.

Replace a `test.fixme` exercise with this pattern, then fill in the actions and assertions:

```ts
test('shows an empty task list', async ({ page }) => {
  // beforeEach already opened the app.
  await expect(page.getByRole('listitem')).toHaveCount(0);
});
```

## Exercises 1–2 — forms and assertions, 20 minutes

1. **Empty list:** check the heading, `No tasks here.`, zero list items, and `0 active tasks` in `getByRole('status')`.
2. **Validation:** submit spaces. Check the alert says `Enter a task name.` and no task was created. Then add a valid task and check the alert disappears.

Run each test with `npm test -- -g "part of its name"`. Predict what will happen before running it.

## Exercises 3–6 — state, lists, and isolation, 25 minutes

3. **Complete and reopen:** add a task, use `check()` and `uncheck()`, assert `toBeChecked()` and the active count after each change.
4. **Filters:** add two tasks and complete one. Check Active shows only the unfinished task, Completed shows only the finished one, and All shows both. Use `exact: true` for button names.
5. **Deletion:** add two tasks; delete one and prove the other remains. Find a row with `getByRole('listitem').filter({ hasText: '...' })`, then locate its button inside that row.
6. **Reload:** add a task, verify it exists, reload, and verify the list is empty. This app deliberately does not persist tasks.

Refactor repeated input/click actions into a typed helper after you have two working tests:

```ts
import { type Page } from '@playwright/test';

async function addTask(page: Page, title: string): Promise<void> {
  await page.getByLabel('New task').fill(title);
  await page.getByRole('button', { name: 'Add task', exact: true }).click();
}
```

`Page` is a type, `title: string` restricts the argument, and `Promise<void>` means the async helper produces no result. Temporarily pass a number to `title` and run typecheck to see the error; then fix it.

## Exercises 7–9 — network control, 20 minutes

7. **Success:** before clicking Get tip, intercept `**/api/tip` with `page.route`. Fulfill it with `{ json: { tip: 'Your custom tip' } }`, then assert that exact text.
8. **Loading:** hold the mocked response with a Promise, click Get tip, assert `Loading tip…`, then release the response and assert the final text. The solution includes this more advanced Promise pattern if you need a hint.
9. **Failure:** fulfill the request with status 500; check `Could not load tip. Try again.`. Set up routes before triggering requests.

## Debugging — 15 minutes

Change a text assertion to an incorrect value. Run that test and read its error: expected value, received value, and locator call log. Then inspect the failure screenshot and trace:

```bash
npm run report
```

Forward port 9323 and open the report URL. Click the failed test and its trace attachment. The trace lets you inspect actions, DOM snapshots, and network activity. Fix the assertion and rerun the test.

For interactive exploration:

```bash
npm run test:ui
```

Forward port 8080 and open it in your browser. `npm run test:debug` requires a graphical display; use the browser-based UI in this headless container.

## Independent challenge — 10 minutes

10. Add a task by pressing Enter instead of clicking Add task. Assert the new checkbox appears and the input is empty. Then add your own test: deleting the last task should restore the empty message.

## Finish

```bash
npm run typecheck
npm test
```

You are finished when all 11 tests pass with no skipped exercises, your extra challenge passes, and you can explain why tests do not share tasks, why actions need `await`, and why locators/assertions are preferable to fixed waits.

Compare with `solutions/tasks.spec.ts` only after attempting the exercises:

```bash
npm run test:solutions
```

The solution suite uses a separate report run, so it replaces the latest HTML report. For later practice, add data-driven validation tests, a second browser, API tests with the `request` fixture, or CI. Page objects and saved login state are useful later when a larger app needs them.

Official references: [Writing tests](https://playwright.dev/docs/writing-tests), [locators](https://playwright.dev/docs/locators), [network mocking](https://playwright.dev/docs/mock), [Trace Viewer](https://playwright.dev/docs/trace-viewer).

## After rebuilding the container

Dependencies are already installed for this session. In a fresh container, restore them with `npm ci` and `npx playwright install --with-deps chromium` before starting the lab. The lockfile pins the package versions used here.
