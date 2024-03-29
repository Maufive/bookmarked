"use client";

import { BookmarkIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { Group, Prisma } from "@prisma/client";
import { useParams } from "next/navigation";
import UserAccountNav from "./user-account-nav";
import Link from "next/link";
import { GroupSelector } from "./group-selector";
import { useEffect, useState } from "react";
import {
  GroupWithBookmarksCount,
  getGroupsForUserWithBookmarksCount,
} from "@/app/groups/actions";

type BookmarkUser = {
  email?: string | null;
  image?: string | null;
  name?: string | null;
};

export default function Header({
  user,
  totalBookmarksCount,
}: {
  user?: BookmarkUser;
  totalBookmarksCount?: number;
}) {
  const [groups, setGroups] = useState<Array<GroupWithBookmarksCount>>([]);

  useEffect(() => {
    const updateGroups = async () => {
      const updatedGroups = await getGroupsForUserWithBookmarksCount();

      setGroups(updatedGroups);
    };

    updateGroups();
  }, []);

  const params = useParams();
  const selectedGroup = groups.find(
    (group) => String(group.id) === params.groupId
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-10 w-full backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl gap-4 p-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-brand">
          <BookmarkIcon className="ml-auto size-4" fill="currentColor" />
          <h2 className="hidden font-black sm:block">Bookmarked</h2>
        </Link>
        {user && (
          <>
            <div className="flex flex-auto justify-center sm:justify-end">
              <GroupSelector
                groups={groups}
                selectedGroup={selectedGroup}
                totalBookmarksCount={totalBookmarksCount}
              />
            </div>
            <div className="flex flex-none justify-end">
              <UserAccountNav user={user} />
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
