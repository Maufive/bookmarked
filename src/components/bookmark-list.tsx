'use client';

import Image from 'next/image';
import type { Bookmark } from '@prisma/client';
import Link from 'next/link';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';

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
      className="py-2 flex w-full gap-2 justify-between items-center"
    >
      <a
        href={bookmark.url}
        target="__blank"
        className="text-primary flex items-center gap-2 flex-1 shrink-1 flex-wrap"
      >
        <Image
          alt="Favicon"
          src={`https://www.google.com/s2/favicons?domain=${bookmark.hostname}`}
          width="16"
          height="16"
        />
        <p className="text-primary truncate shrink-1 break-words max-w-[300px] lg:max-w-[400px] min-w-[10px]">
          {bookmark.name}
        </p>
        <span className="text-muted-foreground text-sm shrink-0">
          {bookmark.hostname}
        </span>
      </a>
      <Link
        className="shrink-0"
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
