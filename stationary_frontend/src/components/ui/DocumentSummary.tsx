import { FileText, Clock } from 'lucide-react';
import { Badge } from './badge';
import { cn } from '../../lib/utils';

export interface DocumentMetadata {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    pageCount?: number;
    isColor?: boolean;
    paperSize?: string;
    copies?: number;
    totalPrice?: number;
    status?: string;
    uploadedAt?: string;
}

interface DocumentSummaryProps {
    document: DocumentMetadata;
    className?: string;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
        UPLOADED: 'bg-blue-100 text-blue-700 border-blue-200',
        ANALYZING: 'bg-amber-100 text-amber-700 border-amber-200',
        READY: 'bg-green-100 text-green-700 border-green-200',
        ERROR: 'bg-red-100 text-red-700 border-red-200',
    };
    return status ? colors[status] || colors.UPLOADED : '';
};

export const DocumentSummary = ({ document, className }: DocumentSummaryProps) => {
    return (
        <div className={cn("border border-gray-200 rounded-lg p-4 space-y-3", className)}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                        <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {document.fileName}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {formatFileSize(document.fileSize)} • {document.fileType}
                        </p>
                    </div>
                </div>
                {document.status && (
                    <Badge className={cn('text-xs', getStatusColor(document.status))}>
                        {document.status.charAt(0) + document.status.slice(1).toLowerCase()}
                    </Badge>
                )}
            </div>

            {/* Print Configuration */}
            {(document.pageCount || document.isColor !== undefined || document.paperSize || document.copies) && (
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Print Configuration</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {document.pageCount && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Pages:</span>
                                <span className="font-medium">{document.pageCount}</span>
                            </div>
                        )}
                        {document.isColor !== undefined && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Color:</span>
                                <span className="font-medium">{document.isColor ? 'Color' : 'B&W'}</span>
                            </div>
                        )}
                        {document.paperSize && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Size:</span>
                                <span className="font-medium">{document.paperSize}</span>
                            </div>
                        )}
                        {document.copies && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Copies:</span>
                                <span className="font-medium">{document.copies}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pricing */}
            {document.totalPrice && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">Total Price:</span>
                    <span className="text-lg font-bold text-green-600">
                        TZS {Number(document.totalPrice).toLocaleString()}
                    </span>
                </div>
            )}

            {/* Footer */}
            {document.uploadedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                </div>
            )}
        </div>
    );
};

interface DocumentListProps {
    documents: DocumentMetadata[];
    className?: string;
}

export const DocumentList = ({ documents, className }: DocumentListProps) => {
    if (documents.length === 0) {
        return (
            <div className={cn("text-center py-8", className)}>
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No documents found</p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-3", className)}>
            {documents.map((doc) => (
                <DocumentSummary key={doc.id} document={doc} />
            ))}
        </div>
    );
};
