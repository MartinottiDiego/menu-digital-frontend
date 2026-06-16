'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { CategoriesTable } from '@/components/admin/CategoriesTable';
import { CategoriesTableSkeleton } from '@/components/admin/CategoriesTableSkeleton';
import { CategoryFormModal } from '@/components/admin/CategoryFormModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import type { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const { data, error, isLoading, mutate } = useSWR(
    'admin-categories-list',
    () =>
      adminApi.getAllCategories({
        limit: 100,
        includeInactive: false,
      }),
    { revalidateOnFocus: false }
  );

  const categories = data?.data ?? [];

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const lowerSearch = search.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(lowerSearch) ||
        (cat.description?.toLowerCase().includes(lowerSearch) ?? false)
    );
  }, [categories, search]);

  const handleCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteTarget(category);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    try {
      await adminApi.deleteCategory(id);
      setDeleteTarget(null);
      await mutate();
      toast.success('Categoría eliminada');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al eliminar categoría';
      if (
        message.toLowerCase().includes('productos') ||
        message.toLowerCase().includes('products')
      ) {
        toast.error(
          'No se puede eliminar: tiene productos asociados'
        );
      } else {
        toast.error(message);
      }
    }
  };

  const handleFormSuccess = () => {
    mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gold-200">Categorías</h1>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="size-5" />
          Nueva Categoría
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <AdminSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o descripción..."
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-600/10 p-4 text-red-400">
          <p>Error al cargar categorías.</p>
          <Button variant="secondary" className="mt-3" onClick={() => mutate()}>
            Reintentar
          </Button>
        </div>
      )}

      {isLoading && <CategoriesTableSkeleton />}

      {!isLoading && !error && filteredCategories.length === 0 && (
        <div className="rounded-lg border border-gold-300/20 bg-dark-800 p-12 text-center">
          <p className="text-white/70">
            {categories.length === 0
              ? 'No hay categorías.'
              : 'No se encontraron categorías con ese filtro.'}
          </p>
          {categories.length === 0 && (
            <Button variant="primary" className="mt-4" onClick={handleCreate}>
              Crear la primera
            </Button>
          )}
        </div>
      )}

      {!isLoading && !error && filteredCategories.length > 0 && (
        <CategoriesTable
          categories={filteredCategories}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar categoría?"
        message="Esta acción desactivará la categoría. No se mostrará en el menú público. Si tiene productos asociados, no podrá eliminarse."
        confirmText="Eliminar"
        isDestructive
      />
    </div>
  );
}
