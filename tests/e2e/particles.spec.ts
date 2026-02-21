import { test, expect } from '@playwright/test'

test.describe('Grammar Particles Quiz', () => {
  test('Basic Game Session', async ({ page }) => {
    await page.goto('/training/particles')

    // Check Title
    await expect(page.getByRole('heading', { name: /Particules/ })).toBeVisible()

    // 1. Verify Card Elements
    const japaneseText = page.locator('.font-japanese')
    await expect(japaneseText.first()).toBeVisible()

    // Gap should be visible (as a hole or question mark placeholder)
    await expect(page.getByText('?')).toBeVisible()

    // 2. Interaction: Select an option
    const options = page.locator('.btn-secondary')
    // We expect 4 options
    await expect(options).toHaveCount(4)
    await expect(options.first()).toBeVisible()
    await expect(options.first()).toBeEnabled()

    // Click first option
    await options.first().click({ force: true })

    // 3. Feedback should appear immediately (no validation button needed)
    // We check for the feedback drawer
    const feedback = page.locator('.animate-drawer-in')
    await expect(feedback).toBeVisible()

    // 4. Verify Next Action
    const nextButton = page.getByRole('button', { name: 'Continuer' })
    await expect(nextButton).toBeVisible()

    // Click Next
    await nextButton.click()

    // Drawer should close
    await expect(feedback).not.toBeVisible()
  })

  test('Skip Functionality', async ({ page }) => {
    await page.goto('/training/particles')

    // Click Skip
    const skipBtn = page.getByRole('button', { name: 'Passer' })
    await skipBtn.click()

    // Should load new question (or just reset state, hard to verify exact new question efficiently without mocking)
    // But we can verify the feedback drawer did NOT open
    const feedback = page.locator('.animate-drawer-in')
    await expect(feedback).not.toBeVisible()
  })
})
