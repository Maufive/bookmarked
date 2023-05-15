'use client';

import Image from 'next/image';
import { MoreVertical, TrashIcon, Loader2 } from 'lucide-react';
import type { Bookmark } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { MouseEventHandler, useState } from 'react';
import Link from 'next/link';
import { toast } from './ui/use-toast';

async function deleteBookmark(bookmarkId: number) {
  return await fetch(`/api/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
  });
}

export function ListItemMenu({
  bookmark,
}: {
  bookmark: Pick<Bookmark, 'id' | 'url' | 'name' | 'hostname' | 'groupId'>;
}) {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const handleDeleteConfirm = async () => {
    setIsDeleteLoading(true);

    const response = await deleteBookmark(bookmark.id);

    if (response.ok) {
      toast({
        description: 'Bookmark has been removed',
      });
      setShowDeleteAlert(false);
      router.refresh();
    } else {
      toast({
        title: 'Something went wrong.',
        description: 'Your bookmark was not deleted. Please try again.',
        variant: 'destructive',
      });
    }

    setIsDeleteLoading(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex border-none h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/bookmarks/${bookmark.id}`} className="flex w-full">
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <TrashIcon className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

type ListItemProps = {
  bookmark: Pick<Bookmark, 'id' | 'url' | 'name' | 'hostname' | 'groupId'>;
};

function ListItem({ bookmark }: ListItemProps) {
  return (
    <li className="py-2 flex gap-2 justify-between">
      <a
        href={bookmark.url}
        target="__blank"
        className="text-primary flex items-center gap-2"
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
      <ListItemMenu bookmark={bookmark} />
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
