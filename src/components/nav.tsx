'use client';

import { BookmarkIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import GroupMenu from './group-menu';
import { Prisma } from '@prisma/client';
import { useParams } from 'next/navigation';
import UserAccountNav from './user-account-nav';
import { User } from 'next-auth';
import Link from 'next/link';

type GroupWithCount = Prisma.GroupGetPayload<{
  include: {
    _count: true;
  };
}>;

type BookmarkUser = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

export default function Header({
  groups,
  user,
}: {
  groups: Array<GroupWithCount>;
  user?: BookmarkUser;
}) {
  const params = useParams();
  const selectedGroup = groups.find(
    (group) => String(group.id) === params.groupId
  );

  return (
    <nav className="w-full h-[68px]">
      <div className="flex gap-4 mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex gap-2 items-center align-center text-primary"
        >
          <BookmarkIcon
            className="ml-auto h-4 w-4 text-sky-400"
            fill="currentColor"
          />
          <h2 className="font-black">Linkaroo</h2>
        </Link>
        <Separator orientation="vertical" />
        {user && (
          <>
            <ul>
              <li className="px-3 py-2 text-sm font-medium">
                <GroupMenu groups={groups} selectedGroup={selectedGroup} />
              </li>
            </ul>
            <div className="flex-grow flex justify-end">
              <UserAccountNav user={user} />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
