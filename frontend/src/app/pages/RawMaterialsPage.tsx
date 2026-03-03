import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rawMaterialsApi } from '../api/rawMaterials';
import type { RawMaterial, RawMaterialCreateUpdate } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function RawMaterialsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [formData, setFormData] = useState<RawMaterialCreateUpdate>({
    name: '',
    stockQuantity: 0,
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['raw-materials'],
    queryFn: rawMaterialsApi.getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const createMutation = useMutation({
    mutationFn: rawMaterialsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setCreateOpen(false);
      setFormData({ name: '', stockQuantity: 0 });
      toast.success('Raw material created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create raw material');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RawMaterialCreateUpdate }) =>
      rawMaterialsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setEditOpen(false);
      setSelectedMaterial(null);
      toast.success('Raw material updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update raw material');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: rawMaterialsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setDeleteOpen(false);
      setSelectedMaterial(null);
      toast.success('Raw material deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete raw material');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEdit = async (material: RawMaterial) => {
    try {
      const freshMaterial = await rawMaterialsApi.getById(material.id);
      setSelectedMaterial(freshMaterial);
      setFormData({ name: freshMaterial.name, stockQuantity: freshMaterial.stockQuantity });
      setEditOpen(true);
    } catch (error: any) {
      toast.error(
        error?.message || 'Failed to load material. It may have been deleted. Please refresh the page.'
      );
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMaterial) {
      updateMutation.mutate({ id: selectedMaterial.id, data: formData });
    }
  };

  const handleDeleteClick = (material: RawMaterial) => {
    setSelectedMaterial(material);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedMaterial) {
      deleteMutation.mutate(selectedMaterial.id);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Raw Materials</h1>
        <Button onClick={() => setCreateOpen(true)}>Create New</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Stock Quantity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.stockQuantity}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="blue" size="sm" onClick={() => handleEdit(material)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(material)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Raw Material</DialogTitle>
            <DialogDescription>
              Add a new raw material to your inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: Number(e.target.value) || 0 })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Raw Material</DialogTitle>
            <DialogDescription>
              Update the raw material information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-stockQuantity">Stock Quantity *</Label>
                <Input
                  id="edit-stockQuantity"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQuantity: Number(e.target.value) || 0 })
                  }
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the raw material "{selectedMaterial?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}