/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Spinner from './ui/spinner';
import { OpenGraphResponse } from '@/app/api/open-graph/route';

type UrlInputProps = {};

export default function UrlInput() {
  const [inputValue, setInputValue] = useState<string>('');
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [openGraphData, setOpenGraphData] = useState<OpenGraphResponse | null>(
    null
  );
  const isDialogOpen = Boolean(openGraphData);

  const handleOpenChange = (open: boolean) => {
    console.log('dialog open: ' + open);
    if (!open) {
      setOpenGraphData(null);
    }
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setInputValue(event.currentTarget.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleClickTrigger = async () => {
    if (!inputValue) {
      return;
    }

    setIsSubmitLoading(true);

    try {
      console.log('Fetching URL: ' + inputValue);
      const response = await fetch(`/api/open-graph?url=${inputValue}`);
      setIsSubmitLoading(false);

      if (response.ok) {
        const data = (await response.json()) as OpenGraphResponse;
        console.log(data);
        setOpenGraphData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickSave = async () => {
    if (!openGraphData) {
      return;
    }

    const response = await fetch('/api/bookmark', {
      method: 'POST',
      body: JSON.stringify(openGraphData),
    });
  };

  return (
    <form
      className="flex w-full items-center space-x-2"
      onSubmit={handleSubmit}
    >
      <Input
        placeholder="Add link here"
        type="url"
        className="shadow-md"
        onChange={handleChange}
        value={inputValue}
      />
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            type="submit"
            onClick={handleClickTrigger}
            disabled={isSubmitLoading}
          >
            {isSubmitLoading ? (
              <>
                <Spinner /> Processing...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Bookmark</DialogTitle>
            <DialogDescription>
              Make changes to the bookmark before saving it
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {openGraphData?.ogImage && (
              <div className="flex w-full mx-auto flex-col gap-4 items-center justify-center relative max-w-[250px]">
                <img
                  alt="Open graph image"
                  src={openGraphData?.ogImage.url}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={openGraphData?.ogTitle ?? 'Fallback string'}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">URL</Label>
              <Input id="url" value={openGraphData?.ogUrl ?? 'Fallback url'} />
            </div>
            {openGraphData?.ogDescription && (
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <p className="text-muted-foreground text-sm">
                  {openGraphData?.ogDescription}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleClickSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
