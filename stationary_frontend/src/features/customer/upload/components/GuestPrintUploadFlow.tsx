import { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';
import { Card, CardContent } from '../../../../components/ui/Card';
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
  const { addFiles, files, updateFile } = useCustomerStore();
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
      
      // Add temporary file to store
      addFiles([{
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      }]);

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

      if (data?.createGuestDocument?.response.status) {
        const backendId = data.createGuestDocument.document.id;
        console.log("Document created with ID:", backendId);
        
        updateFile(tempId, {
          id: backendId,
          progress: 80,
          status: 'analyzing'
        });

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

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-brand-400 transition-colors">
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upload your documents</h3>
              <p className="text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB)</p>
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
              className="cursor-pointer bg-brand-600 text-white hover:bg-brand-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center mx-auto transition-colors"
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
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Files</h3>
          {files.map(file => (
            <Card key={file.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {file.status === 'ready' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-sm text-gray-500">{file.status}</span>
                </div>
              </div>
            </Card>
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
              console.log("Setting global step to 'optimize'");
              setGlobalStep('optimize');
              
              console.log("Global step updated");
            }}
            className="bg-brand-600 text-white hover:bg-brand-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Continue to Configuration
          </button>
        </div>
      )}
    </div>
  );
};
