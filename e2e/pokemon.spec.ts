import { test, expect } from '@playwright/test'

test.describe('Pokemon Explorer', () => {
  test('should display pokemon table on home page', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(
      page.getByRole('heading', { name: /pokémon/i })
    ).toBeVisible()

    // Check table is visible
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('should load and display pokemon data', async ({ page }) => {
    await page.goto('/')

    await page.waitForSelector('table tbody tr')

    const rows = page.locator('table tbody tr')
    await expect(rows.first()).toBeVisible()
  })

  test('should navigate to detail page when clicking a pokemon', async ({
    page,
  }) => {
    await page.goto('/')

    // Wait for table to load
    await page.waitForSelector('table tbody tr')

    // Click first pokemon row
    await page.locator('table tbody tr').first().click()

    // Should navigate to detail page
    await expect(page).toHaveURL(/\/pokemon\/\d+/)


    await expect(page.getByText(/back/i)).toBeVisible()
  })

  test('should navigate back from detail page', async ({ page }) => {
    await page.goto('/pokemon/1')

    // Wait for detail to load
    await page.waitForSelector('[data-testid="pokemon-detail"]', {
      timeout: 10000,
    })

    // Click back button
    await page.getByText(/back/i).click()

    // should have back on main page
    await expect(page).toHaveURL('/')
  })

  test('should paginate through pokemon list', async ({ page }) => {
    await page.goto('/')

    // Wait for initial load
    await page.waitForSelector('table tbody tr')

    //  next button
    const nextButton = page.getByRole('button', { name: /next/i })

    if (await nextButton.isEnabled()) {
      await nextButton.click()

      // show updated page info
      await expect(page.getByText(/page/i)).toBeVisible()
    }
  })

  test('should display pokemon types with badges', async ({ page }) => {
    await page.goto('/')

    // Wait for data to load
    await page.waitForSelector('table tbody tr')

    // type badges (they have role="img")
    const typeBadges = page.locator('[role="img"]')
    await expect(typeBadges.first()).toBeVisible()
  })

  test('should show loading state initially', async ({ page }) => {
    // slow network to catch loading state
    await page.route('**/api/v2/pokemon**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await page.goto('/')

    // show loading indicator
    await expect(page.getByRole('status')).toBeVisible()
  })

  test('should display pokemon stats on detail page', async ({ page }) => {
    await page.goto('/pokemon/25') // Pikachu

    // Waiting for detail to load
    await page.waitForSelector('[data-testid="pokemon-detail"]', {
      timeout: 10000,
    })

    // stats section with Base Stats heading
    await expect(page.getByRole('heading', { name: /base stats/i })).toBeVisible()

    // Should show stat bars 
    await expect(page.getByRole('progressbar', { name: /hp/i })).toBeVisible()
    await expect(page.getByRole('progressbar', { name: /^attack/i })).toBeVisible()
    await expect(page.getByRole('progressbar', { name: /^defense/i })).toBeVisible()
  })
})
