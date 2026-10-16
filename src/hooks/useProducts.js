import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export function useProducts(initialFilters = {}) {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    categoryId: 'all',
    search: '',
    minRating: 0,
    minPrice: 0,
    maxPrice: 2000,
    sort: 'newest',
    pageSize: 12,
    ...initialFilters,
  });

  const fetchProducts = useCallback(async (resetPage = true) => {
    if (resetPage) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const targetPage = resetPage ? 1 : page + 1;
      const result = await productService.getProducts({
        ...filters,
        page: targetPage,
      });

      if (resetPage) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }

      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setPage(targetPage);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts(true);
  }, [filters.categoryId, filters.search, filters.minRating, filters.minPrice, filters.maxPrice, filters.sort]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const refresh = () => {
    fetchProducts(true);
  };

  return {
    products,
    totalCount,
    loading,
    loadingMore,
    hasMore,
    error,
    filters,
    updateFilters,
    loadMore,
    refresh,
  };
}
