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
import { useRouter } from 'next/navigation';

export default function EditBookmarkDialog({
  bookmark,
}: {
  bookmark: Bookmark;
}) {
  const router = useRouter();
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog defaultOpen={true} onOpenChange={handleDialogClose}>
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
