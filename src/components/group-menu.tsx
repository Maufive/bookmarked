'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronsUpDownIcon,
  PlusIcon,
  TrashIcon,
  Plus,
  Loader2,
  CheckIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupCreateSchema } from '@/lib/validations/group';
import { z } from 'zod';
import Spinner from './ui/spinner';
import { Prisma } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import Link from 'next/link';
import { toast } from './ui/use-toast';

const ALL_BOOKMARKS_TITLE = 'All bookmarks';

type FormData = z.infer<typeof groupCreateSchema>;
type GroupWithCount = Prisma.GroupGetPayload<{
  include: {
    _count: true;
  };
}>;

async function deleteGroup(groupId: number) {
  return await fetch(`/api/group/${groupId}`, {
    method: 'DELETE',
  });
}

async function addGroup(groupName: string) {
  return await fetch(`/api/group`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: groupName,
    }),
  });
}

type BadgeProps = {
  children: React.ReactNode;
};

function Badge({ children }: BadgeProps) {
  return (
    <span className="flex items-center justify-center h-5 w-5 bg-slate-200 text-slate-700 rounded-sm">
      {children}
    </span>
  );
}

export default function GroupMenu({
  groups,
  selectedGroup,
}: {
  groups: Array<GroupWithCount>;
  selectedGroup?: GroupWithCount;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(groupCreateSchema),
  });
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const isSubmitDisabled = isSaving || !isValid;
  const totalBookmarkCount = groups.reduce(
    (total, group) => total + group._count.bookmarks,
    0
  );

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    const response = await addGroup(data.name);

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your group was not saved. Please try again.',
        variant: 'destructive',
      });
    }

    toast({
      description: `Group ${data.name} has been saved.`,
    });

    setIsSaving(false);
    router.refresh();
  }

  async function handleConfirmDelete() {
    if (!selectedGroup) {
      return;
    }

    setIsDeleteLoading(true);

    const response = await deleteGroup(selectedGroup.id);

    if (response.ok) {
      toast({
        description: 'Group has been removed',
      });

      setIsDeleteLoading(false);
      setShowDeleteAlert(false);
      router.refresh();
      router.push('/');
    }
  }

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center text-secondary-foreground">
            {selectedGroup?.name ?? ALL_BOOKMARKS_TITLE}
            <ChevronsUpDownIcon className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[175px]">
            <DropdownMenuItem asChild>
              <Link
                className="flex items-center justify-between gap-2"
                href={`/`}
              >
                {!selectedGroup ? (
                  <>
                    {ALL_BOOKMARKS_TITLE} <CheckIcon className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {ALL_BOOKMARKS_TITLE} <Badge>{totalBookmarkCount}</Badge>
                  </>
                )}
              </Link>
            </DropdownMenuItem>
            {groups.map((group) => (
              <DropdownMenuItem key={group.id} asChild>
                <Link
                  className="flex items-center justify-between gap-2"
                  href={`/group/${group.id}`}
                >
                  {selectedGroup?.id === group.id ? (
                    <>
                      {group.name} <CheckIcon className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {group.name} <Badge>{group._count.bookmarks}</Badge>
                    </>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DialogTrigger
              className="flex gap-2 items-center cursor-pointer"
              asChild
            >
              <DropdownMenuItem>
                <PlusIcon className="h-3 w-3" /> New Group
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2"
              onSelect={() => setShowDeleteAlert(true)}
              disabled={!selectedGroup}
            >
              <TrashIcon className="h-3 w-3" /> Delete Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)} className="grid w-full gap-4">
            <DialogHeader>
              <DialogTitle>Add new Group</DialogTitle>
              <DialogDescription>
                Groups are used to categorise your bookmarks. Please enter a
                name for your group.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} autoComplete="off" />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name?.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitDisabled}>
                {isSaving ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Save Group
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete {selectedGroup?.name} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
