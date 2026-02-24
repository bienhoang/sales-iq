const SUGGESTED_SKILLS = [
  { name: '/siq-brand-strategy', desc: 'Define positioning and messaging' },
  { name: '/siq-email-campaign', desc: 'Draft email sequences' },
  { name: '/siq-competitor-intel', desc: 'Analyze competitors' },
  { name: '/siq-proposal-generator', desc: 'Create proposals' },
];

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <span className="text-xl">&#x1F4DD;</span>
        </div>
        <h2 className="text-base font-semibold text-slate-800">No workspace files yet</h2>
        <p className="mt-1 text-sm text-slate-500">Get started by running a skill:</p>
        <ul className="mt-5 space-y-1.5 text-left">
          {SUGGESTED_SKILLS.map((s) => (
            <li key={s.name} className="rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100">
              <code className="text-sm font-semibold text-blue-600">{s.name}</code>
              <span className="ml-1.5 text-xs text-slate-400">{s.desc}</span>
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
