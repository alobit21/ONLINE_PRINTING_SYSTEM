import axios from 'axios';
import { getAuthToken, getAuthHeaders, getJsonAuthHeaders } from '../lib/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with auth + JSON content type (for JSON API calls only)
const apiClient = () => {
    const token = getAuthToken();

    return axios.create({
        baseURL: `${API_BASE_URL}/api/storage`,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `JWT ${token}` }),
        },
    });
};

export interface MediaFile {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadUrl: string;
    downloadUrl: string;
    createdAt: string;
    isScanned: boolean;
    virusDetected: boolean;
}

export interface UploadResponse {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadUrl: string;
    downloadUrl: string;
    createdAt: string;
    message: string;
}

export interface PresignedUploadResponse {
    documentId: string;
    uploadUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
}

class MediaAPI {
    /**
     * Auth headers for binary file fetches (NO Content-Type).
     * Use this for fetch() calls that download images, PDFs, videos, etc.
     */
    getAuthHeaders(): Record<string, string> {
        return getAuthHeaders();
    }

    /**
     * Auth headers for JSON API calls (includes Content-Type: application/json).
     * Use this for axios/fetch calls that send or receive JSON.
     */
    getJsonAuthHeaders(): Record<string, string> {
        return getJsonAuthHeaders();
    }

    /**
     * Upload a file using REST API
     */
    async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Use dev endpoint for testing (no authentication required)
            const response = await axios.post(`${API_BASE_URL}/api/storage/upload/dev/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error: any) {
            console.error('Upload failed:', error);
            throw new Error(error.response?.data?.error || 'Upload failed');
        }
    }

    /**
     * Get file metadata by ID
     */
    async getMedia(documentId: string): Promise<MediaFile> {
        try {
            // Use dev endpoint for testing (no authentication required)
            const response = await axios.get(`${API_BASE_URL}/api/storage/media/dev/${documentId}/`);
            return response.data;
        } catch (error: any) {
            console.error('Get media failed:', error);
            throw new Error(error.response?.data?.error || 'Failed to get media');
        }
    }

    /**
     * List all user's media files
     */
    async listMedia(): Promise<{ media: MediaFile[]; count: number }> {
        try {
            // Use dev endpoint for testing (no authentication required)
            const response = await axios.get(`${API_BASE_URL}/api/storage/media/`);
            return response.data;
        } catch (error: any) {
            console.error('List media failed:', error);
            throw new Error(error.response?.data?.error || 'Failed to list media');
        }
    }

    /**
     * Delete a media file
     */
    async deleteMedia(documentId: string): Promise<void> {
        try {
            await apiClient().delete(`/media/${documentId}/`);
        } catch (error: any) {
            console.error('Delete media failed:', error);
            throw new Error(error.response?.data?.error || 'Failed to delete media');
        }
    }

    /**
     * Create presigned upload URL for client-side uploads
     */
    async createPresignedUpload(
        fileName: string,
        fileType: string,
        fileSize: number
    ): Promise<PresignedUploadResponse> {
        try {
            const response = await apiClient().post('/presigned-upload/', {
                fileName,
                fileType,
                fileSize,
            });
            return response.data;
        } catch (error: any) {
            console.error('Create presigned upload failed:', error);
            throw new Error(
                error.response?.data?.error || 'Failed to create presigned upload'
            );
        }
    }

    /**
     * Delete a document from the server
     * @param documentId - Document ID to delete
     * @returns Promise<void>
     */
    async deleteDocument(documentId: string): Promise<void> {
        try {
            // Use dev endpoint for testing (no authentication required)
            const response = await axios.delete(`${API_BASE_URL}/api/storage/media/dev/${documentId}/`);
            console.log('Document deleted successfully');
        } catch (error: any) {
            console.error('Delete document failed:', error);
            console.error('Delete error details:', error.response?.data, error.response?.status);
            throw new Error(error.response?.data?.error || 'Failed to delete document');
        }
    }

    /**
     * Download URL for a file (authenticated fetch required — do not open directly in browser)
     */
    getDownloadUrl(documentId: string): string {
        return `${API_BASE_URL}/api/documents/${documentId}/download/`;
    }

    /**
     * Preview/view URL for a file (authenticated fetch required — do not open directly in browser)
     */
    getPreviewUrl(documentId: string): string {
        return `${API_BASE_URL}/api/documents/${documentId}/view/`;
    }
}

export const mediaAPI = new MediaAPI();
export type { MediaAPI };