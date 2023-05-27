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
      <div className="fixed bottom-0 left-0 z-10 w-full h-16 p-2 md:static md:mb-5">
        <UrlInput groupId={group.id} userId={user?.id} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-muted-foreground">Title</h2>
        <Separator className="shrink-1" />
        <BookmarkList bookmarks={group?.bookmarks} />
      </div>
    </>
  );
}
