import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <Brain className="w-12 h-12 text-primary" />
          <h1 className="text-2xl font-bold">Welcome back to BrainBash</h1>
          <p className="text-muted-foreground text-center">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>

          <Button className="w-full" type="submit">
            Sign in
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}