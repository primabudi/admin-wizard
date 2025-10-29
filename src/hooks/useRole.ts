import { useSearchParams } from 'react-router-dom';
import type { UserRole } from '../types';

export function useRole(): UserRole {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');

  if (roleParam === 'admin' || roleParam === 'ops') {
    return roleParam;
  }

  return 'ops';
}
