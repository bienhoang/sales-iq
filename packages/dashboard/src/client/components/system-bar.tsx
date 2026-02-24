import { Cpu, Zap } from 'lucide-react';
import { useSystem } from '../hooks/use-system.js';

export function SystemBar() {
  const { version, skillsCount, mcpConfigured, loading } = useSystem();

  if (loading) return null;

  return (
    <footer className="flex items-center gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-1.5 text-[11px] text-slate-400">
      <span className="font-medium text-slate-500">v{version}</span>
      <span className="h-3 w-px bg-slate-200" />
      <span className="flex items-center gap-1">
        <Zap className="h-3 w-3" />
        {skillsCount} skills
      </span>
      <span className="h-3 w-px bg-slate-200" />
      <span className="flex items-center gap-1">
        <Cpu className="h-3 w-3" />
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${mcpConfigured ? 'bg-emerald-400' : 'bg-slate-300'}`} />
        MCP {mcpConfigured ? 'connected' : 'off'}
      </span>
    </footer>
  );
}
