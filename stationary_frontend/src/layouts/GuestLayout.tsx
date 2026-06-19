import { Outlet } from 'react-router-dom';
import { LandingHeader } from '../pages/landing/LandingHeader';

export const GuestLayout = () => {
    return (
        <div className="min-h-screen bg-canvas transition-colors duration-300">
            <LandingHeader />
            <div className="pt-[100px]">
                <Outlet />
            </div>
        </div>
    );
};
