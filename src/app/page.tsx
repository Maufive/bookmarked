import { buttonVariants } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/bookmarks');
  }

  return (
    <>
      <h1 className="title-effect animate-title text-center text-3xl font-medium sm:text-5xl">
        Welcome to Bookmarked, the all-in-one bookmark haven!
      </h1>
      <p className="animate-description max-w-[42rem] text-center leading-normal text-muted-foreground sm:text-xl sm:leading-8">
        Say goodbye to scattered links and embrace the convenience of saving,
        organizing, and accessing all your favorite bookmarks effortlessly, from
        any device.
      </p>
      <div className="animate-cta flex w-full justify-center">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'items-center font-medium'
          )}
        >
          Get Started
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </>
  );
}
