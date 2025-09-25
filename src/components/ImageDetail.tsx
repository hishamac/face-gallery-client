import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { faceAPI } from '@/services/api';
import type { ImageDetails } from '@/types/api';

const ImageDetail = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<ImageDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Face moving states
  const [movingFaceId, setMovingFaceId] = useState<string | null>(null);
  const [allPersons, setAllPersons] = useState<Array<{ id: string; name: string }>>([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);

  useEffect(() => {
    if (imageId) {
      fetchImageDetails(imageId);
    }
  }, [imageId]);

  const fetchImageDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await faceAPI.getImageDetails(id);
      setImageData(data);
    } catch (err) {
      setError('Failed to fetch image details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFaceClick = (faceId: string, personId?: string) => {
    setSelectedFace(faceId);
    if (personId) {
      // Navigate to person detail page after a short delay to show selection
      setTimeout(() => {
        window.location.href = `/person/${personId}`;
      }, 300);
    }
  };

  // Face moving functions
  const fetchAllPersons = async () => {
    try {
      const response = await faceAPI.getAllPersons();
      setAllPersons(response.persons);
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
      
      // Close modal and reset state BEFORE redirecting
      setShowMoveModal(false);
      setMovingFaceId(null);
      setMoveLoading(false);
      
      // Show message if original person was deleted
      if (result.deleted_empty_person) {
        alert(`Face moved successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`);
      }
      
      // Redirect to the target person's page
      navigate(`/person/${targetPersonId}`);
      
    } catch (err) {
      console.error('Failed to move face:', err);
      alert('Failed to move face');
      setMoveLoading(false);
    }
  };

  const moveFaceToNewPerson = async () => {
    if (!movingFaceId) return;
    
    try {
      setMoveLoading(true);
      const result = await faceAPI.moveFaceToNewPerson(movingFaceId);
      
      // Close modal and reset state BEFORE redirecting
      setShowMoveModal(false);
      setMovingFaceId(null);
      setMoveLoading(false);
      
      // Show message if original person was deleted
      if (result.deleted_empty_person) {
        alert(`Face moved to new person successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`);
      }
      
      // Redirect to the new person's page
      navigate(`/person/${result.new_person_id}`);
      
    } catch (err) {
      console.error('Failed to move face to new person:', err);
      alert('Failed to move face to new person');
      setMoveLoading(false);
    }
  };

  const cancelMoveFace = () => {
    setShowMoveModal(false);
    setMovingFaceId(null);
  };

  const getFaceOverlayStyle = (face: any) => {
    if (!imageRef.current) return {};

    const imgElement = imageRef.current;
    const imgRect = imgElement.getBoundingClientRect();
    const naturalWidth = imgElement.naturalWidth;
    const naturalHeight = imgElement.naturalHeight;
    
    if (!naturalWidth || !naturalHeight) return {};

    const scaleX = imgRect.width / naturalWidth;
    const scaleY = imgRect.height / naturalHeight;

    const { top, right, bottom, left } = face.face_location;
    
    return {
      position: 'absolute' as const,
      left: `${left * scaleX}px`,
      top: `${top * scaleY}px`,
      width: `${(right - left) * scaleX}px`,
      height: `${(bottom - top) * scaleY}px`,
      border: `3px solid ${face.person ? '#10B981' : '#EF4444'}`,
      backgroundColor: selectedFace === face.face_id ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.2s ease-in-out',
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading image details...</div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || 'Image not found'}</div>
          <Link to="/">
            <Button>Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{imageData.filename}</h1>
              <p className="text-gray-600 mt-2">
                {imageData.total_faces} face{imageData.total_faces !== 1 ? 's' : ''} detected
              </p>
            </div>
            <Link to="/">
              <Button variant="outline">Back to Gallery</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Image with Face Overlays */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Image with Detected Faces</CardTitle>
                <p className="text-sm text-gray-600">
                  Click on face boxes to view person details. 
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-sm mx-1"></span>
                  Known persons
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-sm mx-1 ml-3"></span>
                  Unknown faces
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative inline-block">
                  <img
                    ref={imageRef}
                    src={faceAPI.getImageUrl(imageData.filename)}
                    alt={imageData.filename}
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMjAwQzIyMS4yMTcgMjAwIDIzOCAxODMuMjE3IDIzOCAxNjJDMjM4IDE0MC43ODMgMjIxLjIxNyAxMjQgMjAwIDEyNEMxNzguNzgzIDEyNCAxNjIgMTQwLjc4MyAxNjIgMTYyQzE2MiAxODMuMjE3IDE3OC43ODMgMjAwIDIwMCAyMDBaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                    }}
                  />
                  {/* Face overlays */}
                  {imageData.faces.map((face) => (
                    <div
                      key={face.face_id}
                      style={getFaceOverlayStyle(face)}
                      onClick={() => handleFaceClick(face.face_id, face.person?.person_id)}
                      className="hover:shadow-lg"
                      title={face.person ? `Click to view ${face.person.person_name}` : 'Unknown person'}
                    >
                      {face.person && (
                        <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {face.person.person_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Faces List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Detected Faces ({imageData.total_faces})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imageData.faces.map((face, index) => (
                    <div
                      key={face.face_id}
                      className={`border rounded-lg p-4 transition-all ${
                        selectedFace === face.face_id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Cropped Face */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {face.cropped_face_filename && (
                            <img
                              src={faceAPI.getFaceUrl(face.cropped_face_filename)}
                              alt={`Face ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiA0MkMzNy41MjI4IDQyIDQyIDM3LjUyMjggNDIgMzJDNDIgMjYuNDc3MiAzNy41MjI4IDIyIDMyIDIyQzI2LjQ3NzIgMjIgMjIgMjYuNDc3MiAyMiAzMkMyMiAzNy41MjI4IDI2LjQ3NzIgNDIgMzIgNDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                              }}
                            />
                          )}
                        </div>

                        {/* Face Info */}
                        <div className="flex-grow">
                          <div className="font-medium text-sm">
                            Face {index + 1}
                          </div>
                          {face.person ? (
                            <div className="text-green-600 text-sm">
                              {face.person.person_name}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">
                              Unknown person
                            </div>
                          )}
                          <div className="text-xs text-gray-400 mt-1">
                            Position: {face.face_location.left}, {face.face_location.top}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          {face.person && (
                            <Link to={`/person/${face.person.person_id}`}>
                              <Button size="sm" variant="outline" className="w-full">
                                View Person
                              </Button>
                            </Link>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => startMoveFace(face.face_id)}
                            className="w-full bg-orange-50 hover:bg-orange-100 border-orange-200"
                          >
                            Move Face
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Move Face Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Move Face</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Move to existing person:</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {allPersons.length === 0 ? (
                    <p className="text-gray-500 text-sm">No persons available</p>
                  ) : (
                    allPersons.map((person) => (
                      <Button
                        key={person.id}
                        onClick={() => moveFaceToPerson(person.id)}
                        disabled={moveLoading}
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        {person.name}
                      </Button>
                    ))
                  )}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Or create new person:</h4>
                <Button
                  onClick={moveFaceToNewPerson}
                  disabled={moveLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {moveLoading ? 'Moving...' : 'Move to New Person'}
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button
                onClick={cancelMoveFace}
                variant="outline"
                className="flex-1"
                disabled={moveLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDetail;