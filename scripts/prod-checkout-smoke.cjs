/* Smoke de checkout REAL contra producción (Vercel + Railway).
 * Agrega un producto, completa el checkout (retiro) y verifica que el
 * POST /orders devuelva 201. NO completa el pago (se detiene en MercadoPago). */
const { chromium } = require('@playwright/test');

const SITE = 'https://miinutas.vercel.app';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const log = (...a) => console.log(...a);

  // 1) Menú → agregar un producto con stock
  await page.goto(SITE + '/menu', { waitUntil: 'domcontentloaded' });
  const addBtn = page
    .locator('button[aria-label="Agregar al carrito"]:not([disabled])')
    .first();
  await addBtn.waitFor({ state: 'visible', timeout: 30000 });
  await addBtn.click();
  log('✓ Producto agregado al carrito');

  // 2) Carrito → checkout
  await page.goto(SITE + '/cart', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /Continuar al checkout/i }).click();
  await page.waitForURL(/\/checkout/, { timeout: 30000 });
  log('✓ En checkout');

  // 3) Retiro en el local (evita dirección obligatoria)
  await page.getByRole('button', { name: /Retiro en el local/i }).click();

  // 4) Datos (resistente a hidratación)
  const fill = async (ph, val) => {
    const loc = page.getByPlaceholder(ph);
    await loc.waitFor({ state: 'visible', timeout: 15000 });
    for (let i = 0; i < 5; i++) {
      await loc.fill(val);
      if ((await loc.inputValue()) === val) break;
      await page.waitForTimeout(150);
    }
  };
  await fill('Martina Gómez', 'Test Prod (Claude)');
  await fill('236 555-1234', '2364725023');
  await fill('martina@email.com', 'test-prod@example.com');
  log('✓ Datos completados (retiro en local)');

  // 5) Escuchar el POST /orders y enviar
  const orderRespP = page
    .waitForResponse(
      (r) =>
        r.request().method() === 'POST' &&
        new URL(r.url()).pathname.endsWith('/orders'),
      { timeout: 30000 }
    )
    .catch(() => null);

  await page.getByRole('button', { name: /Pagar/i }).click();
  const resp = await orderRespP;

  if (!resp) {
    log('✗ No se observó el POST /orders (¿form no envió?)');
    await browser.close();
    process.exit(2);
  }

  const status = resp.status();
  let body = '';
  try {
    body = await resp.text();
  } catch {}
  log('POST /orders ->', status);
  log('body:', body.slice(0, 220));

  if (status === 201) {
    log('\n✅ CHECKOUT REAL OK: pedido creado en producción (201).');
    log('   (Queda pending sin pagar; expira solo a las 24h.)');
  } else {
    log('\n❌ Falló: status ' + status);
  }

  // No completamos el pago.
  await browser.close();
  process.exit(status === 201 ? 0 : 1);
})().catch((e) => {
  console.error('ERROR script:', e.message);
  process.exit(1);
});
