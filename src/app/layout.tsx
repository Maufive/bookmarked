import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/nav';
import { db } from '@/lib/db';
import PageLayout from '@/components/page-layout';
import { Toaster } from '@/components/toaster';
import { getCurrentUser } from '@/lib/session';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
  modal,
  ...rest
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const groups = await db.group.findMany({
    include: {
      _count: { select: { bookmarks: true } },
    },
  });

  return (
    <html lang="en">
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          inter.className
        )}
      >
        <Navigation groups={groups} user={user} />
        <PageLayout>{children}</PageLayout>
        <Toaster />
      </body>
    </html>
  );
}
