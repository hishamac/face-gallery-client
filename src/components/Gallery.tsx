import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { faceAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tag,
  Album,
  ChevronDown,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import type { ImageSummary } from "@/types/api";

interface SearchMatch {
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
}

export default function Gallery() {
  const [images, setImages] = useState<ImageSummary[]>([]);
  const [displayImages, setDisplayImages] = useState<ImageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Albums and sections state
  const [sections, setSections] = useState<Array<{
    section_id: string;
    name: string;
    description: string;
    created_at: string;
    image_count: number;
  }>>([]);
  const [albums, setAlbums] = useState<Array<{
    album_id: string;
    name: string;
    description: string;
    created_at: string;
    image_count: number;
  }>>([]);

  // Search state
  const [searchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [selectedAlbum, setSelectedAlbum] = useState("All Albums");

  // Image search state
  const [searchFile, setSearchFile] = useState<File | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchMatch[]>([]);
  const [searchError, setSearchError] = useState<string>("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
    fetchAlbums();
    fetchSections();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, searchTerm, selectedSection, selectedAlbum]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await faceAPI.getAllImages();
      setImages(data.images);
    } catch (err) {
      console.error("Failed to fetch images:", err);
      setError("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const data = await faceAPI.getAllAlbums();
      setAlbums(data.albums);
    } catch (err) {
      console.error("Failed to fetch albums:", err);
    }
  };

  const fetchSections = async () => {
    try {
      const data = await faceAPI.getAllSections();
      setSections(data.sections);
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    }
  };

  const filterImages = () => {
    let filtered = images;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((image) =>
        image.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by section (you would implement actual section logic here)
    if (selectedSection !== "All Sections") {
      // Implement section filtering logic based on your data structure
    }

    // Filter by album (you would implement actual album logic here)
    if (selectedAlbum !== "All Albums") {
      // Implement album filtering logic based on your data structure
    }

    setDisplayImages(filtered);
  };

  const handleSearchFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSearchFile(file);
      setSearchError("");
    }
  };

  const performImageSearch = async () => {
    if (!searchFile) {
      setSearchError("Please select an image to search");
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError("");
      const results = await faceAPI.searchByImage(searchFile);
      setSearchResults(results.matches);
      setIsSearchMode(true);
    } catch (err: any) {
      console.error("Search failed:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Search failed";
      setSearchError(errorMessage);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearImageSearch = () => {
    setSearchFile(null);
    setSearchResults([]);
    setSearchError("");
    setIsSearchMode(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading images...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );

  const imagesToDisplay = isSearchMode
    ? searchResults.map((match) => ({
        image_id: match.image?.image_id || match.face_id,
        filename: match.image?.filename || "Unknown",
        faces_count: 1,
        persons_count: match.person ? 1 : 0,
        upload_date: null,
      }))
    : displayImages;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight uppercase tracking-wide">
                Gallery
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                Capturing the moments of our festival
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <div className="relative ">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative ">
              {/* Desktop Search */}
              <div className=" flex gap-4 items-center justify-center flex-wrap">
                {/* Search by Image */}
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all backdrop-blur-sm whitespace-nowrap">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">
                          Search by Image
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">
                            Search by Image
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Upload an image to find similar faces in the
                            gallery.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleSearchFileChange}
                            className="hidden"
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {searchFile ? searchFile.name : "Choose Image"}
                          </Button>
                          {searchFile && (
                            <div className="flex gap-2">
                              <Button
                                onClick={performImageSearch}
                                disabled={searchLoading}
                                className="flex-1"
                              >
                                {searchLoading ? "Searching..." : "Search"}
                              </Button>
                              <Button
                                onClick={clearImageSearch}
                                variant="outline"
                                size="sm"
                              >
                                Clear
                              </Button>
                            </div>
                          )}
                          {searchError && (
                            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                              {searchError}
                            </div>
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Sections Dropdown */}
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all backdrop-blur-sm whitespace-nowrap">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Sections</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem
                        onClick={() => setSelectedSection("All Sections")}
                        className={
                          selectedSection === "All Sections" ? "bg-accent" : ""
                        }
                      >
                        All Sections
                      </DropdownMenuItem>
                      {sections.map((section) => (
                        <DropdownMenuItem
                          key={section.section_id}
                          onClick={() => setSelectedSection(section.name)}
                          className={
                            selectedSection === section.name ? "bg-accent" : ""
                          }
                        >
                          {section.name} ({section.image_count})
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Albums Dropdown */}
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-all backdrop-blur-sm whitespace-nowrap">
                        <Album className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Albums</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem
                        onClick={() => setSelectedAlbum("All Albums")}
                        className={selectedAlbum === "All Albums" ? "bg-accent" : ""}
                      >
                        All Albums
                      </DropdownMenuItem>
                      {albums.map((album) => (
                        <DropdownMenuItem
                          key={album.album_id}
                          onClick={() => setSelectedAlbum(album.name)}
                          className={selectedAlbum === album.name ? "bg-accent" : ""}
                        >
                          {album.name} ({album.image_count})
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {isSearchMode && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
              <span className="text-blue-800">
                Found {searchResults.length} matches for your search
              </span>
              <Button onClick={clearImageSearch} variant="outline" size="sm">
                View All Images
              </Button>
            </div>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {imagesToDisplay.map((image, index) => (
            <div
              key={image.image_id || index}
              className="break-inside-avoid mb-6"
            >
              <div className="bauhaus-card group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 p-0">
                <Link to={`/image/${image.image_id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      alt={image.filename}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      src={faceAPI.getImageUrl(image.filename)}
                      style={{ color: "transparent" }}
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Face count overlay */}
                    {image.faces_count > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        {image.faces_count} face
                        {image.faces_count !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {imagesToDisplay.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              {isSearchMode ? "No matches found" : "No images found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isSearchMode
                ? "Try uploading a different image or adjust your search filters."
                : "Get started by uploading some images to your gallery."}
            </p>
            {!isSearchMode && (
              <Link
                to="/admin"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
