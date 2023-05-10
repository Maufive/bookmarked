import BookmarkList from '@/components/bookmark-list';
import Header from '@/components/nav';
import PageLayout from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import UrlInput from '@/components/url-input';
import { db } from '@/lib/db';

export default async function Page({
  params,
}: {
  params: { groupId: string };
}) {
  const group = await db.group.findUnique({
    where: {
      id: Number(params.groupId),
    },
    include: {
      bookmarks: true,
    },
  });

  if (!group) {
    return <div>Could not find group with id {params.groupId}</div>;
  }

  return (
    <>
      <div className="mb-3 md:mb-5">
        <UrlInput />
      </div>
      <div className="space-y-2">
        <h2 className="text-muted-foreground">Title</h2>
        <Separator />
        <BookmarkList bookmarks={group?.bookmarks} />
      </div>
    </>
  );
}
