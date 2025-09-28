import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Move, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import { faceAPI } from '@/services/api';
import type { ImageDetails } from '@/types/api';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';

const ImageDetail = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin/');
  
  const [imageData, setImageData] = useState<ImageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redetectLoading, setRedetectLoading] = useState(false);
  
  // Set page title dynamically based on image filename
  usePageTitle(imageData ? imageData.filename : "Image Details");
  
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Face moving states
  const [movingFaceId, setMovingFaceId] = useState<string | null>(null);
  const [allPersons, setAllPersons] = useState<Array<{ id: string; name: string }>>([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  
  // Face loading states
  const [faceLoadingStates, setFaceLoadingStates] = useState<Record<string, boolean>>({});
  
  // Responsive overlay refresh trigger
  const [overlayRefresh, setOverlayRefresh] = useState(0);
  
  // Delete face states (admin only)
  const [deletingFaceId, setDeletingFaceId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [faceToDelete, setFaceToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (imageId) {
      fetchImageDetails(imageId);
    }
  }, [imageId]);

  // Add resize listener to make bounding boxes responsive
  useEffect(() => {
    const handleResize = () => {
      if (imageLoaded && imageRef.current) {
        // Trigger re-calculation of overlay positions
        setOverlayRefresh(prev => prev + 1);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Listen for orientation change on mobile devices
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100); // Small delay for orientation change
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [imageLoaded]);

  const fetchImageDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setImageLoaded(false); // Reset image loaded state
      const data = await faceAPI.getImageDetails(id);
      setImageData(data);
    } catch (err) {
      setError('Failed to fetch image details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedetectFaces = async () => {
    if (!imageId) return;

    try {
      setRedetectLoading(true);
      const response = await faceAPI.redetectFaces(imageId);
      
      if (response.status === "success") {
        toast.success(response.message);
        // Refresh image details to show updated face count
        await fetchImageDetails(imageId);
      } else {
        toast.error(response.message || "Failed to re-detect faces");
      }
    } catch (error: any) {
      console.error("Error re-detecting faces:", error);
      toast.error(error.response?.data?.message || "Failed to re-detect faces");
    } finally {
      setRedetectLoading(false);
    }
  };

  const handleFaceClick = (faceId: string, personId?: string) => {
    setSelectedFace(faceId);
    if (personId) {
      // Navigate to person detail page after a short delay to show selection
      setTimeout(() => {
        navigate(isAdminRoute ? `/admin/person/${personId}` : `/person/${personId}`);
      }, 300);
    }
  };

  // Face moving functions
  const fetchAllPersons = async () => {
    try {
      const response = await faceAPI.getAllPersons();
      if (response.status === "success") {
        // Map the data structure from API response to component expectation
        const mappedPersons = response.persons.map(p => ({ id: p.person_id, name: p.person_name }));
        setAllPersons(mappedPersons);
      } else {
        setError('Failed to load persons: ' + response.message);
      }
    } catch (err) {
      console.error('Failed to fetch persons:', err);
      setError('Failed to load persons list');
    }
  };

  const startMoveFace = async (faceId: string) => {
    setMovingFaceId(faceId);
    await fetchAllPersons();
    setShowMoveModal(true);
  };

  const moveFaceToPerson = async (targetPersonId: string) => {
    if (!movingFaceId) return;
    
    try {
      setMoveLoading(true);
      const result = await faceAPI.moveFaceToPerson(movingFaceId, targetPersonId);
      
      // Check if the operation was successful
      if (result.status === "success") {
        // Close modal and reset state BEFORE redirecting
        setShowMoveModal(false);
        setMovingFaceId(null);
        setMoveLoading(false);
        
        // Show message if original person was deleted
        if (result.deleted_empty_person) {
          toast.success(`Face moved successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`);
        } else {
          toast.success("Face moved successfully!");
        }
        
        // Redirect to the target person's page
        navigate(isAdminRoute ? `/admin/person/${targetPersonId}` : `/person/${targetPersonId}`);
      } else {
        // Handle error response
        toast.error(result.message || "Failed to move face");
        setMoveLoading(false);
      }
      
    } catch (err: any) {
      console.error('Failed to move face:', err);
      const errorMessage = err?.response?.data?.message || "Failed to move face";
      toast.error(errorMessage);
      setMoveLoading(false);
    }
  };

  const moveFaceToNewPerson = async () => {
    if (!movingFaceId) return;
    
    try {
      setMoveLoading(true);
      const result = await faceAPI.moveFaceToNewPerson(movingFaceId);
      
      // Check if the operation was successful
      if (result.status === "success") {
        // Close modal and reset state BEFORE redirecting
        setShowMoveModal(false);
        setMovingFaceId(null);
        setMoveLoading(false);
        
        // Show message if original person was deleted
        if (result.deleted_empty_person) {
          toast.success(`Face moved to new person successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`);
        } else {
          toast.success("Face moved to new person successfully!");
        }
        
        // Redirect to the new person's page
        navigate(isAdminRoute ? `/admin/person/${result.new_person_id}` : `/person/${result.new_person_id}`);
      } else {
        // Handle error response
        toast.error(result.message || "Failed to move face to new person");
        setMoveLoading(false);
      }
      
    } catch (err: any) {
      console.error('Failed to move face to new person:', err);
      const errorMessage = err?.response?.data?.message || "Failed to move face to new person";
      toast.error(errorMessage);
      setMoveLoading(false);
    }
  };

  const cancelMoveFace = () => {
    setShowMoveModal(false);
    setMovingFaceId(null);
  };

  // Delete face function (admin only)
  const showDeleteConfirmation = (faceId: string) => {
    if (!isAdminRoute) return;
    setFaceToDelete(faceId);
    setShowDeleteConfirm(true);
  };

  const deleteFace = async () => {
    if (!faceToDelete) return;

    try {
      setDeletingFaceId(faceToDelete);
      setDeleteLoading(true);
      const result = await faceAPI.deleteFace(faceToDelete);

      // Check if the operation was successful
      if (result.status === 'success') {
        setShowDeleteConfirm(false);
        
        // Show success message
        if (result.deleted_empty_person) {
          toast.success(
            `Face deleted successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`
          );
        } else {
          toast.success('Face deleted successfully!');
        }
        
        // Refresh image details to update the face count and remove deleted face
        if (imageId) {
          await fetchImageDetails(imageId);
        }
      } else {
        // Handle error response
        toast.error(result.message || 'Failed to delete face');
      }
    } catch (err: any) {
      console.error('Failed to delete face:', err);
      // Show error message from API response or generic message
      const errorMessage = err?.response?.data?.message || 'Failed to delete face';
      toast.error(errorMessage);
    } finally {
      setDeletingFaceId(null);
      setDeleteLoading(false);
      setFaceToDelete(null);
    }
  };

  const getFaceOverlayStyle = (face: any) => {
    if (!imageRef.current) return { display: 'none' };

    const imgElement = imageRef.current;
    const imgRect = imgElement.getBoundingClientRect();
    const naturalWidth = imgElement.naturalWidth;
    const naturalHeight = imgElement.naturalHeight;
    
    // Return hidden style if image dimensions aren't available yet
    if (!naturalWidth || !naturalHeight || imgRect.width === 0 || imgRect.height === 0) {
      return { display: 'none' };
    }

    // Calculate scale factors
    const scaleX = imgRect.width / naturalWidth;
    const scaleY = imgRect.height / naturalHeight;

    const { top, right, bottom, left } = face.face_location;
    
    // Calculate responsive positions and dimensions
    const overlayLeft = left * scaleX;
    const overlayTop = top * scaleY;
    const overlayWidth = (right - left) * scaleX;
    const overlayHeight = (bottom - top) * scaleY;
    
    return {
      position: 'absolute' as const,
      left: `${overlayLeft}px`,
      top: `${overlayTop}px`,
      width: `${overlayWidth}px`,
      height: `${overlayHeight}px`,
      border: `${Math.max(2, Math.min(4, overlayWidth * 0.015))}px solid ${face.person ? '#10B981' : '#EF4444'}`, // Responsive border width
      backgroundColor: selectedFace === face.face_id ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      borderRadius: `${Math.max(2, Math.min(8, overlayWidth * 0.02))}px`, // Responsive border radius
      transition: 'all 0.2s ease-in-out',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      // Ensure overlay stays within bounds
      minWidth: '20px',
      minHeight: '20px',
      zIndex: 10,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="ml-4">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Image Skeleton */}
          <Card className="bg-white shadow-xl border-gray-200 mb-8">
            <CardContent className="p-6">
              <div className="w-full aspect-[4/3] bg-gray-200 rounded-xl animate-pulse"></div>
            </CardContent>
          </Card>
          
          {/* Faces Grid Skeleton */}
          <Card className="bg-white shadow-xl border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="h-7 bg-gray-200 rounded w-64 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="group relative">
                    <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4">
          <div className="text-red-500 mb-6 text-lg font-medium">{error || 'Image not found'}</div>
          <Link to="/">
            <Button className="bg-gray-600 hover:bg-gray-700 text-white">Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-600 text-lg">
                {imageData.total_faces} face{imageData.total_faces !== 1 ? 's' : ''} detected
              </p>
            </div>
            <Link to="/" className="ml-4">
              <Button 
                variant="outline" 
                className="bg-white border-gray-300 hover:bg-gray-50 shadow-md"
              >
                Back to Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Full Width Image with Face Overlays */}
        <Card className="bg-white shadow-xl border-gray-200 mb-8">
          <CardContent className="p-6">
            {/* Bounding box loading indicator */}
            {!imageLoaded && imageData.faces.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-800/30 border-t-blue-800 rounded-full animate-spin"></div>
                  Bounding boxes loading...
                </div>
              </div>
            )}
            {/* Responsive image container with face overlays */}
            <div className="relative inline-block w-full">
              <img
                ref={imageRef}
                src={`data:${imageData.mime_type};base64,${imageData.image_base64}`}  // Use base64 data instead of URL
                alt={imageData.filename}
                className="w-full h-auto rounded-xl shadow-lg"
                onLoad={() => {
                  setImageLoaded(true);
                  // Trigger overlay refresh after image loads
                  setTimeout(() => setOverlayRefresh(prev => prev + 1), 50);
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ci8+CjxwYXRoIGQ9Ik0yMDAgMjAwQzIyMS4yMTcgMjAwIDIzOCAxODMuMjE3IDIzOCAxNjJDMjM4IDE0MC43ODMgMjIxLjIxNyAxMjQgMjAwIDEyNEMxNzguNzgzIDEyNCAxNjIgMTQwLjc4MyAxNjIgMTYyQzE2MiAxODMuMjE3IDE3OC43ODMgMjAwIDIwMCAyMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                }}
              />
              {/* Face overlays - only show when image is loaded */}
              {imageLoaded && imageData.faces.map((face) => (
                <div
                  key={`${face.face_id}-${overlayRefresh}`} // Force re-render when overlay positions change
                  style={getFaceOverlayStyle(face)}
                  onClick={() => handleFaceClick(face.face_id, face.person?.person_id)}
                  className="hover:shadow-lg transition-all duration-200"
                  title={face.person ? `Click to view ${face.person.person_name}` : 'Unknown person'}
                >
                  {face.person && (
                    <div 
                      className="absolute left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-md shadow-sm max-w-32 truncate whitespace-nowrap" 
                      style={{
                        top: '-28px',
                        fontSize: '11px'
                      }}
                      title={face.person.person_name}
                    >
                      {face.person.person_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Detected Faces Section - Like PersonDetail */}
        <Card className="bg-white shadow-xl border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Detected Faces ({imageData.total_faces})
              </CardTitle>
              {isAdminRoute && (
                <Button
                  onClick={handleRedetectFaces}
                  disabled={redetectLoading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {redetectLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {redetectLoading ? "Re-detecting..." : "Redetect Faces"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {imageData.faces.map((face, index) => (
                <div key={face.face_id} className="group relative">
                  <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                    {faceLoadingStates[face.face_id] !== false && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={`data:image/jpeg;base64,${face.face_base64}`}  // Use base64 data instead of URL
                      alt={`Face ${index + 1}`}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        faceLoadingStates[face.face_id] === false ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setFaceLoadingStates(prev => ({ ...prev, [face.face_id]: false }))}
                      onError={(e) => {
                        setFaceLoadingStates(prev => ({ ...prev, [face.face_id]: false }));
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ci8+CjxwYXRoIGQ9Ik01MCA2NS41QzU4LjI4NDMgNjUuNSA2NSA1OC43ODQzIDY1IDUwLjVDNjUgNDIuMjE1NyA1OC4yODQzIDM1LjUgNTAgMzUuNUM0MS43MTU3IDM1LjUgMzUgNDIuMjE1NyAzNSA1MC41QzM1IDU4Ljc4NDMgNDEuNzE1NyA2NS41IDUwIDY1LjVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    {face.person && (
                      <Link to={isAdminRoute ? `/admin/person/${face.person.person_id}` : `/person/${face.person.person_id}`} className="flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full p-2 bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Button
                      onClick={() => startMoveFace(face.face_id)}
                      size="sm"
                      variant="outline"
                      className={`${face.person && !isAdminRoute ? 'flex-1' : isAdminRoute ? 'flex-1' : 'w-full'} p-2 bg-white border-gray-300 hover:bg-gray-50 shadow-sm`}
                    >
                      <Move className="h-4 w-4" />
                    </Button>
                    {isAdminRoute && (
                      <Button
                        onClick={() => showDeleteConfirmation(face.face_id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 p-2 bg-white border-red-300 hover:bg-red-50 shadow-sm text-red-600 hover:text-red-700"
                        disabled={deleteLoading && deletingFaceId === face.face_id}
                      >
                        {deleteLoading && deletingFaceId === face.face_id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      

      {/* Move Face Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Move Face</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Move to existing person:</h4>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {allPersons.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4 text-center bg-gray-50 rounded-lg">
                      No persons available
                    </p>
                  ) : (
                    allPersons.map((person) => (
                      <Button
                        key={person.id}
                        onClick={() => moveFaceToPerson(person.id)}
                        disabled={moveLoading}
                        variant="outline"
                        className="w-full justify-start text-left bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm truncate"
                        title={person.name}
                      >
                        <span className="truncate">{person.name}</span>
                      </Button>
                    ))
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Or create new person:</h4>
                <Button
                  onClick={moveFaceToNewPerson}
                  disabled={moveLoading}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                >
                  {moveLoading ? 'Moving...' : 'Move to New Person'}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <Button
                onClick={cancelMoveFace}
                variant="outline"
                className="flex-1 bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
                disabled={moveLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Face</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this face? This action cannot be
              undone.
              {imageData && imageData.faces.length === 1 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Warning: This is the only face in this image.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteFace}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete Face'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageDetail;