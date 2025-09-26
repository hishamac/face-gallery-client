export interface Face {
  face_id: string;
  image_path: string;
  filename: string;
  cropped_face_filename?: string;
  face_location?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface Person {
  person_id: string;
  person_name: string;
  faces: Face[];
  total_faces: number;
}

export interface PersonDetails {
  person_id: string;
  person_name: string;
  total_faces: number;
  total_images: number;
  faces: {
    face_id: string;
    image_id: string;
    cropped_face_filename: string;
    face_location: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }[];
  images: {
    image_id: string;
    filename: string;
    mime_type: string;
  }[];
}

export interface ImageDetails {
  image_id: string;
  filename: string;
  mime_type: string;
  total_faces: number;
  faces: {
    face_id: string;
    cropped_face_filename: string;
    face_location: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    person: {
      person_id: string;
      person_name: string;
    } | null;
  }[];
}

export interface Gallery {
  gallery: Person[];
  total_persons: number;
}

export interface UploadResponse {
  message: string;
  filename: string;
  mime_type: string;
  faces_detected: number;
  image_id: string;
}

export interface ClusterResponse {
  message: string;
  clusters: number[];
  unique_persons: number;
}

export interface Stats {
  total_persons: number;
  total_images: number;
  total_faces: number;
  images_with_faces?: number;
  images_without_faces?: number;
}

export interface ImageSummary {
  image_id: string;
  filename: string;
  mime_type: string;
  faces_count: number;
  persons_count: number;
  persons: Array<{
    person_id: string;
    person_name: string;
  }>;
  has_faces: boolean;
  album?: {
    album_id: string;
    album_name: string;
  };
  section?: {
    section_id: string;
    section_name: string;
  };
  upload_date?: string;
}

export interface AllImagesResponse {
  images: ImageSummary[];
  total_images: number;
  images_with_faces: number;
  images_without_faces: number;
}

export interface MoveFaceResponse {
  message: string;
  face_id: string;
  from_person: string;
  to_person: string;
  target_person_id: string;
  deleted_empty_person?: string;
}

export interface MoveFaceToNewPersonResponse {
  message: string;
  face_id: string;
  from_person: string;
  new_person_id: string;
  new_person_name: string;
  deleted_empty_person?: string;
}

export interface ApiError {
  error: string;
}