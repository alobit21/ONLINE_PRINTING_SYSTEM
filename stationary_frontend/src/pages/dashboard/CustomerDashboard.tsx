import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../../features/customer/layout/CustomerLayout';
import { CustomerHome } from '../../features/customer/home/CustomerHome';
import { UploadFlowManager } from '../../features/customer/upload/layout/UploadFlowManager';
import { CustomerWallet } from '../../features/customer/wallet/CustomerWallet';
import { CustomerProfile } from '../../features/customer/profile/CustomerProfile';
import { CustomerOrdersPage } from '../../features/customer/orders/pages/CustomerOrdersPage';

export const CustomerDashboard = () => {
    return (
        <Routes>
            <Route element={<CustomerLayout />}>
                <Route index element={<CustomerHome />} />
                <Route path="upload" element={<UploadFlowManager />} />
                <Route path="orders" element={<CustomerOrdersPage />} />
                <Route path="wallet" element={<CustomerWallet />} />
                <Route path="profile" element={<CustomerProfile />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="" replace />} />
            </Route>
        </Routes>
    );
};
