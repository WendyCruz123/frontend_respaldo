'use client';

import { Button, Input } from '@nextui-org/react';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import * as Yup from 'yup';
import API from '@/lib/axios';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Correo inválido').required('Requerido'),
    password: Yup.string().required('Requerido'),
  });

  const handleLogin = useCallback(
    async (values: typeof initialValues) => {
      try {
        const res = await API.post('/auth/login', {
          email: values.email,
          password: values.password,
        });

        const { accessToken, refreshToken } = res.data;

        document.cookie = `accessToken=${accessToken}; path=/; max-age=3600;`;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`;

        sessionStorage.setItem('refreshToken', refreshToken);

        router.push('/');
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Error al iniciar sesión';
        setError(message);
        console.error('Login error:', err.response || err);
      }
    },
    [router]
  );

  return (
  <div className="w-full max-w-md bg-white/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-black/20">


      <h1 className="text-2xl font-bold text-center mb-6 text-black">Iniciar Sesión</h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded text-center">
          {error}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <div className="flex flex-col gap-4">
            <Input
              variant="bordered"
              label="Correo"
              type="email"
              value={values.email}
              isInvalid={!!errors.email && touched.email}
              errorMessage={errors.email}
              onChange={handleChange('email')}
              radius="sm"
            />

            <Input
              variant="bordered"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              isInvalid={!!errors.password && touched.password}
              errorMessage={errors.password}
              onChange={handleChange('password')}
              radius="sm"
              endContent={
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5 text-default-500" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-default-500" />
                  )}
                </button>
              }
            />

            <Button color="primary" onPress={() => handleSubmit()}>
              Entrar
            </Button>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;