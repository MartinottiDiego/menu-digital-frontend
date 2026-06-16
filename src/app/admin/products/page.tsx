'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { ArrowUpDown, Loader2, Plus } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProductsTableSkeleton } from '@/components/admin/ProductsTableSkeleton';
import { ProductFormModal } from '@/components/admin/ProductFormModal';
import { ProductSortModal } from '@/components/admin/ProductSortModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AdminSearchBar } from '@/components/admin/AdminSearchBar';
import { Select } from '@/components/ui/Select';
import { AdminPageHeader } from '@/components/admin/AdminUI';
import type { Product } from '@/lib/types';

const LIMIT = 20;

export default function AdminProductsPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortModalProducts, setSortModalProducts] = useState<Product[]>([]);
  const [sortModalLoading, setSortModalLoading] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    ['admin-products', page, categoryId || undefined],
    () =>
      adminApi.getAllProducts({
        page,
        limit: LIMIT,
        categoryId: categoryId || undefined,
        includeInactive: false, // Solo activos: al eliminar (soft delete) desaparece de la lista
      }),
    { revalidateOnFocus: false }
  );

  /** Solo categorías activas: igual que /admin/categories. includeInactive:true mezclaba
   *  filas desactivadas (p. ej. nombre viejo) y rompía al asignarlas a un producto nuevo. */
  const { data: categoriesData } = useSWR(
    ['admin-categories', 'active-only'],
    () => adminApi.getAllCategories({ limit: 100, includeInactive: false }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const categories = useMemo(() => {
    const list = categoriesData?.data ?? [];
    const byId = new Map(list.map((c) => [c._id, c]));
    return [...byId.values()];
  }, [categoriesData]);
  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const handleCreateClick = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteTarget(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    try {
      await adminApi.deleteProduct(id);
      setDeleteTarget(null);
      await mutate();
      toast.success('Producto eliminado');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al eliminar producto'
      );
    }
  };

  const handleFormSuccess = () => {
    mutate();
  };

  const loadAllActiveProductsForSort = async (): Promise<Product[]> => {
    const pageSize = 100;
    let pageNum = 1;
    const acc: Product[] = [];
    let totalPages = 1;
    do {
      const res = await adminApi.getAllProducts({
        page: pageNum,
        limit: pageSize,
        includeInactive: false,
      });
      acc.push(...res.data);
      totalPages = res.totalPages;
      pageNum += 1;
    } while (pageNum <= totalPages);
    return acc;
  };

  const handleOpenSortModal = async () => {
    setSortModalLoading(true);
    try {
      const all = await loadAllActiveProductsForSort();
      setSortModalProducts(all);
      setShowSortModal(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al cargar productos'
      );
    } finally {
      setSortModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Productos"
        subtitle={total > 0 ? `${total} productos` : undefined}
        actions={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={handleOpenSortModal}
              disabled={sortModalLoading || isLoading}
              className="border-gold-300/30"
            >
              {sortModalLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Cargando…
                </>
              ) : (
                <>
                  <ArrowUpDown className="size-5" />
                  Ordenar
                </>
              )}
            </Button>
            <Button variant="primary" onClick={handleCreateClick}>
              <Plus className="size-5" />
              Nuevo Producto
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <AdminSearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre..."
        />
        <div className="w-full sm:w-48">
          <Select
            value={categoryId}
            onChange={(v) => {
              setCategoryId(v);
              setPage(1);
            }}
            options={[
              { value: '', label: 'Todas las categorías' },
              ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-600/10 p-4 text-red-400">
          <p>Error al cargar productos.</p>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => mutate()}
          >
            Reintentar
          </Button>
        </div>
      )}

      {isLoading && <ProductsTableSkeleton />}

      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="rounded-lg border border-gold-300/20 bg-dark-800 p-12 text-center">
          <p className="text-white/70">
            {products.length === 0
              ? 'No hay productos.'
              : 'No se encontraron productos con ese filtro.'}
          </p>
          {products.length === 0 && (
            <Button
              variant="primary"
              className="mt-4"
              onClick={handleCreateClick}
            >
              Crear el primero
            </Button>
          )}
        </div>
      )}

      {!isLoading && !error && filteredProducts.length > 0 && (
        <>
          <ProductsTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg border border-gold-300/20 bg-dark-800 px-4 py-3">
              <p className="text-sm text-white/70">
                Página {page} de {totalPages} ({total} productos)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="py-2 text-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  className="py-2 text-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={handleFormSuccess}
        categories={categories}
      />

      <ProductSortModal
        isOpen={showSortModal}
        onClose={() => setShowSortModal(false)}
        products={sortModalProducts}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar producto?"
        message="Esta acción desactivará el producto. No se mostrará en el menú público."
        confirmText="Eliminar"
        isDestructive
      />
    </div>
  );
}
