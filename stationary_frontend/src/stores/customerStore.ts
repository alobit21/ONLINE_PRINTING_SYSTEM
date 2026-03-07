import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mediaAPI } from '../services/mediaAPI';

export type WorkflowStep = 'upload' | 'analysis' | 'optimize' | 'edit' | 'shop' | 'checkout';

export interface DocumentMetadata {
    pageCount: number;
    isColor: boolean;
    paperSize: string;
    orientation: 'portrait' | 'landscape';
    estimatedPrintTime: number;
    complexityScore: number;
    isBinding: boolean;
    isLamination: boolean;
}

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error' | 'analyzing' | 'ready' | 'queued';
    metadata?: DocumentMetadata;
    preview?: string;  // Add this line
    error?: string;    // Also adding error as it's used in the code
    queuedAt?: string; // And queuedAt is also used
}

interface CustomerState {
    // Workflow state
    currentStep: WorkflowStep;
    files: UploadedFile[];
    selectedShopId: string | null;

    // Actions
    setCurrentStep: (step: WorkflowStep) => void;
    addFiles: (files: UploadedFile[]) => void;
    updateFile: (id: string, updates: Partial<UploadedFile>) => void;
    removeFile: (id: string) => void;
    deleteDocumentFromServer: (id: string) => Promise<void>;
    setSelectedShopId: (id: string | null) => void;
    resetWorkflow: () => void;
}

export const useCustomerStore = create<CustomerState>()(
    persist(
        (set) => ({
            currentStep: 'upload',
            files: [],
            selectedShopId: null,

            setCurrentStep: (step) => set({ currentStep: step }),

            addFiles: (newFiles) => set((state) => ({
                files: [...state.files, ...newFiles]
            })),

            updateFile: (id, updates) => set((state) => ({
                files: state.files.map((f) => f.id === id ? { ...f, ...updates } : f)
            })),

            removeFile: (id) => set((state) => ({
                files: state.files.filter((f) => f.id !== id)
            })),

            deleteDocumentFromServer: async (id) => {
                try {
                    // Delete from backend
                    await mediaAPI.deleteDocument(id);
                    // Remove from local state
                    set((state) => ({
                        files: state.files.filter((f) => f.id !== id)
                    }));
                } catch (error: any) {
                    console.error('Failed to delete document from server:', error);
                    
                    // If document doesn't exist on server, just remove from local state
                    if (error.message?.includes('404') || error.message?.includes('not found')) {
                        console.log('Document not found on server, removing from local state only');
                        set((state) => ({
                            files: state.files.filter((f) => f.id !== id)
                        }));
                    } else {
                        throw error;
                    }
                }
            },

            setSelectedShopId: (id) => set({ selectedShopId: id }),

            resetWorkflow: () => set({
                currentStep: 'upload',
                files: [],
                selectedShopId: null
            }),
        }),
        {
            name: 'customer-workflow-storage',
            partialize: (state) => ({
                currentStep: state.currentStep,
                files: state.files.filter(f => f.status === 'ready'),
                selectedShopId: state.selectedShopId
            }),
        }
    )
);
