import { useState, useEffect } from 'react';

interface SystemState {
  version: string;
  skillsCount: number;
  mcpConfigured: boolean;
  loading: boolean;
}

export function useSystem(): SystemState {
  const [data, setData] = useState({ version: '', skillsCount: 0, mcpConfigured: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/system')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}
