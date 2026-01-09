import { test, expect } from '@playwright/test'

test.describe('Quiz Flow', () => {
  test('Basic Quiz Session', async ({ page }) => {
    await page.goto('/quiz')

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

    // Verify Feedback Overlay appears
    // It contains either "Correct !" or "Dommage..." or similar
    // We look for the overlay container which covers the screen or card
    const feedbackOverlay = page.locator('.absolute.inset-0.z-20')
    await expect(feedbackOverlay).toBeVisible()
    await page.waitForTimeout(500) // Wait for overlay animation to be fully stable

    // Click "Continuer" / "Question Suivante"
    // The button is outside the card, formatted as "Question Suivante"
    const nextButton = page.getByRole('button', { name: 'Question Suivante' })
    await expect(nextButton).toBeVisible()
    await nextButton.click()

    // Verify new question loads (feedback hidden)
    await expect(feedbackOverlay).toBeHidden()
  })
})
