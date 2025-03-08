import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="flex items-center space-x-2">
            <Brain className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">BrainBash</h1>
          </div>
          
          <h2 className="text-2xl font-semibold text-muted-foreground max-w-2xl">
            Challenge yourself with interactive quizzes and compete with others in real-time
          </h2>
          
          <div className="grid gap-4 mt-8">
            <p className="text-lg text-muted-foreground">
              Join thousands of quiz enthusiasts in testing your knowledge across various topics.
              Create your own quizzes or participate in existing ones!
            </p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <Button asChild size="lg">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Create Quizzes</h3>
              <p className="text-muted-foreground">
                Design engaging quizzes with multiple choice questions and custom scoring.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Real-time Competition</h3>
              <p className="text-muted-foreground">
                Compete with others and see live rankings as you progress through quizzes.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your performance and improve your knowledge over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
