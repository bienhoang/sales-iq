import { useState, useCallback } from 'react';

interface SaveFileState {
  save: (content: string) => Promise<void>;
  saving: boolean;
  error: string | null;
}

export function useSaveFile(filePath: string, endpoint?: string): SaveFileState {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (content: string) => {
      setSaving(true);
      setError(null);
      try {
        const url = endpoint || `/api/files?path=${encodeURIComponent(filePath)}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) throw new Error('Failed to save');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setSaving(false);
      }
    },
    [filePath, endpoint],
  );

  return { save, saving, error };
}
