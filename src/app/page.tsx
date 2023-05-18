import { buttonVariants } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/bookmarks');
  }

  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12">
      <div className="container flex flex-col gap-4">
        <h1 className="font-heading text-3xl sm:text-5xl">
          Welcome to Linkaroo, the all-in-one bookmark haven!
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Say goodbye to scattered links and embrace the convenience of saving,
          organizing, and accessing all your favorite bookmarks effortlessly,
          from any device.
        </p>
        <div>
          <Link href="/login" className={cn(buttonVariants({ size: 'lg' }))}>
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
