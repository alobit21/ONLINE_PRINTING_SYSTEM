import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface GuestContactInfo {
    email?: string;
    whatsappNumber: string;
}

export const useGuestVerification = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [currentFeature, setCurrentFeature] = useState<string>('');
    
    // Initialize guestContactInfo from localStorage
    const [guestContactInfo, setGuestContactInfo] = useState<GuestContactInfo | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('guestContactInfo');
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });

    // Save to localStorage whenever guestContactInfo changes
    useEffect(() => {
        if (guestContactInfo && typeof window !== 'undefined') {
            localStorage.setItem('guestContactInfo', JSON.stringify(guestContactInfo));
        }
    }, [guestContactInfo]);

    const isLoggedIn = !!user;

    const requireVerification = useCallback((feature: string) => {
        if (isLoggedIn) {
            // User is logged in, proceed normally
            return true;
        }

        if (guestContactInfo) {
            // Guest user already verified, proceed
            return true;
        }

        // Guest user needs to verify first
        setCurrentFeature(feature);
        setIsVerificationModalOpen(true);
        return false;
    }, [isLoggedIn, guestContactInfo]);

    const handleVerificationSuccess = useCallback((contactInfo: GuestContactInfo) => {
        setGuestContactInfo(contactInfo);
        setIsVerificationModalOpen(false);
        
        // Navigate to the requested feature after verification
        switch (currentFeature) {
            case 'orders':
                navigate('/guest/orders');
                break;
            case 'wallet':
                navigate('/guest/wallet');
                break;
            case 'profile':
                navigate('/guest/profile');
                break;
            default:
                break;
        }
    }, [currentFeature, navigate]);

    const handleVerificationClose = useCallback(() => {
        setIsVerificationModalOpen(false);
        setCurrentFeature('');
    }, []);

    const clearGuestVerification = useCallback(() => {
        setGuestContactInfo(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('guestContactInfo');
        }
    }, []);

    const getVerificationModalProps = useCallback(() => {
        let title = '';
        let description = '';

        switch (currentFeature) {
            case 'orders':
                title = 'Track Your Orders';
                description = 'Enter your contact details to view your order history and tracking information.';
                break;
            case 'wallet':
                title = 'Access Your Wallet';
                description = 'Enter your contact details to view your balance and transaction history.';
                break;
            case 'profile':
                title = 'Your Guest Profile';
                description = 'Enter your contact details to view and manage your guest account information.';
                break;
            default:
                title = 'Guest Verification Required';
                description = 'Please enter your contact details to access this feature.';
        }

        return {
            isOpen: isVerificationModalOpen,
            onClose: handleVerificationClose,
            onSuccess: handleVerificationSuccess,
            title,
            description
        };
    }, [currentFeature, isVerificationModalOpen, handleVerificationClose, handleVerificationSuccess]);

    return {
        requireVerification,
        getVerificationModalProps,
        guestContactInfo,
        isLoggedIn
    };
};
