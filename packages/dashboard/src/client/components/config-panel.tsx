import { useConfig } from '../hooks/use-config.js';

export function ConfigPanel() {
  const { config, loading } = useConfig();

  if (loading || !config) return null;

  const industrySection = config.industry ? (
    <span> &middot; {String(config.industry)}</span>
  ) : null;

  return (
    <div className="border-b border-gray-200 px-4 py-2">
      <p className="text-xs text-gray-500">
        <span className="font-medium text-gray-700">{String(config.name)}</span>
        {industrySection}
      </p>
    </div>
  );
}
