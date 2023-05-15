'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Bookmark } from '@prisma/client';
import EditBookmarkForm from './edit-bookmark-form';

export default function EditBookmarkDialog({
  bookmark,
}: {
  bookmark: Bookmark;
}) {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogDescription>{bookmark.name}</DialogDescription>
        </DialogHeader>
        <EditBookmarkForm bookmark={bookmark} />
      </DialogContent>
    </Dialog>
  );
}
