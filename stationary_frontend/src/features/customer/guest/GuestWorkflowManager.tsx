import { useEffect } from 'react';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerStore } from '../../../stores/customerStore';
import type { WorkflowStep } from '../../../stores/customerStore';
import { GuestPrintUploadFlow } from '../upload/components/GuestPrintUploadFlow';
import { GuestShopSelection } from './GuestShopSelection';
import { OrderProgress } from '../orders/components/OrderProgress';
import { GuestCheckoutForm } from '../checkout/components/GuestCheckoutForm';
import { DocumentAnalyzer } from '../analysis/components/DocumentAnalyzer';
import { LandingHeader } from '../../../pages/landing/LandingHeader';

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
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'shop', 'checkout'];
        const currentIndex = stepFlow.indexOf(currentStep as WorkflowStep);
        if (currentIndex > 0) {
            setCurrentStep(stepFlow[currentIndex - 1]);
        }
    };

    const canGoBack = () => {
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'shop', 'checkout'];
        const currentIndex = stepFlow.indexOf(currentStep as WorkflowStep);
        return currentIndex > 0;
    };

    const getStepNumber = () => {
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'shop', 'checkout'];
        return stepFlow.indexOf(currentStep as WorkflowStep) + 1;
    };

    const renderBreadcrumbs = () => {
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'shop', 'checkout'];
        const stepLabels: Record<string, string> = {
            'upload': 'Upload',
            'analysis': 'Analysis',
            'shop': 'Shop Selection',
            'checkout': 'Payment'
        };

        const currentIndex = stepFlow.indexOf(currentStep as WorkflowStep);
        const visibleSteps = stepFlow.slice(0, currentIndex + 1);

        return (
            <div className="flex items-center gap-2 text-sm text-steel mb-2 sm:mb-6 pb-4 border-b border-fog/50 max-w-5xl mx-auto px-4 w-full overflow-x-auto whitespace-nowrap">
                {visibleSteps.map((step, index) => {
                    const isLast = index === visibleSteps.length - 1;
                    const label = stepLabels[step];
                    
                    return (
                        <div key={step} className="flex items-center gap-2">
                            {index > 0 && <ChevronRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />}
                            {isLast ? (
                                <span className="text-hp-primary font-medium bg-cloud px-2 py-0.5 rounded-[4px] text-xs uppercase tracking-[0.5px]">
                                    {label}
                                </span>
                            ) : (
                                <button
                                    onClick={() => setCurrentStep(step)}
                                    className="hover:text-hp-primary transition-colors text-charcoal flex items-center gap-1.5"
                                >
                                    {index === 0 && <Home className="w-3.5 h-3.5" />}
                                    <span className="font-medium">{label}</span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderStep = () => {
        console.log("renderStep called with currentStep:", currentStep);
        
        switch (currentStep) {
            case 'upload':
                return (
                    <div className="max-w-5xl mx-auto p-0 sm:p-4 min-h-screen">
                        <OrderProgress currentStep={1} />
                        <GuestPrintUploadFlow />
                    </div>
                );
            case 'analysis':
                return (
                    <div className="max-w-5xl mx-auto p-0 sm:p-4 min-h-screen">
                        <OrderProgress currentStep={2} />
                        <DocumentAnalyzer />
                    </div>
                );

            case 'shop':
                return (
                    <div className="max-w-5xl mx-auto p-0 sm:p-4 min-h-screen">
                        <GuestShopSelection />
                    </div>
                );
            case 'checkout':
                return (
                    <div className="min-h-screen">
                        <GuestCheckoutForm />
                    </div>
                );
            default:
                return (
                    <div className="max-w-5xl mx-auto p-0 sm:p-4 min-h-screen">
                        <OrderProgress currentStep={1} />
                        <GuestPrintUploadFlow />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-canvas transition-colors duration-300">
            <LandingHeader />
            
            {/* Main Content with padding to account for the 100px fixed header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] sm:pt-[120px] pb-8">
                {renderBreadcrumbs()}
                {renderStep()}
            </div>
        </div>
    );
};