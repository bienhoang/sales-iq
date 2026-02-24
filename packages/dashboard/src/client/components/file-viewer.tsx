interface Props {
  content: string;
  filePath: string;
  loading: boolean;
}

export function FileViewer({ content, filePath, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  const breadcrumb = filePath.replace(/\//g, ' / ');

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <p className="text-xs text-gray-500">{breadcrumb}</p>
      </div>
      <pre className="flex-1 overflow-y-auto whitespace-pre-wrap p-4 font-mono text-sm text-gray-800">
        {content}
      </pre>
    </div>
  );
}
