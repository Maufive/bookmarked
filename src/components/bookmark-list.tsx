import Image from 'next/image';
import type { Bookmark } from '@prisma/client';
import Link from 'next/link';

type ListItemProps = {
  bookmark: Pick<Bookmark, 'id' | 'url' | 'name' | 'hostname' | 'groupId'>;
};

function ListItem({ bookmark }: ListItemProps) {
  return (
    <li className="py-2 flex gap-2 justify-between">
      <a
        href={bookmark.url}
        target="__blank"
        className="text-primary flex items-center gap-2 flex-1"
      >
        <Image
          alt="Favicon"
          src={`https://www.google.com/s2/favicons?domain=${bookmark.hostname}`}
          width="16"
          height="16"
        />
        <p className="text-primary truncate max-w-[400px]">{bookmark.name}</p>
        <span className="text-muted-foreground text-sm">
          {bookmark.hostname}
        </span>
      </a>
      <Link href={`/bookmarks/${bookmark.id}`}>Edit</Link>
    </li>
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
    <ul className="space-y-2">
      {bookmarks.map((bookmark) => (
        <ListItem key={bookmark.id} bookmark={bookmark} />
      ))}
    </ul>
  );
}
