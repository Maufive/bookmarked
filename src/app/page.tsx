import BookmarkList from '@/components/bookmark-list';
import { Separator } from '@/components/ui/separator';
import UrlInput from '@/components/url-input';
import { db } from '@/lib/db';

export default async function Home() {
  const bookmarks = await db.bookmark.findMany();

  return (
    <>
      <div className="mb-3 md:mb-5">
        <UrlInput groupId={1} />
      </div>
      <div className="space-y-2">
        <h2 className="text-muted-foreground">Title</h2>
        <Separator />
        <BookmarkList bookmarks={bookmarks} />
      </div>
    </>
  );
}
