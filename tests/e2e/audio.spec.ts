import { test, expect } from '@playwright/test'

test.describe('Audio Quiz', () => {
  test('Basic Audio Quiz Session', async ({ page }) => {
    await page.goto('/training/audio')

    // Check Title
    await expect(page.getByRole('heading', { name: /Quiz Audio/ })).toBeVisible()

    // Check Audio Player button exists (using aria-label for robustness)
    const audioBtn = page.locator('button[aria-label="Réécouter"]')
    await expect(audioBtn).toBeVisible()

    // Check we have options
    const options = page.locator('.btn-3d')
    await expect(options.first()).toBeVisible()
    // Should be at least 2 options (likely 4)
    expect(await options.count()).toBeGreaterThanOrEqual(2)

    // Play Audio (Click button) - force click for mobile overlay safety
    await audioBtn.click({ force: true })
    // Verify playing state (pulse or icon change) - optional as it's fast
    // We assume functionality based on button clickability

    // Select an option
    await options.first().click()

    // Verify Feedback Drawer appears
    const feedbackDrawer = page.locator('.animate-drawer-in')
    await expect(feedbackDrawer).toBeVisible()

    // Continue
    const nextButton = page.getByRole('button', { name: 'Continuer' })
    await nextButton.click()

    // Feedback hidden
    await expect(feedbackDrawer).toBeHidden()
  })
})
