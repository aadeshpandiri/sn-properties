'use client';

import { useAuthContext } from '@/components/Providers';

export const useAuth = () => {
  const { user, loading, isAdmin } = useAuthContext();
  return { user, loading, isAdmin };
};
