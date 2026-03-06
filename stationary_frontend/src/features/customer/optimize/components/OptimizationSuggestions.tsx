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
                <h2 className="text-3xl font-bold text-slate-100">Optimization</h2>
                <p className="text-slate-400">Smart cost-saving recommendations for your documents.</p>
            </div>

            <div className="space-y-4">
                {readyFiles.map((file) => (
                    <div key={file.id} className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <div className="h-5 w-5 bg-cyan-500/20 rounded text-cyan-400 flex items-center justify-center font-bold text-[10px] border border-cyan-400/30">
                                {file.name.split('.').pop()?.toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-300 truncate">{file.name}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {optimizations.map((opt) => {
                                const isApplied = opt.id === 'grayscale' && !file.metadata?.isColor;

                                return (
                                    <Card
                                        key={opt.id}
                                        className={cn(
                                            "relative border-2 transition-all duration-300 overflow-hidden group bg-slate-800/50",
                                            isApplied ? "border-green-400/50 bg-green-500/10" : "border-slate-600/50 hover:border-cyan-500/50"
                                        )}
                                    >
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform border",
                                                    isApplied ? "bg-green-500/20 text-green-300 border-green-400/30" : "bg-cyan-500/20 text-cyan-400 border-cyan-400/30"
                                                )}>
                                                    <opt.icon className="h-5 w-5" />
                                                </div>
                                                <div className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                    isApplied ? "bg-green-500/20 text-green-300 border border-green-400/30" : "bg-slate-700/50 text-slate-400 border border-slate-600/50"
                                                )}>
                                                    {opt.impact}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{opt.title}</p>
                                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.description}</p>
                                            </div>

                                            <Button
                                                variant={isApplied ? "default" : "outline"}
                                                size="sm"
                                                className={cn(
                                                    "mt-2 gap-2 w-full",
                                                    isApplied ? "bg-green-600 hover:bg-green-700 border-none" : "border-2 border-slate-600 hover:border-cyan-500 bg-slate-800/50 text-slate-300 hover:text-cyan-400"
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
            <div className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-cyan-500/20 overflow-hidden relative border border-cyan-400/30">
                <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 bg-cyan-400/20 rounded-full -ml-12 -mb-12 blur-xl" />

                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <DollarSign className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Smart Savings</h3>
                        <p className="text-cyan-100 text-sm mt-1">Optimization could save you up to $12.50 on this order.</p>
                    </div>
                </div>

                <h2 className="text-4xl font-extrabold relative z-10">$12.50</h2>
            </div>
        </div>
    );
};
