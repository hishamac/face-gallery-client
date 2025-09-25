import axios from 'axios';
import type { Gallery, UploadResponse, ClusterResponse, Stats, PersonDetails, ImageDetails, MoveFaceResponse, MoveFaceToNewPersonResponse } from '@/types/api';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const faceAPI = {
  // Upload an image
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Trigger face clustering
  clusterFaces: async (): Promise<ClusterResponse> => {
    const response = await api.get<ClusterResponse>('/cluster');
    return response.data;
  },

  // Get gallery data
  getGallery: async (): Promise<Gallery> => {
    const response = await api.get<Gallery>('/gallery');
    return response.data;
  },

  // Get statistics
  getStats: async (): Promise<Stats> => {
    const response = await api.get<Stats>('/stats');
    return response.data;
  },

  // Reset database (use with caution)
  resetDatabase: async (): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>('/reset');
    return response.data;
  },

  // Get image URL
  getImageUrl: (filename: string): string => {
    return `${API_BASE_URL}/images/${filename}`;
  },

  // Get cropped face URL
  getFaceUrl: (filename: string): string => {
    return `${API_BASE_URL}/faces/${filename}`;
  },

  // Get person details
  getPersonDetails: async (personId: string): Promise<PersonDetails> => {
    const response = await api.get<PersonDetails>(`/person/${personId}`);
    return response.data;
  },

  // Get image details
  getImageDetails: async (imageId: string): Promise<ImageDetails> => {
    const response = await api.get<ImageDetails>(`/image/${imageId}`);
    return response.data;
  },

  // Rename a person
  renamePerson: async (personId: string, name: string): Promise<{ message: string; person_id: string; old_name: string; new_name: string }> => {
    const response = await api.put(`/person/${personId}/rename`, { name });
    return response.data;
  },

  // Move face to existing person
  moveFaceToPerson: async (faceId: string, targetPersonId: string): Promise<MoveFaceResponse> => {
    const response = await api.put(`/face/${faceId}/move`, { target_person_id: targetPersonId });
    return response.data;
  },

  // Move face to new person
  moveFaceToNewPerson: async (faceId: string): Promise<MoveFaceToNewPersonResponse> => {
    const response = await api.put(`/face/${faceId}/move-to-new`);
    return response.data;
  },

  // Get list of all persons for dropdown
  getAllPersons: async (): Promise<{ persons: Array<{ id: string; name: string }>; total: number }> => {
    const response = await api.get('/persons/list');
    return response.data;
  },
};

export default api;