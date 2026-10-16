import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async ({ name, iconKey }) => {
    const newCat = await categoryService.create({ name, iconKey });
    await fetchCategories();
    return newCat;
  };

  const updateCategory = async (id, { name, iconKey }) => {
    const updated = await categoryService.update(id, { name, iconKey });
    await fetchCategories();
    return updated;
  };

  const deleteCategory = async (id) => {
    await categoryService.delete(id);
    await fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
