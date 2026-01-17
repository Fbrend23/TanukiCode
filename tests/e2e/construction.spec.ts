import { test, expect } from '@playwright/test'

test.describe('Construction Game', () => {
  test('Basic Game Session', async ({ page }) => {
    await page.goto('/training/construction')

    // Check Title
    await expect(page.getByRole('heading', { name: /Construction/ })).toBeVisible()

    // 1. Verify Card Elements
    // The translation (English/French) should be prominent
    const translation = page.locator('h2.text-tanuki-brown-dark')
    await expect(translation).toBeVisible()

    // 2. Interaction: Add tokens
    // We expect some buttons in the "Propositions" pool
    const poolButtons = page.locator('.btn-secondary')
    await expect(poolButtons.first()).toBeVisible()

    // Click first token
    await poolButtons.first().click()

    // 3. Verify it moved to the Answer Zone
    // Tokens in the answer zone have the 'btn-primary' class and 'animate-pop-in'
    const answerTokens = page.locator('div.btn-primary.animate-pop-in')
    await expect(answerTokens).toBeVisible()
    await expect(answerTokens).toHaveCount(1)

    // 4. Verify Validation Button appears
    const validateButton = page.getByRole('button', { name: 'Valider' })
    await expect(validateButton).toBeVisible()

    // 5. Test Manual Validation
    await validateButton.click()

    // Feedback should appear (either success drawer or red error text)
    // We look for the status message or the drawer
    const feedback = page.locator('.animate-bounce-short, .animate-drawer-in')
    await expect(feedback.first()).toBeVisible()
  })

  test('Settings Toggle works', async ({ page }) => {
    await page.goto('/training/construction')

    // Click Filtres
    const filtersBtn = page.getByRole('button', { name: 'Filtres' })
    await filtersBtn.click()

    // Verify Settings Panel
    await expect(page.getByText("Options d'entraînement")).toBeVisible()

    // Toggle Kana mode
    const kanaBtn = page.getByRole('button', { name: 'Kana' })
    await kanaBtn.click()

    // Verify it indicates selection
    await expect(kanaBtn).toHaveClass(/border-tanuki-green/)
  })
})
