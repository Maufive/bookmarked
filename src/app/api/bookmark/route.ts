import * as z from 'zod';
import { db } from '@/lib/db';

const bookmarkCreateSchema = z.object({
  url: z.string().url(),
  groupId: z.number(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bookmarkCreateSchema.parse(json);
    const url = new URL(body.url);

    const bookmark = await db.bookmark.create({
      data: {
        url: body.url,
        groupId: body.groupId,
        hostname: url.hostname,
      },
    });

    return new Response(JSON.stringify(bookmark));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
