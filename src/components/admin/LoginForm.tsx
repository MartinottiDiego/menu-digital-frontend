'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/useToast';
import { validateLoginForm, type LoginFormErrors } from '@/lib/validations';
import { Eye, EyeOff } from 'lucide-react';
import { Icon } from '@/components/ui/Icons';

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value);
    else setPassword(value);
    if (touched[field]) {
      const newErrors = validateLoginForm({
        email: field === 'email' ? value : email,
        password: field === 'password' ? value : password,
      });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateLoginForm({ email, password });
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateLoginForm({ email, password });
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const { access_token } = await api.login(email.trim(), password);
      useAuthStore.getState().login(access_token);
      toast.success('Bienvenido de vuelta');
      router.push('/admin/dashboard');
    } catch {
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="field">
        <span className="field-lbl">Email</span>
        <div
          className="field-input"
          style={errors.email ? { boxShadow: 'inset 0 0 0 1.5px #d4796b' } : undefined}
        >
          <Icon.mail />
          <input
            type="email"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="admin@miinuta.com"
            disabled={loading}
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <span className="text-[12px]" style={{ color: '#d4796b' }}>
            {errors.email}
          </span>
        )}
      </div>

      <div className="field">
        <span className="field-lbl">Contraseña</span>
        <div
          className="field-input"
          style={errors.password ? { boxShadow: 'inset 0 0 0 1.5px #d4796b' } : undefined}
        >
          <Icon.lock />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="••••••••"
            disabled={loading}
            autoComplete="current-password"
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={loading}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="ml-1 flex shrink-0 items-center justify-center text-tan-dim transition-colors hover:text-gold"
          >
            {showPassword ? (
              <EyeOff style={{ width: 18, height: 18 }} />
            ) : (
              <Eye style={{ width: 18, height: 18 }} />
            )}
          </button>
        </div>
        {errors.password && (
          <span className="text-[12px]" style={{ color: '#d4796b' }}>
            {errors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-gold mt-1 h-[52px] w-full text-[14px]"
        style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
      >
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#2a1c08] border-t-transparent" />
            Iniciando sesión…
          </>
        ) : (
          'Ingresar al panel'
        )}
      </button>
    </form>
  );
}
