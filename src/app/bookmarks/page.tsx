import BookmarkList from '@/components/bookmark-list';
import { Separator } from '@/components/ui/separator';
import UrlInput from '@/components/url-input';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { Bookmark, User } from '@prisma/client';
import { redirect } from 'next/navigation';

async function getBookmarksForUser(userId: User['id']) {
  return await db.bookmark.findMany({
    where: {
      userId: userId,
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
      <div className="mb-3 md:mb-5">
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
