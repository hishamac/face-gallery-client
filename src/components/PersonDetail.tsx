import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Move } from 'lucide-react';
import { faceAPI } from '@/services/api';
import type { PersonDetails } from '@/types/api';

const PersonDetail = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [renameLoading, setRenameLoading] = useState(false);
  
  // Face moving states
  const [movingFaceId, setMovingFaceId] = useState<string | null>(null);
  const [allPersons, setAllPersons] = useState<Array<{ id: string; name: string }>>([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);

  useEffect(() => {
    if (personId) {
      fetchPersonDetails(personId);
    }
  }, [personId]);

  const fetchPersonDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await faceAPI.getPersonDetails(id);
      setPerson(data);
    } catch (err) {
      setError('Failed to fetch person details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!personId || !newName.trim()) return;
    
    try {
      setRenameLoading(true);
      await faceAPI.renamePerson(personId, newName.trim());
      
      // Update local state
      if (person) {
        setPerson({ ...person, person_name: newName.trim() });
      }
      
      setIsRenaming(false);
      setNewName('');
    } catch (err) {
      console.error('Failed to rename person:', err);
      setError('Failed to rename person');
    } finally {
      setRenameLoading(false);
    }
  };

  const startRenaming = () => {
    if (person) {
      setNewName(person.person_name);
      setIsRenaming(true);
    }
  };

  const cancelRenaming = () => {
    setIsRenaming(false);
    setNewName('');
  };

  // Face moving functions
  const fetchAllPersons = async () => {
    try {
      const response = await faceAPI.getAllPersons();
      // Filter out current person from the list and map the data structure
      const filteredPersons = response.persons
        .filter(p => p.person_id !== personId)
        .map(p => ({ id: p.person_id, name: p.person_name }));
      setAllPersons(filteredPersons);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section Skeleton */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="h-9 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-64 mt-3 animate-pulse"></div>
              </div>
              <div className="ml-4">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Detected Faces Section Skeleton */}
          <Card className="bg-white shadow-xl border-gray-200 mb-8">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="h-7 bg-gray-200 rounded w-48 animate-pulse"></div>
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

          {/* Images Section Skeleton */}
          <Card className="bg-white shadow-xl border-gray-200">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="h-7 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="break-inside-avoid mb-6">
                    <div 
                      className="bg-gray-200 rounded-lg animate-pulse"
                      style={{ 
                        height: `${200 + (index % 3) * 100}px` // Varied heights for masonry effect
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md mx-4">
          <div className="text-red-500 mb-6 text-lg font-medium">{error || 'Person not found'}</div>
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
              {isRenaming ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 bg-white border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent min-w-0 flex-1 max-w-md"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename();
                      if (e.key === 'Escape') cancelRenaming();
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRename}
                      disabled={!newName.trim() || renameLoading}
                      size="sm"
                      className="bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                    >
                      {renameLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={cancelRenaming}
                      variant="outline"
                      size="sm"
                      className="bg-white border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 flex-wrap">
                  <h1 
                    className="text-2xl sm:text-3xl font-bold text-gray-900 truncate max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl" 
                    title={person.person_name}
                  >
                    {person.person_name}
                  </h1>
                  <Button
                    onClick={startRenaming}
                    variant="outline"
                    size="sm"
                    className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-md"
                  >
                    Rename
                  </Button>
                </div>
              )}
              <p className="text-gray-600 mt-3 text-lg">
                {person.total_faces} face{person.total_faces !== 1 ? 's' : ''} across {person.total_images} image{person.total_images !== 1 ? 's' : ''}
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
        {/* Detected Faces Section - Full Width */}
        <Card className="bg-white shadow-xl border-gray-200 mb-8">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Detected Faces ({person.total_faces})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {person.faces.map((face) => (
                <div key={face.face_id} className="group relative">
                  <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                    {face.cropped_face_filename && (
                      <img
                        src={faceAPI.getFaceUrl(face.cropped_face_filename)}
                        alt="Cropped face"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA2NS41QzU4LjI4NDMgNjUuNSA2NSA1OC43ODQzIDY1IDUwLjVDNjUgNDIuMjE1NyA1OC4yODQzIDM1LjUgNTAgMzUuNUM0MS43MTU3IDM1LjUgMzUgNDIuMjE1NyAzNSA1MC41QzM1IDU4Ljc4NDMgNDEuNzE1NyA2NS41IDUwIDY1LjVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <Link to={`/image/${face.image_id}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full p-2 bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => startMoveFace(face.face_id)}
                      size="sm"
                      variant="outline"
                      className="flex-1 p-2 bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
                    >
                      <Move className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images Section */}
        <Card className="bg-white shadow-xl border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Images ({person.total_images})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {person.images.map((image) => (
                <div
                  key={image.image_id}
                  className="break-inside-avoid mb-6"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <Link to={`/image/${image.image_id}`}>
                      <div className="relative overflow-hidden">
                        <img
                          src={faceAPI.getImageUrl(image.filename)}
                          alt={image.filename}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTM1QzE2My4yNTQgMTM1IDE3NCAxMjQuMjU0IDE3NCAxMTFDMTc0IDk3Ljc0NTggMTYzLjI1NCA4NyAxNTAgODdDMTM2Ljc0NiA4NyAxMjYgOTcuNzQ1OCAxMjYgMTExQzEyNiAxMjQuMjU0IDEzNi43NDYgMTM1IDE1MCAxMzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                          }}
                        />
                        <div className="absolute inset-0 bg-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>
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
                      No other persons available
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
    </div>
  );
};

export default PersonDetail;