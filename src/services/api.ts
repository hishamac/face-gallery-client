import axios from 'axios';
import type { UploadResponse, ClusterResponse, Stats, PersonDetails, ImageDetails, MoveFaceResponse, MoveFaceToNewPersonResponse, DeleteFaceResponse, DeleteImageResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for large file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const faceAPI = {
  // Upload an image
  uploadImage: async (file: File, albumId?: string, sectionId?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (albumId) formData.append('album_id', albumId);
    if (sectionId) formData.append('section_id', sectionId);
    
    const response = await api.post<UploadResponse>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 180000, // 3 minutes for single file upload
    });
    
    return response.data;
  },

  // Search for similar faces using an uploaded image
  searchByImage: async (file: File, tolerance: number = 1, maxResults: number = 5): Promise<{
    message: string;
    matches: Array<{
      face_id: string;
      confidence: number;
      distance: number;
      person?: {
        person_id: string;
        person_name: string;
      };
      image?: {
        image_id: string;
        filename: string;
      };
      cropped_face_filename?: string;
    }>;
    total_faces_searched: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tolerance', tolerance.toString());
    formData.append('max_results', maxResults.toString());
    
    const response = await api.post('/images/search-by-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images
  uploadMultipleImages: async (
    files: File[], 
    albumId?: string, 
    sectionId?: string,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<{
    status: "success" | "error";
    message: string;
    successful_uploads: number;
    total_files: number;
    total_faces_detected: number;
    results: Array<{
      filename: string;
      faces_detected: number;
      persons_assigned: number;
      image_id: string;
    }>;
    errors?: string[];
  }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    if (albumId) formData.append('album_id', albumId);
    if (sectionId) formData.append('section_id', sectionId);
    
    const response = await api.post('/images/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for multiple file uploads
      onUploadProgress,
    });
    return response.data;
  },

  // Trigger face clustering
  clusterFaces: async (): Promise<ClusterResponse> => {
    const response = await api.get<ClusterResponse>('/cluster');
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

  // Get image URL by image ID
  getImageUrl: (imageId: string): string => {
    return `${API_BASE_URL}/images/${imageId}/file`;
  },

  // Get cropped face URL by face ID
  getFaceUrl: (faceId: string): string => {
    return `${API_BASE_URL}/faces/${faceId}`;
  },

  // Get person details 
  getPersonDetails: async (personId: string): Promise<PersonDetails> => {
    const response = await api.get<PersonDetails>(`/persons/${personId}`);
    return response.data;
  },

  // Get image details
  getImageDetails: async (imageId: string): Promise<ImageDetails> => {
    const response = await api.get<ImageDetails>(`/images/${imageId}`);
    return response.data;
  },

  // Rename a person
  renamePerson: async (personId: string, name: string): Promise<{ status: "success" | "error"; message: string; person_id: string; old_name: string; new_name: string }> => {
    const response = await api.put(`/persons/${personId}/rename`, { name });
    return response.data;
  },

  // Move face to existing person
  moveFaceToPerson: async (faceId: string, targetPersonId: string): Promise<MoveFaceResponse> => {
    const response = await api.put(`/faces/${faceId}/move`, { target_person_id: targetPersonId });
    return response.data;
  },

  // Move face to new person
  moveFaceToNewPerson: async (faceId: string, customName?: string): Promise<MoveFaceToNewPersonResponse> => {
    const response = await api.put(`/faces/${faceId}/move-to-new`, {
      custom_name: customName
    });
    return response.data;
  },

  // Delete face
  deleteFace: async (faceId: string): Promise<DeleteFaceResponse> => {
    const response = await api.delete(`/faces/${faceId}`);
    return response.data;
  },

  // Delete image
  deleteImage: async (imageId: string): Promise<DeleteImageResponse> => {
    const response = await api.delete(`/images/${imageId}`);
    return response.data;
  },

  // Get list of all persons for dropdown and persons page
  getAllPersons: async (): Promise<{ 
    status: "success" | "error";
    persons: Array<{ 
      person_id: string; 
      person_name: string; 
      total_faces: number; 
      total_images: number; 
      thumbnail: string | null;  // Now contains base64 data instead of face_id
    }>; 
    total: number;
    message: string;
  }> => {
    const response = await api.get('/persons');
    return response.data;
  },

  // Get all images (with and without faces)
  getAllImages: async (): Promise<{
    status: "success" | "error";
    images: Array<{
      image_id: string;
      filename: string;
      mime_type: string;
      image_base64: string;  // Add base64 data for image
      faces_count: number;
      persons_count: number;
      persons: Array<{ person_id: string; person_name: string }>;
      has_faces: boolean;
      upload_date: string;
    }>;
    total_images: number;
    images_with_faces: number;
    images_without_faces: number;
  }> => {
    const response = await api.get('/images');
    return response.data;
  },

  // Albums API
  getAllAlbums: async (): Promise<{
    status: "success" | "error";
    albums: Array<{
      album_id: string;
      name: string;
      description: string;
      created_at: string;
      image_count: number;
    }>;
    total: number;
    message: string;
  }> => {
    const response = await api.get('/albums');
    return response.data;
  },

  createAlbum: async (name: string, description: string = ''): Promise<{
    status: "success" | "error";
    message: string;
    album: {
      album_id: string;
      name: string;
      description: string;
      created_at: string;
    };
  }> => {
    const response = await api.post('/albums/', { name, description });
    return response.data;
  },

  updateAlbum: async (albumId: string, name: string, description: string = ''): Promise<{
    status: "success" | "error";
    message: string;
  }> => {
    const response = await api.put(`/albums/${albumId}`, { name, description });
    return response.data;
  },

  deleteAlbum: async (albumId: string): Promise<{
    status: "success" | "error";
    message: string;
  }> => {
    const response = await api.delete(`/albums/${albumId}`);
    return response.data;
  },

  // Sections API
  getAllSections: async (): Promise<{
    status: "success" | "error";
    sections: Array<{
      section_id: string;
      name: string;
      description: string;
      created_at: string;
      image_count: number;
    }>;
    total: number;
    message: string;
  }> => {
    const response = await api.get('/sections');
    return response.data;
  },

  createSection: async (name: string, description: string = ''): Promise<{
    status: "success" | "error";
    message: string;
    section: {
      section_id: string;
      name: string;
      description: string;
      created_at: string;
    };
  }> => {
    const response = await api.post('/sections/', { name, description });
    return response.data;
  },

  updateSection: async (sectionId: string, name: string, description: string = ''): Promise<{
    status: "success" | "error";
    message: string;
  }> => {
    const response = await api.put(`/sections/${sectionId}`, { name, description });
    return response.data;
  },

  deleteSection: async (sectionId: string): Promise<{
    status: "success" | "error";
    message: string;
  }> => {
    const response = await api.delete(`/sections/${sectionId}`);
    return response.data;
  },
};

export default api;