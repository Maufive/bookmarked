import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface BookmarkLayoutProps {
  children: React.ReactNode;
}

export default function BookmarkLayout({ children }: BookmarkLayoutProps) {
  return (
    <>
      <div>
        <Link
          href="/bookmarks"
          className={cn(buttonVariants({ variant: 'ghost' }))}
        >
          <ChevronLeft className="mr-2 size-4" />
          Bookmarks
        </Link>
      </div>
      {children}
    </>
  );
}
