import { useSystem } from '../hooks/use-system.js';

export function SystemBar() {
  const { version, skillsCount, mcpConfigured, loading } = useSystem();

  if (loading) return null;

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-1.5 text-[11px] text-slate-400 flex items-center gap-3">
      <span className="font-medium text-slate-500">v{version}</span>
      <span className="h-3 w-px bg-slate-200" />
      <span>{skillsCount} skills</span>
      <span className="h-3 w-px bg-slate-200" />
      <span className="flex items-center gap-1">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${mcpConfigured ? 'bg-emerald-400' : 'bg-slate-300'}`} />
        MCP {mcpConfigured ? 'connected' : 'off'}
      </span>
    </footer>
  );
}
