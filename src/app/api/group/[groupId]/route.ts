import * as z from 'zod';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { groupCreateSchema } from '@/lib/validations/group';

const routeContextSchema = z.object({
  params: z.object({
    groupId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    await db.group.delete({
      where: {
        id: Number(params.groupId),
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
    const group = groupCreateSchema.parse(body);

    // Update the group.
    await db.group.update({
      where: {
        id: Number(params.groupId),
      },
      data: {
        name: group.name,
        color: group.color,
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
