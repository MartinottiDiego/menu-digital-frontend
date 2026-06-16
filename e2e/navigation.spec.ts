import { test, expect } from '@playwright/test';

/**
 * Secciones públicas con <h1> siempre presente: deben responder < 400, mostrar
 * su heading y no lanzar errores JS (excepciones no capturadas).
 */
const PAGES_WITH_HEADING: Array<{ path: string; heading?: string }> = [
  { path: '/combos', heading: 'Combos de la casa' },
  { path: '/nosotros' }, // el h1 es dinámico (settings.aboutTitle)
  { path: '/contacto', heading: 'Contacto y pedidos' },
  { path: '/mis-pedidos', heading: 'Mis pedidos' },
];

for (const { path, heading } of PAGES_WITH_HEADING) {
  test(`${path} carga sin errores`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(resp?.status() ?? 200).toBeLessThan(400);

    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    if (heading) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }

    expect(
      errors,
      `Errores JS en ${path}:\n${errors.join('\n')}`
    ).toHaveLength(0);
  });
}

/**
 * Carrito y checkout dependen del estado del carrito (acá está vacío), así que
 * solo verificamos que cargan sin crashear y renderizan contenido.
 */
for (const path of ['/cart', '/checkout']) {
  test(`${path} carga sin errores (carrito vacío)`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(resp?.status() ?? 200).toBeLessThan(400);
    await expect(page.locator('body')).not.toBeEmpty();

    expect(
      errors,
      `Errores JS en ${path}:\n${errors.join('\n')}`
    ).toHaveLength(0);
  });
}

test('el header navega entre secciones', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'Nosotros' }).first().click();
  await expect(page).toHaveURL(/\/nosotros/);
  await page.getByRole('link', { name: 'Contacto' }).first().click();
  await expect(page).toHaveURL(/\/contacto/);
});
