import React, { useState, useEffect } from 'react';
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
    const [imageError, setImageError] = useState(false);
    const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
    const category = getFileCategory(file.fileType);
    const Icon = getFileIcon(file.fileType);

    // Load authenticated content for images
    useEffect(() => {
        console.log('FilePreview useEffect:', { category, fileId: file.id, open });
        
        if (category === 'image' && open) {
            const loadImage = async () => {
                try {
                    const previewUrl = mediaAPI.getPreviewUrl(file.id);
                    console.log('Loading image from:', previewUrl);
                    
                    const headers = mediaAPI.isDevEndpoint(previewUrl) ? {} : 
                        (mediaAPI as any).getAuthHeaders();
                    console.log('Using headers:', headers);
                    
                    const response = await fetch(previewUrl, { headers });
                    
                    console.log('Image response status:', response.status);
                    
                    if (response.ok) {
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        setImageBlobUrl(blobUrl);
                        setImageError(false);
                        console.log('Image loaded successfully');
                    } else {
                        const errorText = await response.text();
                        console.error('Image load failed:', response.status, errorText);
                        setImageError(true);
                    }
                } catch (error) {
                    console.error('Failed to load image:', error);
                    setImageError(true);
                }
            };
            
            loadImage();
            
            // Cleanup blob URL when dialog closes
            return () => {
                if (imageBlobUrl) {
                    URL.revokeObjectURL(imageBlobUrl);
                    setImageBlobUrl(null);
                }
            };
        }
    }, [category, file.id, open, imageBlobUrl]);

    const handleDownload = async () => {
        const downloadUrl = mediaAPI.getDownloadUrl(file.id);
        console.log('Starting download from:', downloadUrl);
        
        setIsLoading(true);
        
        try {
            // First check if the file exists
            const exists = await mediaAPI.checkFileExists(file.id);
            if (!exists) {
                throw new Error('File not found on server');
            }
            
            // Create a direct download link
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = file.fileName;
            a.target = '_blank';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            console.log('Download link clicked');
            
            // Set a timeout to hide loading state
            setTimeout(() => {
                setIsLoading(false);
                console.log('Download loading state cleared');
            }, 2000);
            
        } catch (error: any) {
            console.error('Download failed:', error);
            alert(error.message || 'Download failed. Please try again later.');
            setIsLoading(false);
        }
    };

    const handleOpenInNewTab = async () => {
        const previewUrl = mediaAPI.getPreviewUrl(file.id);
        
        try {
            // Check if file exists before opening
            const exists = await mediaAPI.checkFileExists(file.id);
            if (!exists) {
                throw new Error('File not found on server');
            }
            
            window.open(previewUrl, '_blank', 'noopener,noreferrer');
        } catch (error: any) {
            console.error('Failed to open file:', error);
            alert(error.message || 'Failed to open file. Please try again later.');
        }
    };

    const renderPreviewContent = () => {
        const previewUrl = mediaAPI.getPreviewUrl(file.id);
        
        if (category === 'image') {
            return (
                <div className="flex justify-center">
                    <img
                        src={imageBlobUrl || ''}
                        alt={file.fileName}
                        className="max-w-full max-h-96 rounded-lg shadow-lg"
                        onError={(e) => {
                            setImageError(true);
                            e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => setImageError(false)}
                    />
                    {imageError && (
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
                    <iframe
                        src={previewUrl}
                        className="w-full h-full rounded-lg border"
                        title={file.fileName}
                        onLoad={() => {
                            // PDFs may need authentication headers, so try open in new tab if this fails
                        }}
                        onError={() => {
                            setImageError(true);
                        }}
                    />
                    {imageError && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Icon className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 mb-2">PDF preview failed</p>
                            <p className="text-sm text-gray-400">Try opening in a new tab</p>
                        </div>
                    )}
                </div>
            );
        }

        if (category === 'video') {
            return (
                <div className="flex justify-center">
                    <video
                        src={previewUrl}
                        controls
                        className="max-w-full max-h-96 rounded-lg shadow-lg"
                        onError={() => {
                            setImageError(true);
                        }}
                    >
                        Your browser does not support the video tag.
                    </video>
                    {imageError && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Icon className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-gray-500 mb-2">Video failed to load</p>
                            <p className="text-sm text-gray-400">Try downloading the file</p>
                        </div>
                    )}
                </div>
            );
        }

        // Default file preview
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
                        className="cursor-pointer"
                        onClick={category === 'image' ? handleOpenInNewTab : undefined}
                    >
                        {renderPreviewContent()}
                    </div>
                </ScrollArea>

                {file.uploadUrl && (
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
                )}
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
        console.log('Starting download from:', downloadUrl);
        
        setIsLoading(true);
        
        try {
            // First check if the file exists
            const exists = await mediaAPI.checkFileExists(file.id);
            if (!exists) {
                throw new Error('File not found on server');
            }
            
            // Create a direct download link
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = file.fileName;
            a.target = '_blank';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            console.log('Download link clicked');
            
            // Set a timeout to hide loading state
            setTimeout(() => {
                setIsLoading(false);
                console.log('Download loading state cleared');
            }, 2000);
            
        } catch (error: any) {
            console.error('Download failed:', error);
            alert(error.message || 'Download failed. Please try again later.');
            setIsLoading(false);
        }
    };

    const handleOpenInNewTab = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const previewUrl = mediaAPI.getPreviewUrl(file.id);
        
        try {
            // Check if file exists before opening
            const exists = await mediaAPI.checkFileExists(file.id);
            if (!exists) {
                throw new Error('File not found on server');
            }
            
            window.open(previewUrl, '_blank', 'noopener,noreferrer');
        } catch (error: any) {
            console.error('Failed to open file:', error);
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
                    disabled={!file.uploadUrl}
                    className="h-8 w-8 p-0"
                    title="Open in new tab"
                >
                    <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!file.uploadUrl || isLoading}
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
