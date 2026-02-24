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
    X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { mediaAPI } from '../../services/mediaAPI';

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

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType === 'application/pdf') return FileText;
    if (fileType.startsWith('video/')) return FileVideo;
    return File;
};

const getFileCategory = (fileType: string): 'image' | 'pdf' | 'video' | 'document' | 'other' => {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType === 'application/pdf') return 'pdf';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.includes('document') || fileType.includes('sheet') || fileType.includes('presentation')) return 'document';
    return 'other';
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeColor = (category: string) => {
    const colors = {
        image: 'bg-green-100 text-green-700 border-green-200',
        pdf: 'bg-red-100 text-red-700 border-red-200',
        video: 'bg-purple-100 text-purple-700 border-purple-200',
        document: 'bg-blue-100 text-blue-700 border-blue-200',
        other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[category as keyof typeof colors] || colors.other;
};

export function FilePreview({ file, open, onOpenChange }: FilePreviewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
    const blobUrlRef = useRef<string | null>(null);
    const category = getFileCategory(file.fileType);
    const Icon = getFileIcon(file.fileType);

    // FIX 1: imageBlobUrl removed from deps to prevent infinite re-render loop.
    // A ref is used for cleanup so the latest blob URL is always accessible
    // in the cleanup function without triggering re-runs.
    useEffect(() => {
        if (category !== 'image' || !open) return;

        let cancelled = false;
        setPreviewError(false);
        setImageBlobUrl(null);

        const loadImage = async () => {
            try {
                const previewUrl = mediaAPI.getPreviewUrl(file.id);
                const headers = mediaAPI.getAuthHeaders();

                const response = await fetch(previewUrl, { headers });

                if (cancelled) return;

                if (response.ok) {
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    blobUrlRef.current = blobUrl;
                    setImageBlobUrl(blobUrl);
                    setPreviewError(false);
                } else {
                    console.error('Image load failed:', response.status, await response.text());
                    setPreviewError(true);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to load image:', error);
                    setPreviewError(true);
                }
            }
        };

        loadImage();

        return () => {
            cancelled = true;
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
                setImageBlobUrl(null);
            }
        };
    }, [category, file.id, open]); // ✅ No imageBlobUrl dependency

    // Load PDF with authentication
    useEffect(() => {
        if (category !== 'pdf' || !open) return;

        let cancelled = false;
        setPreviewError(false);
        setPdfBlobUrl(null);

        const loadPdf = async () => {
            try {
                const previewUrl = mediaAPI.getPreviewUrl(file.id);
                const response = await fetch(previewUrl, {
                    headers: mediaAPI.getAuthHeaders()
                });

                if (cancelled) return;

                if (response.ok) {
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    blobUrlRef.current = blobUrl;
                    setPdfBlobUrl(blobUrl);
                    setPreviewError(false);
                } else {
                    console.error('PDF load failed:', response.status, await response.text());
                    setPreviewError(true);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to load PDF:', error);
                    setPreviewError(true);
                }
            }
        };

        loadPdf();

        return () => {
            cancelled = true;
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
                setPdfBlobUrl(null);
            }
        };
    }, [category, file.id, open]);

    // Load video with authentication
    useEffect(() => {
        if (category !== 'video' || !open) return;

        let cancelled = false;
        setPreviewError(false);
        setVideoBlobUrl(null);

        const loadVideo = async () => {
            try {
                const previewUrl = mediaAPI.getPreviewUrl(file.id);
                const response = await fetch(previewUrl, {
                    headers: mediaAPI.getAuthHeaders()
                });

                if (cancelled) return;

                if (response.ok) {
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    blobUrlRef.current = blobUrl;
                    setVideoBlobUrl(blobUrl);
                    setPreviewError(false);
                } else {
                    console.error('Video load failed:', response.status, await response.text());
                    setPreviewError(true);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error('Failed to load video:', error);
                    setPreviewError(true);
                }
            }
        };

        loadVideo();

        return () => {
            cancelled = true;
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
                setVideoBlobUrl(null);
            }
        };
    }, [category, file.id, open]);

    // Reset error state when file changes
    useEffect(() => {
        setPreviewError(false);
    }, [file.id]);

    const handleDownload = async () => {
        const downloadUrl = mediaAPI.getDownloadUrl(file.id);
        setIsLoading(true);

        try {
            const response = await fetch(downloadUrl, {
                headers: mediaAPI.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Extract filename from Content-Disposition header if available
            let filename = file.fileName;
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Create and trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error: any) {
            console.error('Download failed:', error);
            alert(error.message || 'Download failed. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenInNewTab = async () => {
        const viewUrl = mediaAPI.getPreviewUrl(file.id);
        
        try {
            const response = await fetch(viewUrl, {
                headers: mediaAPI.getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Failed to open file: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            // Open in new tab
            window.open(objectUrl, '_blank', 'noopener,noreferrer');
            
            // Clean up object URL after a short delay
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            
        } catch (error: any) {
            console.error('Open failed:', error);
            alert(error.message || 'Failed to open file. Please try again later.');
        }
    };

    const renderPreviewContent = () => {

        if (category === 'image') {
            return (
                <div className="flex justify-center">
                    {!previewError && imageBlobUrl && (
                        <img
                            src={imageBlobUrl}
                            alt={file.fileName}
                            className="max-w-full max-h-96 rounded-lg shadow-lg"
                            onError={() => setPreviewError(true)}
                        />
                    )}
                    {!previewError && !imageBlobUrl && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Loader2 className="h-10 w-10 text-gray-400 mb-4 animate-spin" />
                            <p className="text-gray-500">Loading preview...</p>
                        </div>
                    )}
                    {previewError && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Icon className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 mb-2">Image failed to load</p>
                            <p className="text-sm text-gray-400">Try downloading the file instead</p>
                        </div>
                    )}
                </div>
            );
        }

        if (category === 'pdf') {
            return (
                <div className="w-full h-96">
                    {previewError ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Icon className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 mb-2">PDF preview failed</p>
                            <p className="text-sm text-gray-400">Try opening in a new tab</p>
                        </div>
                    ) : !pdfBlobUrl ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Loader2 className="h-10 w-10 text-gray-400 mb-4 animate-spin" />
                            <p className="text-gray-500">Loading PDF...</p>
                        </div>
                    ) : (
                        <iframe
                            src={pdfBlobUrl}
                            className="w-full h-full rounded-lg border"
                            title={file.fileName}
                            onError={() => setPreviewError(true)}
                        />
                    )}
                </div>
            );
        }

        if (category === 'video') {
            return (
                <div className="flex justify-center">
                    {!previewError && !videoBlobUrl ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Loader2 className="h-10 w-10 text-gray-400 mb-4 animate-spin" />
                            <p className="text-gray-500">Loading video...</p>
                        </div>
                    ) : !previewError && videoBlobUrl ? (
                        <video
                            src={videoBlobUrl}
                            controls
                            className="max-w-full max-h-96 rounded-lg shadow-lg"
                            onError={() => setPreviewError(true)}
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Icon className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 mb-2">Video failed to load</p>
                            <p className="text-sm text-gray-400">Try downloading the file</p>
                        </div>
                    )}
                </div>
            );
        }

        // Default: no preview available
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Icon className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">Preview not available</p>
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
                            <DialogTitle className="text-lg font-semibold">{file.fileName}</DialogTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className={cn('text-xs', getFileTypeColor(category))}>
                                    {file.fileType}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    {formatFileSize(file.fileSize)}
                                </span>
                                {file.createdAt && (
                                    <span className="text-sm text-gray-500">
                                        Uploaded {new Date(file.createdAt).toLocaleDateString()}
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

                <ScrollArea className="flex-1">
                    <div
                        className={cn(category === 'image' && !previewError && imageBlobUrl ? 'cursor-pointer' : '')}
                        onClick={category === 'image' && !previewError && imageBlobUrl ? handleOpenInNewTab : undefined}
                    >
                        {renderPreviewContent()}
                    </div>
                </ScrollArea>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    {category !== 'image' && (
                        <Button onClick={handleOpenInNewTab} variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                        </Button>
                    )}
                    <Button onClick={handleDownload} variant="outline" size="sm" disabled={isLoading}>
                        {isLoading ? (
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

interface FileAttachmentCardProps {
    file: FileAttachment;
    onPreview: (file: FileAttachment) => void;
}

export function FileAttachmentCard({ file, onPreview }: FileAttachmentCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const category = getFileCategory(file.fileType);
    const Icon = getFileIcon(file.fileType);

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const downloadUrl = mediaAPI.getDownloadUrl(file.id);
        setIsLoading(true);

        try {
            const response = await fetch(downloadUrl, {
                headers: mediaAPI.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            // Extract filename from Content-Disposition header if available
            let filename = file.fileName;
            const contentDisposition = response.headers.get('Content-Disposition');
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Create and trigger download
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        } catch (error: any) {
            console.error('Download failed:', error);
            alert(error.message || 'Download failed. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenInNewTab = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const viewUrl = mediaAPI.getPreviewUrl(file.id);
        
        try {
            const response = await fetch(viewUrl, {
                headers: mediaAPI.getAuthHeaders()
            });
            
            if (!response.ok) {
                throw new Error(`Failed to open file: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            
            // Open in new tab
            window.open(objectUrl, '_blank', 'noopener,noreferrer');
            
            // Clean up object URL after a short delay
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            
        } catch (error: any) {
            console.error('Open failed:', error);
            alert(error.message || 'Failed to open file. Please try again later.');
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
                <p className="text-sm font-medium text-gray-900 truncate">
                    {file.fileName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <Badge className={cn('text-xs', getFileTypeColor(category))}>
                        {category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                        {formatFileSize(file.fileSize)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenInNewTab}
                    className="h-8 w-8 p-0"
                    title="Open in new tab"
                >
                    <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                    title="Download file"
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}