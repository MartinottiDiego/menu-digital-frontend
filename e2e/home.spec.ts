import { test, expect } from '@playwright/test';

test.describe('Home', () => {
  test('carga el hero y el CTA al catálogo', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'confianza que vuelve'
    );
    await expect(
      page.getByRole('link', { name: 'Ver catálogo' })
    ).toBeVisible();
  });

  test('el tile "Cortes" lleva al catálogo filtrado por nombre', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: 'Cortes', exact: true }).first().click();
    await expect(page).toHaveURL(/\/menu\?cat=Cortes/);
    await expect(
      page.getByRole('heading', { name: 'Elegí tu corte' })
    ).toBeVisible();
  });
});
