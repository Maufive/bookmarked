import * as z from 'zod';
import { db } from '@/lib/db';
import getOpenGraphDataFromUrl from '@/lib/open-graph';

const bookmarkCreateSchema = z.object({
  url: z.string().url(),
  groupId: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = bookmarkCreateSchema.parse(json);

    const duplicate = await db.bookmark.findUnique({
      where: {
        url: body.url,
      },
    });

    if (duplicate) {
      return new Response(JSON.stringify({ ...duplicate, isDuplicate: true }));
    }

    const url = new URL(body.url);
    const og = await getOpenGraphDataFromUrl(body.url);
    // TODO: Check if OG fails.If it does, the user may have entered an invalid URL or something bad
    // we should not save this and instead return an error describing the problem

    const bookmark = await db.bookmark.create({
      data: {
        url: body.url,
        groupId: body.groupId,
        hostname: url.hostname,
        name: og.title ?? url.href,
        description: og.description,
        image: og.image,
        keywords: og.keywords,
        icon: og.icon,
        siteName: og.siteName,
      },
    });

    return new Response(JSON.stringify(bookmark));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    console.log(error);

    return new Response(null, { status: 500 });
  }
}
