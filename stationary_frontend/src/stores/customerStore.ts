import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorkflowStep = 'upload' | 'analysis' | 'optimize' | 'edit' | 'shop' | 'checkout';

export interface DocumentMetadata {
    pageCount: number;
    isColor: boolean;
    paperSize: string;
    orientation: 'portrait' | 'landscape';
    estimatedPrintTime: number;
    complexityScore: number;
}

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error' | 'analyzing' | 'ready';
    metadata?: DocumentMetadata;
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
                files: state.files.filter(f => f.status === 'ready'),
                selectedShopId: state.selectedShopId
            }),
        }
    )
);
