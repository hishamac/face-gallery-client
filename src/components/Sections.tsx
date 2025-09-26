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

interface Section {
  section_id: string;
  name: string;
  description: string;
  created_at: string;
  image_count: number;
}

export default function Sections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const loadSections = async () => {
    try {
      const data = await faceAPI.getAllSections();
      setSections(data.sections);
    } catch (error) {
      console.error('Failed to load sections:', error);
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleCreateSection = async () => {
    if (!formData.name.trim()) {
      toast.error('Section name is required');
      return;
    }

    try {
      setCreateLoading(true);
      await faceAPI.createSection(formData.name, formData.description);
      toast.success('Section created successfully');
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '' });
      loadSections();
    } catch (error: any) {
      console.error('Failed to create section:', error);
      toast.error(error.response?.data?.error || 'Failed to create section');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditSection = async () => {
    if (!editingSection || !formData.name.trim()) {
      toast.error('Section name is required');
      return;
    }

    try {
      setEditLoading(true);
      await faceAPI.updateSection(editingSection.section_id, formData.name, formData.description);
      toast.success('Section updated successfully');
      setIsEditDialogOpen(false);
      setEditingSection(null);
      setFormData({ name: '', description: '' });
      loadSections();
    } catch (error: any) {
      console.error('Failed to update section:', error);
      toast.error(error.response?.data?.error || 'Failed to update section');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteSection = async (section: Section) => {
    setDeletingSection(section);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSection = async () => {
    if (!deletingSection) return;

    try {
      setDeleteLoading(true);
      await faceAPI.deleteSection(deletingSection.section_id);
      toast.success('Section deleted successfully');
      setIsDeleteDialogOpen(false);
      setDeletingSection(null);
      loadSections();
    } catch (error: any) {
      console.error('Failed to delete section:', error);
      toast.error(error.response?.data?.error || 'Failed to delete section');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditDialog = (section: Section) => {
    setEditingSection(section);
    setFormData({ name: section.name, description: section.description });
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
                <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
              </div>
            </div>

            {/* Header Actions Skeleton */}
            <div className="mb-8 flex justify-between items-center">
              <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
            </div>

            {/* Sections Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
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
                Sections
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
                Categorize your photos by event sections
              </p>
            </div>
          </div>

          <div className="mb-8 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {sections.length} section{sections.length !== 1 ? 's' : ''} total
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Section
                </Button>
              </DialogTrigger>
              <DialogContent className="[&>button]:hidden">
                <DialogHeader>
                  <DialogTitle>Create New Section</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter section name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter section description (optional)"
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
                    <Button onClick={handleCreateSection} disabled={createLoading}>
                      {createLoading ? 'Creating...' : 'Create Section'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Image className="w-10 h-10" />
                </div>
                <p className="text-lg mb-2">No sections yet</p>
                <p className="text-sm">Create your first section to categorize your photos</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sections.map((section) => (
                <Card key={section.section_id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{section.name}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(section)}
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSection(section)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {section.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Image className="w-4 h-4" />
                          <span>{section.image_count} images</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(section.created_at)}</span>
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
                <DialogTitle>Edit Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter section name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter section description (optional)"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingSection(null);
                    setFormData({ name: '', description: '' });
                  }} disabled={editLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditSection} disabled={editLoading}>
                    {editLoading ? 'Updating...' : 'Update Section'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="[&>button]:hidden">
              <DialogHeader>
                <DialogTitle>Delete Section</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete "{deletingSection?.name}"? This action cannot be undone and will remove all associated data.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setDeletingSection(null);
                  }} disabled={deleteLoading}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteSection} disabled={deleteLoading}>
                    {deleteLoading ? 'Deleting...' : 'Delete Section'}
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