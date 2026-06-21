import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNavigation } from './BottomNavigation';

export const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background  text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background  shadow-sm">
        <TopHeader />
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-28 md:pb-32 lg:pb-24">
        <div className="w-[96%] max-w-[1440px] mx-auto py-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 z-20">
        <BottomNavigation />
      </footer>

      {/* Mobile safe area spacing */}
      <div className="h-safe w-full bg-slate-900 sm:hidden" />
    </div>
  );
};