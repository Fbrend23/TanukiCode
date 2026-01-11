import { test, expect } from '@playwright/test'

test.describe('Study / Flashcards', () => {
  test('Flashcard interaction', async ({ page }) => {
    await page.goto('/study')

    // Check Title
    await expect(page.getByRole('heading', { name: 'Flashcards' })).toBeVisible()

    // Check Card Front
    const cardScene = page.locator('.scene')
    const cardInner = page.locator('.transform-style-3d')

    await expect(cardScene).toBeVisible()
    // Initially NOT flipped
    await expect(cardInner).not.toHaveClass(/rotate-y-180/)

    // Click to Flip
    await cardScene.click()

    // Now FLIPPED
    await expect(cardInner).toHaveClass(/rotate-y-180/)

    // Click Next
    await page.getByRole('button', { name: 'Suivant' }).click()

    // Should reset flip (wait for animation handled in component)
    await expect(cardInner).not.toHaveClass(/rotate-y-180/)
  })

  test('Mode switching', async ({ page }) => {
    await page.goto('/study')

    // Default is Hiragana
    await expect(page.getByRole('button', { name: 'Hiragana' })).toHaveClass(/bg-tanuki-green/)

    // Switch to Katakana
    await page.getByRole('button', { name: 'Katakana' }).click()
    await expect(page.getByRole('button', { name: 'Katakana' })).toHaveClass(/bg-tanuki-green/)
    await expect(page.getByRole('button', { name: 'Hiragana' })).not.toHaveClass(/bg-tanuki-green/)

    // Switch to Phrases
    await page.getByRole('button', { name: 'Phrases' }).click()
    await expect(page.getByRole('button', { name: 'Phrases' })).toHaveClass(/bg-tanuki-green/)
  })
})
