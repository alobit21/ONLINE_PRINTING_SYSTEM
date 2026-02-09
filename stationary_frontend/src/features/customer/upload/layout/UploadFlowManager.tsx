import { AnimatePresence, motion } from 'framer-motion';
import { useCustomerStore } from '../../../../stores/customerStore';
import { UploadZone } from '../components/UploadZone';
import { DocumentAnalyzer } from '../../analysis/components/DocumentAnalyzer';
import { OptimizationSuggestions } from '../../optimize/components/OptimizationSuggestions';
import { DocumentEditor } from '../../edit/components/DocumentEditor';
import { ShopSelector } from '../../shop/components/ShopSelector';
import { CheckoutAction } from '../../checkout/components/CheckoutAction';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../../../../lib/utils';

const steps = [
    { id: 'upload', label: 'Upload' },
    { id: 'analysis', label: 'Analyze' },
    { id: 'optimize', label: 'Optimize' },
    { id: 'edit', label: 'Edit' },
    { id: 'shop', label: 'Select Shop' },
    { id: 'checkout', label: 'Checkout' },
];

export const UploadFlowManager = () => {
    const { currentStep, setCurrentStep } = useCustomerStore();

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-24">
            {/* Horizontal Step Indicator */}
            <div className="relative flex justify-between px-2">
                <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200" />
                <div
                    className="absolute top-5 left-8 h-0.5 bg-brand-600 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isActive = index === currentStepIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 group">
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                isCompleted ? "bg-brand-600 border-brand-600 text-white" :
                                    isActive ? "bg-white border-brand-600 text-brand-600 shadow-lg scale-110" :
                                        "bg-white border-slate-200 text-slate-400"
                            )}>
                                {isCompleted ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                                isActive ? "text-brand-600" : "text-slate-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Workflow Content */}
            <div className="min-h-[500px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === 'upload' && <UploadZone />}
                        {currentStep === 'analysis' && <DocumentAnalyzer />}
                        {currentStep === 'optimize' && <OptimizationSuggestions />}
                        {currentStep === 'edit' && <DocumentEditor />}
                        {currentStep === 'shop' && <ShopSelector />}
                        {currentStep === 'checkout' && <CheckoutAction />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls (Standardized) */}
            <div className="fixed bottom-20 left-0 right-0 p-4 sm:p-6 glass border-t border-white/20 bg-white/90 md:relative md:bottom-0 md:glass-none md:bg-transparent md:border-t-0">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <button
                        onClick={() => {
                            const prev = steps[currentStepIndex - 1];
                            if (prev) setCurrentStep(prev.id as any);
                        }}
                        disabled={currentStepIndex === 0}
                        className="px-6 py-2 rounded-xl text-slate-600 font-medium disabled:opacity-30 transition-all hover:bg-slate-100"
                    >
                        Back
                    </button>

                    {currentStep !== 'checkout' && (
                        <button
                            onClick={() => {
                                const next = steps[currentStepIndex + 1];
                                if (next) setCurrentStep(next.id as any);
                            }}
                            className="px-8 py-3 rounded-xl gradient-brand text-white font-bold shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
                        >
                            Next
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
