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
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h1 className="text-sm font-semibold text-gray-900">Sales-IQ Dashboard</h1>
        {projectName && (
          <p className="mt-0.5 text-xs text-gray-500">{projectName}</p>
        )}
      </div>

      {/* Brand section */}
      <div className="border-b border-gray-200 px-2 py-2">
        <p className="px-2 pb-1 text-xs font-medium text-gray-400 uppercase">Brand</p>
        {exists ? (
          <button
            onClick={onSelectBrand}
            className={`w-full rounded px-2 py-1.5 text-left text-sm ${
              isBrandSelected
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            brand-context.md
          </button>
        ) : (
          <p className="px-2 py-1 text-xs text-gray-400">
            Run <code className="rounded bg-gray-100 px-1">/siq-brand-strategy</code> to create brand context
          </p>
        )}
      </div>

      {/* Workspace categories */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <p className="px-2 pb-1 text-xs font-medium text-gray-400 uppercase">Workspace</p>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm ${
              selectedCategory === cat.name && !isBrandSelected
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>
              {CATEGORY_ICONS[cat.name] || '\u{1F4C1}'}{' '}
              {formatCategoryName(cat.name)}
            </span>
            <span className="rounded-full bg-gray-200 px-1.5 text-xs text-gray-600">
              {cat.files.length}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
