import { useEffect } from 'react';
import { useCustomerStore } from '../../../stores/customerStore';
import { GuestPrintUploadFlow } from '../upload/components/GuestPrintUploadFlow';
import { GuestShopSelection } from './GuestShopSelection';
import { OrderProgress } from '../orders/components/OrderProgress';
import { GuestCheckoutForm } from '../checkout/components/GuestCheckoutForm';

export const GuestWorkflowManager = () => {
    const { currentStep, setCurrentStep } = useCustomerStore();

    console.log("GuestWorkflowManager rendered, currentStep:", currentStep);

    // Initialize guest workflow at upload step if not set
    useEffect(() => {
        console.log("GuestWorkflowManager useEffect, currentStep:", currentStep);
        if (!currentStep) {
            console.log("Setting currentStep to 'upload'");
            setCurrentStep('upload');
        }
    }, [currentStep, setCurrentStep]);

    // Listen for step changes
    useEffect(() => {
        console.log("GuestWorkflowManager: currentStep changed to:", currentStep);
    }, [currentStep]);

    const renderStep = () => {
        console.log("renderStep called with currentStep:", currentStep);
        switch (currentStep) {
            case 'upload':
                return (
                    <div className="max-w-5xl mx-auto p-4">
                        <OrderProgress currentStep={1} />
                        <GuestPrintUploadFlow />
                    </div>
                );
            case 'analyze':
            case 'analysis':
                return (
                    <div className="max-w-5xl mx-auto p-4">
                        <OrderProgress currentStep={2} />
                        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analyzing Documents</h2>
                            <p className="text-gray-600">We're analyzing your documents to determine the best printing options...</p>
                        </div>
                    </div>
                );
            case 'optimize':
                return (
                    <div className="max-w-5xl mx-auto p-4">
                        <OrderProgress currentStep={3} />
                        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Configuration</h2>
                            <p className="text-gray-600 mb-6">Configure your printing preferences</p>
                            <div className="bg-green-100 border border-green-300 p-4 rounded">
                                <p className="text-green-800">✅ Files uploaded successfully!</p>
                                <p className="text-green-700 mt-2">Ready to proceed to shop selection</p>
                                <button 
                                    onClick={() => setCurrentStep('shop')}
                                    className="mt-4 bg-brand-600 text-white px-6 py-2 rounded hover:bg-brand-700"
                                >
                                    Continue to Shop Selection
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'shop':
                return (
                    <div className="max-w-5xl mx-auto p-4">
                        <OrderProgress currentStep={4} />
                        <GuestShopSelection />
                    </div>
                );
            case 'checkout':
                return <GuestCheckoutForm />;
            default:
                return (
                    <div className="max-w-5xl mx-auto p-4">
                        <OrderProgress currentStep={1} />
                        <GuestPrintUploadFlow />
                    </div>
                );
        }
    };

    return renderStep();
};
