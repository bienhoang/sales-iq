import {
  FileText,
  Mail,
  Send,
  Megaphone,
  PenLine,
  Globe,
  Search,
  BarChart3,
  Compass,
  Briefcase,
  FlaskConical,
  FolderOpen,
  Palette,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import type { Category } from '../hooks/use-workspace.js';
import { useBrandContext } from '../hooks/use-brand-context.js';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  proposals: FileText,
  emails: Mail,
  outreach: Send,
  'ad-copy': Megaphone,
  content: PenLine,
  social: Globe,
  intel: Search,
  reports: BarChart3,
  strategy: Compass,
  'sales-prep': Briefcase,
  research: FlaskConical,
  plans: ClipboardList,
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
    <aside className="flex w-60 flex-col border-r border-slate-200 bg-slate-50/80">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-xs font-bold text-white">S</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">Sales-IQ</h1>
            {projectName && (
              <p className="text-[11px] leading-tight text-slate-500">{projectName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Brand section */}
      <div className="px-3 pb-2">
        <p className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Brand
        </p>
        {exists ? (
          <button
            onClick={onSelectBrand}
            className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-all duration-150 ${
              isBrandSelected
                ? 'bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-100'
                : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
            }`}
          >
            <Palette className="h-4 w-4 shrink-0" />
            <span>Brand Context</span>
          </button>
        ) : (
          <p className="px-2 py-1 text-xs text-slate-400">
            Run <code className="rounded bg-slate-200 px-1 py-0.5 text-[11px] text-slate-600">/siq-brand-strategy</code> to create
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-slate-200" />

      {/* Workspace categories */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 pt-2 pb-3">
        <p className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
          Workspace
        </p>
        <div className="space-y-0.5">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name] || FolderOpen;
            const isActive = selectedCategory === cat.name && !isBrandSelected;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-100'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{formatCategoryName(cat.name)}</span>
                </span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-200/70 text-slate-500'
                }`}>
                  {cat.files.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
