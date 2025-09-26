import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { faceAPI } from "@/services/api";
import {
  Album,
  AlertTriangle,
  CheckCircle,
  Database,
  Image as ImageIcon,
  Shuffle,
  Tag,
  Upload,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Admin() {
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [multipleUploading, setMultipleUploading] = useState(false);
  const [clustering, setClustering] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [results, setResults] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Album and Section state
  const [albums, setAlbums] = useState<
    Array<{
      album_id: string;
      name: string;
      description: string;
      created_at: string;
      image_count: number;
    }>
  >([]);
  const [sections, setSections] = useState<
    Array<{
      section_id: string;
      name: string;
      description: string;
      created_at: string;
      image_count: number;
    }>
  >([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("none");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("none");

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchAlbums(), fetchSections()]);
      setInitialLoading(false);
    };
    loadData();
  }, []);

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

  const handleMultipleFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setMultipleFiles(Array.from(e.target.files));
    }
  };

  const handleMultipleUpload = async () => {
    if (multipleFiles.length === 0) {
      setMessage("Please select files");
      return;
    }

    try {
      setMultipleUploading(true);
      setMessage("");
      const result = await faceAPI.uploadMultipleImages(
        multipleFiles,
        selectedAlbumId && selectedAlbumId !== "none"
          ? selectedAlbumId
          : undefined,
        selectedSectionId && selectedSectionId !== "none"
          ? selectedSectionId
          : undefined
      );
      setResults(result);
      setMessage(
        `Upload completed: ${result.successful_uploads}/${result.total_files} files uploaded, ${result.total_faces_detected} total faces detected`
      );
      setMultipleFiles([]);
      // Reset the file input
      const fileInput = document.getElementById(
        "multiple-files"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setMessage(
        "Error uploading files: " +
          (error.response?.data?.error || error.message)
      );
      setResults(null);
    } finally {
      setMultipleUploading(false);
    }
  };

  const handleClustering = async () => {
    try {
      setClustering(true);
      setMessage("");
      const result = await faceAPI.clusterFaces();
      setResults(result);
      setMessage(`Clustering completed successfully`);
    } catch (error: any) {
      setMessage(
        "Error during clustering: " +
          (error.response?.data?.error || error.message)
      );
      setResults(null);
    } finally {
      setClustering(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }

    try {
      setResetting(true);
      setMessage("");
      const result = await faceAPI.resetDatabase();
      setResults(result);
      setMessage("Database reset successfully! All data has been cleared.");
      setShowResetConfirm(false);
    } catch (error: any) {
      setMessage(
        "Error resetting database: " +
          (error.response?.data?.error || error.message)
      );
      setResults(null);
    } finally {
      setResetting(false);
    }
  };

  if (initialLoading) {
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

        <div className="max-w-6xl mx-auto px-4">
          {/* Image Upload Section Skeleton */}
          <div className="mb-12">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8">
                  <div className="text-center space-y-4">
                    <div className="h-12 w-12 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-28 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>

          {/* Management Actions Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-72 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
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
                Admin Panel
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                Upload images, manage face clustering, and control your gallery
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Current Selection Status */}
        {((selectedAlbumId && selectedAlbumId !== "none") ||
          (selectedSectionId && selectedSectionId !== "none")) && (
          <div className="mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <CheckCircle className="w-4 h-4" />
                    Active Selection:
                  </div>

                  {selectedAlbumId && selectedAlbumId !== "none" && (
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <Album className="w-3 h-3" />
                      <span>
                        {albums.find((a) => a.album_id === selectedAlbumId)
                          ?.name || "Unknown Album"}
                      </span>
                    </div>
                  )}

                  {selectedSectionId && selectedSectionId !== "none" && (
                    <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3" />
                      <span>
                        {sections.find(
                          (s) => s.section_id === selectedSectionId
                        )?.name || "Unknown Section"}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Image Upload Section */}
        <div className="mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                Image Upload
              </CardTitle>
              <CardDescription>
                Upload single or multiple images at once. Images will be
                processed for face detection and clustering.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 transition-colors hover:border-primary/50">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        Choose Images
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Select one or more image files to upload
                      </p>
                    </div>
                    <input
                      id="multiple-files"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFilesChange}
                      className="hidden"
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("multiple-files")?.click()
                      }
                      variant="outline"
                      className="mt-4"
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>

                {multipleFiles.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <ImageIcon className="w-4 h-4 text-primary" />
                      Selected Files ({multipleFiles.length})
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      {multipleFiles.slice(0, 8).map((file, index) => (
                        <div
                          key={index}
                          className="truncate bg-background rounded px-2 py-1"
                        >
                          {file.name}
                        </div>
                      ))}
                      {multipleFiles.length > 8 && (
                        <div className="bg-background rounded px-2 py-1 text-center">
                          +{multipleFiles.length - 8} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selection Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Album className="w-4 h-4 text-primary" />
                    Album (Optional)
                  </label>
                  <Select
                    value={selectedAlbumId}
                    onValueChange={setSelectedAlbumId}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select an album" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Album</SelectItem>
                      {albums.map((album) => (
                        <SelectItem key={album.album_id} value={album.album_id}>
                          {album.name} ({album.image_count} images)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    Section (Optional)
                  </label>
                  <Select
                    value={selectedSectionId}
                    onValueChange={setSelectedSectionId}
                  >
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Section</SelectItem>
                      {sections.map((section) => (
                        <SelectItem
                          key={section.section_id}
                          value={section.section_id}
                        >
                          {section.name} ({section.image_count} images)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Upload Button */}
              <Button
                onClick={handleMultipleUpload}
                disabled={multipleFiles.length === 0 || multipleUploading}
                className="w-full py-6 text-lg"
              >
                {multipleUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading {multipleFiles.length} files...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload {multipleFiles.length || ""}{" "}
                    {multipleFiles.length === 1 ? "Image" : "Images"}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Management Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Face Clustering */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shuffle className="w-5 h-5 text-primary" />
                </div>
                Face Clustering
              </CardTitle>
              <CardDescription>
                Re-run the face clustering algorithm to group similar faces.
                Manual assignments are preserved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleClustering}
                disabled={clustering}
                variant="outline"
                className="w-full py-4"
              >
                {clustering ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Clustering faces...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shuffle className="w-4 h-4" />
                    Run Face Clustering
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Database Reset */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-destructive">
                <div className="bg-destructive/10 p-2 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80">
                ⚠️ Permanently delete ALL data including persons, images, faces,
                albums, and sections. This cannot be undone!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showResetConfirm ? (
                <Button
                  onClick={handleResetDatabase}
                  disabled={resetting}
                  variant="destructive"
                  className="w-full py-4"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Reset Database
                  </div>
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-sm text-destructive font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Are you absolutely sure? This will delete everything!
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleResetDatabase}
                      disabled={resetting}
                      variant="destructive"
                      className="flex-1"
                    >
                      {resetting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Resetting...
                        </div>
                      ) : (
                        "Yes, Delete Everything"
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowResetConfirm(false)}
                      variant="outline"
                      className="flex-1"
                      disabled={resetting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {message && (
          <div className="mb-8">
            <Card
              className={`border-l-4 ${
                message.includes("Error")
                  ? "border-destructive bg-destructive/5"
                  : "border-primary bg-primary/5"
              }`}
            >
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    message.includes("Error")
                      ? "text-destructive"
                      : "text-primary"
                  }`}
                >
                  {message.includes("Error") ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {message.includes("Error") ? "Error" : "Success"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-sm ${
                    message.includes("Error")
                      ? "text-destructive"
                      : "text-primary"
                  }`}
                >
                  {message}
                </p>
                {results && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                      View Details
                    </summary>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(results, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
