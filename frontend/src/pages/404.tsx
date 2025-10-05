import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Siloam Hospitals</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>
      
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <CardHeader>
              <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
              <CardTitle className="text-2xl">Page Not Found</CardTitle>
              <CardDescription>
                The page you are looking for does not exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="default">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/doctors">
                    <Search className="mr-2 h-4 w-4" />
                    Find Doctors
                  </Link>
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">Popular pages:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/specializations" className="text-sm text-primary hover:underline">
                    Specializations
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/hospitals" className="text-sm text-primary hover:underline">
                    Hospitals
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/about" className="text-sm text-primary hover:underline">
                    About
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/services/emergency" className="text-sm text-primary hover:underline">
                    Emergency
                  </Link>
                </div>
              </div>
              
              <div className="pt-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/contact">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Need Help?
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
