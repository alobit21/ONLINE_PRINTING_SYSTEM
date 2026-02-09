import { useState, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';
import { cn } from '../../../../lib/utils';
import { Card, CardContent } from '../../../../components/ui/Card';
import { useMutation } from '@apollo/client/react';
import { CREATE_DOCUMENT, type CreateDocumentData, type CreateDocumentVariables } from '../api';

export const UploadZone = () => {
    const { addFiles, files, removeFile, updateFile } = useCustomerStore();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const [createDocument] = useMutation<CreateDocumentData, CreateDocumentVariables>(CREATE_DOCUMENT);

    const performUpload = async (tempId: string, file: File) => {
        try {
            updateFile(tempId, { progress: 20, status: 'uploading' });

            const { data } = await createDocument({
                variables: {
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type || 'application/pdf'
                }
            });

            if (data?.createDocument.response.status) {
                const backendId = data.createDocument.document.id;

                // 1. Swap the temp ID for the real Backend UUID IMMEDIATELY
                updateFile(tempId, {
                    id: backendId,
                    progress: 100,
                    status: 'analyzing'
                });

                // 2. Subsequent updates must use backendId
                // Simulate a very short "AI analysis" phase
                setTimeout(() => {
                    updateFile(backendId, {
                        status: 'ready',
                        metadata: {
                            pageCount: Math.floor(Math.random() * 20) + 1,
                            isColor: Math.random() > 0.5,
                            paperSize: 'A4',
                            orientation: 'portrait',
                            estimatedPrintTime: 120,
                            complexityScore: 4.5
                        }
                    });
                }, 800);
            } else {
                updateFile(tempId, { status: 'error' });
            }
        } catch (err) {
            console.error("Upload failed:", err);
            updateFile(tempId, { status: 'error' });
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);

        droppedFiles.forEach(file => {
            const tempId = 'temp_' + Math.random().toString(36).substr(2, 9);
            addFiles([{
                id: tempId,
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0,
                status: 'uploading' as const,
            }]);
            performUpload(tempId, file);
        });
    }, [addFiles, createDocument]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);

        selectedFiles.forEach(file => {
            const tempId = 'temp_' + Math.random().toString(36).substr(2, 9);
            addFiles([{
                id: tempId,
                name: file.name,
                size: file.size,
                type: file.type,
                progress: 0,
                status: 'uploading' as const,
            }]);
            performUpload(tempId, file);
        });
    };

    return (
        <div className="space-y-6 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Upload Documents</h2>
                <p className="text-slate-500">Fast and secure printing with smart document analysis.</p>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={onDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 flex flex-col items-center gap-4 cursor-pointer overflow-hidden",
                    isDragging
                        ? "border-brand-500 bg-brand-50/50 scale-[0.99]"
                        : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/50"
                )}
            >
                {isDragging && (
                    <div className="absolute inset-0 bg-brand-500/10 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <p className="text-brand-700 font-bold text-lg">Drop to upload</p>
                    </div>
                )}

                <div className="h-20 w-20 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 mb-2">
                    <Upload className="h-10 w-10 float" />
                </div>

                <div className="text-center">
                    <p className="text-xl font-bold text-slate-800">Drag & Drop files here</p>
                    <p className="text-sm text-slate-500 mt-1">or click to browse from your device</p>
                </div>

                <input
                    type="file"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                />

                <div className="mt-4 flex gap-6 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> PDF, DOCX</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Max 25MB</span>
                </div>
            </div>

            {/* File List */}
            <div className="space-y-3 mt-8">
                {files.map((file, index) => (
                    <Card key={file.id} className="overflow-hidden border-none shadow-md slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md",
                                        file.status === 'error' ? "bg-red-500" :
                                            file.status === 'ready' ? "bg-green-500" : "bg-brand-500"
                                    )}>
                                        {file.name.split('.').pop()?.toUpperCase() || 'FILE'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 truncate">{file.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-medium text-slate-500">
                                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                                            </span>
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                                                file.status === 'ready' ? "bg-green-100 text-green-700" :
                                                    file.status === 'analyzing' ? "bg-blue-100 text-blue-700" :
                                                        "bg-slate-100 text-slate-600"
                                            )}>
                                                {file.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {file.status === 'ready' && <div className="text-xs font-bold text-brand-600">{file.metadata?.pageCount} Pages</div>}
                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            {file.status === 'uploading' && (
                                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-600 transition-all duration-300 ease-out"
                                        style={{ width: `${file.progress}%` }}
                                    />
                                </div>
                            )}

                            {file.status === 'analyzing' && (
                                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-brand-600">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span>AI analyzing document...</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
