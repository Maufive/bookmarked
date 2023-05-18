'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Spinner from './ui/spinner';
import { useRouter } from 'next/navigation';
import { toast } from './ui/use-toast';
import { User } from '@prisma/client';

async function addBookmark(url: string, userId: User['id'], groupId?: number) {
  return await fetch('/api/bookmarks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, userId, groupId }),
  });
}

const schema = z.object({
  url: z.string().url(),
});

type Inputs = z.infer<typeof schema>;

export default function UrlInput({
  groupId,
  userId,
}: {
  groupId?: number;
  userId: User['id'];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (input) => {
    setIsLoading(true);
    try {
      const response = await addBookmark(input.url, userId, groupId);

      if (response.ok) {
        toast({
          description: 'Your bookmark has been saved.',
        });
      }
    } catch (error) {
      console.error(error);
    }

    router.refresh();
    reset({ url: '' });
    setIsLoading(false);
  };

  const isSubmitDisabled = Boolean(errors.url || !isValid);

  return (
    <>
      <form
        className="flex w-full items-center space-x-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Add link here"
          type="url"
          className="shadow-md"
          autoComplete="off"
          id="url"
          {...register('url')}
        />
        <Button type="submit" disabled={isSubmitDisabled}>
          {isLoading ? (
            <>
              <Spinner /> Saving...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add
            </>
          )}
        </Button>
      </form>
    </>
  );
}
