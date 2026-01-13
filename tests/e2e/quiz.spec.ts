import { test, expect } from '@playwright/test'

test.describe('Quiz Flow', () => {
  test('Basic Quiz Session', async ({ page }) => {
    await page.goto('/training/quiz')

    // Check Title
    await expect(page.getByRole('heading', { name: /Quiz/ })).toBeVisible()

    // Wait for question to load
    // We look for the "Type Badge" e.g. "KANA", "KANJI" etc.
    const typeBadge = page.locator('.uppercase.font-bold.tracking-widest')
    await expect(typeBadge).toBeVisible()

    // Check we have choices (buttons)
    // The quiz usually has 4 answer buttons in reading mode inside a grid
    const answerButtons = page.locator('.grid button')
    // We wait for at least one answer button
    await expect(answerButtons.first()).toBeVisible()

    // Simulate answering
    await answerButtons.first().click()

    // Verify Feedback Drawer appears
    // It is a fixed bottom drawer with an animation class
    const feedbackDrawer = page.locator('.animate-drawer-in')
    await expect(feedbackDrawer).toBeVisible()
    await page.waitForTimeout(500) // Wait for overlay animation to be fully stable

    // Click "Continuer"
    // The button is inside the drawer
    const nextButton = page.getByRole('button', { name: 'Continuer' })
    await expect(nextButton).toBeVisible()
    await nextButton.click()

    // Verify new question loads (feedback hidden)
    await expect(feedbackDrawer).toBeHidden()
  })

  test('Enable Sentences Category', async ({ page }) => {
    await page.goto('/training/quiz')

    // Open Filters
    await page.getByRole('button', { name: 'Filtres' }).click()

    // Clicks on "Phrases" category button
    const sentencesBtn = page.getByRole('button', { name: 'Phrases' })
    await expect(sentencesBtn).toBeVisible()

    // Toggle it on if off (it might be on by default or off, we force it)
    await sentencesBtn.click()

    // Close filters (click filter button again)
    await page.getByRole('button', { name: 'Filtres' }).click()

    // Verify UI is stable
    await expect(page.getByRole('heading', { name: /Quiz/ })).toBeVisible()
  })
})
