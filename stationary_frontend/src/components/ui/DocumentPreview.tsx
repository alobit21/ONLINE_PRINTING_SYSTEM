import { useState } from 'react';
import { Eye, Download, Loader2, AlertCircle, ExternalLink, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';
import { getAuthToken, getAuthHeaders } from '../../lib/auth';

export interface DocumentPreviewProps {
    documentId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    className?: string;
}

export const DocumentPreview = ({
    documentId,
    fileName,
    fileType,
    fileSize,
    className,
}: DocumentPreviewProps) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [isLoadingTab, setIsLoadingTab] = useState(false);
    const [isLoadingDownload, setIsLoadingDownload] = useState(false);
    const [error, setError] = useState<string>('');

    // ─── Helpers ────────────────────────────────────────────────────────────────

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return '📄';
        if (type.includes('word') || type.includes('doc')) return '📝';
        if (type.includes('image')) return '🖼️';
        return '📄';
    };

    const isImageFile = (type: string) =>
        type.includes('image/') ||
        type.includes('jpg') ||
        type.includes('jpeg') ||
        type.includes('png');

    const isPDFFile = (type: string) => type.includes('pdf');

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const resolveAuthError = (status: number) => {
        if (status === 401) return 'Authentication required. Please log in again.';
        if (status === 403) return 'Permission denied. You do not have access to this document.';
        if (status === 404) return 'Document not found.';
        return 'An unexpected error occurred. Please try again.';
    };

    /**
     * Fetches the document via the API with JWT auth headers and returns a blob URL.
     *
     * Why this is necessary:
     * window.open(apiUrl) and <a href={apiUrl}> both make browser-native requests
     * that do NOT include the Authorization header, causing a 401 Unauthorized.
     * By fetching with headers first and converting to a blob URL, we can hand
     * the browser a local object URL it can open/download freely without auth.
     */
    const fetchAuthenticatedBlob = async (
        endpoint: 'view' | 'download'
    ): Promise<string | null> => {
        if (!getAuthToken()) {
            setError('Authentication required. Please log in again.');
            return null;
        }

        const response = await fetch(
            `http://localhost:8000/api/documents/${documentId}/${endpoint}/`,
            { headers: getAuthHeaders() }
        );

        if (!response.ok) {
            setError(resolveAuthError(response.status));
            return null;
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    // ─── Handlers ───────────────────────────────────────────────────────────────

    const handlePreview = async () => {
        setIsLoadingPreview(true);
        setError('');

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
        }

        try {
            const url = await fetchAuthenticatedBlob('view');
            if (url) setPreviewUrl(url);
        } catch (err) {
            console.error('Preview error:', err);
            setError('Failed to load document preview.');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleOpenInNewTab = async () => {
        setIsLoadingTab(true);
        setError('');

        try {
            // Reuse existing blob URL if a preview is already loaded
            let url = previewUrl;
            let isTemporary = false;

            if (!url) {
                url = (await fetchAuthenticatedBlob('view')) ?? '';
                isTemporary = true;
            }

            if (!url) return;

            const tab = window.open(url, '_blank');

            if (!tab) {
                setError('Pop-ups are blocked. Please allow pop-ups for this site and try again.');
                if (isTemporary) URL.revokeObjectURL(url);
                return;
            }

            // Revoke temporary blob URLs after the browser has loaded the resource
            if (isTemporary) {
                setTimeout(() => URL.revokeObjectURL(url), 10_000);
            }
        } catch (err) {
            console.error('Open in new tab error:', err);
            setError('Failed to open document in a new tab.');
        } finally {
            setIsLoadingTab(false);
        }
    };

    const handleDownload = async () => {
        setIsLoadingDownload(true);
        setError('');

        try {
            const url = await fetchAuthenticatedBlob('download');
            if (!url) return;

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
            setError('Failed to download document.');
        } finally {
            setIsLoadingDownload(false);
        }
    };

    const handleClosePreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
        }
    };

    // ─── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className={cn('border border-gray-200 rounded-lg p-4 space-y-4', className)}>
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="text-2xl flex-shrink-0">{getFileIcon(fileType)}</div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {fileName}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {fileType} • {formatFileSize(fileSize)}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreview}
                        disabled={isLoadingPreview}
                        className="flex items-center gap-2"
                    >
                        {isLoadingPreview ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Loading...</>
                        ) : (
                            <><Eye className="h-4 w-4" /> Preview</>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenInNewTab}
                        disabled={isLoadingTab}
                        className="flex items-center gap-2"
                    >
                        {isLoadingTab ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Opening...</>
                        ) : (
                            <><ExternalLink className="h-4 w-4" /> Open</>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={isLoadingDownload}
                        className="flex items-center gap-2"
                    >
                        {isLoadingDownload ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Downloading...</>
                        ) : (
                            <><Download className="h-4 w-4" /> Download</>
                        )}
                    </Button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-700 flex-1">{error}</span>
                    <button
                        onClick={() => setError('')}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Preview Panel */}
            {previewUrl && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Preview
                        </span>
                        <button
                            onClick={handleClosePreview}
                            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                        >
                            <X className="h-3 w-3" /> Close
                        </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        {isImageFile(fileType) ? (
                            <img
                                src={previewUrl}
                                alt={fileName}
                                className="w-full h-auto max-h-96 object-contain bg-gray-50"
                            />
                        ) : isPDFFile(fileType) ? (
                            <iframe
                                src={previewUrl}
                                title={fileName}
                                className="w-full h-96 border-0"
                            />
                        ) : (
                            <div className="p-8 text-center bg-gray-50">
                                <Eye className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-gray-600">
                                    Preview not available for this file type
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{fileType}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};