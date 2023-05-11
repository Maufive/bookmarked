import './globals.css';
import { Inter } from 'next/font/google';
import Navigation from '@/components/nav';
import { db } from '@/lib/db';
import PageLayout from '@/components/page-layout';
import { Toaster } from '@/components/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) {
  const groups = await db.group.findMany({
    include: {
      _count: { select: { bookmarks: true } },
    },
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation groups={groups} />
        <PageLayout>{children}</PageLayout>
        <Toaster />
      </body>
    </html>
  );
}
