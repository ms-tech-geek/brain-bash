'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { AlertCircle, Brain } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const displayName = formData.get('display-name') as string;

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              display_name: displayName,
              role: 'player',
            },
          ]);

        if (profileError) {
          setError(profileError.message);
          // Clean up the created user if profile creation fails
          await supabase.auth.signOut();
          return;
        }

        toast({
          title: 'Account created successfully!',
          description: 'Redirecting you to login...',
        });

        router.push('/auth/login');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <Brain className="w-12 h-12 text-primary" />
          <h1 className="text-2xl font-bold">Create your BrainBash account</h1>
          <p className="text-muted-foreground text-center">
            Join our community of quiz enthusiasts
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input name="display-name" type="text" placeholder="JohnDoe" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" type="password" required minLength={6} />
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}