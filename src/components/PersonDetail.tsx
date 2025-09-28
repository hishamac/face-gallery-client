import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Move, Trash2, Search } from "lucide-react";
import { faceAPI } from "@/services/api";
import type { PersonDetails } from "@/types/api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";

const PersonDetail = () => {
  const { personId } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin/");
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set page title dynamically based on person name and route
  usePageTitle(
    person
      ? `${person.person_name}${isAdminRoute ? " - Admin" : ""}`
      : isAdminRoute
      ? "Person Details - Admin"
      : "Person Details"
  );

  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  // Face moving states
  const [movingFaceId, setMovingFaceId] = useState<string | null>(null);
  const [allPersons, setAllPersons] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [searchPersonQuery, setSearchPersonQuery] = useState("");
  const [customPersonName, setCustomPersonName] = useState("");

  // Image loading states
  const [faceLoadingStates, setFaceLoadingStates] = useState<
    Record<string, boolean>
  >({});
  const [imageLoadingStates, setImageLoadingStates] = useState<
    Record<string, boolean>
  >({});

  // Delete face states (admin only)
  const [deletingFaceId, setDeletingFaceId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [faceToDelete, setFaceToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (personId) {
      fetchPersonDetails(personId);
    }
  }, [personId]);

  // Load persons when move modal is opened
  useEffect(() => {
    if (showMoveModal && allPersons.length === 0) {
      fetchAllPersons();
    }
  }, [showMoveModal]);

  const fetchPersonDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await faceAPI.getPersonDetails(id);
      setPerson(data);
    } catch (err) {
      setError("Failed to fetch person details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!personId || !newName.trim()) return;

    try {
      setRenameLoading(true);
      const result = await faceAPI.renamePerson(personId, newName.trim());

      // Check if the operation was successful
      if (result.status === "success") {
        // Update local state
        if (person) {
          setPerson({ ...person, person_name: newName.trim() });
        }

        setIsRenaming(false);
        setNewName("");
      } else {
        // Handle error response
        setError(result.message || "Failed to rename person");
      }
    } catch (err: any) {
      console.error("Failed to rename person:", err);
      const errorMessage = err?.response?.data?.message || "Failed to rename person";
      setError(errorMessage);
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
    setNewName("");
  };

  // Face moving functions
  const fetchAllPersons = async () => {
    try {
      const response = await faceAPI.getAllPersons();
      if (response.status === "success") {
        // Filter out current person from the list and map the data structure
        const filteredPersons = response.persons
          .filter((p) => p.person_id !== personId)
          .map((p) => ({ id: p.person_id, name: p.person_name }));
        setAllPersons(filteredPersons);
      } else {
        setError("Failed to load persons: " + response.message);
      }
    } catch (err) {
      console.error("Failed to fetch persons:", err);
      setError("Failed to load persons list");
    }
  };

  const startMoveFace = (faceId: string) => {
    setMovingFaceId(faceId);
    setShowMoveModal(true);
  };

  const moveFaceToPerson = async (targetPersonId: string) => {
    if (!movingFaceId) return;

    try {
      setMoveLoading(true);
      const result = await faceAPI.moveFaceToPerson(
        movingFaceId,
        targetPersonId
      );

      // Check if the operation was successful
      if (result.status === "success") {
        // Close modal and reset state BEFORE redirecting
        setShowMoveModal(false);
        setMovingFaceId(null);
        setSearchPersonQuery("");
        setCustomPersonName("");

        // Show message if original person was deleted
        if (result.deleted_empty_person) {
          toast.success(
            `Face moved successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`
          );
        } else {
          toast.success("Face moved successfully!");
        }

        // Redirect to the target person's page
        navigate(`/person/${targetPersonId}`);
      } else {
        // Handle error response
        toast.error(result.message || "Failed to move face");
      }
    } catch (err: any) {
      console.error("Failed to move face:", err);
      // Show error message from API response or generic message
      const errorMessage = err?.response?.data?.message || "Failed to move face";
      toast.error(errorMessage);
    } finally {
      setMoveLoading(false);
    }
  };

  const moveFaceToNewPerson = async () => {
    if (!movingFaceId) return;

    try {
      setMoveLoading(true);
      const result = await faceAPI.moveFaceToNewPerson(movingFaceId, customPersonName.trim() || undefined);

      // Check if the operation was successful
      if (result.status === "success") {
        // Close modal and reset state BEFORE redirecting
        setShowMoveModal(false);
        setMovingFaceId(null);
        setSearchPersonQuery("");
        setCustomPersonName("");

        // Show message if original person was deleted
        if (result.deleted_empty_person) {
          toast.success(
            `Face moved to new person successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`
          );
        } else {
          toast.success("Face moved to new person successfully!");
        }

        // Redirect to the new person's page
        navigate(`/person/${result.new_person_id}`);
      } else {
        // Handle error response
        toast.error(result.message || "Failed to move face to new person");
      }
    } catch (err: any) {
      console.error("Failed to move face to new person:", err);
      // Show error message from API response or generic message
      const errorMessage = err?.response?.data?.message || "Failed to move face to new person";
      toast.error(errorMessage);
    } finally {
      setMoveLoading(false);
    }
  };

  const cancelMoveFace = () => {
    setShowMoveModal(false);
    setMovingFaceId(null);
    setSearchPersonQuery("");
    setCustomPersonName("");
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
      if (result.status === "success") {
        setShowDeleteConfirm(false);
        
        // Show success message
        if (result.deleted_empty_person) {
          toast.success(
            `Face deleted successfully! Empty person "${result.deleted_empty_person}" was automatically deleted.`
          );
          // Navigate back to persons page if person was deleted
          navigate("/admin/persons");
        } else {
          toast.success("Face deleted successfully!");
          // Refresh person details to update the face count
          if (personId) {
            await fetchPersonDetails(personId);
          }
        }
      } else {
        // Handle error response
        toast.error(result.message || "Failed to delete face");
      }
    } catch (err: any) {
      console.error("Failed to delete face:", err);
      // Show error message from API response or generic message
      const errorMessage = err?.response?.data?.message || "Failed to delete face";
      toast.error(errorMessage);
    } finally {
      setDeletingFaceId(null);
      setDeleteLoading(false);
      setFaceToDelete(null);
    }
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
                        height: `${200 + (index % 3) * 100}px`, // Varied heights for masonry effect
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
          <div className="text-red-500 mb-6 text-lg font-medium">
            {error || "Person not found"}
          </div>
          <Link to="/">
            <Button className="bg-gray-600 hover:bg-gray-700 text-white">
              Back to Gallery
            </Button>
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
              {isRenaming && isAdminRoute ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 bg-white border-2 border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent min-w-0 flex-1 max-w-md"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") cancelRenaming();
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRename}
                      disabled={!newName.trim() || renameLoading}
                      size="sm"
                      className="bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                    >
                      {renameLoading ? "Saving..." : "Save"}
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
                  {isAdminRoute && (
                    <Button
                      onClick={startRenaming}
                      variant="outline"
                      size="sm"
                      className="bg-white border-gray-300 hover:bg-gray-50 text-gray-700 shadow-md"
                    >
                      Rename
                    </Button>
                  )}
                </div>
              )}
              <p className="text-gray-600 mt-3 text-lg">
                {person.total_faces} face{person.total_faces !== 1 ? "s" : ""}{" "}
                across {person.total_images} image
                {person.total_images !== 1 ? "s" : ""}
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
                      <>
                        {faceLoadingStates[face.face_id] !== false && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={`data:image/jpeg;base64,${face.face_base64}`}  // Use base64 data instead of URL
                          alt="Cropped face"
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            faceLoadingStates[face.face_id] === false
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() =>
                            setFaceLoadingStates((prev) => ({
                              ...prev,
                              [face.face_id]: false,
                            }))
                          }
                          onError={(e) => {
                            setFaceLoadingStates((prev) => ({
                              ...prev,
                              [face.face_id]: false,
                            }));
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA2NS41QzU4LjI4NDMgNjUuNSA2NSA1OC43ODQzIDY1IDUwLjVDNjUgNDIuMjE1NyA1OC4yODQzIDM1LjUgNTAgMzUuNUM0MS43MTU3IDM1LjUgMzUgNDIuMjE1NyAzNSA1MC41QzM1IDU4Ljc4NDMgNDEuNzE1NyA2NS41IDUwIDY1LjVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K";
                          }}
                        />
                      </>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <Link to={isAdminRoute ? `/admin/image/${face.image_id}` : `/image/${face.image_id}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full p-2 bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {isAdminRoute && (
                      <Button
                        onClick={() => startMoveFace(face.face_id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 p-2 bg-white border-gray-300 hover:bg-gray-50 shadow-sm"
                      >
                        <Move className="h-4 w-4" />
                      </Button>
                    )}
                    {isAdminRoute && (
                      <Button
                        onClick={() => showDeleteConfirmation(face.face_id)}
                        size="sm"
                        variant="outline"
                        className="flex-1 p-2 bg-white border-red-300 hover:bg-red-50 shadow-sm text-red-600 hover:text-red-700"
                        disabled={
                          deleteLoading && deletingFaceId === face.face_id
                        }
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
                <div key={image.image_id} className="break-inside-avoid mb-6">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <Link to={isAdminRoute ? `/admin/image/${image.image_id}` : `/image/${image.image_id}`}>
                      <div className="relative overflow-hidden">
                        {imageLoadingStates[image.image_id] !== false && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                        <img
                          src={`data:${image.mime_type};base64,${image.image_base64}`}  // Use base64 data instead of URL
                          alt={image.filename}
                          className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 ${
                            imageLoadingStates[image.image_id] === false
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() =>
                            setImageLoadingStates((prev) => ({
                              ...prev,
                              [image.image_id]: false,
                            }))
                          }
                          onError={(e) => {
                            setImageLoadingStates((prev) => ({
                              ...prev,
                              [image.image_id]: false,
                            }));
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi0vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTM1QzE2My4yNTQgMTM1IDE3NCAxMjQuMjU0IDE3NCAxMTFDMTc0IDk3Ljc0NTggMTYzLjI1NCA4NyAxNTAgODdDMTM2Ljc0NiA4NyAxMjYgOTcuNzQ1OCAxMjYgMTExQzEyNiAxMjQuMjU0IDEzNi43NDYgMTM1IDE1MCAxMzVaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K";
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

      {/* Move Face Dialog */}
      <Dialog open={showMoveModal} onOpenChange={(open) => !open && cancelMoveFace()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Move Face</DialogTitle>
            <DialogDescription>
              Move this face to an existing person or create a new person.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Search existing persons */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                Move to existing person:
              </h4>
              
              {/* Search input */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search persons..."
                  value={searchPersonQuery}
                  onChange={(e) => setSearchPersonQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                {allPersons.filter(person => 
                  person.name.toLowerCase().includes(searchPersonQuery.toLowerCase())
                ).length === 0 ? (
                  <p className="text-gray-500 text-sm py-4 text-center bg-gray-50 rounded-lg">
                    {searchPersonQuery ? "No matching persons found" : "No other persons available"}
                  </p>
                ) : (
                  allPersons
                    .filter(person => 
                      person.name.toLowerCase().includes(searchPersonQuery.toLowerCase())
                    )
                    .map((person) => (
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

            {/* Create new person with custom name */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                Or create new person:
              </h4>
              
              <div className="space-y-3">
                <Input
                  placeholder="Enter person name (optional)"
                  value={customPersonName}
                  onChange={(e) => setCustomPersonName(e.target.value)}
                  disabled={moveLoading}
                />
                
                <Button
                  onClick={moveFaceToNewPerson}
                  disabled={moveLoading}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                >
                  {moveLoading ? "Moving..." : "Create New Person"}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={cancelMoveFace}
              variant="outline"
              disabled={moveLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Face</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this face? This action cannot be
              undone.
              {person && person.total_faces === 1 && (
                <span className="block mt-2 text-red-600 font-medium">
                  Warning: This is the only face for this person. Deleting it
                  will also delete the person "{person.person_name}".
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
                "Delete Face"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonDetail;
