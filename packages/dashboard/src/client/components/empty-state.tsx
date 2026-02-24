const SUGGESTED_SKILLS = [
  { name: '/siq-brand-strategy', desc: 'Define positioning and messaging' },
  { name: '/siq-email-campaign', desc: 'Draft email sequences' },
  { name: '/siq-competitor-intel', desc: 'Analyze competitors' },
  { name: '/siq-proposal-generator', desc: 'Create proposals' },
];

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-lg font-semibold text-gray-800">No workspace files yet</h2>
        <p className="mt-2 text-sm text-gray-500">Get started by running a skill:</p>
        <ul className="mt-4 space-y-2 text-left">
          {SUGGESTED_SKILLS.map((s) => (
            <li key={s.name} className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
              <code className="text-sm font-medium text-blue-600">{s.name}</code>
              <span className="ml-2 text-sm text-gray-500">— {s.desc}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-gray-400">
          Files will appear here automatically after skills generate output.
        </p>
      </div>
    </div>
  );
}
