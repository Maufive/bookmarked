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
      className="py-2 flex w-full gap-4 justify-between items-center lg:gap-2"
    >
      <img
        alt="Bookmark favicon"
        src={`https://www.google.com/s2/favicons?domain=${bookmark.hostname}&sz=48`}
        className="flex-none w-6 h-6 lg:w-4 lg:h-4 rounded-full"
      />
      <a
        href={bookmark.url}
        target="__blank"
        className="text-primary flex items-center gap-2 flex-auto min-w-0 flex-wrap lg:flex-nowrap"
      >
        <p className="text-primary truncate">{bookmark.name}</p>
        <span className="text-muted-foreground text-sm flex-none">
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
