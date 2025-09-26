import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { faceAPI } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ImageSummary, Stats } from '@/types/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Search state
  const [showSearch, setShowSearch] = useState(false);
  const [searchFile, setSearchFile] = useState<File | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchMatch[]>([]);
  const [searchError, setSearchError] = useState<string>('');
  const [searchMessage, setSearchMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
    fetchStats();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await faceAPI.getAllImages();
      setImages(data.images);
    } catch (err) {
      console.error('Failed to fetch images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await faceAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSearchFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSearchFile(file);
      setSearchError('');
      setSearchMessage('');
    }
  };

  const performSearch = async () => {
    if (!searchFile) {
      setSearchError('Please select an image to search');
      return;
    }

    try {
      setSearchLoading(true);
      setSearchError('');
      setSearchMessage('');
      const results = await faceAPI.searchByImage(searchFile);
      setSearchResults(results.matches);
    } catch (err: any) {
      console.error('Search failed:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Search failed';
      const searchMessage = err.response?.data?.message || err.response?.data?.error || 'Search failed';
      setSearchError(errorMessage);
      setSearchMessage(searchMessage);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchFile(null);
    setSearchResults([]);
    setSearchError('');
    setSearchMessage('');
    setShowSearch(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading images...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Gallery</h1>
        <p className="text-gray-600">Browse all uploaded images and search for similar faces</p>
      </div>

      {/* Search Toggle */}
      <div className="mb-6">
        <Button
          onClick={() => setShowSearch(!showSearch)}
          className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200"
        >
          {showSearch ? 'Hide Search' : 'Search by Image'}
        </Button>
      </div>

      {/* Search Section */}
      {showSearch && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Search by Image</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload an image to find similar faces in the gallery. Works only with images containing exactly one face.
            </p>
            
            <div className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSearchFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={performSearch}
                  disabled={!searchFile || searchLoading}
                  className="px-6 py-2"
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
                {(searchFile || searchResults.length > 0) && (
                  <Button onClick={clearSearch} variant="outline">
                    Clear
                  </Button>
                )}
              </div>

              {searchError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {searchError}
                </div>
              )}
              {searchMessage && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  {searchMessage}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Search Results ({searchResults.length} matches)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {searchResults.map((match, index) => (
                <div key={index} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                  {match.cropped_face_filename && (
                    <div className="aspect-square mb-2 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={faceAPI.getFaceUrl(match.cropped_face_filename)}
                        alt="Search match"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="text-xs space-y-1">
                    <div className="font-medium text-green-600">
                      {Math.round((1 - match.distance) * 100)}% match
                    </div>
                    {match.person && (
                      <div>
                        <Link
                          to={`/person/${match.person.person_id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {match.person.person_name}
                        </Link>
                      </div>
                    )}
                    {match.image && (
                      <div>
                        <Link
                          to={`/image/${match.image.image_id}`}
                          className="text-gray-600 hover:underline text-xs"
                        >
                          {match.image.filename}
                        </Link>
                      </div>
                    )}
                    <div className="text-gray-400">Distance: {match.distance.toFixed(3)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_images}</div>
              <div className="text-sm text-muted-foreground">Total Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.total_faces}</div>
              <div className="text-sm text-muted-foreground">Total Faces</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.total_persons}</div>
              <div className="text-sm text-muted-foreground">Total Persons</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.images_with_faces || 0}</div>
              <div className="text-sm text-muted-foreground">Images with Faces</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card key={image.image_id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/image/${image.image_id}`}>
              <div className="relative aspect-square">
                <img
                  src={faceAPI.getImageUrl(image.filename)}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Face count overlay */}
                {image.faces_count > 0 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                    {image.faces_count} face{image.faces_count !== 1 ? 's' : ''}
                  </div>
                )}
                {/* No faces indicator */}
                {image.faces_count === 0 && (
                  <div className="absolute top-2 right-2 bg-gray-500/70 text-white px-2 py-1 rounded-full text-xs">
                    No faces
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm truncate" title={image.filename}>
                    {image.filename}
                  </h3>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{image.faces_count} faces</span>
                    <span>{image.persons_count} persons</span>
                  </div>
                  {image.upload_date && (
                    <div className="text-xs text-muted-foreground">
                      Uploaded: {new Date(image.upload_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No images found</div>
          <Link 
            to="/admin" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Images
          </Link>
        </div>
      )}
    </div>
  );
}
