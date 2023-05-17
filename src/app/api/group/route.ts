import { db } from '@/lib/db';
import { groupCreateSchema } from '@/lib/validations/group';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response('Unauthorized', { status: 403 });
    }

    const json = await req.json();
    const body = groupCreateSchema.parse(json);

    const post = await db.group.create({
      data: {
        name: body.name,
        color: body.color,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(post));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
