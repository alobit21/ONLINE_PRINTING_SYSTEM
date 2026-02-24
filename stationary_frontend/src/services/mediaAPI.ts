import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with auth
const apiClient = () => {
    const token = localStorage.getItem('token') || 
                 JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
    
    return axios.create({
        baseURL: `${API_BASE_URL}/api/storage`,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `JWT ${token}` })
        }
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
     * Get authentication headers for API requests
     * @returns HeadersInit object with Authorization header if token exists
     */
    getAuthHeaders(): Record<string, string> {
        const token = localStorage.getItem('token') || 
                     JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
        
        return token ? { 'Authorization': `JWT ${token}` } : {};
    }

    /**
     * Upload a file using REST API
     * @param file - File object to upload
     * @returns Promise<UploadResponse>
     */
    async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token') || 
                     JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token;
        
        try {
            const response = await axios.post(`${API_BASE_URL}/api/storage/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...(token && { 'Authorization': `JWT ${token}` })
                }
            });
            
            return response.data;
        } catch (error: any) {
            console.error('Upload failed:', error);
            throw new Error(error.response?.data?.error || 'Upload failed');
        }
    }

    /**
     * Get file metadata by ID
     * @param documentId - Document ID
     * @returns Promise<MediaFile>
     */
    async getMedia(documentId: string): Promise<MediaFile> {
        try {
            const response = await apiClient().get(`/media/${documentId}/`);
            return response.data;
        } catch (error: any) {
            console.error('Get media failed:', error);
            throw new Error(error.response?.data?.error || 'Failed to get media');
        }
    }

    /**
     * List all user's media files
     * @returns Promise<MediaFile[]>
     */
    async listMedia(): Promise<{ media: MediaFile[]; count: number }> {
        try {
            const response = await apiClient().get('/media/');
            return response.data;
        } catch (error: any) {
            console.error('List media failed:', error);
            throw new Error(error.response?.data?.error || 'Failed to list media');
        }
    }

    /**
     * Delete a media file
     * @param documentId - Document ID
     * @returns Promise<void>
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
     * @param fileName - Name of the file
     * @param fileType - MIME type of the file
     * @param fileSize - Size of the file in bytes
     * @returns Promise<PresignedUploadResponse>
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
                fileSize
            });
            return response.data;
        } catch (error: any) {
            console.error('Create presigned upload failed:', error);
            throw new Error(error.response?.data?.error || 'Failed to create presigned upload');
        }
    }

    /**
     * Get download URL for a file
     * @param documentId - Document ID
     * @returns string
     */
    getDownloadUrl(documentId: string): string {
        // TODO: Implement clean download URL
        return `${API_BASE_URL}/api/documents/${documentId}/download/`;
    }

    /**
     * Get preview URL for a file
     * @param documentId - Document ID
     * @returns string
     */
    getPreviewUrl(documentId: string): string {
        // TODO: Implement clean preview URL
        return `${API_BASE_URL}/api/documents/${documentId}/view/`;
    }
}

// Export singleton instance
export const mediaAPI = new MediaAPI();

// Export types for use in components
export type { MediaAPI };
