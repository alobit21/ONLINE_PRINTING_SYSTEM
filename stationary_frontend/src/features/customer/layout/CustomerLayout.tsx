import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNavigation } from './BottomNavigation';

export const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900 shadow-sm">
        <TopHeader />
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-28 md:pb-32 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Optional subtle background panel for content */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 shadow-inner">
            <Outlet />
          </div>
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