import { expect, type Locator } from '@playwright/test';

/**
 * Rellena un input de forma resistente a la hidratación de React.
 *
 * Si interactuás apenas con `domcontentloaded`, React puede hidratar DESPUÉS
 * del fill y resetear el input controlado a su estado inicial (''), perdiendo
 * lo tipeado. `toPass` reintenta el fill hasta que el valor realmente queda.
 */
export async function fillReliably(locator: Locator, value: string) {
  await locator.waitFor({ state: 'visible' });
  await expect(async () => {
    await locator.fill(value);
    await expect(locator).toHaveValue(value, { timeout: 500 });
  }).toPass({ timeout: 10_000 });
}
