'use client'

import { useState } from 'react';
import { signIn } from "next-auth/react";
import { Translate } from '@/app/i18n/client';

export default function EnhancedLoginPage({ params: { lng } }) {
  const { t } = Translate(lng, '',"")
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    // Basic client-side validation
    if (!username || !password) {
        setError("All fields are required.");
        return;
    }

    const result = await signIn("credentials", {
        username,
        password,
        redirect: false,   // Handle the redirect manually
    });

    console.log("signIn result:", result);

    if (result) {
      if (result.error === 'CredentialsSignin' || result.status === 401) {
          setError("Invalid username or password");
      } else {
          // Check if the referrer is from the same origin
          if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
              // Safe to navigate back
              window.history.back();
          } else {
              // Navigate to a default page, e.g., homepage
              window.location.href = "/";
          }
      }
  } else {
      setError("An unexpected error occurred.");
  }
  
  };


  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('Signintitle')}
          </h2>
        </div>
        {error && (
          <div className="text-center text-red-500">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('Username')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('password')}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-slate-500 dark:text-amber-200 focus:ring-amber-400 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                {t('Rememberme')}
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-slate-500 dark:text-amber-200 hover:text-indigo-500">
                {t('Forgotpassword')}
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-slate-500 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('signin')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}