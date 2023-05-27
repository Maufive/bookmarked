'use client';

import { BookmarkIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { Prisma } from '@prisma/client';
import { useParams } from 'next/navigation';
import UserAccountNav from './user-account-nav';
import Link from 'next/link';
import { GroupSelector } from './group-selector';

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
  totalBookmarksCount,
}: {
  groups: Array<GroupWithCount>;
  user?: BookmarkUser;
  totalBookmarksCount?: number;
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
          className="flex gap-2 items-center align-center text-brand"
        >
          <BookmarkIcon className="ml-auto h-4 w-4" fill="currentColor" />
          <h2 className="font-black hidden sm:block">Linkaroo</h2>
        </Link>
        {user && (
          <>
            <div className="flex justify-center sm:justify-end flex-auto">
              <GroupSelector
                groups={groups}
                selectedGroup={selectedGroup}
                totalBookmarksCount={totalBookmarksCount}
              />
            </div>
            <div className="flex justify-end flex-none">
              <UserAccountNav user={user} />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
