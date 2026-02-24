import { useState, useEffect, useCallback } from 'react';

interface FileInfo {
  name: string;
  path: string;
  modified: string;
  size: number;
}

export interface Category {
  name: string;
  files: FileInfo[];
}

interface WorkspaceState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWorkspace(): WorkspaceState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/workspace');
      if (!res.ok) throw new Error('Failed to fetch workspace');
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { categories, loading, error, refetch: fetchData };
}
