import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { productMaterialsApi } from '../api/productMaterials';
import { rawMaterialsApi } from '../api/rawMaterials';
import type {
  Product,
  ProductCreateUpdate,
  ProductMaterial,
  ProductMaterialCreateUpdate,
} from '../types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductCreateUpdate>({
    name: '',
    price: 0,
  });

  // BOM (Materials) state
  const [materialFormData, setMaterialFormData] = useState<ProductMaterialCreateUpdate>({
    rawMaterialId: '',
    requiredQuantity: 0,
  });
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [deleteMaterialOpen, setDeleteMaterialOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: rawMaterials = [] } = useQuery({
    queryKey: ['raw-materials'],
    queryFn: rawMaterialsApi.getAll,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { data: productMaterials = [] } = useQuery({
    queryKey: ['product-materials', selectedProduct?.id],
    queryFn: () => productMaterialsApi.getAll(selectedProduct!.id),
    enabled: !!selectedProduct?.id && editOpen,
  });

  // Product mutations
  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setCreateOpen(false);
      setFormData({ name: '', price: 0 });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductCreateUpdate }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setDeleteOpen(false);
      setSelectedProduct(null);
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });

  // Material mutations
  const createMaterialMutation = useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductMaterialCreateUpdate }) =>
      productMaterialsApi.create(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-materials', selectedProduct?.id] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setMaterialFormData({ rawMaterialId: '', requiredQuantity: 0 });
      toast.success('Material added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add material');
    },
  });

  const updateMaterialMutation = useMutation({
    mutationFn: ({
      productId,
      rawMaterialId,
      data,
    }: {
      productId: string;
      rawMaterialId: string;
      data: ProductMaterialCreateUpdate;
    }) => productMaterialsApi.update(productId, rawMaterialId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-materials', selectedProduct?.id] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setEditingMaterialId(null);
      setMaterialFormData({ rawMaterialId: '', requiredQuantity: 0 });
      toast.success('Material updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update material');
    },
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: ({ productId, rawMaterialId }: { productId: string; rawMaterialId: string }) =>
      productMaterialsApi.delete(productId, rawMaterialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-materials', selectedProduct?.id] });
      queryClient.invalidateQueries({ queryKey: ['production-suggestion'] });
      setDeleteMaterialOpen(false);
      setSelectedMaterialId(null);
      toast.success('Material removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove material');
    },
  });

  // Product handlers
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleEdit = async (product: Product) => {
    try {
      const freshProduct = await productsApi.getById(product.id);
      setSelectedProduct(freshProduct);
      setFormData({ name: freshProduct.name, price: freshProduct.price });
      setEditOpen(true);
    } catch (error: any) {
      toast.error(
        error?.message || 'Failed to load product. It may have been deleted. Please refresh the page.'
      );
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      updateMutation.mutate({ id: selectedProduct.id, data: formData });
    }
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  // Material handlers
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && materialFormData.rawMaterialId) {
      createMaterialMutation.mutate({
        productId: selectedProduct.id,
        data: materialFormData,
      });
    }
  };

  const handleEditMaterial = (material: ProductMaterial) => {
    setEditingMaterialId(material.rawMaterialId);
    setMaterialFormData({
      rawMaterialId: material.rawMaterialId,
      requiredQuantity: material.requiredQuantity,
    });
  };

  const handleUpdateMaterial = () => {
    if (selectedProduct && editingMaterialId) {
      updateMaterialMutation.mutate({
        productId: selectedProduct.id,
        rawMaterialId: editingMaterialId,
        data: materialFormData,
      });
    }
  };

  const handleDeleteMaterialClick = (rawMaterialId: string) => {
    setSelectedMaterialId(rawMaterialId);
    setDeleteMaterialOpen(true);
  };

  const handleDeleteMaterialConfirm = () => {
    if (selectedProduct && selectedMaterialId) {
      deleteMaterialMutation.mutate({
        productId: selectedProduct.id,
        rawMaterialId: selectedMaterialId,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingMaterialId(null);
    setMaterialFormData({ rawMaterialId: '', requiredQuantity: 0 });
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setCreateOpen(true)}>Create New</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button variant="blue" size="sm" onClick={() => handleEdit(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(product)}>
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
            <DialogTitle>Create Product</DialogTitle>
            <DialogDescription>
              Add a new product to your catalog.
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
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
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

      {/* Edit Dialog with BOM */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information and manage its bill of materials.
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
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) || 0 })
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

          {/* Materials (BOM) Section */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Materials (BOM)</h3>

            {/* Add Material Form */}
            <form onSubmit={handleAddMaterial} className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material-select">Raw Material *</Label>
                  <Select
                    value={materialFormData.rawMaterialId}
                    onValueChange={(value) =>
                      setMaterialFormData({ ...materialFormData, rawMaterialId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials.map((rm) => (
                        <SelectItem key={rm.id} value={rm.id}>
                          {rm.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="required-quantity">Required Quantity *</Label>
                  <Input
                    id="required-quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={materialFormData.requiredQuantity}
                    onChange={(e) =>
                      setMaterialFormData({
                        ...materialFormData,
                        requiredQuantity: Number(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="sm"
                disabled={createMaterialMutation.isPending || !materialFormData.rawMaterialId}
              >
                <Plus className="h-4 w-4 mr-2" />
                {createMaterialMutation.isPending ? 'Adding...' : 'Add Material'}
              </Button>
            </form>

            {/* Materials List */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Required Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productMaterials.map((material) => (
                  <TableRow key={material.rawMaterialId}>
                    <TableCell>{material.rawMaterialName}</TableCell>
                    <TableCell>
                      {editingMaterialId === material.rawMaterialId ? (
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={materialFormData.requiredQuantity}
                          onChange={(e) =>
                            setMaterialFormData({
                              ...materialFormData,
                              requiredQuantity: Number(e.target.value) || 0,
                            })
                          }
                          className="w-32"
                        />
                      ) : (
                        material.requiredQuantity
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingMaterialId === material.rawMaterialId ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleUpdateMaterial}
                            disabled={updateMaterialMutation.isPending}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMaterial(material)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMaterialClick(material.rawMaterialId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{selectedProduct?.name}".
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

      {/* Delete Material Confirmation */}
      <AlertDialog open={deleteMaterialOpen} onOpenChange={setDeleteMaterialOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this material from the product?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMaterialConfirm}
              disabled={deleteMaterialMutation.isPending}
            >
              {deleteMaterialMutation.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}