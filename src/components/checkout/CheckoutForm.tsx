'use client';

import { useState } from 'react';
import type { CheckoutFormData, DeliveryMethod } from '@/lib/types';
import type { CheckoutFormErrors } from '@/lib/validations';
import { validateCheckoutForm } from '@/lib/validations';
import { Icon, type IconName } from '@/components/ui/Icons';
import { fmtPrice, cn } from '@/lib/utils';
import { useSettings } from '@/components/layout/SettingsProvider';

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  loading: boolean;
  total: number;
  deliveryMethod: DeliveryMethod;
  onDeliveryMethodChange: (m: DeliveryMethod) => void;
}

const INITIAL_DATA: Omit<CheckoutFormData, 'deliveryMethod'> = {
  customerName: '',
  customerPhone: '',
  customerAddress: '',
  customerZipCode: '',
  customerEmail: '',
  notes: '',
};

export function CheckoutForm({
  onSubmit,
  loading,
  total,
  deliveryMethod,
  onDeliveryMethodChange,
}: CheckoutFormProps) {
  const settings = useSettings();
  const [data, setData] = useState(INITIAL_DATA);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [addressError, setAddressError] = useState<string | undefined>();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isPickup = deliveryMethod === 'pickup';

  const handleChange = (field: keyof typeof INITIAL_DATA, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (field === 'customerAddress' && value.trim()) setAddressError(undefined);
    if ((field === 'customerName' || field === 'customerPhone' || field === 'customerEmail') && touched[field]) {
      const newErrors = validateCheckoutForm({
        customerName: field === 'customerName' ? value : data.customerName,
        customerPhone: field === 'customerPhone' ? value : data.customerPhone,
        customerEmail: field === 'customerEmail' ? value : data.customerEmail,
      });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof typeof newErrors] }));
    }
  };

  const handleBlur = (field: 'customerName' | 'customerPhone' | 'customerEmail') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateCheckoutForm({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    });
    setErrors((prev) => ({ ...prev, [field]: newErrors[field as keyof typeof newErrors] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateCheckoutForm({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
    });
    setErrors(newErrors);
    setTouched({ customerName: true, customerPhone: true, customerEmail: true });

    // La dirección es obligatoria solo para delivery.
    const addrErr =
      deliveryMethod === 'delivery' && !data.customerAddress?.trim()
        ? 'Ingresá una dirección para el delivery'
        : undefined;
    setAddressError(addrErr);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors || !data.customerName.trim() || !data.customerPhone.trim() || addrErr) {
      return;
    }

    onSubmit({
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      // En retiro no mandamos dirección.
      customerAddress: isPickup ? undefined : data.customerAddress?.trim() || undefined,
      customerZipCode: isPickup ? undefined : data.customerZipCode?.trim() || undefined,
      customerEmail: data.customerEmail?.trim() || undefined,
      deliveryMethod,
      notes: data.notes?.trim() || undefined,
    });
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const missingRequired =
    !data.customerName.trim() ||
    !data.customerPhone.trim() ||
    !data.customerEmail?.trim() ||
    (deliveryMethod === 'delivery' && !data.customerAddress?.trim());
  const isDisabled = hasErrors || missingRequired || loading;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Método de entrega */}
      <section>
        <h2 className="font-display mb-4 text-[22px] text-cream lg:text-[26px]">
          Método de entrega
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onDeliveryMethodChange('delivery')}
            className={cn('opt-card w-full border-0 text-left', !isPickup && 'sel')}
          >
            <span className="dot" />
            <span className="oi">
              <Icon.truck />
            </span>
            <div>
              <div className="text-[14.5px] font-bold text-cream">
                Delivery a domicilio
              </div>
              <div className="text-[12.5px] text-tan-dim">Hoy · antes de las 22h</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onDeliveryMethodChange('pickup')}
            className={cn('opt-card w-full border-0 text-left', isPickup && 'sel')}
          >
            <span className="dot" />
            <span className="oi">
              <Icon.storefront />
            </span>
            <div>
              <div className="text-[14.5px] font-bold text-cream">
                Retiro en el local
              </div>
              <div className="text-[12.5px] text-tan-dim">Sin cargo · pasás a buscarlo</div>
            </div>
          </button>
        </div>
      </section>

      {/* Datos */}
      <section>
        <h2 className="font-display mb-4 text-[22px] text-cream lg:text-[26px]">
          Tus datos
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DesignField
            label="Nombre completo *"
            icon="user"
            name="name"
            autoComplete="name"
            placeholder="Martina Gómez"
            value={data.customerName}
            onChange={(v) => handleChange('customerName', v)}
            onBlur={() => handleBlur('customerName')}
            error={errors.customerName}
            disabled={loading}
          />
          <DesignField
            label="Teléfono *"
            icon="phone"
            type="tel"
            name="tel"
            autoComplete="tel"
            placeholder="236 555-1234"
            value={data.customerPhone}
            onChange={(v) => handleChange('customerPhone', v)}
            onBlur={() => handleBlur('customerPhone')}
            error={errors.customerPhone}
            disabled={loading}
          />
          <div className="sm:col-span-2">
            <DesignField
              label="Email *"
              icon="mail"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="martina@email.com"
              value={data.customerEmail || ''}
              onChange={(v) => handleChange('customerEmail', v)}
              onBlur={() => handleBlur('customerEmail')}
              error={errors.customerEmail}
              disabled={loading}
            />
          </div>

          {/* Dirección: solo delivery */}
          {!isPickup && (
            <>
              <div className="sm:col-span-2">
                <DesignField
                  label="Dirección de entrega *"
                  icon="mapPin"
                  name="street-address"
                  autoComplete="street-address"
                  placeholder="Belgrano 842"
                  value={data.customerAddress || ''}
                  onChange={(v) => handleChange('customerAddress', v)}
                  error={addressError}
                  disabled={loading}
                />
              </div>
              <DesignField
                label="Código postal"
                name="postal-code"
                autoComplete="postal-code"
                placeholder="6000"
                value={data.customerZipCode || ''}
                onChange={(v) => handleChange('customerZipCode', v)}
                disabled={loading}
              />
            </>
          )}

          {/* Info del local: solo retiro */}
          {isPickup && (
            <div className="sm:col-span-2">
              <div
                className="flex items-start gap-3.5 rounded-[13px] p-[15px_16px]"
                style={{
                  background: 'linear-gradient(180deg,var(--card-a),var(--card-b))',
                  boxShadow: 'inset 0 0 0 1px var(--line)',
                }}
              >
                <span
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] text-gold"
                  style={{ background: 'rgba(216,162,62,.12)' }}
                >
                  <Icon.storefront style={{ width: 20, height: 20 }} />
                </span>
                <div>
                  <div className="text-[13px] font-bold text-cream">Retirás en</div>
                  <div className="mt-0.5 text-[13.5px] text-tan">{settings.address}</div>
                  <div className="mt-0.5 text-[12.5px] text-tan-dim">{settings.hours}</div>
                </div>
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <div className="field">
              <span className="field-lbl">Notas (opcional)</span>
              <div className="field-input" style={{ height: 'auto', padding: '12px 15px' }}>
                <textarea
                  value={data.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value.slice(0, 500))}
                  placeholder={isPickup ? 'Ej: paso a buscarlo a las 20h' : 'Ej: tocar timbre 2 veces'}
                  rows={2}
                  maxLength={500}
                  disabled={loading}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pago */}
      <section>
        <h2 className="font-display mb-4 text-[22px] text-cream lg:text-[26px]">
          Pago
        </h2>
        <div className="opt-card sel">
          <span className="dot" />
          <span className="oi">
            <Icon.creditCard />
          </span>
          <div className="flex-1">
            <div className="text-[14.5px] font-bold text-cream">Mercado Pago</div>
            <div className="text-[12.5px] text-tan-dim">
              Tarjeta, débito, dinero en cuenta. Pago protegido.
            </div>
          </div>
          <Icon.lock style={{ width: 18, height: 18, color: 'var(--gold)' }} />
        </div>
      </section>

      <button
        type="submit"
        disabled={isDisabled}
        className="btn btn-gold h-[54px] w-full text-[14.5px]"
        style={isDisabled ? { opacity: 0.55, cursor: 'not-allowed' } : undefined}
      >
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#2a1c08] border-t-transparent" />
            Procesando…
          </>
        ) : (
          <>
            <Icon.lock style={{ width: 17, height: 17 }} /> Pagar {fmtPrice(total)}
          </>
        )}
      </button>
      <p className="-mt-3 text-center text-[11.5px] text-tan-dim">
        El precio final se ajusta según el peso real de cada corte.
      </p>
    </form>
  );
}

function DesignField({
  label,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  name,
  autoComplete,
}: {
  label: string;
  icon?: IconName;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  /** Para que Chrome/Google ofrezca autocompletar con los datos guardados. */
  name?: string;
  autoComplete?: string;
}) {
  const I = icon ? Icon[icon] : null;
  return (
    <div className="field">
      <span className="field-lbl">{label}</span>
      <div
        className="field-input"
        style={error ? { boxShadow: 'inset 0 0 0 1.5px #d4796b' } : undefined}
      >
        {I && <I />}
        <input
          type={type}
          name={name}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      </div>
      {error && <span className="text-[12px]" style={{ color: '#d4796b' }}>{error}</span>}
    </div>
  );
}
