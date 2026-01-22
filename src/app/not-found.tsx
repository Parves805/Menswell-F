
'use client';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center text-center px-4 py-16">
        <div className="space-y-6">
          <SearchX className="mx-auto h-24 w-24 text-primary/70" strokeWidth={1.5} />
          <div>
            <h1 className="text-6xl md:text-8xl font-bold font-headline text-primary">404</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mt-2">Page Not Found</h2>
          </div>
          <p className="max-w-md mx-auto text-muted-foreground">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
