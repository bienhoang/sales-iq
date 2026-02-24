import type { Category } from '../hooks/use-workspace.js';
import { useBrandContext } from '../hooks/use-brand-context.js';

const CATEGORY_ICONS: Record<string, string> = {
  proposals: '\u{1F4C4}',
  emails: '\u{2709}\u{FE0F}',
  outreach: '\u{1F4E8}',
  'ad-copy': '\u{1F4E3}',
  content: '\u{270F}\u{FE0F}',
  social: '\u{1F310}',
  intel: '\u{1F50D}',
  reports: '\u{1F4CA}',
  strategy: '\u{1F9ED}',
  'sales-prep': '\u{1F4BC}',
  research: '\u{1F52C}',
};

function formatCategoryName(name: string): string {
  return name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

interface Props {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (name: string) => void;
  projectName: string | null;
  onSelectBrand: () => void;
  isBrandSelected: boolean;
}

export function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  projectName,
  onSelectBrand,
  isBrandSelected,
}: Props) {
  const { exists } = useBrandContext();

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-300">
      {/* Header */}
      <div className="border-b border-slate-700/50 px-4 py-4">
        <h1 className="text-sm font-bold tracking-wide text-white">Sales-IQ</h1>
        {projectName && (
          <p className="mt-0.5 text-xs text-slate-400">{projectName}</p>
        )}
      </div>

      {/* Brand section */}
      <div className="border-b border-slate-700/50 px-3 py-3">
        <p className="mb-1.5 px-1 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Brand</p>
        {exists ? (
          <button
            onClick={onSelectBrand}
            className={`w-full rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
              isBrandSelected
                ? 'bg-blue-600/20 text-blue-400 font-medium'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Brand Context
          </button>
        ) : (
          <p className="px-1 py-1 text-xs text-slate-500">
            Run <code className="rounded bg-slate-800 px-1 text-slate-400">/siq-brand-strategy</code> to create
          </p>
        )}
      </div>

      {/* Workspace categories */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="mb-1.5 px-1 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">Workspace</p>
        <div className="space-y-0.5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                selectedCategory === cat.name && !isBrandSelected
                  ? 'bg-blue-600/20 text-blue-400 font-medium'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{CATEGORY_ICONS[cat.name] || '\u{1F4C1}'}</span>
                <span>{formatCategoryName(cat.name)}</span>
              </span>
              <span className="rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                {cat.files.length}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
