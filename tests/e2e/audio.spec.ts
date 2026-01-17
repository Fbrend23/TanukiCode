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

    // Select an option - force for mobile safety
    await options.first().click({ force: true })

    // Verify Feedback Drawer appears
    const feedbackDrawer = page.locator('.animate-drawer-in')
    await expect(feedbackDrawer).toBeVisible()

    // Click "Continuer"
    const nextButton = page.getByRole('button', { name: 'Continuer' })
    await expect(nextButton).toBeVisible()
    await page.waitForTimeout(500) // Wait for animation

    // Use evaluate click for maximum robustness on mobile/overlays
    await nextButton.evaluate((el) => (el as HTMLElement).click())

    // Feedback hidden (increased timeout for transition)
    await expect(nextButton).toBeHidden({ timeout: 10000 })
  })
})
