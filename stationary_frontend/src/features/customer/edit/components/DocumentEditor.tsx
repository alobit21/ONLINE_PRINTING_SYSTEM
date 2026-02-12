import { useCustomerStore } from '../../../../stores/customerStore';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Settings2, Scissors, Layers, Check, Info } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { useState } from 'react';

export const DocumentEditor = () => {
    const { files, updateFile } = useCustomerStore();
    const readyFiles = files.filter(f => f.status === 'ready');
    const [selectedId, setSelectedId] = useState<string | null>(readyFiles[0]?.id || null);

    const activeFile = files.find(f => f.id === selectedId);

    const paperSizes = ['A4', 'A3', 'A5', 'Letter'];

    return (
        <div className="space-y-6 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Document Editor</h2>
                <p className="text-slate-500">Fine-tune your layout and select premium finishes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* File Sidebar (Desktop) */}
                <div className="lg:col-span-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Your Documents</p>
                    {readyFiles.map((file) => (
                        <button
                            key={file.id}
                            onClick={() => setSelectedId(file.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all",
                                selectedId === file.id
                                    ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm"
                                    : "border-transparent bg-white text-slate-600 hover:border-slate-200"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs",
                                selectedId === file.id ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                            )}>
                                {file.name.split('.').pop()?.toUpperCase()}
                            </div>
                            <span className="text-sm font-bold truncate text-left flex-1">{file.name}</span>
                            {selectedId === file.id && <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />}
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-8">
                    {activeFile ? (
                        <Card className="glass border-none shadow-xl rounded-3xl overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600">
                                            <Settings2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">Configure Printing</h3>
                                            <p className="text-xs text-slate-500">Setting up: {activeFile.name}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">
                                        ID: {activeFile.id}
                                    </div>
                                </div>

                                {/* Paper Size Selector */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Scissors className="h-4 w-4 text-brand-500" />
                                        Paper Size
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {paperSizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => updateFile(activeFile.id, { metadata: { ...activeFile.metadata!, paperSize: size } })}
                                                className={cn(
                                                    "h-12 rounded-xl font-bold text-sm transition-all border-2",
                                                    activeFile.metadata?.paperSize === size
                                                        ? "border-brand-500 bg-brand-600 text-white"
                                                        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-brand-200"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Premium Services */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-brand-500" />
                                        Finishing Services
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <ServiceToggle
                                            title="Professional Binding"
                                            description="Spiral or Glue binding for a premium look."
                                            icon={<Check className="h-4 w-4" />}
                                            active={activeFile.metadata?.isBinding}
                                            onClick={() => updateFile(activeFile.id, {
                                                metadata: { ...activeFile.metadata!, isBinding: !activeFile.metadata?.isBinding }
                                            })}
                                        />
                                        <ServiceToggle
                                            title="Lamination"
                                            description="Protect your pages with high-quality laminate."
                                            icon={<Check className="h-4 w-4" />}
                                            active={activeFile.metadata?.isLamination}
                                            onClick={() => updateFile(activeFile.id, {
                                                metadata: { ...activeFile.metadata!, isLamination: !activeFile.metadata?.isLamination }
                                            })}
                                        />
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-4">
                                    <div className="h-8 w-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        Our AI has automatically optimized your document for the best print quality.
                                        You can manually override any settings here.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                            <p className="text-slate-500">Select a document to edit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ServiceToggle = ({ title, description, icon, active, onClick }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left group w-full",
            active ? "border-brand-500 bg-brand-50/50" : "border-slate-100 hover:border-brand-200"
        )}>
        <div className={cn(
            "h-6 w-6 rounded-full flex items-center justify-center transition-all",
            active ? "bg-brand-600 text-white" : "bg-slate-200 text-transparent group-hover:bg-slate-300"
        )}>
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{description}</p>
        </div>
    </button>
);
