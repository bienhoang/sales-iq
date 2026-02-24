import { useState, useEffect } from 'react';

interface FileState {
  content: string;
  modified: string;
  loading: boolean;
  error: string | null;
}

export function useFile(path: string | null): FileState {
  const [content, setContent] = useState('');
  const [modified, setModified] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setContent('');
      setModified('');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/files?path=${encodeURIComponent(path)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch file');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setContent(data.content);
        setModified(data.modified);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unknown error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [path]);

  return { content, modified, loading, error };
}
