import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { faceAPI } from '@/services/api';

export default function Admin() {
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [singleUploading, setSingleUploading] = useState(false);
  const [multipleUploading, setMultipleUploading] = useState(false);
  const [clustering, setClustering] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSingleFile(e.target.files[0]);
    }
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMultipleFiles(Array.from(e.target.files));
    }
  };

  const handleSingleUpload = async () => {
    if (!singleFile) {
      setMessage('Please select a file');
      return;
    }

    try {
      setSingleUploading(true);
      setMessage('');
      const result = await faceAPI.uploadImage(singleFile);
      setResults(result);
      setMessage(`Single upload completed: ${result.faces_detected} faces detected`);
      setSingleFile(null);
      // Reset the file input
      const fileInput = document.getElementById('single-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setMessage('Error uploading file: ' + (error.response?.data?.error || error.message));
      setResults(null);
    } finally {
      setSingleUploading(false);
    }
  };

  const handleMultipleUpload = async () => {
    if (multipleFiles.length === 0) {
      setMessage('Please select files');
      return;
    }

    try {
      setMultipleUploading(true);
      setMessage('');
      const result = await faceAPI.uploadMultipleImages(multipleFiles);
      setResults(result);
      setMessage(`Multiple upload completed: ${result.successful_uploads}/${result.total_files} files uploaded, ${result.total_faces_detected} total faces detected`);
      setMultipleFiles([]);
      // Reset the file input
      const fileInput = document.getElementById('multiple-files') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setMessage('Error uploading files: ' + (error.response?.data?.error || error.message));
      setResults(null);
    } finally {
      setMultipleUploading(false);
    }
  };

  const handleClustering = async () => {
    try {
      setClustering(true);
      setMessage('');
      const result = await faceAPI.clusterFaces();
      setResults(result);
      setMessage(`Clustering completed successfully`);
    } catch (error: any) {
      setMessage('Error during clustering: ' + (error.response?.data?.error || error.message));
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
      setMessage('');
      const result = await faceAPI.resetDatabase();
      setResults(result);
      setMessage('Database reset successfully! All data has been cleared.');
      setShowResetConfirm(false);
    } catch (error: any) {
      setMessage('Error resetting database: ' + (error.response?.data?.error || error.message));
      setResults(null);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Upload images and manage face clustering</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Single Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Single Image Upload</CardTitle>
              <CardDescription>Upload one image at a time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  id="single-file"
                  type="file"
                  accept="image/*"
                  onChange={handleSingleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {singleFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {singleFile.name}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleSingleUpload} 
                disabled={!singleFile || singleUploading}
                className="w-full"
              >
                {singleUploading ? 'Uploading...' : 'Upload Single Image'}
              </Button>
            </CardContent>
          </Card>

          {/* Multiple Images Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Multiple Images Upload</CardTitle>
              <CardDescription>Upload multiple images at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  id="multiple-files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleFilesChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {multipleFiles.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {multipleFiles.length} files
                  </p>
                )}
              </div>
              <Button 
                onClick={handleMultipleUpload} 
                disabled={multipleFiles.length === 0 || multipleUploading}
                className="w-full"
              >
                {multipleUploading ? 'Uploading...' : `Upload ${multipleFiles.length} Images`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Clustering Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Face Clustering</CardTitle>
            <CardDescription>
              Re-run face clustering algorithm to group similar faces. 
              Manual assignments are preserved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleClustering} 
              disabled={clustering}
              variant="outline"
              className="w-full"
            >
              {clustering ? 'Clustering...' : 'Run Face Clustering'}
            </Button>
          </CardContent>
        </Card>

        {/* Database Reset Section */}
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-600">
              ⚠️ This action will permanently delete ALL data including persons, images, faces, albums, and sections. This cannot be undone!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResetConfirm ? (
              <Button 
                onClick={handleResetDatabase}
                disabled={resetting}
                variant="destructive"
                className="w-full"
              >
                Reset Database
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-red-700 font-medium">
                  Are you absolutely sure? This will delete everything!
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleResetDatabase}
                    disabled={resetting}
                    variant="destructive"
                    className="flex-1"
                  >
                    {resetting ? 'Resetting...' : 'Yes, Delete Everything'}
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

        {/* Results Section */}
        {message && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
              {results && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(results, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            Back to Gallery
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/persons'}
          >
            View Persons
          </Button>
        </div>
      </div>
    </div>
  );
}