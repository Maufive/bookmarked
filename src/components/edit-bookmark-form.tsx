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

type FormData = z.infer<typeof editBookmarkSchema>;

export default function EditBookmarkForm({ bookmark }: { bookmark: Bookmark }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(editBookmarkSchema),
  });
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);

    const response = await fetch(`/api/bookmark/${bookmark.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
      }),
    });

    setIsSaving(false);

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
      <button
        type="submit"
        className={cn(buttonVariants())}
        disabled={hasEditedValues}
      >
        {isSaving && <Spinner />}
        <span>Save</span>
      </button>
    </form>
  );
}
