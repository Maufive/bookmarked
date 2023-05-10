import { db } from '@/lib/db';
import { groupCreateSchema } from '@/lib/validations/group';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session) {
    //   return new Response('Unauthorized', { status: 403 });
    // }

    // const { user } = session;

    const json = await req.json();
    const body = groupCreateSchema.parse(json);

    console.log(body);

    const post = await db.group.create({
      data: {
        name: body.name,
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
