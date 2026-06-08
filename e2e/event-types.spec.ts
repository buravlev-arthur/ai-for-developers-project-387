import { test, expect } from '@playwright/test';

test.describe('Admin event types', () => {
  test('happy path: create new event type', async ({ page }) => {
    await page.goto('/owner/event-types');
    await expect(page.locator('.ant-card-head-title').filter({ hasText: 'Типы событий' })).toBeVisible();

    await page.getByRole('button', { name: /plus/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel('Название').fill('Собеседование');
    await page.getByLabel('Длительность (мин)').fill('45');
    await page.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();

    await expect(page.getByText('Собеседование').first()).toBeVisible();
  });

  test('error: validation - empty name', async ({ page }) => {
    await page.goto('/owner/event-types');

    await page.getByRole('button', { name: /plus/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel('Длительность (мин)').fill('45');
    await page.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('error: validation - empty duration', async ({ page }) => {
    await page.goto('/owner/event-types');

    await page.getByRole('button', { name: /plus/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByLabel('Название').fill('Тестовый тип');
    await page.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
