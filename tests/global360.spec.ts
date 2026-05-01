import { test, expect } from '@playwright/test';

// TROY BAKER - Global 360 - QA Engineer Assessment

test('SnipeItApp Demo Test', async ({ page }) => {
  await page.goto('https://demo.snipeitapp.com/login');

  // Test 1 ----- * Login to the snipeit demo at https://demo.snipeitapp.com/login
  // Login
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  // Verify text on the page after login
 await expect(page.getByRole('navigation').getByRole('link', { name: 'Admin User' })).toBeVisible();


  // Test 2 ----- * Create a new Macbook Pro 13" asset with the ready to deploy status and checked out to a random user
  // Navigate to create asset
  await page.getByText('Create New', { exact: true }).click();
  await page.getByRole('navigation').getByText('Asset', { exact: true }).click();

  // Select Model - Macbook Pro 13
  await page.locator('#select2-model_select_id-container').click();
  await page.getByText('Laptops - Macbook Pro 13" (#').click();

  // Select Status - Ready to Deploy
  await page.locator('[id="select2-status_select_id-container"]').click();  
  await page.getByRole('option', { name: 'Ready to Deploy' }).click();
  await page.waitForLoadState('networkidle');

  // Select Random User - Checkout to
  await page.locator('[id="select2-assigned_user_select-container"]').click();
       // Wait for options to load
  await page.waitForSelector('.select2-results__option');
  await page.waitForTimeout(500);
      // Get all options and pick a random one
  const options = page.locator('.select2-results__option');
  const count = await options.count();

  const randomIndex = Math.floor(Math.random() * count);
  await options.nth(randomIndex).click();
      // Log selected user and verify has #
  await expect(page.locator('[id="select2-assigned_user_select-container"]')).toContainText('#');
  const text = await page.locator('[id="select2-assigned_user_select-container"]').textContent();
  console.log(`Random Selected User: ${text}`);
      // Asset Tag For Test 3 Verify 
  const assetTag = `TEST${Date.now()}`;
  console.log(`Asset tag: ${assetTag}`);
  await page.locator('#asset_tag').fill(assetTag); 
      // Click Submit Button
  await page.locator('[id="submit_button"]').click();


  // Test 3 ----- * Find the asset you just created in the assets list to verify it was created successfully
      // - Auto navigated to Assets page from Test 2
  await page.waitForLoadState('networkidle');
  // Search for Created Asset
  await page.locator('input[type="search"]').fill(assetTag);
  await page.keyboard.press('Enter');
  await page.waitForLoadState('networkidle');
    // Verify it appears in the Asset List
  await expect(page.getByText(assetTag)).toBeVisible();
  await expect(page.getByText('Showing 1 to 1 of 1 rows').first()).toBeVisible();
  console.log(`Verified ${assetTag} appears in the List:`);


  // Test 4 ----- * Navigate to the asset page from the list and validate relevant details from the asset creation
  // Navigate from the Asset List to Asset Page - Verfiy Created Asset
  await page.locator('#assetsListingTable').getByRole('cell').nth(1).click();
  await page.waitForLoadState('networkidle');
    // - Verify the AssestTag and Ready to Deploy Status
  await expect(page.getByText(assetTag).first()).toBeVisible();
  await expect(page.getByText('Ready to Deploy Deployed')).toBeVisible();


  // Test 5 ----- * Validate the details in the "History" tab on the asset page
  // Navigate to History Tab - Verify Created Asset
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText(assetTag).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Admin User' }).first()).toBeVisible();


});