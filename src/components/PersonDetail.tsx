import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      // Filter out current person from the list
      const filteredPersons = response.persons.filter(p => p.id !== personId);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading person details...</div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error || 'Person not found'}</div>
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
            <div className="flex-1">
              {isRenaming ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-3xl font-bold text-gray-900 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename();
                      if (e.key === 'Escape') cancelRenaming();
                    }}
                  />
                  <Button
                    onClick={handleRename}
                    disabled={!newName.trim() || renameLoading}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {renameLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={cancelRenaming}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">{person.person_name}</h1>
                  <Button
                    onClick={startRenaming}
                    variant="outline"
                    size="sm"
                  >
                    Rename
                  </Button>
                </div>
              )}
              <p className="text-gray-600 mt-2">
                {person.total_faces} face{person.total_faces !== 1 ? 's' : ''} across {person.total_images} image{person.total_images !== 1 ? 's' : ''}
              </p>
            </div>
            <Link to="/">
              <Button variant="outline">Back to Gallery</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cropped Faces Section */}
          <Card>
            <CardHeader>
              <CardTitle>Detected Faces ({person.total_faces})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {person.faces.map((face) => (
                  <div key={face.face_id} className="group relative">
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      {face.cropped_face_filename && (
                        <img
                          src={faceAPI.getFaceUrl(face.cropped_face_filename)}
                          alt="Cropped face"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA2NS41QzU4LjI4NDMgNjUuNSA2NSA1OC43ODQzIDY1IDUwLjVDNjUgNDIuMjE1NyA1OC4yODQzIDM1LjUgNTAgMzUuNUM0MS43MTU3IDM1LjUgMzUgNDIuMjE1NyAzNSA1MC41QzM1IDU4Ljc4NDMgNDEuNzE1NyA2NS41IDUwIDY1LjVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                          }}
                        />
                      )}
                    </div>
                    <div className="space-y-2 mt-2">
                      <Link to={`/image/${face.image_id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                        >
                          View in Image
                        </Button>
                      </Link>
                      <Button
                        onClick={() => startMoveFace(face.face_id)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs bg-orange-50 hover:bg-orange-100 border-orange-200"
                      >
                        Move Face
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card>
            <CardHeader>
              <CardTitle>Images ({person.total_images})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {person.images.map((image) => (
                  <Link
                    key={image.image_id}
                    to={`/image/${image.image_id}`}
                    className="group block"
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={faceAPI.getImageUrl(image.filename)}
                        alt={image.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTM1QzE2My4yNTQgMTM1IDE3NCAxMjQuMjU0IDE3NCAxMTFDMTc0IDk3Ljc0NTggMTYzLjI1NCA4NyAxNTAgODdDMTM2Ljc0NiA4NyAxMjYgOTcuNzQ1OCAxMjYgMTExQzEyNiAxMjQuMjU0IDEzNi43NDYgMTM1IDE1MCAxMzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2 truncate">
                      {image.filename}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
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
                    <p className="text-gray-500 text-sm">No other persons available</p>
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

export default PersonDetail;