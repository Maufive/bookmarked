import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user as
    | {
        id: string;
        name: string;
        email: string;
        image: string;
      }
    | undefined;
}
