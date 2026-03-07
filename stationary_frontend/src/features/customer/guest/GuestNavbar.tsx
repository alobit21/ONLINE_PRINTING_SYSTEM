import { Home, FileUp, Phone, HelpCircle, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from '../../../stores/customerStore';
import type { WorkflowStep } from '../../../stores/customerStore';
import { cn } from '../../../lib/utils';
import { useState } from 'react';

const guestNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: FileUp, label: 'Upload', path: '/checkout' },
    { icon: Phone, label: 'Contact', path: '/contact' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
];

export const GuestNavbar = () => {
    const { currentStep, setCurrentStep, resetWorkflow } = useCustomerStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const getStepInfo = () => {
        switch (currentStep) {
            case 'upload':
                return { step: 1, title: 'Upload Documents', description: 'Add your files for printing' };
            case 'analysis':
                return { step: 2, title: 'Document Analysis', description: 'Review file metadata' };
            case 'optimize':
                return { step: 3, title: 'Configuration', description: 'Set printing preferences' };
            case 'shop':
                return { step: 4, title: 'Shop Selection', description: 'Choose a printing shop' };
            case 'checkout':
                return { step: 5, title: 'Guest Checkout', description: 'Complete your order' };
            default:
                return { step: 1, title: 'Upload Documents', description: 'Add your files for printing' };
        }
    };

    const stepInfo = getStepInfo();

    const handleBack = () => {
        const stepFlow: WorkflowStep[] = ['upload', 'analysis', 'optimize', 'shop', 'checkout'];
        const currentIndex = stepFlow.indexOf(currentStep as WorkflowStep);
        if (currentIndex > 0) {
            setCurrentStep(stepFlow[currentIndex - 1]);
        } else {
            navigate('/');
        }
    };

    const handleHome = () => {
        resetWorkflow();
        navigate('/');
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline text-sm">Back</span>
                        </button>
                        <div className="h-10 w-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer" onClick={handleHome}>
                            <span className="text-lg">P</span>
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">PrintSync</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">Guest Portal</p>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                Step {stepInfo.step} of 5
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div
                                        key={num}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-300",
                                            num <= stepInfo.step
                                                ? "bg-brand-500"
                                                : "bg-slate-300 dark:bg-slate-600"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stepInfo.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{stepInfo.description}</p>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group"
                            title="Toggle theme"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                            ) : (
                                <Moon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-500" />
                            )}
                        </button>

                        {/* Help */}
                        <button className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <HelpCircle className="h-5 w-5" />
                        </button>

                        {/* Sign In */}
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Phone className="h-4 w-4" />
                            <span className="text-sm font-medium">Sign In</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <div className="w-5 h-5 flex flex-col justify-center gap-1">
                                <div className="w-full h-0.5 bg-current rounded"></div>
                                <div className="w-full h-0.5 bg-current rounded"></div>
                                <div className="w-full h-0.5 bg-current rounded"></div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Progress Info */}
                <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{stepInfo.title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Step {stepInfo.step} of 5</div>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div
                                key={num}
                                className={cn(
                                    "flex-1 h-1 rounded-full transition-all duration-300",
                                    num <= stepInfo.step
                                        ? "bg-brand-500"
                                        : "bg-slate-300 dark:bg-slate-600"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 py-4">
                        <nav className="flex flex-col gap-2">
                            {guestNavItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-left text-brand-600 dark:text-brand-400 font-medium"
                            >
                                <Phone className="h-5 w-5" />
                                <span>Sign In to Account</span>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};
