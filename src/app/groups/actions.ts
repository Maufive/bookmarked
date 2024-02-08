"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Prisma } from "@prisma/client";

export async function getGroupsForUser() {
  const user = await getCurrentUser();
  const groups = await db.group.findMany({
    where: {
      userId: user?.id,
    },
  });

  return groups;
}

export type GroupWithBookmarksCount = Prisma.GroupGetPayload<{
  include: {
    _count: {
      select: {
        bookmarks: true;
      };
    };
  };
}>;

export async function getGroupsForUserWithBookmarksCount(): Promise<
  GroupWithBookmarksCount[]
> {
  const user = await getCurrentUser();
  const groups = await db.group.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      _count: {
        select: {
          bookmarks: true,
        },
      },
    },
  });

  return groups;
}
