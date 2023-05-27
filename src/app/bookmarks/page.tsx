import BookmarkList from '@/components/bookmark-list';
import { Separator } from '@/components/ui/separator';
import UrlInput from '@/components/url-input';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';

async function getBookmarksForUser(userId: User['id']) {
  return await db.bookmark.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }

  const bookmarks = await getBookmarksForUser(user.id);

  return (
    <>
      <div className="fixed bottom-0 left-0 z-10 w-full p-4 md:p-0 md:static md:mb-5">
        <UrlInput userId={user.id} />
      </div>
      <div className="space-y-2">
        <h2 className="text-muted-foreground">Title</h2>
        <Separator />
        <BookmarkList bookmarks={bookmarks} />
      </div>
    </>
  );
}
