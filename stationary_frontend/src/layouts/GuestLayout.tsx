import { Outlet } from 'react-router-dom';
import { TopHeader } from '../features/customer/layout/TopHeader';

export const GuestLayout = () => {
    return (
        <div>
            <TopHeader />
            <Outlet />
        </div>
    );
};
