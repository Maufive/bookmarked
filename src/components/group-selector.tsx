'use client';

import * as React from 'react';
import {
  Check,
  ChevronsUpDown,
  Edit2,
  Loader2,
  Plus,
  PlusIcon,
  SaveIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DialogClose } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { Group, Prisma } from '@prisma/client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupCreateSchema } from '@/lib/validations/group';
import { Input } from './ui/input';
import { z } from 'zod';
import Spinner from './ui/spinner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';

type GroupEditValues = Pick<Group, 'name' | 'color'>;
type FormData = z.infer<typeof groupCreateSchema>;
type GroupWithCount = Prisma.GroupGetPayload<{
  include: {
    _count: true;
  };
}>;

const colors = [
  '#ef4444',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
];

type BadgeProps = {
  children: React.ReactNode;
  color: string;
};

function Counter({ children, color }: BadgeProps) {
  return (
    <span
      className="flex items-center justify-center h-5 w-5 text-white rounded-sm"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}

async function deleteGroup(groupId: number) {
  return await fetch(`/api/group/${groupId}`, {
    method: 'DELETE',
  });
}

async function addGroup({ name, color }: GroupEditValues) {
  return await fetch(`/api/group`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      color,
    }),
  });
}

async function editGroup(groupId: number, group: GroupEditValues) {
  return await fetch(`/api/group/${groupId}`, {
    method: 'PATCH',
    body: JSON.stringify({ ...group, groupId }),
  });
}

const badgeStyle = (color: string) => ({
  borderColor: `${color}20`,
  backgroundColor: `${color}30`,
  color,
});

type FancyBoxProps = {
  groups: Array<GroupWithCount>;
  selectedGroup?: GroupWithCount;
  totalBookmarksCount?: number;
};

export function GroupSelector({
  groups,
  selectedGroup,
  totalBookmarksCount,
}: FancyBoxProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(groupCreateSchema),
  });

  const isSubmitDisabled = isSaving || !isValid;

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
  };

  async function onSubmit(data: FormData) {
    setIsSaving(true);
    const response = await addGroup({
      name: data.name,
      color: data.color,
    });

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

    reset({
      name: '',
    });
    setIsSaving(false);
    setShowNewGroupDialog(false);
    router.refresh();
  }

  return (
    <div className="w-[230px] sm:w-[250px] md:w-[300px] lg:max-w-[230px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[230px] sm:w-[250px] md:w-[300px] lg:w-[230px] justify-between text-foreground"
          >
            <span className="truncate">
              {selectedGroup?.name ?? 'All bookmarks'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        {openCombobox && (
          <div className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden" />
        )}
        <PopoverContent className="w-[230px] sm:w-[250px] md:w-[300px] lg:max-w-[230px] p-0">
          <Command loop>
            <CommandInput ref={inputRef} placeholder="Search groups..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup className="max-h-[145px] overflow-auto">
                <Link
                  href={`/bookmarks`}
                  onClick={() => setOpenCombobox(false)}
                >
                  <CommandItem>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        !selectedGroup ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex-1 truncate">All bookmarks</div>
                    <Counter color="#a855f7">
                      {String(totalBookmarksCount ?? 0)}
                    </Counter>
                  </CommandItem>
                </Link>
                {groups.map((group) => {
                  const isActive = selectedGroup?.id === group.id;
                  return (
                    <Link
                      key={group.id}
                      href={`/bookmarks/groups/${group.id}`}
                      onClick={() => setOpenCombobox(false)}
                    >
                      <CommandItem value={String(group.name)}>
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isActive ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex-1 truncate">{group.name}</div>
                        <Counter color={group.color}>
                          {group._count.bookmarks}
                        </Counter>
                      </CommandItem>
                    </Link>
                  );
                })}
              </CommandGroup>
            </CommandList>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <CommandItem
                className="text-sm text-muted-foreground"
                onSelect={() => setOpenDialog(true)}
              >
                <Edit2 className="mr-2 h-3 w-3" />
                Edit Groups
              </CommandItem>
              <CommandItem
                className="text-sm text-muted-foreground"
                onSelect={() => setShowNewGroupDialog(true)}
              >
                <PlusIcon className="mr-2 h-3 w-3" />
                New Group
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent className="max-w-[300px] sm:max-w-[425px]">
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
            </div>
            <div className="flex flex-col gap-2">
              <Label>Color</Label>
              <Controller
                control={control}
                name="color"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    className="flex"
                    value={value}
                    onValueChange={onChange}
                    loop
                  >
                    {colors.map((color, index) => (
                      <RadioGroupItem
                        key={color}
                        value={color}
                        id={color}
                        {...register('color')}
                        className="text-white border-none h-6 w-6"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
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
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCombobox(true);
          }
          setOpenDialog(open);
        }}
      >
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Labels</DialogTitle>
            <DialogDescription>
              Change the label names or delete the labels. Create a label
              through the combobox though.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-scroll -mx-6 px-6 flex-1 py-2">
            {groups.map((group) => {
              return <DialogListItem key={group.id} group={group} />;
            })}
          </div>
          <DialogFooter className="bg-opacity-40">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const DialogListItem = ({ group }: { group: Group }) => {
  const router = useRouter();
  const [colorValue, setColorValue] = useState<string>(group.color);
  const [accordionValue, setAccordionValue] = useState<string>('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormData>({
    resolver: zodResolver(groupCreateSchema),
  });

  const isSubmitDisabled = isLoadingUpdate || !isValid;

  const onSubmit = async (data: FormData) => {
    setIsLoadingUpdate(true);
    const response = await editGroup(group.id, {
      name: data.name,
      color: data.color,
    });

    if (!response?.ok) {
      return toast({
        title: 'Something went wrong.',
        description: 'Your group was not saved. Please try again.',
        variant: 'destructive',
      });
    }

    toast({
      description: `Changes to ${group.name} has been saved.`,
    });

    setIsLoadingUpdate(false);
    setAccordionValue('');
    router.refresh();
  };

  const removeGroup = async () => {
    setIsLoadingDelete(true);
    const response = await deleteGroup(group.id);

    if (response.ok) {
      toast({ description: `Group ${group.name} has been deleted.` });
    }

    setIsLoadingDelete(false);
    router.refresh();
  };

  return (
    <Accordion
      key={group.name}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={group.name}>
        <div className="flex justify-between items-center">
          <div>
            <Badge variant="outline" style={badgeStyle(group.color)}>
              {group.name}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <AccordionTrigger>Edit</AccordionTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="xs"
                  disabled={isLoadingDelete}
                >
                  {isLoadingDelete ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                  <AlertDialogDescription className="flex items-center">
                    You are about to delete group
                    <Badge
                      variant="outline"
                      style={badgeStyle(group.color)}
                      className="ml-2 font-bold"
                    >
                      {group.name}
                    </Badge>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={removeGroup}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AccordionContent>
          <form
            className="flex items-end gap-4 pl-1"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full gap-3 grid">
              <Label htmlFor="name">Group name</Label>
              <Input
                id="name"
                {...register('name')}
                defaultValue={group.name}
                className="h-8"
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="gap-3 grid">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="color"
                value={colorValue}
                {...register('color')}
                onChange={(e) => setColorValue(e.target.value)}
                className="h-8 px-2 py-1"
              />
            </div>
            <Button type="submit" disabled={isSubmitDisabled} size="xs">
              {isLoadingUpdate ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Save'
              )}
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
