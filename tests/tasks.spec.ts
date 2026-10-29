import { test, expect, type Page } from "@playwright/test";

// Each test gets a fresh browser context: tasks do not leak between tests.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function addTask(page: Page, title: string): Promise<void> {
  await page.getByLabel("New task").fill(title);
  await page.getByRole("button", { name: "Add task", exact: true }).click();
}

test("adds a task", async ({ page }) => {
  // Locate controls as a person using assistive technology would.
  await addTask(page, "Learn Playwright");

  // Web-first assertions retry until the UI matches or the timeout expires.
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(
    page.getByRole("checkbox", { name: "Learn Playwright" }),
  ).not.toBeChecked();
  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(page.getByRole("textbox", { name: "New task" })).toBeEmpty();
});

// Replace test.fixme with test, then fill in the callback as you work.
test("shows an empty task list", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await expect(
    page.getByRole("heading", { name: "Task Tracker" }),
  ).toBeVisible();
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("0 active tasks");
  await expect(page.locator("p#empty")).toBeVisible();
  await expect(page.locator("p#empty")).toHaveText("No tasks here.");
});

test("rejects a blank task", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await addTask(page, "   ");

  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("alert")).toHaveText("Enter a task name.");
  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("0 active tasks");
  await expect(page.locator("p#empty")).toBeVisible();
  await expect(page.locator("p#empty")).toHaveText("No tasks here.");

  await addTask(page, "Buy eggs");

  await expect(page.getByRole("alert")).not.toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Buy eggs" }),
  ).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Buy eggs" })).toBeVisible();
});

test("completes and reopens a task", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await addTask(page, "Buy eggs");

  await page.locator("input[type='checkbox']").check();
  await expect(page.getByRole("status")).toHaveText("0 active tasks");
  await expect(page.getByRole("checkbox", { name: "Buy eggs" })).toBeChecked();

  await page.locator("input[type='checkbox']").uncheck();
  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(
    page.getByRole("checkbox", { name: "Buy eggs" }),
  ).not.toBeChecked();
});

test("filters active and completed tasks", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await addTask(page, "Buy eggs");

  await addTask(page, "Drink protein shake");

  await page.getByRole("checkbox", { name: "Buy eggs" }).check();
  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(page.getByRole("checkbox", { name: "Buy eggs" })).toBeChecked();

  await page.getByRole("button", { name: "Active", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(
    page.getByRole("checkbox", { name: "Drink protein shake" }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Buy eggs" }),
  ).not.toBeVisible();

  await page.getByRole("button", { name: "Completed", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(page.getByRole("checkbox", { name: "Buy eggs" })).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Drink protein shake" }),
  ).not.toBeVisible();

  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(page.getByRole("checkbox", { name: "Buy eggs" })).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Drink protein shake" }),
  ).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Buy eggs" })).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Drink protein shake" }),
  ).toBeVisible();
});

test("deletes only the selected task", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await addTask(page, "Buy eggs");

  await addTask(page, "Drink protein shake");

  await page
    .getByRole("listitem")
    .filter({ hasText: "Buy eggs" })
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(
    page.getByRole("checkbox", { name: "Drink protein shake" }),
  ).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: "Buy eggs" }),
  ).not.toBeVisible();
});

test("starts fresh after a reload", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await addTask(page, "Buy eggs");

  await expect(page.getByRole("listitem")).toHaveCount(1);

  await page.reload();

  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("0 active tasks");
});

test("shows a mocked daily tip", async ({ page }) => {
  await page.route("**/api/tip", async (route) => {
    await route.fulfill({
      json: { tip: "Drink some water" },
    });
  });

  await page.getByRole("button", { name: "Get tip", exact: true }).click();

  await expect(page.locator("p#tip")).toHaveText("Drink some water");
});

test("shows loading while the tip request is pending", async ({ page }) => {
  // TODO: write your actions and assertions here.

  let releaseResponse!: () => void;

  const holdResponse = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });

  await page.route("**/api/tip", async (route) => {
    await holdResponse;

    await route.fulfill({
      json: { tip: "Drink some water" },
    });
  });

  await page.getByRole("button", { name: "Get tip", exact: true }).click();
  await expect(page.locator("p#tip")).toHaveText("Loading tip…");

  releaseResponse();

  await expect(page.locator("p#tip")).toHaveText("Drink some water");
});

test("handles a failed tip request", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await page.route("**/api/tip", async (route) => {
    await route.fulfill({
      status: 500,
    });
  });

  await page.getByRole("button", { name: "Get tip", exact: true }).click();

  await expect(page.locator("p#tip")).toHaveText(
    "Could not load tip. Try again.",
  );
});

test("adds a task by pressing Enter", async ({ page }) => {
  // TODO: write your actions and assertions here.
  await page.getByRole("textbox", { name: "New task" }).fill("Buy eggs");
  await page
    .getByRole("textbox", { name: "New task", exact: true })
    .press("Enter");

  await expect(
    page.getByRole("checkbox", { name: "Buy eggs" }),
  ).not.toBeChecked();
  await expect(page.getByRole("status")).toHaveText("1 active task");
  await expect(page.getByRole("textbox", { name: "New task" })).toBeEmpty();
});

test("shows empty state after deleting the last task", async ({ page }) => {
  // Your implementation

  await addTask(page, "Buy eggs");

  await page
    .getByRole("listitem")
    .filter({ hasText: "Buy eggs" })
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(page.getByRole("listitem")).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveText("0 active tasks");
  await expect(page.locator("p#empty")).toBeVisible();
  await expect(page.locator("p#empty")).toHaveText("No tasks here.");
});
