import { useState, useEffect } from 'react';
import { Upload, Users, Image, BarChart3, RefreshCw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { faceAPI } from '@/services/api';
import type { Gallery as GalleryType, Stats } from '@/types/api';

function Gallery() {
  const [file, setFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<GalleryType | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [clustering, setClustering] = useState(false);

  // Fetch gallery data
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const galleryData = await faceAPI.getGallery();
      setGallery(galleryData);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const statsData = await faceAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Upload image handler
  const handleUpload = async () => {
    if (!file) {
      alert('Please select an image first');
      return;
    }

    try {
      setUploading(true);
      
      // Upload the image
      const uploadResult = await faceAPI.uploadImage(file);
      console.log('Upload result:', uploadResult);

      // Auto-trigger clustering after upload
      setClustering(true);
      await faceAPI.clusterFaces();
      
      // Refresh gallery and stats
      await Promise.all([fetchGallery(), fetchStats()]);
      
      // Reset file input
      setFile(null);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setClustering(false);
    }
  };

  // Manual clustering handler
  const handleCluster = async () => {
    try {
      setClustering(true);
      await faceAPI.clusterFaces();
      await Promise.all([fetchGallery(), fetchStats()]);
    } catch (error) {
      console.error('Clustering failed:', error);
      alert('Failed to cluster faces. Please try again.');
    } finally {
      setClustering(false);
    }
  };

  // Reset database handler
  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the entire database? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await faceAPI.resetDatabase();
      await Promise.all([fetchGallery(), fetchStats()]);
      alert('Database reset successfully');
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Failed to reset database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchGallery();
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Face Clustering Gallery
          </h1>
          <p className="text-muted-foreground">
            Upload images to automatically detect and group faces by person
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Persons</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_persons}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Images</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_images}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Faces</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_faces}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Select an image to upload and detect faces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || uploading || clustering}
                  className="min-w-24"
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : clustering ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Clustering...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleCluster} 
                  variant="outline"
                  disabled={clustering || loading}
                >
                  {clustering ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Clustering...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Re-cluster
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="destructive"
                  disabled={loading || uploading || clustering}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Section */}
        <Card>
          <CardHeader>
            <CardTitle>Face Gallery</CardTitle>
            <CardDescription>
              Faces grouped by person using AI clustering
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && !gallery ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="mr-2 h-6 w-6 animate-spin" />
                <span>Loading gallery...</span>
              </div>
            ) : !gallery || gallery.gallery.length === 0 ? (
              <div className="text-center py-8">
                <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No persons found</h3>
                <p className="text-muted-foreground">
                  Upload some images with faces to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.gallery.map((person) => (
                  <Card key={person.person_id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        <Link 
                          to={`/person/${person.person_id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {person.person_name}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        {person.total_faces} face{person.total_faces !== 1 ? 's' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-2">
                        {person.faces.map((face) => (
                          <div key={face.face_id} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={faceAPI.getImageUrl(face.filename)}
                              alt={`Face from ${face.filename}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0EyIDIgMCAwIDAgMTkgNUg1QTIgMiAwIDAgMCAzIDdWMTdBMiAyIDAgMCAwIDUgMTlIMTlBMiAyIDAgMCAwIDIxIDE3VjE1IiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Im0yMSAxNS0zLjA5LTMuMDlBMi43OCAyLjc4IDAgMCAwIDE2IDExSDVMMTUgMjEiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Gallery;
