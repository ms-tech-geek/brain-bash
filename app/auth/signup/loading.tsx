import { Brain } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <Brain className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}