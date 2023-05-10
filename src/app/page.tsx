import BookmarkList from '@/components/bookmark-list';
import Header from '@/components/header';
import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import UrlInput from '@/components/url-input';
import { db } from '@/lib/db';

export default async function Home() {
  const groups = await db.group.findMany({
    include: {
      _count: { select: { bookmarks: true } },
    },
  });
  const bookmarks = await db.bookmark.findMany();

  return (
    <>
      <Header groups={groups} />
      <PageLayout>
        <div className="mb-3 md:mb-5">
          <UrlInput groups={groups} />
        </div>
        <div className="space-y-2">
          <h2 className="text-muted-foreground">Title</h2>
          <Separator />
          <BookmarkList bookmarks={bookmarks} />
        </div>
      </PageLayout>
    </>
  );
}
