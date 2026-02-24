import { useState, useEffect } from 'react';

interface BrandContextState {
  content: string;
  modified: string;
  loading: boolean;
  exists: boolean;
}

export function useBrandContext(): BrandContextState {
  const [content, setContent] = useState('');
  const [modified, setModified] = useState('');
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    fetch('/api/brand-context')
      .then((res) => {
        if (!res.ok) {
          setExists(false);
          return null;
        }
        setExists(true);
        return res.json();
      })
      .then((data) => {
        if (data) {
          setContent(data.content);
          setModified(data.modified);
        }
      })
      .catch(() => setExists(false))
      .finally(() => setLoading(false));
  }, []);

  return { content, modified, loading, exists };
}
