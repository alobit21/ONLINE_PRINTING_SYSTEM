import { useCustomerStore } from '../../../../stores/customerStore';
import { FileText, Layers, Maximize, Compass, Zap, BarChart, ArrowRight } from 'lucide-react';

export const DocumentAnalyzer = () => {
    const { files, setCurrentStep } = useCustomerStore();
    const readyFiles = files.filter(f => f.status === 'ready');

    const handleContinue = () => {
        setCurrentStep('optimize');
    };

    return (
        <div className="space-y-6 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-[28px] font-medium text-ink">Document Analysis</h2>
                <p className="text-charcoal">We've analyzed your documents to extract technical metadata.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {readyFiles.map((file) => (
                    <div key={file.id} className="bg-canvas border border-fog rounded-[16px] shadow-[0_2px_8px_rgba(26,26,26,0.08)] overflow-hidden">
                        <div className="bg-cloud border-b border-fog p-4">
                            <h3 className="text-sm font-medium flex items-center gap-2 text-hp-primary">
                                <FileText className="h-4 w-4" />
                                {file.name}
                            </h3>
                        </div>
                        <div className="p-0">
                            <div className="grid grid-cols-2">
                                <MetaItem
                                    icon={Layers}
                                    label="Total Pages"
                                    value={file.metadata?.pageCount.toString() || '0'}
                                />
                                <MetaItem
                                    icon={BarChart}
                                    label="Color Pages"
                                    value={file.metadata?.isColor ? 'Detected' : 'None'}
                                />
                                <MetaItem
                                    icon={Maximize}
                                    label="Paper Size"
                                    value={file.metadata?.paperSize || 'A4'}
                                />
                                <MetaItem
                                    icon={Compass}
                                    label="Orientation"
                                    value={file.metadata?.orientation || 'Portrait'}
                                />
                                <MetaItem
                                    icon={Zap}
                                    label="Print Time"
                                    value={`${file.metadata?.estimatedPrintTime || 0}s`}
                                />
                                <MetaItem
                                    icon={BarChart}
                                    label="Complexity"
                                    value={file.metadata?.complexityScore.toString() || '0'}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {readyFiles.length === 0 && (
                <div className="text-center py-20 bg-cloud rounded-[16px] border-2 border-dashed border-fog">
                    <p className="text-charcoal font-medium">Please upload documents first to see analysis.</p>
                </div>
            )}

            {readyFiles.length > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleContinue}
                        className="bg-hp-primary hover:bg-hp-primary/90 text-canvas px-6 py-3 rounded-[4px] font-semibold transition-colors flex items-center gap-2 tracking-[0.7px]"
                    >
                        Continue to Configuration
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

const MetaItem = ({ icon: Icon, label, value }: any) => (
    <div className="p-6 border-b border-r border-fog last:border-r-0 hover:bg-cloud/50 transition-colors">
        <div className="h-10 w-10 rounded-full flex items-center justify-center mb-3 bg-cloud text-hp-primary">
            <Icon className="h-5 w-5" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-steel">{label}</p>
        <p className="text-base font-medium text-ink mt-0.5">{value}</p>
    </div>
);
