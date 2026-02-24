import { useState, useEffect } from 'react';

interface ConfigState {
  config: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
}

export function useConfig(): ConfigState {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => {
        if (!res.ok) throw new Error('Config not found');
        return res.json();
      })
      .then((d) => setConfig(d))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
