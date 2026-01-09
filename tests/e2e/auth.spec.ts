import { test, expect } from '@playwright/test'

test.describe('Auth / Guest restrictions', () => {
  test('Guest should NOT see Mastery Checkmarks', async ({ page }) => {
    // 1. Visit Kanas
    await page.goto('/charts')

    // Check for the "Check" icon button (Mastery toggle)
    // In our code, it has v-if="authStore.user"
    // So for a guest, it should be hidden.
    const masteryButton = page.locator('button:has(.lucide-check)')
    await expect(masteryButton).toBeHidden()

    // 2. Visit Vocabulary
    await page.goto('/vocabulary')
    await expect(masteryButton).toBeHidden()
  })

  test('Guest Nav should show Login button', async ({ page, isMobile }) => {
    await page.goto('/')

    if (isMobile) {
      const menuButton = page
        .getByRole('button')
        .filter({ has: page.locator('svg') })
        .first()
      if (await menuButton.isVisible()) {
        await menuButton.click()
      }
    }

    const navContext = isMobile
      ? page.locator('nav[aria-label="Navigation mobile"]')
      : page.locator('nav[aria-label="Navigation principale"]')

    // Should see "Connexion"
    await expect(navContext.getByRole('link', { name: 'Connexion' })).toBeVisible()

    // Should NOT see "Mon Profil"
    await expect(navContext.getByRole('link', { name: 'Mon Profil' })).toBeHidden()
  })
})
