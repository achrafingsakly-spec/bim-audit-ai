import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAppStore } from '@/stores/appStore';
import '@/lib/i18n';

const Index = () => {
  const { theme } = useAppStore();

  useEffect(() => {
    // Apply theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-accent/5 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto max-w-7xl">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
