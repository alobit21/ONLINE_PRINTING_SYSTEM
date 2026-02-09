import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNavigation } from './BottomNavigation';

export const CustomerLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <TopHeader />

            <main className="flex-1 pb-24 lg:pb-6 md:pb-28">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Outlet />
                </div>
            </main>

            <BottomNavigation />

            {/* Mobile safe area spacing */}
            <div className="h-safe w-full bg-white sm:hidden" />
        </div>
    );
};
