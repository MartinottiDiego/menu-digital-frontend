import { test, expect } from '@playwright/test';
import { fillReliably } from './utils';

test.describe('Admin', () => {
  test('la pantalla de login renderiza el formulario', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Panel de administración')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Ingresar al panel' })
    ).toBeVisible();
  });

  test('una ruta protegida sin sesión redirige al login', async ({ page }) => {
    await page.goto('/admin/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD;

test.describe('Admin (autenticado)', () => {
  test.skip(
    !ADMIN_EMAIL || !ADMIN_PASSWORD,
    'Sin credenciales: definí ADMIN_EMAIL/ADMIN_PASSWORD en el .env del backend (o E2E_ADMIN_* en miinutas/.env.local)'
  );

  // Solo lectura: loguea y recorre cada sección del panel. No crea ni edita nada.
  test('login real y recorrido de todas las secciones', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/admin/login');
    // Esperamos a que carguen los chunks y React hidrate: si clickeamos antes,
    // el form se envía nativo (GET) y recarga sin loguear (URL queda /login?).
    await page.waitForLoadState('networkidle');
    await fillReliably(page.locator('input[type="email"]'), ADMIN_EMAIL!);
    await fillReliably(page.locator('input[type="password"]'), ADMIN_PASSWORD!);
    await page.getByRole('button', { name: 'Ingresar al panel' }).click();

    // Login OK → entra al dashboard y se ve el chrome autenticado (sidebar).
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
    await expect(
      page.getByRole('button', { name: 'Cerrar sesión' }).first()
    ).toBeVisible();

    const sections = [
      '/admin/dashboard',
      '/admin/products',
      '/admin/categories',
      '/admin/combos',
      '/admin/orders',
      '/admin/settings',
      '/admin/analytics',
    ];

    for (const route of sections) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      // Sigue autenticado (no lo redirige al login) y renderiza contenido.
      await expect(page).toHaveURL(new RegExp(route.replace(/\//g, '\\/')));
      await expect(page.locator('main')).not.toBeEmpty();
    }

    expect(
      errors,
      `Errores JS en el panel:\n${errors.join('\n')}`
    ).toHaveLength(0);
  });
});
