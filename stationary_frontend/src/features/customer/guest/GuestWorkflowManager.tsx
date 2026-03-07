import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCustomerStore } from '../../../stores/customerStore';
import type { WorkflowStep } from '../../../stores/customerStore';
import { GuestPrintUploadFlow } from '../upload/components/GuestPrintUploadFlow';
import { GuestShopSelection } from './GuestShopSelection';
import { OrderProgress } from '../orders/components/OrderProgress';
import { GuestCheckoutForm } from '../checkout/components/GuestCheckoutForm';
import { DocumentAnalyzer } from '../analysis/components/DocumentAnalyzer';
import { TopHeader } from '../layout/TopHeader';

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

    // Navigation helpers
    const goBack = () => {
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'optimize', 'shop', 'checkout'];
        const currentIndex = stepFlow.indexOf(currentStep as WorkflowStep);
        if (currentIndex > 0) {
            setCurrentStep(stepFlow[currentIndex - 1]);
        }
    };

    const canGoBack = () => {
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'optimize', 'shop', 'checkout'];
        const currentIndex = stepFlow.indexOf(currentStep as WorkflowStep);
        return currentIndex > 0;
    };

    const getStepNumber = () => {
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'optimize', 'shop', 'checkout'];
        return stepFlow.indexOf(currentStep as WorkflowStep) + 1;
    };

    const renderStep = () => {
        console.log("renderStep called with currentStep:", currentStep);
        
        switch (currentStep) {
            case 'upload':
                return (
                    <div className="max-w-5xl mx-auto p-4 dark:bg-gray-900 min-h-screen">
                        <OrderProgress currentStep={1} />
                        <GuestPrintUploadFlow />
                    </div>
                );
            case 'analyze':
            case 'analysis':
                return (
                    <div className="max-w-5xl mx-auto p-4 dark:bg-gray-900 min-h-screen">
                        <OrderProgress currentStep={2} />
                        <DocumentAnalyzer />
                    </div>
                );
            case 'optimize':
                return (
                    <div className="max-w-5xl mx-auto p-4 dark:bg-gray-900 min-h-screen">
                        <OrderProgress currentStep={3} />
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-8 text-center transition-colors duration-200">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Configuration</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Configure your printing preferences</p>
                            <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 p-4 rounded">
                                <p className="text-green-800 dark:text-green-300">✅ Files uploaded successfully!</p>
                                <p className="text-green-700 dark:text-green-400 mt-2">Ready to proceed to shop selection</p>
                                <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
                                    <button
                                        onClick={goBack}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Upload
                                    </button>
                                    <button 
                                        onClick={() => setCurrentStep('shop')}
                                        className="bg-brand-600 dark:bg-brand-500 text-white px-6 py-2 rounded hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors duration-200 focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                                    >
                                        Continue to Shop Selection
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'shop':
                return (
                    <div className="max-w-5xl mx-auto p-4 dark:bg-gray-900 min-h-screen">
                        <div className="flex items-center justify-between mb-6">
                            <OrderProgress currentStep={4} />
                            <button
                                onClick={goBack}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Configuration
                            </button>
                        </div>
                        <GuestShopSelection />
                    </div>
                );
            case 'checkout':
                return (
                    <div className="dark:bg-gray-900 min-h-screen">
                        <div className="max-w-5xl mx-auto p-4">
                            <div className="flex items-center justify-between mb-6">
                                <div></div> {/* Empty div for spacing */}
                                <button
                                    onClick={goBack}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-2 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Shop Selection
                                </button>
                            </div>
                        </div>
                        <GuestCheckoutForm />
                    </div>
                );
            default:
                return (
                    <div className="max-w-5xl mx-auto p-4 dark:bg-gray-900 min-h-screen">
                        <OrderProgress currentStep={1} />
                        <GuestPrintUploadFlow />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
            <TopHeader />
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderStep()}
            </div>
        </div>
    );
};