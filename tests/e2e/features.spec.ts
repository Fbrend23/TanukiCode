import { test, expect } from '@playwright/test'

test.describe('Features', () => {
  test('Kanji Search works', async ({ page }) => {
    await page.goto('/kanji')

    // Type "Soleil" in search
    const searchInput = page.getByPlaceholder(/Rechercher/)
    await searchInput.fill('Soleil') // "日" should remain

    // Verify results - assuming "日" (Soleil) is present and visible
    // We target the card containing "日"
    await expect(page.getByText('日', { exact: true })).toBeVisible()

    // Verify that unrelated kanji (e.g. "月" Lune) are likely hidden
    // (This depends on the data, but "Lune" shouldn't match "Soleil")
    await expect(page.getByText('月', { exact: true })).toBeHidden()
  })

  test('Kana Modal opens on click', async ({ page }) => {
    await page.goto('/charts')

    // Click on the first Kana (あ - 'a')
    // We assume the first visible card in the grid is 'あ'
    const firstKanaCard = page.locator('.grid > div').filter({ hasText: 'あ' }).first()
    await firstKanaCard.click()

    // Check for Modal presence
    // Check for Modal presence by looking for specific modal content
    // We look for the "Entraînement" header which is present in the modal
    const modalContent = page.getByText('Entraînement', { exact: true })
    await expect(modalContent).toBeVisible()

    // Close modal (X button usually top-right)
    await page.locator('button:has(.lucide-x)').first().click()
    await expect(modalContent).toBeHidden()
  })

  test('Kanji Modal opens on click', async ({ page }) => {
    await page.goto('/kanji')

    // SEARCH for "Sun" (日) to isolate a specific kanji
    const searchInput = page.getByPlaceholder(/Rechercher/)
    await searchInput.fill('Soleil')
    await expect(page.getByText('日', { exact: true })).toBeVisible()

    // Click on the Kanji card
    await page.getByText('日', { exact: true }).click()

    // Verify Modal Opens
    // The "Détails" button is unique to the modal view
    const detailsButton = page.getByRole('button', { name: 'Détails' }).first()
    await expect(detailsButton).toBeVisible()

    // Close Modal
    await page.locator('button:has(.lucide-x)').first().click()
    await expect(detailsButton).toBeHidden()
  })
})
