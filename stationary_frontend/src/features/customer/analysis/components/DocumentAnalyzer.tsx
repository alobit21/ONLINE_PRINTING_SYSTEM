import { useCustomerStore } from '../../../../stores/customerStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { FileText, Layers, Maximize, Compass, Zap, BarChart } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export const DocumentAnalyzer = () => {
    const { files } = useCustomerStore();
    const readyFiles = files.filter(f => f.status === 'ready');

    return (
        <div className="space-y-6 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-100">Document Analysis</h2>
                <p className="text-slate-400">We've analyzed your documents to extract technical metadata.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {readyFiles.map((file) => (
                    <Card key={file.id} className="glass border-none shadow-xl overflow-hidden group bg-slate-800/50 border border-slate-700/50">
                        <CardHeader className="bg-cyan-500/10 border-b border-slate-700/50 p-4">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-cyan-400">
                                <FileText className="h-4 w-4" />
                                {file.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-2">
                                <MetaItem
                                    icon={Layers}
                                    label="Total Pages"
                                    value={file.metadata?.pageCount.toString() || '0'}
                                    color="bg-purple-500/20 text-purple-300 border border-purple-400/30"
                                />
                                <MetaItem
                                    icon={BarChart}
                                    label="Color Pages"
                                    value={file.metadata?.isColor ? 'Detected' : 'None'}
                                    color="bg-blue-500/20 text-blue-300 border border-blue-400/30"
                                />
                                <MetaItem
                                    icon={Maximize}
                                    label="Paper Size"
                                    value={file.metadata?.paperSize || 'A4'}
                                    color="bg-amber-500/20 text-amber-300 border border-amber-400/30"
                                />
                                <MetaItem
                                    icon={Compass}
                                    label="Orientation"
                                    value={file.metadata?.orientation || 'Portrait'}
                                    color="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                                />
                                <MetaItem
                                    icon={Zap}
                                    label="Print Time"
                                    value={`${file.metadata?.estimatedPrintTime || 0}s`}
                                    color="bg-green-500/20 text-green-300 border border-green-400/30"
                                />
                                <MetaItem
                                    icon={BarChart}
                                    label="Complexity"
                                    value={file.metadata?.complexityScore.toString() || '0'}
                                    color="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {readyFiles.length === 0 && (
                <div className="text-center py-20 bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-600">
                    <p className="text-slate-400 font-medium">Please upload documents first to see analysis.</p>
                </div>
            )}
        </div>
    );
};

const MetaItem = ({ icon: Icon, label, value, color }: any) => (
    <div className="p-6 border-b border-r border-slate-700/50 last:border-r-0 hover:bg-slate-700/30 transition-colors">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3 shadow-sm border", color)}>
            <Icon className="h-5 w-5" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-100 mt-0.5">{value}</p>
    </div>
);
