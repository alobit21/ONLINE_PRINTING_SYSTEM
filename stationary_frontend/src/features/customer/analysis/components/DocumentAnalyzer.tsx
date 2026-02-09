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
                <h2 className="text-3xl font-bold text-slate-900">Document Analysis</h2>
                <p className="text-slate-500">We've analyzed your documents to extract technical metadata.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {readyFiles.map((file) => (
                    <Card key={file.id} className="glass border-none shadow-xl overflow-hidden group">
                        <CardHeader className="bg-brand-600/5 border-b border-brand-100 p-4">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-brand-700">
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
                                    color="bg-purple-100 text-purple-600"
                                />
                                <MetaItem
                                    icon={BarChart}
                                    label="Color Pages"
                                    value={file.metadata?.isColor ? 'Detected' : 'None'}
                                    color="bg-blue-100 text-blue-600"
                                />
                                <MetaItem
                                    icon={Maximize}
                                    label="Paper Size"
                                    value={file.metadata?.paperSize || 'A4'}
                                    color="bg-amber-100 text-amber-600"
                                />
                                <MetaItem
                                    icon={Compass}
                                    label="Orientation"
                                    value={file.metadata?.orientation || 'Portrait'}
                                    color="bg-cyan-100 text-cyan-600"
                                />
                                <MetaItem
                                    icon={Zap}
                                    label="Print Time"
                                    value={`${file.metadata?.estimatedPrintTime || 0}s`}
                                    color="bg-green-100 text-green-600"
                                />
                                <MetaItem
                                    icon={BarChart}
                                    label="Complexity"
                                    value={file.metadata?.complexityScore.toString() || '0'}
                                    color="bg-indigo-100 text-indigo-600"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {readyFiles.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">Please upload documents first to see analysis.</p>
                </div>
            )}
        </div>
    );
};

const MetaItem = ({ icon: Icon, label, value, color }: any) => (
    <div className="p-6 border-b border-r border-slate-100 last:border-r-0 hover:bg-slate-50 transition-colors">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3 shadow-sm", color)}>
            <Icon className="h-5 w-5" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-900 mt-0.5">{value}</p>
    </div>
);
