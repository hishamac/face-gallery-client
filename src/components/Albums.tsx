import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Calendar, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { faceAPI } from '@/services/api';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';

interface Album {
  album_id: string;
  name: string;
  description: string;
  created_at: string;
  image_count: number;
}

export default function Albums() {
  usePageTitle("Albums");
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const loadAlbums = async () => {
    try {
      const data = await faceAPI.getAllAlbums();
      setAlbums(data.albums);
    } catch (error) {
      console.error('Failed to load albums:', error);
      toast.error('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleCreateAlbum = async () => {
    if (!formData.name.trim()) {
      toast.error('Album name is required');
      return;
    }

    try {
      setCreateLoading(true);
      await faceAPI.createAlbum(formData.name, formData.description);
      toast.success('Album created successfully');
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '' });
      loadAlbums();
    } catch (error: any) {
      console.error('Failed to create album:', error);
      toast.error(error.response?.data?.error || 'Failed to create album');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditAlbum = async () => {
    if (!editingAlbum || !formData.name.trim()) {
      toast.error('Album name is required');
      return;
    }

    try {
      setEditLoading(true);
      await faceAPI.updateAlbum(editingAlbum.album_id, formData.name, formData.description);
      toast.success('Album updated successfully');
      setIsEditDialogOpen(false);
      setEditingAlbum(null);
      setFormData({ name: '', description: '' });
      loadAlbums();
    } catch (error: any) {
      console.error('Failed to update album:', error);
      toast.error(error.response?.data?.error || 'Failed to update album');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAlbum = async (album: Album) => {
    setDeletingAlbum(album);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAlbum = async () => {
    if (!deletingAlbum) return;

    try {
      setDeleteLoading(true);
      await faceAPI.deleteAlbum(deletingAlbum.album_id);
      toast.success('Album deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingAlbum(null);
      loadAlbums();
    } catch (error: any) {
      console.error('Failed to delete album:', error);
      toast.error(error.response?.data?.error || 'Failed to delete album');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditDialog = (album: Album) => {
    setEditingAlbum(album);
    setFormData({ name: album.name, description: album.description });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section Skeleton */}
        <div className="py-20 mt-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center space-y-8 mb-12">
              <div className="space-y-6">
                <div className="h-16 bg-gray-200 rounded mx-auto w-64 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mx-auto w-80 animate-pulse"></div>
              </div>
            </div>

            {/* Header Actions Skeleton */}
            <div className="mb-8 flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>

            {/* Albums Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="flex gap-1">
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-8 mb-12">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight uppercase tracking-wide">
                Albums
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                Organize your photos into collections
              </p>
            </div>
          </div>

          <div className="mb-8 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {albums.length} album{albums.length !== 1 ? 's' : ''} total
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Album
                </Button>
              </DialogTrigger>
              <DialogContent className="[&>button]:hidden">
                <DialogHeader>
                  <DialogTitle>Create New Album</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter album name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter album description (optional)"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setIsCreateDialogOpen(false);
                      setFormData({ name: '', description: '' });
                    }} disabled={createLoading}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAlbum} disabled={createLoading}>
                      {createLoading ? 'Creating...' : 'Create Album'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {albums.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Image className="w-10 h-10" />
                </div>
                <p className="text-lg mb-2">No albums yet</p>
                <p className="text-sm">Create your first album to organize your photos</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album) => (
                <Card key={album.album_id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{album.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(album)}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteAlbum(album)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {album.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          <span>{album.image_count} images</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(album.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="[&>button]:hidden">
              <DialogHeader>
                <DialogTitle>Edit Album</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter album name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter album description (optional)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingAlbum(null);
                    setFormData({ name: '', description: '' });
                  }} disabled={editLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditAlbum} disabled={editLoading}>
                    {editLoading ? 'Updating...' : 'Update Album'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="[&>button]:hidden">
              <DialogHeader>
                <DialogTitle>Delete Album</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete "{deletingAlbum?.name}"? This action cannot be undone and will remove all associated data.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setDeletingAlbum(null);
                  }} disabled={deleteLoading}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteAlbum} disabled={deleteLoading}>
                    {deleteLoading ? 'Deleting...' : 'Delete Album'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}