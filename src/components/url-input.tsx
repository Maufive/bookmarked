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
import { ToastAction } from './ui/toast';
import Link from 'next/link';

async function addBookmark(url: string, groupId?: number) {
  return await fetch('/api/bookmark', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, groupId }),
  });
}

const schema = z.object({
  url: z.string().url(),
});

type Inputs = z.infer<typeof schema>;

export default function UrlInput({ groupId }: { groupId?: number }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (input) => {
    setIsLoading(true);
    try {
      const response = await addBookmark(input.url, groupId);

      if (response.ok) {
        const data = await response.json();

        if (data.isDuplicate) {
          toast({
            title: 'Bookmark already exists.',
            description: 'It looks like you have already saved this bookmark.',
            action: (
              <ToastAction altText="Go to bookmark" asChild>
                <Link href={`/bookmark/${data.id}`}>Go to bookmark</Link>
              </ToastAction>
            ),
          });
        } else {
          toast({
            description: 'Your bookmark has been saved.',
          });
        }
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
    router.refresh();
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
