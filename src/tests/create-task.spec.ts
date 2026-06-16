import { test, expect } from '@playwright/test';

test('create task successfully', async ({ page }) => {

  await page.goto('http://localhost:5173');

  await page.getByRole('button', {
    name: /new task/i
  }).click();

  await page.getByLabel(/title/i)
    .fill('Playwright Task');

  await page.getByLabel(/description/i)
    .fill('Created through automated testing');

  await page.getByText('High')
    .click();

  await page.getByText('Bug')
    .click();

  await page.getByPlaceholder('e.g. Sarah K.')
    .fill('Shruti');

  await page.getByRole('button', {
    name: /create task/i
  }).click();

  await expect(
    page.getByText('Playwright Task')
  ).toBeVisible();

});