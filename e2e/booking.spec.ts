import { test, expect } from '@playwright/test';

function getNextWeekday(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

test.describe('Guest booking', () => {
  test('happy path: full booking flow', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Календарь Cal.me')).toBeVisible();

    await page.getByRole('button', { name: 'Записаться' }).click();
    await page.waitForURL('/booking');
    await expect(page.getByText('Тип встречи', { exact: true })).toBeVisible();

    await page.getByText('Консультация', { exact: true }).click();

    const dateStr = fmt(getNextWeekday());
    await page.locator(`[title="${dateStr}"]`).click();

    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().waitFor();
    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().click();

    await page.getByRole('button', { name: 'Продолжить' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel('Имя').fill('Иван Петров');
    await page.getByLabel('Email').fill('ivan@example.com');
    await page.getByRole('button', { name: 'Записаться' }).click();

    await expect(page.getByText('Вы записаны')).toBeVisible();
    await expect(page.getByText('Иван Петров')).toBeVisible();
    await expect(page.getByText('ivan@example.com')).toBeVisible();
    await expect(page.getByText('Консультация')).toBeVisible();
  });

  test('error: validation - empty name', async ({ page }) => {
    await page.goto('/booking');
    await expect(page.getByText('Тип встречи', { exact: true })).toBeVisible();

    await page.getByText('Консультация', { exact: true }).click();
    await page.locator(`[title="${fmt(getNextWeekday())}"]`).click();
    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().waitFor();
    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().click();

    await page.getByRole('button', { name: 'Продолжить' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Записаться' }).click();

    await expect(page.getByText('Введите имя')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('error: validation - invalid email', async ({ page }) => {
    await page.goto('/booking');
    await expect(page.getByText('Тип встречи', { exact: true })).toBeVisible();

    await page.getByText('Консультация', { exact: true }).click();
    await page.locator(`[title="${fmt(getNextWeekday())}"]`).click();
    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().waitFor();
    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().click();

    await page.getByRole('button', { name: 'Продолжить' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel('Имя').fill('Иван');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByRole('button', { name: 'Записаться' }).click();

    await expect(page.getByText('Некорректный email')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('error: API failure shows retry card', async ({ page }) => {
    await page.route('**/api/appointments', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/booking');
    await expect(page.getByText('Тип встречи', { exact: true })).toBeVisible();

    await page.getByText('Консультация', { exact: true }).click();
    await page.locator(`[title="${fmt(getNextWeekday())}"]`).click();
    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().waitFor();
    await page.locator('.ant-tag').filter({ hasText: 'свободно' }).first().click();

    await page.getByRole('button', { name: 'Продолжить' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel('Имя').fill('Иван Петров');
    await page.getByLabel('Email').fill('ivan@example.com');
    await page.getByRole('button', { name: 'Записаться' }).click();

    await expect(page.getByText('Не удалось создать бронь')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Попробовать ещё раз' })).toBeVisible();
  });
});
