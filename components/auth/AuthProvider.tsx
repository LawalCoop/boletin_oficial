'use client';

import { SessionProvider } from 'next-auth/react';
import { UserDataProvider } from '@/contexts/UserDataContext';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <UserDataProvider>{children}</UserDataProvider>
    </SessionProvider>
  );
}
