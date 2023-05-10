/* eslint-disable @next/next/no-img-element */
'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Spinner from './ui/spinner';
import { useRouter } from 'next/navigation';

type UrlInputProps = {
  groups: Array<{ id: number; name: string }>;
};

const schema = z.object({
  url: z.string().url(),
  groupId: z.string(),
});

type Inputs = z.infer<typeof schema>;

export default function UrlInput({ groups }: UrlInputProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (input) => {
    setIsLoading(true);
    try {
      const data = {
        ...input,
        groupId: Number(input.groupId),
      };

      const response = await fetch('/api/bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      // handle error
      console.error(error);
    }

    setIsLoading(false);
    // This forces a cache invalidation.
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
