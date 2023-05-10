import { db } from '@/lib/db';

export default async function Page({
  params,
}: {
  params: { bookmarkId: string };
}) {
  const bookmark = await db.bookmark.findUnique({
    where: {
      id: Number(params.bookmarkId),
    },
  });
  console.log(bookmark);
  return <div>Hello World</div>;
}
