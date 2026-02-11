import { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, X, FileText, CheckCircle2, Loader2, AlertCircle, Image as ImageIcon, File, ChevronRight } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';
import { cn } from '../../../../lib/utils';
import { Card, CardContent } from '../../../../components/ui/Card';
import { useMutation } from '@apollo/client/react';
import { CREATE_DOCUMENT, type CreateDocumentData, type CreateDocumentVariables } from '../api';

// Supported formats with their icons and colors
const SUPPORTED_FORMATS = [
  { ext: 'PDF', type: 'application/pdf', icon: FileText, color: 'bg-red-100 text-red-600' },
  { ext: 'DOC', type: 'application/msword', icon: FileText, color: 'bg-blue-100 text-blue-600' },
  { ext: 'DOCX', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: FileText, color: 'bg-blue-100 text-blue-600' },
  { ext: 'JPG', type: 'image/jpeg', icon: ImageIcon, color: 'bg-green-100 text-green-600' },
  { ext: 'PNG', type: 'image/png', icon: ImageIcon, color: 'bg-green-100 text-green-600' }
];

export const UploadZone = () => {
  const { addFiles, files, removeFile, updateFile } = useCustomerStore();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<string[]>([]);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [createDocument] = useMutation<CreateDocumentData, CreateDocumentVariables>(CREATE_DOCUMENT);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const performUpload = async (tempId: string, file: File) => {
    try {
      // Create preview for images
      let preview = null;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
        updateFile(tempId, { preview, progress: 20 });
      } else {
        updateFile(tempId, { progress: 20, status: 'uploading' });
      }

      const { data } = await createDocument({
        variables: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || 'application/pdf'
        }
      });

      if (data?.createDocument.response.status) {
        const backendId = data.createDocument.document.id;

        // Swap temp ID for real Backend UUID
        updateFile(tempId, {
          id: backendId,
          progress: 80,
          status: 'analyzing'
        });

        // Simulate AI analysis
        setTimeout(() => {
          const pageCount = Math.floor(Math.random() * 20) + 1;
          updateFile(backendId, {
            status: 'ready',
            progress: 100,
            metadata: {
              pageCount,
              isColor: Math.random() > 0.5,
              paperSize: 'A4',
              orientation: 'portrait',
              estimatedPrintTime: pageCount * 5,
              complexityScore: Math.random() * 5 + 3
            }
          });

          // Remove from upload queue
          setUploadQueue(prev => prev.filter(id => id !== tempId && id !== backendId));
        }, 1500);
      } else {
        updateFile(tempId, { status: 'error', error: 'Upload failed' });
        setUploadQueue(prev => prev.filter(id => id !== tempId));
      }
    } catch (err) {
      console.error("Upload failed:", err);
      updateFile(tempId, { 
        status: 'error', 
        error: err instanceof Error ? err.message : 'Upload failed' 
      });
      setUploadQueue(prev => prev.filter(id => id !== tempId));
    }
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = SUPPORTED_FORMATS.map(f => f.type);
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `Unsupported file format. Please upload ${SUPPORTED_FORMATS.map(f => f.ext).join(', ')}` 
      };
    }
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File size exceeds 50MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
      };
    }
    return { valid: true };
  };

  const processFiles = (filesToProcess: File[]) => {
    filesToProcess.forEach(file => {
      const validation = validateFile(file);
      if (!validation.valid) {
        // Show error toast/banner
        alert(validation.error);
        return;
      }

      // Check for duplicate files
      const isDuplicate = files.some(f => f.name === file.name && f.size === file.size);
      if (isDuplicate) {
        if (!confirm(`${file.name} already exists. Do you want to upload it again?`)) {
          return;
        }
      }

      const tempId = 'temp_' + Math.random().toString(36).substr(2, 9);
      
      // Add to queue
      setUploadQueue(prev => [...prev, tempId]);
      
      // Add file to store with optimistic update
      addFiles([{ 
        id: tempId, 
        name: file.name, 
        size: file.size, 
        type: file.type, 
        progress: 0, 
        status: 'queued' as const,
        queuedAt: new Date().toISOString()
      }]);

      // Start upload after a small delay to show queued state
      setTimeout(() => {
        performUpload(tempId, file);
      }, 300);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, [processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
    // Clear input so same file can be uploaded again
    e.target.value = '';
  };

  const getFileIcon = (fileType: string, fileName: string) => {
    const format = SUPPORTED_FORMATS.find(f => f.type === fileType);
    if (format) {
      const Icon = format.icon;
      return <Icon className={cn("h-6 w-6", format.color.split(' ')[1])} />;
    }
    // Fallback based on extension
    const ext = fileName.split('.').pop()?.toUpperCase();
    if (ext === 'PDF') return <FileText className="h-6 w-6 text-red-600" />;
    if (['DOC', 'DOCX'].includes(ext || '')) return <FileText className="h-6 w-6 text-blue-600" />;
    if (['JPG', 'JPEG', 'PNG'].includes(ext || '')) return <ImageIcon className="h-6 w-6 text-green-600" />;
    return <File className="h-6 w-6 text-slate-600" />;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'analyzing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'uploading': return 'bg-brand-100 text-brand-700 border-brand-200';
      case 'queued': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ready': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'analyzing': return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case 'uploading': return <Loader2 className="h-4 w-4 animate-spin text-brand-600" />;
      case 'queued': return <Loader2 className="h-4 w-4 text-slate-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Upload queue counter
  const queuedCount = files.filter(f => f.status === 'queued' || f.status === 'uploading').length;
  const analyzingCount = files.filter(f => f.status === 'analyzing').length;
  const readyCount = files.filter(f => f.status === 'ready').length;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Upload Documents
          </h2>
          <p className="text-slate-500">
            Fast and secure printing with smart document analysis
          </p>
        </div>
        
        {files.length > 0 && (
          <div className="flex items-center gap-3">
            {readyCount > 0 && (
              <div className="px-3 py-1.5 bg-green-50 rounded-2xl border border-green-200">
                <span className="text-sm font-medium text-green-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  {readyCount} ready
                </span>
              </div>
            )}
            {(queuedCount + analyzingCount) > 0 && (
              <div className="px-3 py-1.5 bg-brand-50 rounded-2xl border border-brand-200">
                <span className="text-sm font-medium text-brand-700 flex items-center gap-1.5">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {queuedCount + analyzingCount} processing
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main upload zone */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300",
          "flex flex-col items-center gap-4 cursor-pointer group",
          isDragging
            ? "border-brand-500 bg-brand-50/80 scale-[0.99] shadow-lg"
            : "border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50/50 hover:shadow-md"
        )}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-brand-500/10 backdrop-blur-[2px] rounded-3xl z-10 
                        flex items-center justify-center animate-pulse">
            <div className="bg-white/90 px-6 py-3 rounded-2xl shadow-xl">
              <p className="text-brand-700 font-bold text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Drop files to upload
              </p>
            </div>
          </div>
        )}

        {/* Upload icon with animated background */}
        <div className={cn(
          "h-24 w-24 rounded-3xl flex items-center justify-center transition-all duration-300",
          isDragging 
            ? "bg-brand-200 scale-110" 
            : "bg-brand-100 group-hover:bg-brand-200 group-hover:scale-105"
        )}>
          <Upload className={cn(
            "h-12 w-12 transition-all duration-300",
            isDragging 
              ? "text-brand-700 scale-110" 
              : "text-brand-600 group-hover:text-brand-700"
          )} />
        </div>

        {/* Upload text */}
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-slate-800">
            {isDragging ? 'Release to upload' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-slate-500">
            or <span className="text-brand-600 font-medium hover:text-brand-700">browse files</span> from your device
          </p>
        </div>

        {/* Format badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {SUPPORTED_FORMATS.map(format => (
            <div
              key={format.ext}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5",
                format.color,
                "border border-transparent"
              )}
            >
              <format.icon className="h-3.5 w-3.5" />
              {format.ext}
            </div>
          ))}
          <div className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-600">
            Max 50MB
          </div>
        </div>

        <input
          ref={fileInputRef}
          id="fileInput"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </div>

      {/* Upload another button - only show when files exist */}
      {files.length > 0 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group px-6 py-2.5 rounded-2xl bg-white border-2 border-brand-200 
                     text-brand-700 font-semibold hover:bg-brand-50 
                     hover:border-brand-300 transition-all duration-200
                     flex items-center gap-2 shadow-sm hover:shadow"
          >
            <Upload className="h-4 w-4 group-hover:scale-110 transition-transform" />
            Upload Another Document
          </button>
        </div>
      )}

      {/* Files list */}
      {files.length > 0 && (
        <div className="space-y-3 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Uploaded Documents ({files.length})
            </h3>
            <button
              onClick={() => {
                if (confirm('Remove all uploaded files?')) {
                  files.forEach(file => {
                    if (file.preview) URL.revokeObjectURL(file.preview);
                    removeFile(file.id);
                  });
                }
              }}
              className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition"
            >
              Clear all
            </button>
          </div>

          {files.map((file, index) => {
            const format = SUPPORTED_FORMATS.find(f => f.type === file.type);
            const isImage = file.type?.startsWith('image/');
            
            return (
              <Card 
                key={file.id} 
                className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-200
                         slide-in-right group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* File icon/preview */}
                    <div className={cn(
                      "h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0",
                      "border-2 transition-all duration-200",
                      file.status === 'ready' ? "border-green-200" :
                      file.status === 'error' ? "border-red-200" : "border-slate-200",
                      isImage && file.preview ? "overflow-hidden p-0" : format?.color
                    )}>
                      {isImage && file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getFileIcon(file.type, file.name)
                      )}
                    </div>

                    {/* File details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900 truncate pr-4 group-hover:text-brand-700 transition">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-500">
                              {formatFileSize(file.size)}
                            </span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium border flex items-center gap-1",
                              getStatusColor(file.status)
                            )}>
                              {getStatusIcon(file.status)}
                              {file.status === 'analyzing' ? 'AI Analyzing' : 
                               file.status === 'queued' ? 'Queued' :
                               file.status === 'ready' ? 'Ready' : 
                               file.status === 'uploading' ? 'Uploading' : 
                               file.status}
                            </span>
                            {file.metadata?.pageCount && (
                              <>
                                <span className="text-xs text-slate-300">•</span>
                                <span className="text-xs font-medium text-brand-600">
                                  {file.metadata.pageCount} {file.metadata.pageCount === 1 ? 'page' : 'pages'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {file.status === 'ready' && (
                            <button
                              onClick={() => {/* Navigate to next step */}}
                              className="p-2 text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition-all"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (file.preview) URL.revokeObjectURL(file.preview);
                              removeFile(file.id);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar for uploading */}
                      {file.status === 'uploading' && (
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-brand-600 font-medium">Uploading...</span>
                            <span className="text-slate-500">{file.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-600 transition-all duration-300 ease-out relative"
                              style={{ width: `${file.progress}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Analyzing state with animation */}
                      {file.status === 'analyzing' && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>AI analyzing document...</span>
                          </div>
                          <div className="flex gap-2 text-[10px] text-slate-500">
                            <span className="px-2 py-1 bg-slate-100 rounded-full">Detecting colors</span>
                            <span className="px-2 py-1 bg-slate-100 rounded-full">Counting pages</span>
                            <span className="px-2 py-1 bg-slate-100 rounded-full">Checking quality</span>
                          </div>
                        </div>
                      )}

                      {/* Queued state */}
                      {file.status === 'queued' && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Waiting in queue...</span>
                          {file.queuedAt && (
                            <span className="text-[10px] text-slate-400">
                              {new Date(file.queuedAt).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Error state */}
                     {/* Error state */}
{file.status === 'error' && (
  <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
    <span>{file.error || 'Upload failed'}</span>
    <button
      onClick={() => {
        removeFile(file.id);
        // Note: Retry requires the user to re-select the file
        alert('Please re-upload the file from your device');
        fileInputRef.current?.click();
      }}
      className="ml-auto text-xs font-medium text-red-700 hover:text-red-800 underline"
    >
      Retry
    </button>
  </div>
)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state with helpful tips */}
      {files.length === 0 && (
        <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-brand-600 bg-red-50" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900">Ready to start printing?</h4>
              <p className="text-sm text-slate-600">
                Upload your documents and our AI will automatically analyze them for:
              </p>
              <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                <li>Page count and paper size detection</li>
                <li>Color vs black & white page identification</li>
                <li>Instant price calculation with 10% description fees</li>
                <li>Print quality optimization suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

