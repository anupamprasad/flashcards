import { expect, test } from '@playwright/test'

const STORAGE_KEY = 'spanish-flashcards:deck'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.localStorage.clear())
  await page.reload()
})

test('displays initial Spanish word and flips to English with assessment buttons', async ({ page }) => {
  const label = page.locator('.flashcard-label')
  const word = page.locator('.flashcard-word')
  const card = page.locator('.flashcard')

  await expect(label).toHaveText('Spanish')
  await expect(word).toHaveText('casa')
  await expect(page.locator('.assessment-buttons')).toHaveCount(0)

  await card.click()

  await expect(label).toHaveText('English')
  await expect(word).toHaveText('house')
  await expect(page.locator('.assessment-buttons')).toBeVisible()
  await expect(page.locator('.assessment-button')).toHaveCount(2)
})

test('cycles through cards when pressing Next', async ({ page }) => {
  const word = page.locator('.flashcard-word')
  const nextBtn = page.locator('.next-button')
  await expect(word).toHaveText('casa')
  // Ensure enabled
  await expect(nextBtn).toBeEnabled()
  // Click and see card change
  await nextBtn.click()
  await expect(word).not.toHaveText('casa')
  // Click Next N times cycles deck
  const seen = new Set([await word.textContent()])
  for (let i = 0; i < 49; i++) {
    await expect(nextBtn).toBeEnabled()
    await nextBtn.click()
    seen.add(await word.textContent())
  }
  expect(seen.size).toBeGreaterThan(1)
})

test('persists assessment decisions to localStorage', async ({ page }) => {
  await page.locator('.flashcard').click()
  await page.getByRole('button', { name: 'I Got It Right' }).click()

  await page.waitForFunction((key) => {
    const stored = window.localStorage.getItem(key)
    if (!stored) return false
    try {
      const json = JSON.parse(stored) as Array<{ id: number; is_known: boolean }>
      return json.some((entry) => entry.id === 1 && entry.is_known === true)
    } catch {
      return false
    }
  }, STORAGE_KEY)

  const persisted = await page.evaluate((key) => {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }, STORAGE_KEY)

  const firstCard = persisted.find(
    (entry: { id: number; is_known: boolean }) => entry.id === 1,
  )
  expect(firstCard).toBeTruthy()
  expect(firstCard.is_known).toBe(true)
})

test('loads stored deck state on application start', async ({ page }) => {
  await page.evaluate(
    ({ key }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify([{ id: 1, is_known: true }]),
      )
    },
    { key: STORAGE_KEY },
  )

  await page.reload()

  const persisted = await page.evaluate((key) => {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }, STORAGE_KEY)

  const firstCard = persisted.find(
    (entry: { id: number; is_known: boolean }) => entry.id === 1,
  )

  expect(firstCard).toBeTruthy()
  expect(firstCard.is_known).toBe(true)
})

