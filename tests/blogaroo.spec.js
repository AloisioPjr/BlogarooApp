import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe.serial('Blogaroo login flow', () => {
  let username = `user_${Date.now()}`;
  const password = 'Test@1234';

  test('Register a new user', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    await page.screenshot({ path: 'debug-after-register.png' });
    console.log(await page.textContent('body'));
  });

  test('Login with registered user', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    

    await page.screenshot({ path: 'debug-after-login.png' });
    console.log(await page.textContent('body'));

    // Assert login was successful
    await expect(page.locator(`h1`)).toContainText('Welcome');

  });
  
});
