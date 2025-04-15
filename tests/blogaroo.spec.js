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

  
    console.log(await page.textContent('body')); // Log the body content for debugging
  });

  test('Login with registered user', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    


    console.log(await page.textContent('body'));//  Log the body content for debugging

    // Assert login was successful
    await expect(page.locator(`h1`)).toContainText('Welcome');

  });
  
  test('Create a new blog post', async ({ page }) => {
    await page.goto(`${BASE_URL}/create`);
    await page.fill('input[name="title"]', 'Test Post');
    await page.fill('textarea[name="content"]', 'This is a test post.');
    await page.click('button[type="submit"]');

    // Assert post creation was successful
    await expect(page.locator(`h1`)).toContainText('Post created');
  });
 

});
