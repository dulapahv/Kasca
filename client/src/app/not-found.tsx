'use client';

import Link from 'next/link';
import { Home, MoveLeft } from 'lucide-react';

import { SITE_URL } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Alert className="max-w-lg">
        <AlertTitle className="text-xl font-semibold">
          404 - Page Not Found
        </AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Please
          check the URL or navigate back to the homepage.
        </AlertDescription>
        <div className="mt-6 flex flex-col justify-end gap-4 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <MoveLeft className="size-4" />
            Go Back
          </Button>
          <Button variant="default" asChild className="gap-2">
            <Link href={SITE_URL}>
              <Home className="size-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </Alert>
    </div>
  );
}