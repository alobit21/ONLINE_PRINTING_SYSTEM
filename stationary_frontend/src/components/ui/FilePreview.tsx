import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from './dialog';
import { Button } from './Button';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import {
    File,
    FileText,
    FileImage,
    FileVideo,
    Download,
    ExternalLink,
    Loader2,
    X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { mediaAPI } from '../../services/mediaAPI';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileAttachment {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadUrl?: string;
    downloadUrl?: string;
    createdAt?: string;
}

interface FilePreviewProps {
    file: FileAttachment;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FileAttachmentCardProps {
    file: FileAttachment;
    onPreview: (file: FileAttachment) => void;
}

type FileCategory = 'image' | 'pdf' | 'video' | 'document' | 'other';

// ─── Pure helpers ─────────────────────────────────────────────────────────────

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType === 'application/pdf') return FileText;
    if (fileType.startsWith('video/')) return FileVideo;
    return File;
};

const getFileCategory = (fileType: string): FileCategory => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType === 'application/pdf') return 'pdf';
    if (fileType.startsWith('video/')) return 'video';
    if (
        fileType.includes('document') ||
        fileType.includes('sheet') ||
        fileType.includes('presentation')
    )
        return 'document';
    return 'other';
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeColor = (category: FileCategory): string => {
    const colors: Record<FileCategory, string> = {
        image: 'bg-green-100 text-green-700 border-green-200',
        pdf: 'bg-red-100 text-red-700 border-red-200',
        video: 'bg-purple-100 text-purple-700 border-purple-200',
        document: 'bg-blue-100 text-blue-700 border-blue-200',
        other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category];
};

// ─── Authenticated fetch utilities ────────────────────────────────────────────

/**
 * Fetch a file without authentication and return a blob URL.
 *
 * The preview endpoint is now publicly accessible, so we can fetch directly
 * without JWT headers. We still convert to blob URLs for consistent handling.
 */
const fetchBlobUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

/**
 * Download a file without authentication, using the Content-Disposition
 * filename from the response when available.
 */
const downloadFile = async (url: string, fallbackFileName: string): Promise<void> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    let filename = fallbackFileName;
    const contentDisposition = response.headers.get('Content-Disposition');
    if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match) filename = match[1];
    }

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
};

// ─── Hook: useAuthenticatedBlobUrl ────────────────────────────────────────────

/**
 * Fetches a URL with auth headers, returning a stable blob URL for use in
 * <img>, <iframe>, or <video> tags. Cleans up the blob URL on unmount.
 *
 * @param url     - The authenticated API URL to fetch. Pass null to skip.
 * @param enabled - Set false to prevent fetching (e.g. dialog is closed).
 */
function useAuthenticatedBlobUrl(
    url: string | null,
    enabled: boolean
): { blobUrl: string | null; isLoading: boolean; hasError: boolean } {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const currentBlobUrl = useRef<string | null>(null);

    useEffect(() => {
        if (!enabled || !url) {
            setBlobUrl(null);
            setHasError(false);
            return;
        }

        let cancelled = false;

        setIsLoading(true);
        setHasError(false);
        setBlobUrl(null);

        fetchBlobUrl(url)
            .then((newUrl) => {
                if (cancelled) {
                    URL.revokeObjectURL(newUrl);
                    return;
                }
                currentBlobUrl.current = newUrl;
                setBlobUrl(newUrl);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('useAuthenticatedBlobUrl error:', err);
                    setHasError(true);
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
            if (currentBlobUrl.current) {
                URL.revokeObjectURL(currentBlobUrl.current);
                currentBlobUrl.current = null;
            }
            setBlobUrl(null);
        };
    }, [url, enabled]);

    return { blobUrl, isLoading, hasError };
}

// ─── FilePreview (dialog) ─────────────────────────────────────────────────────

export function FilePreview({ file, open, onOpenChange }: FilePreviewProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isOpeningTab, setIsOpeningTab] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const category = getFileCategory(file.fileType);
    const Icon = getFileIcon(file.fileType);

    const previewUrl = mediaAPI.getPreviewUrl(file.id);
    const previewEnabled = open && category !== 'other' && category !== 'document';

    const { blobUrl, isLoading, hasError } = useAuthenticatedBlobUrl(
        previewEnabled ? previewUrl : null,
        previewEnabled
    );

    useEffect(() => {
        setActionError(null);
    }, [file.id]);

    const handleDownload = async () => {
        setIsDownloading(true);
        setActionError(null);
        try {
            await downloadFile(mediaAPI.getDownloadUrl(file.id), file.fileName);
        } catch (err: any) {
            console.error('Download failed:', err);
            setActionError(err.message || 'Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleOpenInNewTab = async () => {
        setIsOpeningTab(true);
        setActionError(null);
        try {
            // Reuse the already-loaded blob URL when possible to avoid a
            // second network request. Only fetch fresh if not yet loaded.
            const objectUrl = blobUrl ?? (await fetchBlobUrl(previewUrl));
            const isFresh = !blobUrl;

            const tab = window.open(objectUrl, '_blank', 'noopener,noreferrer');

            if (!tab) {
                setActionError('Pop-ups are blocked. Please allow pop-ups for this site.');
                if (isFresh) URL.revokeObjectURL(objectUrl);
                return;
            }

            // Revoke only URLs we created here — not the one managed by the hook
            if (isFresh) {
                setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
            }
        } catch (err: any) {
            console.error('Open in new tab failed:', err);
            setActionError(err.message || 'Failed to open file. Please try again.');
        } finally {
            setIsOpeningTab(false);
        }
    };

    const renderPreview = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 text-gray-400 mb-4 animate-spin" />
                    <p className="text-gray-500">Loading preview…</p>
                </div>
            );
        }

        if (hasError) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Icon className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-1">Preview failed to load</p>
                    <p className="text-sm text-gray-400">Try downloading the file instead</p>
                </div>
            );
        }

        if (category === 'image' && blobUrl) {
            return (
                <div
                    className="flex justify-center cursor-pointer"
                    onClick={handleOpenInNewTab}
                    title="Click to open full size"
                >
                    <img
                        src={blobUrl}
                        alt={file.fileName}
                        className="max-w-full max-h-96 rounded-lg shadow-lg"
                    />
                </div>
            );
        }

        if (category === 'pdf' && blobUrl) {
            return (
                <div className="w-full h-96">
                    <iframe
                        src={blobUrl}
                        className="w-full h-full rounded-lg border"
                        title={file.fileName}
                    />
                </div>
            );
        }

        if (category === 'video' && blobUrl) {
            return (
                <div className="flex justify-center">
                    <video
                        src={blobUrl}
                        controls
                        className="max-w-full max-h-96 rounded-lg shadow-lg"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-1">Preview not available</p>
                <p className="text-sm text-gray-400">Download the file to view its contents</p>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div>
                            <DialogTitle className="text-lg font-semibold">
                                {file.fileName}
                            </DialogTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className={cn('text-xs', getFileTypeColor(category))}>
                                    {file.fileType}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    {formatFileSize(file.fileSize)}
                                </span>
                                {file.createdAt && (
                                    <span className="text-sm text-gray-500">
                                        Uploaded{' '}
                                        {new Date(file.createdAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <ScrollArea className="flex-1">{renderPreview()}</ScrollArea>

                {actionError && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        <span className="flex-1">{actionError}</span>
                        <button onClick={() => setActionError(null)}>
                            <X className="h-4 w-4 text-red-400 hover:text-red-600" />
                        </button>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                    {category !== 'image' && (
                        <Button
                            onClick={handleOpenInNewTab}
                            variant="outline"
                            size="sm"
                            disabled={isOpeningTab}
                        >
                            {isOpeningTab ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <ExternalLink className="h-4 w-4 mr-2" />
                            )}
                            Open
                        </Button>
                    )}
                    <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4 mr-2" />
                        )}
                        Download
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── FileAttachmentCard ───────────────────────────────────────────────────────

export function FileAttachmentCard({ file, onPreview }: FileAttachmentCardProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isOpeningTab, setIsOpeningTab] = useState(false);
    const category = getFileCategory(file.fileType);
    const Icon = getFileIcon(file.fileType);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDownloading(true);
        try {
            await downloadFile(mediaAPI.getDownloadUrl(file.id), file.fileName);
        } catch (err: any) {
            console.error('Download failed:', err);
            alert(err.message || 'Download failed. Please try again later.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleOpenInNewTab = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpeningTab(true);
        try {
            const objectUrl = await fetchBlobUrl(mediaAPI.getPreviewUrl(file.id));
            const tab = window.open(objectUrl, '_blank', 'noopener,noreferrer');

            if (!tab) {
                alert('Pop-ups are blocked. Please allow pop-ups for this site.');
                URL.revokeObjectURL(objectUrl);
                return;
            }

            setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
        } catch (err: any) {
            console.error('Open failed:', err);
            alert(err.message || 'Failed to open file. Please try again later.');
        } finally {
            setIsOpeningTab(false);
        }
    };

    return (
        <div
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onPreview(file)}
        >
            <div className="flex-shrink-0">
                <Icon className="h-8 w-8 text-gray-400" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn('text-xs', getFileTypeColor(category))}>
                        {category}
                    </Badge>
                    <span className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenInNewTab}
                    disabled={isOpeningTab}
                    className="h-8 w-8 p-0"
                    title="Open in new tab"
                >
                    {isOpeningTab ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <ExternalLink className="h-4 w-4" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="h-8 w-8 p-0"
                    title="Download file"
                >
                    {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}