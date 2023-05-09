import * as z from 'zod';
import { db } from '@/lib/db';

const routeContextSchema = z.object({
  params: z.object({
    bookmarkId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    // Validate the route params.
    const { params } = routeContextSchema.parse(context);

    // Check if the user has access to this bookmark.
    // if (!(await verifyCurrentUserHasAccessToPost(params.postId))) {
    //   return new Response(null, { status: 403 });
    // }

    // Delete the post.
    await db.bookmark.delete({
      where: {
        id: Number(params.bookmarkId),
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
