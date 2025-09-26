import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { faceAPI } from "@/services/api";
import { Eye, Image as ImageIcon, Search, User, Users, Edit2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

interface Person {
  person_id: string;
  person_name: string;
  total_faces: number;
  total_images: number;
  thumbnail: string | null;
}

interface PersonsData {
  persons: Person[];
  total: number;
}

export default function Persons() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin/persons';
  
  const [personsData, setPersonsData] = useState<PersonsData | null>(null);
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (personsData) {
      const filtered = personsData.persons.filter((person) =>
        person.person_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredPersons(filtered);
    }
  }, [personsData, debouncedSearchTerm]);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const data = await faceAPI.getAllPersons();
      setPersonsData(data);
    } catch (err) {
      console.error("Failed to fetch persons:", err);
      setError("Failed to load persons");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (person: Person) => {
    setEditingPersonId(person.person_id);
    setEditingName(person.person_name);
  };

  const handleCancelEdit = () => {
    setEditingPersonId(null);
    setEditingName("");
  };

  const handleSaveEdit = async (personId: string) => {
    if (!editingName.trim()) {
      toast.error("Person name cannot be empty");
      return;
    }

    try {
      setUpdating(personId);
      // TODO: Add API call to update person name
      // await faceAPI.updatePersonName(personId, editingName);
      
      // Update local state
      if (personsData) {
        const updatedPersons = personsData.persons.map(person => 
          person.person_id === personId 
            ? { ...person, person_name: editingName }
            : person
        );
        setPersonsData({ ...personsData, persons: updatedPersons });
      }
      
      setEditingPersonId(null);
      setEditingName("");
      toast.success("Person name updated successfully");
    } catch (err) {
      console.error("Failed to update person name:", err);
      toast.error("Failed to update person name");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section Skeleton */}
        <div className="py-20 mt-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <div className="h-16 bg-gray-200 rounded mx-auto w-64 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Search Bar Skeleton */}
          <div className="mb-12">
            <div className="relative">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Persons Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="py-20 mt-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="text-red-500">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight uppercase tracking-wide">
                Persons
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                Discover all detected persons and explore their captured moments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search persons by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Results Info */}
        {debouncedSearchTerm && (
          <div className="mb-6">
            <div className="text-sm text-muted-foreground text-center">
              {filteredPersons.length > 0
                ? `Found ${filteredPersons.length} person${filteredPersons.length !== 1 ? 's' : ''} matching "${debouncedSearchTerm}"`
                : `No persons found matching "${debouncedSearchTerm}"`}
            </div>
          </div>
        )}

        {/* Persons Grid */}
        {personsData && (debouncedSearchTerm ? filteredPersons : personsData.persons).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(debouncedSearchTerm ? filteredPersons : personsData.persons).map((person) => (
              <div key={person.person_id}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <Link to={`/person/${person.person_id}`} className="block">
                    <div className="relative aspect-square bg-muted">
                      {person.thumbnail ? (
                        <img
                          src={faceAPI.getFaceUrl(person.thumbnail)}
                          alt={`${person.person_name} face`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            const parent = img.parentElement;
                            if (parent) {
                              parent.innerHTML =
                                '<div class="w-full h-full flex items-center justify-center text-muted-foreground"><div class="text-center"><div class="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div><p class="text-sm">No Face</p></div></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                              <User className="w-8 h-8" />
                            </div>
                            <p className="text-sm">No Face</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {/* Person Name - Editable in admin mode */}
                      {isAdminRoute && editingPersonId === person.person_id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="text-sm"
                            disabled={updating === person.person_id}
                          />
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleSaveEdit(person.person_id)}
                            disabled={updating === person.person_id}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={handleCancelEdit}
                            disabled={updating === person.person_id}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground truncate">
                            {person.person_name}
                          </h3>
                          {isAdminRoute && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditClick(person)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>
                            {person.total_faces} face
                            {person.total_faces !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" />
                          <span>
                            {person.total_images} image
                            {person.total_images !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-muted-foreground">
              <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                {debouncedSearchTerm ? <Search className="w-10 h-10" /> : <Users className="w-10 h-10" />}
              </div>
              <p className="text-lg mb-2">
                {debouncedSearchTerm ? "No matching persons found" : "No persons detected yet"}
              </p>
              <p className="text-sm mb-6">
                {debouncedSearchTerm
                  ? `Try adjusting your search term "${debouncedSearchTerm}"`
                  : "Upload some images with faces to get started"}
              </p>
              {!debouncedSearchTerm && (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Go to Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
