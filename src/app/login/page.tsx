'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/contact-us/FormModal';
import CustomAlert from '@/components/utils/CustomAlert';
import Helmet from '@/components/utils/config/Helmet';

interface LoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    password: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>(
    'success'
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        'https://blog.ibidunlayiojo.com/wp-json/jwt-auth/v1/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_display_name', data.user_display_name);
        localStorage.setItem('user_email', data.user_email);
        setIsLoggedIn(true);
        showNotification('Successfully logged in!', 'success');
        router.push('/');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : 'Login failed',
        'error'
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_display_name');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
  };

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning'
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <>
      <Helmet pageKey='login' />

      <section className='p-4 md:p-0'>
        <div className='text-center w-4/5 mx-auto mt-12 '>
          <img
            src='/assets/logo.png'
            className='md:h-16 h-14 w-auto mx-auto my-1'
            alt='flowing rivers logo'
          />
        </div>
        <section className='max-w-xl mx-auto p-6 md:mt-32 mt-16 shadow-lg rounded-md '>
          {showAlert && (
            <div className='pt-20'>
              <CustomAlert variant={alertType}>{alertMessage}</CustomAlert>
            </div>
          )}

          {!isLoggedIn ? (
            <div className='space-y-4'>
              <h2 className='text-xl font-bold'>Login to Comment</h2>
              <form onSubmit={handleLogin} className='space-y-4'>
                <FormField
                  label='Email Address'
                  name='username'
                  type='username'
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                />
                <FormField
                  label='Password'
                  name='password'
                  type='password'
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
                <button
                  type='submit'
                  className='w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 mb-6'>
                  Login
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className='flex justify-center items-center mb-4'>
                <button
                  onClick={handleLogout}
                  className='text-red-500 hover:text-red-700'>
                  Logout
                </button>
              </div>
            </div>
          )}
        </section>
      </section>
      <div className='absolute bottom-0 w-full'>
        <div className='flex justify-between'>
          <img
            src='/assets/logo-r.png'
            alt=''
            className='md:h-40 h-28 w-auto'
          />
          <img
            src='/assets/logo-l.png}'
            alt=''
            className='md:h-40 h-28 w-auto'
          />
        </div>
      </div>
    </>
  );
};

export default Login;
