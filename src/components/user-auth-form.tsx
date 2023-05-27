'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { userAuthSchema } from '@/lib/validations/auth';
import { buttonVariants } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import GithubIcon from './ui/github-icon';
import GoogleIcon from './ui/google-icon';
import { Loader2 } from 'lucide-react';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className }: UserAuthFormProps) {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

  return (
    <div className={cn('grid gap-4', className)}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: 'default' }))}
        onClick={() => {
          setIsGoogleLoading(true);
          signIn('google');
        }}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary-on-brand" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}{' '}
        Continue with Google
      </button>
      <button
        type="button"
        className={cn(buttonVariants({ variant: 'outline' }))}
        onClick={() => {
          setIsGitHubLoading(true);
          signIn('github');
        }}
        disabled={isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary-on-brand" />
        ) : (
          <GithubIcon className="mr-2 h-4 w-4" />
        )}
        Continue with Github
      </button>
    </div>
  );
}
