import BookmarkList from '@/components/bookmark-list';
import { Separator } from '@/components/ui/separator';
import UrlInput from '@/components/url-input';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { groupId: string };
}) {
  const user = await getCurrentUser();
  const group = await db.group.findUnique({
    where: {
      id: Number(params.groupId),
    },
    include: {
      bookmarks: true,
    },
  });

  if (!user) {
    redirect(authOptions?.pages?.signIn || '/login');
  }

  if (!group) {
    return <div>Could not find group with id {params.groupId}</div>;
  }

  return (
    <>
      <div className="mb-3 md:mb-5">
        <UrlInput groupId={group.id} userId={user?.id} />
      </div>
      <div className="space-y-2">
        <h2 className="text-muted-foreground">Title</h2>
        <Separator />
        <BookmarkList bookmarks={group?.bookmarks} />
      </div>
    </>
  );
}
