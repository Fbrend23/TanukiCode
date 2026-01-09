import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to all sections (Desktop & Mobile)', async ({ page, isMobile }) => {
    // 1. Visit Home
    await page.goto('/')
    await expect(page).toHaveTitle(/TanukiCode/)

    // Helper to click nav links (handles Mobile Menu)
    const navigateTo = async (name: string, urlRegex: RegExp) => {
      if (isMobile) {
        // Open Menu if closed
        const menuButton = page
          .getByRole('button')
          .filter({ has: page.locator('svg') })
          .first() // Generic matching for the menu icon
        if (await menuButton.isVisible()) {
          await menuButton.click()
        }
        await expect(page.locator('nav[aria-label="Navigation mobile"]')).toBeVisible()
      }

      // Click link
      const navContext = isMobile
        ? page.locator('nav[aria-label="Navigation mobile"]')
        : page.locator('nav[aria-label="Navigation principale"]')

      await navContext.getByRole('link', { name: name, exact: true }).click()
      await expect(page).toHaveURL(urlRegex)
    }

    // 2. Kanas
    await navigateTo('Kanas', /.*charts/)
    await expect(page.getByRole('heading', { name: /Kanas/ })).toBeVisible()

    // 3. Kanjis
    await navigateTo('Kanjis', /.*kanji/)
    await expect(page).toHaveURL(/.*kanji/)

    // 4. Vocabulary
    await navigateTo('Vocabulaire', /.*vocabulary/)
    await expect(page.getByRole('heading', { name: /Vocabulaire/ })).toBeVisible()

    // 5. Quiz
    await navigateTo('Quiz', /.*quiz/)
    await expect(page.getByRole('heading', { name: /Quiz/ })).toBeVisible()
  })
})
