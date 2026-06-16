import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Parser mínimo de archivos .env (sin dependencia dotenv).
function readEnvFile(file: string): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch {
    /* archivo inexistente: ignoramos */
  }
  return out;
}

// Credenciales de admin para el test autenticado. Las tomamos (en orden):
// 1) variables de entorno ya presentes, 2) miinutas/.env.local (E2E_ADMIN_*),
// 3) el .env del backend (ADMIN_EMAIL/ADMIN_PASSWORD, que seedean el admin).
// Nunca se commitean: .env* está en .gitignore.
const feEnv = readEnvFile(path.join(__dirname, '.env.local'));
const beEnv = readEnvFile(
  path.join(__dirname, '..', 'menu-digital-backend', '.env')
);
process.env.E2E_ADMIN_EMAIL =
  process.env.E2E_ADMIN_EMAIL || feEnv.E2E_ADMIN_EMAIL || beEnv.ADMIN_EMAIL || '';
process.env.E2E_ADMIN_PASSWORD =
  process.env.E2E_ADMIN_PASSWORD ||
  feEnv.E2E_ADMIN_PASSWORD ||
  beEnv.ADMIN_PASSWORD ||
  '';

/**
 * Smoke tests E2E contra el entorno LOCAL.
 *
 * Requisitos:
 *  - Backend corriendo en http://localhost:4001
 *  - Front en http://localhost:3000 (si no está levantado, Playwright lo arranca
 *    con `pnpm dev` y lo reusa si ya está corriendo).
 *
 * Nota: `next dev --webpack` compila cada ruta on-demand la primera vez (lento).
 * Por eso corremos en SERIE (1 worker) y con timeouts holgados: en paralelo el
 * compilador se satura y las navegaciones dan timeout (falsos negativos).
 *
 * Alcance: SOLO LECTURA / cliente. Los tests no escriben en la base de datos
 * (no guardan settings, no crean combos/productos/pedidos), para no ensuciar
 * datos reales mientras el back local apunta a la DB de producción.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: 'http://localhost:3100',
    navigationTimeout: 90_000,
    actionTimeout: 15_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Levantamos un front DEDICADO en :3100 apuntando al backend local
  // (localhost:4001), aislado del dev del usuario (que usa dev tunnels y
  // requiere auth que el navegador limpio de Playwright no tiene).
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3100',
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      ...process.env,
      PORT: '3100',
      NEXT_PUBLIC_API_URL: 'http://localhost:4001',
      // `.next` separado para no chocar el lock del dev server del usuario.
      NEXT_DIST_DIR: '.next-e2e',
    },
  },
});
