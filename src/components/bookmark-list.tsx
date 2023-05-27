'use client';

import type { Bookmark } from '@prisma/client';
import Link from 'next/link';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

type ListItemProps = {
  bookmark: Pick<Bookmark, 'id' | 'url' | 'name' | 'hostname' | 'groupId'>;
};

function ListItem({ bookmark }: ListItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout="position"
      className="flex w-full items-center justify-between gap-4 py-2 lg:gap-2"
    >
      <img
        alt="Bookmark favicon"
        src={`https://www.google.com/s2/favicons?domain=${bookmark.hostname}&sz=48`}
        className="h-6 w-6 flex-none rounded-full lg:h-4 lg:w-4"
      />
      <a
        href={bookmark.url}
        target="__blank"
        className="flex min-w-0 flex-auto flex-wrap items-center gap-2 text-primary lg:flex-nowrap"
      >
        <p className="truncate text-primary">{bookmark.name}</p>
        <span className="flex-none text-sm text-muted-foreground">
          {bookmark.hostname}
        </span>
      </a>
      <Link
        className={cn(buttonVariants({ variant: 'ghost' }), 'flex-none')}
        href={`/bookmarks/groups/${bookmark.groupId}/bookmark/${bookmark.id}`}
      >
        Edit
      </Link>
    </motion.li>
  );
}

export default function BookmarkList({
  bookmarks,
}: {
  bookmarks: Array<
    Pick<Bookmark, 'id' | 'url' | 'name' | 'hostname' | 'groupId'>
  >;
}) {
  return (
    <LayoutGroup>
      <ul className="space-y-2">
        <AnimatePresence>
          {bookmarks.map((bookmark) => (
            <ListItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </AnimatePresence>
      </ul>
    </LayoutGroup>
  );
}
