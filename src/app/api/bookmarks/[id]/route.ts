import * as z from 'zod';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/session';
import { editBookmarkSchema } from '@/lib/validations/bookmark';

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    await db.bookmark.delete({
      where: {
        id: Number(params.id),
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

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    const user = await getCurrentUser();

    if (!user) {
      return new Response(null, { status: 403 });
    }

    const body = await req.json();
    const bookmark = editBookmarkSchema.parse(body);

    // Update the user.
    await db.bookmark.update({
      where: {
        id: Number(params.id),
      },
      data: {
        name: bookmark.name,
        description: bookmark.description,
      },
    });

    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
