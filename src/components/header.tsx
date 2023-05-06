import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  BookmarkIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
} from 'lucide-react';

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

export default function Header() {
  return (
    <nav className="w-full h-[68px]">
      <div className="flex gap-4 mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 items-center align-center text-primary">
          <BookmarkIcon className="ml-auto h-4 w-4" fill="black" />
          <h2 className="font-black">Bookmarked</h2>
        </div>
        <Separator orientation="vertical" />
        <ul className="">
          <li className="px-3 py-2 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-2 items-center text-secondary-foreground">
                Recept <ChevronsUpDownIcon className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[175px]">
                <DropdownMenuItem className="flex items-center justify-between gap-2">
                  Recept <CheckIcon className="h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between gap-2">
                  Artiklar <Badge>4</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between gap-2">
                  Tweets <Badge>2</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between gap-2">
                  Reddit <Badge>3</Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-between gap-2">
                  Böcker <Badge>1</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2 items-center">
                  <PlusIcon className="h-3 w-3" /> New Group
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2 items-center">
                  <TrashIcon className="h-3 w-3" /> Delete Group
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </nav>
  );
}
