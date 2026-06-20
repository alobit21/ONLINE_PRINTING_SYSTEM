import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';

import { useMutation } from '@apollo/client/react';
import { CREATE_GUEST_DOCUMENT, type CreateGuestDocumentData, type CreateDocumentVariables } from '../api';

// Supported formats
const SUPPORTED_FORMATS = [
  { ext: 'PDF', type: 'application/pdf' },
  { ext: 'DOC', type: 'application/msword' },
  { ext: 'DOCX', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { ext: 'JPG', type: 'image/jpeg' },
  { ext: 'PNG', type: 'image/png' }
];

interface PrintConfiguration {
  isColor: boolean;
  paperSize: string;
  copies: number;
  isBinding: boolean;
  isLamination: boolean;
}

export const GuestPrintUploadFlow = () => {
  const { addFiles, files, updateFile, deleteDocumentFromServer } = useCustomerStore();
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [config] = useState<PrintConfiguration>({
    isColor: false,
    paperSize: 'A4',
    copies: 1,
    isBinding: false,
    isLamination: false
  });

  const [createGuestDocument] = useMutation<CreateGuestDocumentData, CreateDocumentVariables>(CREATE_GUEST_DOCUMENT);

  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const supportedTypes = SUPPORTED_FORMATS.map(f => f.type);
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }
    
    if (!supportedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type. Please upload PDF, DOC, DOCX, JPG, or PNG' };
    }
    
    return { valid: true };
  };

  const handleFileSelect = async (fileList: FileList) => {
    console.log("Files selected:", fileList.length);
    const fileArray = Array.from(fileList);
    
    for (const file of fileArray) {
      console.log("Processing file:", file.name, file.size, file.type);
      const validation = validateFile(file);
      if (!validation.valid) {
        console.error("Validation failed:", validation.error);
        alert(validation.error);
        continue;
      }

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log("Created temp ID:", tempId);
      
      let previewUrl = undefined;
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        previewUrl = URL.createObjectURL(file);
      }
      
      // Add temporary file to store
      addFiles([{
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading',
        preview: previewUrl
      }]);
      
      // Auto-select the newly uploaded file for preview
      setPreviewFileId(tempId);

      await performUpload(tempId, file);
    }
  };

  const performUpload = async (tempId: string, file: File) => {
    try {
      console.log("Starting upload for file:", file.name);
      updateFile(tempId, { status: 'uploading', progress: 20 });

      // Step 1: Create document metadata via GraphQL
      console.log("Creating guest document metadata...");
      const { data } = await createGuestDocument({
        variables: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || 'application/pdf'
        }
      });

      console.log("Guest document response:", data);

      if (data?.createGuestDocument?.response.success) {
        const backendId = data.createGuestDocument.document.id;
        console.log("Document created with ID:", backendId);
        
        updateFile(tempId, {
          id: backendId,
          progress: 80,
          status: 'analyzing'
        });
        
        // Update the previewFileId if it was pointing to the tempId
        setPreviewFileId(current => current === tempId ? backendId : current);

        // Step 2: Simulate document analysis (skip REST API for now)
        setTimeout(() => {
          console.log("Document analysis complete");
          updateFile(backendId, {
            status: 'ready',
            progress: 100,
            metadata: {
              pageCount: Math.floor(Math.random() * 50) + 1,
              isColor: file.type === 'application/pdf' ? Math.random() > 0.5 : false,
              paperSize: 'A4',
              orientation: 'portrait' as const,
              estimatedPrintTime: 10,
              complexityScore: 3,
              isBinding: config.isBinding,
              isLamination: config.isLamination
            }
          });
        }, 2000);
      } else {
        console.error("Failed to create guest document:", data);
        updateFile(tempId, { status: 'error', error: 'Upload failed' });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      updateFile(tempId, {
        status: 'error',
        error: err instanceof Error ? err.message : 'Upload failed'
      });
    }
  };

  const readyFiles = files.filter(f => f.status === 'ready');
  const hasFiles = files.length > 0;
  
  const handleRemoveFile = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteDocumentFromServer(id);
      if (previewFileId === id) {
        setPreviewFileId(null);
      }
    } catch (err) {
      console.error('Failed to remove file:', err);
      // Even if backend fails, we might want to force remove it from UI, 
      // but deleteDocumentFromServer already handles 404s gracefully.
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Determine which file to preview
  const fileToPreview = files.find(f => f.id === previewFileId) || readyFiles[0] || files[0];

  return (
    <div className={`grid gap-8 items-start transition-all duration-500 ${hasFiles ? 'lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
      <div className="space-y-8">
        {/* Upload Zone */}
      <div className="bg-canvas border-2 border-dashed border-fog hover:border-hp-primary rounded-[16px] transition-colors shadow-sm">
        <div className="p-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-cloud rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-hp-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-ink">Upload your documents</h3>
              <p className="text-charcoal mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                console.log("File input change event triggered");
                console.log("Files:", e.target.files);
                if (e.target.files && e.target.files.length > 0) {
                  console.log("Calling handleFileSelect with files:", e.target.files.length);
                  handleFileSelect(e.target.files);
                } else {
                  console.log("No files selected");
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <button 
              type="button"
              className="cursor-pointer bg-hp-primary text-canvas hover:bg-hp-primary/90 px-6 py-3 rounded-[4px] font-semibold flex items-center justify-center mx-auto transition-colors tracking-[0.7px]"
              onClick={() => {
                console.log("Button clicked - triggering file input");
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) {
                  fileInput.click();
                } else {
                  console.error("File input not found");
                }
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-ink">Uploaded Files</h3>
          {files.map(file => (
            <div 
              key={file.id} 
              onClick={() => setPreviewFileId(file.id)}
              className={`p-4 bg-canvas border rounded-[16px] shadow-[0_2px_8px_rgba(26,26,26,0.08)] cursor-pointer transition-colors ${
                (previewFileId === file.id || (!previewFileId && file.id === fileToPreview?.id))
                  ? 'border-hp-primary ring-1 ring-hp-primary'
                  : 'border-fog hover:border-hp-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-steel" />
                  <div>
                    <p className="font-medium text-ink">{file.name}</p>
                    <p className="text-sm text-charcoal">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {file.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
                    {file.status === 'ready' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    <span className="text-sm text-steel capitalize hidden sm:inline-block">{file.status}</span>
                  </div>
                  <div className="w-[1px] h-4 bg-fog hidden sm:block"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.id);
                    }}
                    disabled={isDeleting === file.id || file.status === 'uploading'}
                    className="p-1.5 text-steel hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove file"
                  >
                    {isDeleting === file.id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <X className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue Button */}
      {readyFiles.length > 0 && (
        <div className="flex justify-center">
          <button 
            onClick={() => {
              console.log("Continue button clicked");
              console.log("Current ready files:", readyFiles.length);
              
              // Update the global customer store step
              const { setCurrentStep: setGlobalStep } = useCustomerStore.getState();
              console.log("Setting global step to 'analysis'");
              setGlobalStep('analysis');
              
              console.log("Global step updated");
            }}
            className="bg-hp-primary text-canvas hover:bg-hp-primary/90 px-6 py-3 rounded-[4px] font-semibold transition-colors tracking-[0.7px]"
          >
            Continue to Analysis
          </button>
        </div>
      )}
      </div>

      {/* Right side document preview panel */}
      {hasFiles && (
        <div className="bg-canvas border border-fog rounded-[16px] shadow-[0_2px_8px_rgba(26,26,26,0.08)] overflow-hidden flex flex-col min-h-[600px] sticky top-[140px] animate-fade-in">
          <div className="bg-cloud border-b border-fog p-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-ink flex items-center gap-2">
              <FileText className="w-4 h-4 text-hp-primary" />
              Document Preview
            </h3>
            <span className="text-[10px] font-bold bg-hp-primary text-canvas px-2 py-1 rounded-[4px] uppercase tracking-[0.7px]">Preview Mode</span>
          </div>
          <div className="flex-1 bg-fog/30 p-8 flex items-center justify-center relative">
            {fileToPreview ? (
              <div className="w-full h-full flex flex-col relative items-center justify-center">
                {fileToPreview.preview ? (
                  fileToPreview.type.startsWith('image/') ? (
                    <img 
                      src={fileToPreview.preview} 
                      alt="Preview" 
                      className="max-w-[90%] max-h-[500px] object-contain shadow-[0_4px_24px_rgba(26,26,26,0.15)] rounded-[8px] bg-canvas border border-fog"
                    />
                  ) : fileToPreview.type === 'application/pdf' ? (
                    <object 
                      data={fileToPreview.preview} 
                      type="application/pdf" 
                      className="w-full max-w-[90%] h-[500px] shadow-[0_4px_24px_rgba(26,26,26,0.15)] rounded-[8px] bg-canvas border border-fog"
                    >
                      <p>Your browser does not support PDFs. <a href={fileToPreview.preview} target="_blank" rel="noreferrer" className="text-hp-primary">Download the PDF</a>.</p>
                    </object>
                  ) : (
                    <div className="bg-canvas w-[90%] sm:w-[70%] aspect-[1/1.4] shadow-xl rounded-[4px] flex flex-col relative border border-fog items-center justify-center p-8 text-center">
                      <FileText className="w-16 h-16 text-steel mb-4" />
                      <p className="text-ink font-medium">Document Preview not available</p>
                      <p className="text-charcoal text-sm mt-2">File type: {fileToPreview.type || fileToPreview.name.split('.').pop()}</p>
                      <p className="text-steel text-xs mt-1">{fileToPreview.name}</p>
                    </div>
                  )
                ) : (
                  <div className="bg-canvas w-[90%] sm:w-[70%] aspect-[1/1.4] shadow-xl rounded-[4px] flex flex-col relative border border-fog items-center justify-center p-8 text-center">
                    <FileText className="w-16 h-16 text-steel mb-4" />
                    <p className="text-ink font-medium text-lg">Preview not available</p>
                    <p className="text-charcoal text-sm mt-2 text-center max-w-sm">This file was uploaded in a previous session or its temporary preview URL has expired. Please re-upload the file to see the preview.</p>
                    <p className="text-steel text-xs mt-4 bg-cloud px-3 py-1 rounded-full">{fileToPreview.name}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 bg-cloud rounded-full flex items-center justify-center animate-pulse">
                  <Loader2 className="w-8 h-8 text-hp-primary animate-spin" />
                </div>
                <div>
                  <p className="text-ink font-medium">Processing Document...</p>
                  <p className="text-steel text-sm mt-1">Generating preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
