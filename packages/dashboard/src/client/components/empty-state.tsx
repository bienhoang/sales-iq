import { Sparkles, Mail, Search, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SuggestedSkill {
  name: string;
  desc: string;
  icon: LucideIcon;
}

const SUGGESTED_SKILLS: SuggestedSkill[] = [
  { name: '/siq-brand-strategy', desc: 'Define positioning and messaging', icon: Sparkles },
  { name: '/siq-email-campaign', desc: 'Draft email sequences', icon: Mail },
  { name: '/siq-competitor-intel', desc: 'Analyze competitors', icon: Search },
  { name: '/siq-proposal-generator', desc: 'Create proposals', icon: FileText },
];

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50/50">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">No workspace files yet</h2>
        <p className="mt-1.5 text-sm text-slate-500">Get started by running a skill in Claude Code:</p>
        <ul className="mt-5 space-y-1.5 text-left">
          {SUGGESTED_SKILLS.map((s) => (
            <li
              key={s.name}
              className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 shadow-sm ring-1 ring-slate-100 transition-all duration-150 hover:shadow-md hover:ring-slate-200"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50">
                <s.icon className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <code className="text-sm font-semibold text-blue-600">{s.name}</code>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-slate-400">
          Files appear automatically after skills generate output.
        </p>
      </div>
    </div>
  );
}
