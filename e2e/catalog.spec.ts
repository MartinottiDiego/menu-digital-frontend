import { test, expect } from '@playwright/test';
import { fillReliably } from './utils';

test.describe('Catálogo', () => {
  test('muestra el buscador y el tab "Todos"', async ({ page }) => {
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    await expect(page.getByPlaceholder('Buscar productos…')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Todos' })).toBeVisible();
  });

  test('agregar un producto incrementa el contador del carrito', async ({
    page,
  }) => {
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    const addButtons = page.getByRole('button', { name: 'Agregar al carrito' });

    // Esperar a que aparezca al menos un producto o el empty state.
    await Promise.race([
      addButtons
        .first()
        .waitFor({ state: 'visible' })
        .catch(() => {}),
      page
        .getByText('No encontramos productos')
        .waitFor({ state: 'visible' })
        .catch(() => {}),
    ]);

    const count = await addButtons.count();
    test.skip(count === 0, 'No hay productos en la DB local para probar el carrito');

    await addButtons.first().click();
    await expect(page.locator('.badge-count').first()).toBeVisible();
  });

  test('buscar un texto inexistente muestra el empty state con "Limpiar filtros"', async ({
    page,
  }) => {
    await page.goto('/menu', { waitUntil: 'domcontentloaded' });
    await fillReliably(
      page.getByPlaceholder('Buscar productos…'),
      'zzz-no-existe-xyz'
    );
    await expect(page.getByText('No encontramos productos')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Limpiar filtros' })
    ).toBeVisible();
  });
});
