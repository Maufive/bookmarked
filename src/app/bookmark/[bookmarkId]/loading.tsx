import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="grid w-full gap-10">
      <div>
        <Skeleton className="h-[200px] w-full" />
      </div>
      <div className="flex w-full items-center gap-10">
        <Skeleton className="h-[38px] w-[90px]" />
        <Skeleton className="h-[38px] w-[80px]" />
      </div>
      <div className="mx-auto w-full space-y-6">
        <Skeleton className="h-[50px] w-full" />
        <Skeleton className="h-[20px] w-2/3" />
        <Skeleton className="h-[20px] w-full" />
        <Skeleton className="h-[20px] w-full" />
      </div>
    </div>
  );
}
