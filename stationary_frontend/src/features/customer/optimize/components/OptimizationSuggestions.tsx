import { useCustomerStore } from '../../../../stores/customerStore';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Sparkles, Check, Zap, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../lib/utils';

export const OptimizationSuggestions = () => {
    const { files, updateFile } = useCustomerStore();
    const readyFiles = files.filter(f => f.status === 'ready');

    const optimizations = [
        {
            id: 'grayscale',
            title: 'Switch to Grayscale',
            description: 'Save up to 40% by printing in B&W instead of Color.',
            impact: 'High Savings',
            icon: Zap,
            action: (fileId: string) => {
                const file = files.find(f => f.id === fileId);
                if (file?.metadata) {
                    updateFile(fileId, { metadata: { ...file.metadata, isColor: false } });
                }
            }
        },
        {
            id: 'duplex',
            title: 'Enable Double-Sided',
            description: 'Reduce paper waste and costs by 50%.',
            impact: 'Eco-Friendly',
            icon: Sparkles,
            action: () => { } // Mock
        },
        {
            id: 'layout',
            title: 'Multiple Pages per Sheet',
            description: 'Print 2 pages per side to save paper.',
            impact: 'Fast Printing',
            icon: Zap,
            action: () => { } // Mock
        }
    ];

    return (
        <div className="space-y-6 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Optimization</h2>
                <p className="text-slate-500">Smart cost-saving recommendations for your documents.</p>
            </div>

            <div className="space-y-4">
                {readyFiles.map((file) => (
                    <div key={file.id} className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <div className="h-5 w-5 bg-brand-100 rounded text-brand-600 flex items-center justify-center font-bold text-[10px]">
                                {file.name.split('.').pop()?.toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-700 truncate">{file.name}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {optimizations.map((opt) => {
                                const isApplied = opt.id === 'grayscale' && !file.metadata?.isColor;

                                return (
                                    <Card
                                        key={opt.id}
                                        className={cn(
                                            "relative border-2 transition-all duration-300 overflow-hidden group",
                                            isApplied ? "border-green-500 bg-green-50/30" : "border-slate-100 hover:border-brand-200"
                                        )}
                                    >
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform",
                                                    isApplied ? "bg-green-100 text-green-600" : "bg-brand-50 text-brand-600"
                                                )}>
                                                    <opt.icon className="h-5 w-5" />
                                                </div>
                                                <div className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                    isApplied ? "bg-green-600 text-white" : "bg-slate-100 text-slate-500"
                                                )}>
                                                    {opt.impact}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">{opt.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{opt.description}</p>
                                            </div>

                                            <Button
                                                variant={isApplied ? "primary" : "outline"}
                                                fullWidth
                                                size="sm"
                                                className={cn(
                                                    "mt-2 gap-2",
                                                    isApplied ? "bg-green-600 hover:bg-green-700 border-none" : "border-2"
                                                )}
                                                onClick={() => opt.action(file.id)}
                                            >
                                                {isApplied ? <Check className="h-4 w-4" /> : 'Apply'}
                                                {isApplied ? 'Applied' : <ArrowRight className="h-4 w-4" />}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Savings Banner */}
            <div className="mt-8 gradient-brand rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-brand-500/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 bg-brand-400/20 rounded-full -ml-12 -mb-12 blur-xl" />

                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <DollarSign className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Smart Savings</h3>
                        <p className="text-brand-100 text-sm mt-1">Optimization could save you up to $12.50 on this order.</p>
                    </div>
                </div>

                <h2 className="text-4xl font-extrabold relative z-10">$12.50</h2>
            </div>
        </div>
    );
};
