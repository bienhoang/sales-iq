import { useSystem } from '../hooks/use-system.js';

export function SystemBar() {
  const { version, skillsCount, mcpConfigured, loading } = useSystem();

  if (loading) return null;

  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-4 py-1.5 text-xs text-gray-500 flex items-center gap-4">
      <span>v{version}</span>
      <span>{skillsCount} skills installed</span>
      <span>MCP: {mcpConfigured ? 'configured' : 'not configured'}</span>
    </footer>
  );
}
