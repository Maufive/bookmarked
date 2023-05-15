'use client';

import { Bookmark } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from './ui/textarea';
import Spinner from './ui/spinner';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';
import { useState } from 'react';
import { toast } from './ui/use-toast';
import { editBookmarkSchema } from '@/lib/validations/bookmark';
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

type FormData = z.infer<typeof editBookmarkSchema>;

async function deleteBookmark(bookmarkId: number) {
  return await fetch(`/api/bookmarks/${bookmarkId}`, {
    method: 'DELETE',
  });
}

async function updateBookmark(bookmarkId: number, data: FormData) {
  return await fetch(`/api/bookmarks/${bookmarkId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: data.name,
      description: data.description,
    }),
  });
}

export default function EditBookmarkForm({ bookmark }: { bookmark: Bookmark }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(editBookmarkSchema),
  });
  const router = useRouter();
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [isSavingLoading, setIsSavingLoading] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    setIsSavingLoading(true);

    const response = await updateBookmark(bookmark.id, data);

    setIsSavingLoading(false);

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'The bookmark was not updated. Please try again.',
        variant: 'destructive',
      });
    }

    toast({
      description: 'Your bookmark has been updated.',
    });

    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleteLoading(true);

    const response = await deleteBookmark(bookmark.id);

    if (response.ok) {
      toast({
        description: 'Bookmark has been removed',
      });
    } else {
      toast({
        title: 'Something went wrong.',
        description: 'Your bookmark was not deleted. Please try again.',
        variant: 'destructive',
      });
    }

    setIsDeleteLoading(false);

    router.refresh();
    router.back();
  };

  const hasEditedValues = !isDirty;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          autoComplete="off"
          defaultValue={bookmark.name ?? 'Default name'}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name?.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          autoComplete="off"
          defaultValue={bookmark.description ?? ''}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description?.message}</p>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-destructive'
          )}
          onClick={handleDeleteConfirm}
          disabled={isSavingLoading || isDeleteLoading}
        >
          {isDeleteLoading && <Spinner />}
          Delete bookmark
        </button>
        <button
          type="submit"
          className={cn(buttonVariants())}
          disabled={hasEditedValues || isDeleteLoading}
        >
          {isSavingLoading && <Spinner />}
          <span>Save changes</span>
        </button>
      </div>
    </form>
  );
}
