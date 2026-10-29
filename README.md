# Playwright Task Tracker — Automated Testing

A hands-on QA automation learning project using **Playwright and TypeScript** to test a small Task Tracker web application.

The application, project setup, and initial exercises were generated with AI for educational purposes. I implemented the automated tests myself, using AI as a learning assistant for explanations, guidance, and debugging.

The goal of this project was to develop practical skills in UI automation, asynchronous JavaScript, network mocking, and test debugging.

## Technologies

- **Playwright** — browser automation and end-to-end testing
- **TypeScript** — writing typed test code
- **Node.js** — running the application and tests
- **Docker Dev Containers** — development environment
- **Git** — version control

## Test Coverage

The project contains **12 automated tests**, covering the following scenarios:

| Area                  | Test scenarios                                                              |
| --------------------- | --------------------------------------------------------------------------- |
| Task creation         | Adding tasks using the Add button or Enter key                              |
| Input validation      | Rejecting blank task names and clearing validation errors                   |
| Task management       | Completing, reopening, and deleting tasks                                   |
| Filtering             | Displaying active, completed, and all tasks                                 |
| Empty states          | Verifying the initial empty list and the state after deleting the last task |
| Application state     | Confirming that tasks reset after reloading the page                        |
| Network mocking       | Mocking successful API responses and HTTP 500 errors                        |
| Asynchronous behavior | Verifying the loading state while an API response is pending                |

The tests use accessible locators, web-first assertions, reusable helper functions, and isolated browser contexts.

## Project Structure

```text
.
├── .devcontainer/
│   └── devcontainer.json
├── app/
│   ├── index.html
│   └── server.cjs
├── tests/
│   └── tasks.spec.ts
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

The `app/` directory contains the AI-generated Task Tracker application, while `tests/tasks.spec.ts` contains the automated tests I implemented.

## Getting Started

### Prerequisites

- Node.js and npm
- A Chromium browser installed through Playwright

Alternatively, the project can be opened using VS Code with Docker and the Dev Containers extension.

### Installation

Clone the repository and navigate into the project directory.

Install dependencies:

```bash
npm ci
```

Install the Chromium browser used by Playwright:

```bash
npx playwright install chromium
```

If running in a fresh Linux environment without the necessary system dependencies, use:

```bash
npx playwright install --with-deps chromium
```

### Running Tests

Run the complete test suite:

```bash
npm test
```

Run TypeScript type checking:

```bash
npm run typecheck
```

Run a specific test by name:

```bash
npx playwright test -g "adds a task$"
```

Open the Playwright HTML report:

```bash
npm run report
```

### Running the Application

The application starts automatically during testing through Playwright's `webServer` configuration.

To run it manually:

```bash
npm start
```

The application runs on port `3000`.

When using a Dev Container, forward the port through VS Code to access the application in your browser.

## Testing Approach

### UI Automation

Tests primarily use Playwright's accessible locators, such as `getByRole()` and `getByLabel()`, to interact with the application.

Assertions use Playwright's automatic retry behavior to verify the expected UI state without relying on fixed delays.

### Test Isolation

Each test runs in a fresh browser context. A `beforeEach` hook navigates to the application before every test.

The Task Tracker stores tasks in memory rather than in a database, so tasks do not persist after a page reload.

### Reusable Helpers

A typed `addTask()` helper reduces duplicated code when creating tasks across different tests.

### Network Mocking

The tests intercept requests to `/api/tip` using `page.route()` to simulate:

- Successful API responses
- Delayed responses and loading states
- HTTP 500 server errors

This allows different network scenarios to be tested without depending on a live external API.

### Debugging

During development, I practiced debugging intentionally failing tests using Playwright's error messages, HTML reports, and Trace Viewer.

These tools help identify failed assertions, inspect browser state, and understand the sequence of actions leading to a failure.

## Results

**Final local verification:**

- 12 of 12 tests passing in Chromium
- TypeScript type checking successful
- No skipped tests

## What I Learned

This project helped me develop a better understanding of:

- Structuring automated UI tests
- Selecting elements using reliable locators
- Writing meaningful assertions
- Working with `async`, `await`, and Promises
- Understanding why missing `await` can cause unreliable tests
- Creating reusable test helpers with TypeScript
- Intercepting and mocking HTTP requests
- Testing asynchronous loading and error states
- Debugging failures using Playwright's built-in tools

## Scope and Limitations

This is a learning project rather than a production application.

The Task Tracker does not include authentication, persistent storage, or a database. Testing is currently configured for Chromium only.

Future areas of practice include API testing with Playwright's `request` fixture, authentication flows, persistent test data, and CI/CD integration.

## AI Usage Disclosure

The Task Tracker application, development setup, and original exercise instructions were generated with AI.

I wrote and completed the Playwright test suite as a guided learning exercise. AI was used to explain unfamiliar concepts, provide hints, review implementations, and assist with debugging.

The purpose of this repository is to demonstrate my progress in learning QA automation, rather than to present the application itself as an independently developed product.

## References

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Locators](https://playwright.dev/docs/locators)
- [Network Mocking](https://playwright.dev/docs/mock)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
