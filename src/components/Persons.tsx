import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { faceAPI } from "@/services/api";
import { Eye, Image as ImageIcon, Search, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [personsData, setPersonsData] = useState<PersonsData | null>(null);
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="py-20 mt-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <div className="animate-pulse">Loading persons...</div>
            </div>
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
              <Link key={person.person_id} to={`/person/${person.person_id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
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
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {person.person_name}
                      </h3>
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
              </Link>
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
