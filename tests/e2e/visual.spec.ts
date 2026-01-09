import { test, expect } from '@playwright/test'

const pages = [
  { name: 'home', url: '/' },
  { name: 'kanas', url: '/charts' },
  { name: 'kanjis', url: '/kanji' },
  { name: 'vocabulary', url: '/vocabulary' },
  { name: 'grammar', url: '/grammar' },
  { name: 'quiz', url: '/quiz' },
  { name: 'study', url: '/study' },
  { name: 'auth', url: '/auth' },
  { name: 'legal', url: '/legal' },
]

test.describe('Visual Regression', () => {
  for (const pageInfo of pages) {
    test(`Snapshot of ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.url)

      // Wait for font loading or animations if necessary
      // Waiting for the main heading is usually a good stability check
      await expect(page.locator('h1, h2').first()).toBeVisible()

      // Additional wait for stability (optional but helpful for visual tests)
      await page.waitForTimeout(500)

      // Define masks for dynamic pages
      const masks = []
      if (pageInfo.url === '/quiz') {
        masks.push(page.locator('.card')) // Mask the question card area
        masks.push(page.locator('.grid')) // Mask answer buttons
      }
      if (pageInfo.url === '/study') {
        masks.push(page.locator('.scene')) // Mask the flashcard content
      }

      await expect(page).toHaveScreenshot(`${pageInfo.name}.png`, {
        fullPage: true,
        mask: masks,
      })
    })
  }

  test('Snapshot of Kanji Modal', async ({ page }) => {
    await page.goto('/kanji')
    await page.getByPlaceholder(/Rechercher/).fill('Soleil')
    await page.getByText('日', { exact: true }).click()

    // Wait for Modal content
    await expect(page.getByRole('button', { name: 'Détails' }).first()).toBeVisible()
    await page.waitForTimeout(3000) // Wait for drawing animation to finish

    // Reset scroll to top to ensure consistent snapshot
    await page.evaluate(() => window.scrollTo(0, 0))

    // Mask the drawing area to avoid animation flake
    const drawingMask = page.locator('.border-tanuki-beige')

    await expect(page).toHaveScreenshot('kanji-modal.png', { mask: [drawingMask] })
  })

  test('Snapshot of Kana Modal', async ({ page }) => {
    await page.goto('/charts')
    // Click 'a' (first kana usually)
    await page.locator('.grid > div').first().click()

    await expect(page.getByText('Entraînement')).toBeVisible()
    await page.waitForTimeout(3000) // Wait for open animation

    // Reset scroll to top to ensure consistent snapshot
    await page.evaluate(() => window.scrollTo(0, 0))

    // Mask the drawing area to avoid animation flake
    const drawingMask = page.locator('.border-tanuki-beige')

    await expect(page).toHaveScreenshot('kana-modal.png', { mask: [drawingMask] })
  })

  test('Snapshot of Grammar Detail', async ({ page }) => {
    await page.goto('/grammar')
    await page.locator('.card').first().click()

    await expect(page).toHaveURL(/\/grammar\/.+/)
    await expect(page.locator('h1')).toBeVisible()
    await page.waitForTimeout(500)

    await expect(page).toHaveScreenshot('grammar-detail.png')
  })

  // Protected Routes (requires Auth)
  test('Snapshot of Profile (Protected)', async ({ page }) => {
    // 1. Login
    await page.goto('/auth')
    if (!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) {
      test.skip(true, 'Skipping Profile test: Missing TEST_EMAIL or TEST_PASSWORD in .env')
      return
    }

    await page.getByPlaceholder('Votre email').fill(process.env.TEST_EMAIL)
    await page.getByPlaceholder('Votre mot de passe').fill(process.env.TEST_PASSWORD)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // 2. Wait for redirection or success
    // Using explicit navigation to profile to be sure
    await expect(page).not.toHaveURL('/auth') // Wait for nav away from auth
    await page.goto('/profile')

    // 3. Wait for content
    await expect(page.getByRole('heading', { name: 'Mon Profil' })).toBeVisible()
    await page.waitForTimeout(500)

    // 4. Snapshot
    await expect(page).toHaveScreenshot('profile.png')
  })
})
