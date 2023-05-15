import EditBookmarkDialog from '@/components/edit-bookmark-dialog';
import { db } from '@/lib/db';
import { z } from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

type RouteContext = z.infer<typeof routeContextSchema>;

export default async function BookmarkDialog({ params }: RouteContext) {
  const bookmark = await db.bookmark.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  if (!bookmark) {
    return null;
  }

  return <EditBookmarkDialog bookmark={bookmark} />;
}
