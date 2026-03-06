import { useState, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, ArrowRight, Settings, Package } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';
import { cn } from '../../../../lib/utils';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { DocumentSummary } from '../../../../components/ui/DocumentSummary';
import { useMutation } from '@apollo/client/react';
import { CREATE_DOCUMENT, type CreateDocumentData, type CreateDocumentVariables } from '../api';

// Supported formats
const SUPPORTED_FORMATS = [
  { ext: 'PDF', type: 'application/pdf' },
  { ext: 'DOC', type: 'application/msword' },
  { ext: 'DOCX', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { ext: 'JPG', type: 'image/jpeg' },
  { ext: 'PNG', type: 'image/png' }
];

type UploadStep = 'upload' | 'analyzing' | 'configure' | 'pricing' | 'confirmation';

interface PrintConfiguration {
  isColor: boolean;
  paperSize: string;
  copies: number;
  isBinding: boolean;
  isLamination: boolean;
}

export const PrintUploadFlow = () => {
  const { addFiles, files, updateFile } = useCustomerStore();
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [config, setConfig] = useState<PrintConfiguration>({
    isColor: false,
    paperSize: 'A4',
    copies: 1,
    isBinding: false,
    isLamination: false
  });

  const [createDocument] = useMutation<CreateDocumentData, CreateDocumentVariables>(CREATE_DOCUMENT);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleFileSelect = async (fileList: FileList) => {
    const fileArray = Array.from(fileList);
    
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      addFiles([{
        id: tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      }]);

      await performUpload(tempId, file);
    }
  };

  const performUpload = async (tempId: string, file: File) => {
    try {
      updateFile(tempId, { status: 'uploading', progress: 20 });

      // Step 1: Create document metadata via GraphQL
      const { data } = await createDocument({
        variables: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || 'application/pdf'
        }
      });

      if (data?.createDocumentDev.response.status) {
        const backendId = data.createDocumentDev.document.id;
        
        updateFile(tempId, {
          id: backendId,
          progress: 60,
          status: 'uploading'
        });

        // Step 2: Upload actual file via REST API (development endpoint)
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch('http://localhost:8001/api/storage/upload/dev/', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || `Upload failed with status ${uploadResponse.status}`);
        }

        updateFile(backendId, {
          status: 'analyzing',
          progress: 80
        });

        // Simulate analysis (in real app, this would be backend processing)
        setTimeout(() => {
          updateFile(backendId, {
            status: 'ready',
            progress: 100,
            metadata: {
              pageCount: Math.floor(Math.random() * 20) + 1,
              isColor: config.isColor,
              paperSize: config.paperSize,
              orientation: 'portrait' as const,
              estimatedPrintTime: 10,
              complexityScore: 3,
              isBinding: config.isBinding,
              isLamination: config.isLamination
            }
          });
        }, 2000);
      } else {
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

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = SUPPORTED_FORMATS.map(f => f.type);
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not supported. Please upload PDF, DOC, DOCX, JPG, or PNG files.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 50MB.' };
    }

    return { valid: true };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleConfigureFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setCurrentStep('configure');
  };

  const calculatePrice = () => {
    if (!selectedFile?.metadata) return 0;
    
    const basePrice = selectedFile.metadata.isColor ? 500 : 100;
    const pageCount = selectedFile.metadata.pageCount || 1;
    const sizeMultiplier = config.paperSize === 'A3' ? 1.5 : 1;
    const copies = config.copies;
    
    let total = (basePrice * pageCount * sizeMultiplier * copies);
    
    if (config.isBinding) total += 1000;
    if (config.isLamination) total += 1000;
    
    return total;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents for Printing</h2>
              <p className="text-gray-600">Upload your files and we'll prepare them for professional printing</p>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-500 transition-colors cursor-pointer bg-gray-50 hover:bg-brand-50"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Drop files here or click to browse</h3>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, DOC, DOCX, JPG, PNG (Max 50MB)
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                accept={SUPPORTED_FORMATS.map(f => f.type).join(',')}
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
                {files.map((file) => (
                  <Card key={file.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => handleConfigureFile(file.id)}
                              className="h-8"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Configure
                            </Button>
                          )}
                          {file.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                          {file.status === 'analyzing' && <Loader2 className="h-4 w-4 animate-spin text-amber-500" />}
                          {file.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {file.status === 'ready' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'configure':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Print Settings</h2>
              <p className="text-gray-600">Customize how your document should be printed</p>
            </div>

            {selectedFile && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h3>
                  <DocumentSummary 
                    document={{
                      id: selectedFile.id,
                      fileName: selectedFile.name,
                      fileType: selectedFile.type,
                      fileSize: selectedFile.size,
                      pageCount: selectedFile.metadata?.pageCount,
                      uploadedAt: new Date().toISOString()
                    }}
                  />
                </div>

                {/* Configuration Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Print Options</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={!config.isColor ? "primary" : "outline"}
                          onClick={() => setConfig(prev => ({ ...prev, isColor: false }))}
                          className="h-12"
                        >
                          Black & White
                        </Button>
                        <Button
                          variant={config.isColor ? "primary" : "outline"}
                          onClick={() => setConfig(prev => ({ ...prev, isColor: true }))}
                          className="h-12"
                        >
                          Color
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['A4', 'A3'].map(size => (
                          <Button
                            key={size}
                            variant={config.paperSize === size ? "primary" : "outline"}
                            onClick={() => setConfig(prev => ({ ...prev, paperSize: size }))}
                            className="h-12"
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Copies</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 5].map(copies => (
                          <Button
                            key={copies}
                            variant={config.copies === copies ? "primary" : "outline"}
                            onClick={() => setConfig(prev => ({ ...prev, copies }))}
                            className="h-12"
                          >
                            {copies}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Finishing Options</label>
                      <div className="space-y-2">
                        <Button
                          variant={config.isBinding ? "primary" : "outline"}
                          onClick={() => setConfig(prev => ({ ...prev, isBinding: !prev.isBinding }))}
                          className="w-full h-12 justify-start"
                        >
                          Binding (+TZS 1,000)
                        </Button>
                        <Button
                          variant={config.isLamination ? "primary" : "outline"}
                          onClick={() => setConfig(prev => ({ ...prev, isLamination: !prev.isLamination }))}
                          className="w-full h-12 justify-start"
                        >
                          Lamination (+TZS 1,000)
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-700">Estimated Price:</span>
                      <span className="text-2xl font-bold text-green-600">
                        TZS {calculatePrice().toLocaleString()}
                      </span>
                    </div>
                    <Button
                      onClick={() => setCurrentStep('pricing')}
                      className="w-full h-14"
                      size="lg"
                    >
                      Continue to Pricing
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing Summary</h2>
              <p className="text-gray-600">Review your print configuration and pricing</p>
            </div>

            {selectedFile && (
              <div className="max-w-2xl mx-auto space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Price ({selectedFile.metadata?.pageCount || 1} pages)</span>
                        <span className="font-medium">TZS {((selectedFile.metadata?.isColor ? 500 : 100) * (selectedFile.metadata?.pageCount || 1)).toLocaleString()}</span>
                      </div>
                      
                      {config.paperSize === 'A3' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">A3 Size Surcharge</span>
                          <span className="font-medium">TZS {((selectedFile.metadata?.pageCount || 1) * 250).toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Copies ({config.copies})</span>
                        <span className="font-medium">×{config.copies}</span>
                      </div>
                      
                      {config.isBinding && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Binding</span>
                          <span className="font-medium">TZS 1,000</span>
                        </div>
                      )}
                      
                      {config.isLamination && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lamination</span>
                          <span className="font-medium">TZS 1,000</span>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">Total Price</span>
                          <span className="text-2xl font-bold text-green-600">
                            TZS {calculatePrice().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('configure')}
                    className="flex-1 h-14"
                  >
                    Back to Configuration
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('confirmation')}
                    className="flex-1 h-14"
                  >
                    Proceed to Order
                    <Package className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmation</h2>
              <p className="text-gray-600">Your print job is ready to be submitted</p>
            </div>

            {selectedFile && (
              <div className="max-w-2xl mx-auto">
                <DocumentSummary 
                  document={{
                    id: selectedFile.id,
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                    fileSize: selectedFile.size,
                    pageCount: selectedFile.metadata?.pageCount,
                    isColor: config.isColor,
                    paperSize: config.paperSize,
                    copies: config.copies,
                    totalPrice: calculatePrice(),
                    status: 'READY'
                  }}
                />

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Ready for printing</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Your document has been analyzed and configured. Click below to submit your order to the nearest print shop.
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('upload')}
                    className="flex-1 h-14"
                  >
                    Upload Another File
                  </Button>
                  <Button
                    onClick={() => {
                      // In real app, this would create the order
                      alert('Order submitted successfully! (This would create the order in production)');
                      setCurrentStep('upload');
                      setSelectedFileId(null);
                    }}
                    className="flex-1 h-14"
                  >
                    Submit Order
                    <Package className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[
            { step: 'upload' as UploadStep, label: 'Upload', icon: Upload },
            { step: 'configure' as UploadStep, label: 'Configure', icon: Settings },
            { step: 'pricing' as UploadStep, label: 'Pricing', icon: Package },
            { step: 'confirmation' as UploadStep, label: 'Confirm', icon: CheckCircle2 }
          ].map(({ step, label, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                currentStep === step 
                  ? "bg-brand-600 border-brand-600 text-white" 
                  : "border-gray-300 text-gray-500"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn(
                "ml-2 text-sm font-medium",
                currentStep === step ? "text-brand-600" : "text-gray-500"
              )}>
                {label}
              </span>
              {step !== 'confirmation' && (
                <ArrowRight className="h-4 w-4 mx-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {renderStepContent()}
      </div>
    </div>
  );
};
