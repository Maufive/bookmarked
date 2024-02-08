"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bookmark } from "@prisma/client";
import EditBookmarkForm from "./edit-bookmark-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Group = {
  id: number;
  name: string;
  color: string;
};

export default function EditBookmarkDialog({
  bookmark,
  groups,
}: {
  bookmark: Bookmark;
  groups: Group[];
}) {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setOpen(false);
      router.back();
    }
  };

  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Bookmark</DialogTitle>
          <DialogDescription>{bookmark.name}</DialogDescription>
        </DialogHeader>
        <EditBookmarkForm
          bookmark={bookmark}
          groups={groups}
          onClose={handleDialogClose}
        />
      </DialogContent>
    </Dialog>
  );
}
