import { LeaderboardData } from '@/types';

interface ApiDataDisplayProps {
  data: LeaderboardData;
  isLoading?: boolean;
}

export default function ApiDataDisplay({ data, isLoading }: ApiDataDisplayProps) {
  if (isLoading) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Response Data</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return `[${value.length} items]`;
    if (typeof value === 'object') return 'Object';
    return String(value);
  };

  const renderObject = (obj: any, depth = 0) => {
    if (!obj || typeof obj !== 'object') return null;
    
    const indent = depth * 20;
    
    return Object.entries(obj).map(([key, value]) => (
      <div key={key} className="mb-2" style={{ marginLeft: indent }}>
        <div className="flex items-start">
          <span className="font-medium text-gray-700 mr-2 min-w-0 flex-shrink-0">
            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
          </span>
          <span className="text-gray-900 break-all">
            {Array.isArray(value) ? (
              <div className="space-y-1">
                <span className="text-sm text-gray-500">[{value.length} items]</span>
                {value.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-sm pl-4 border-l-2 border-gray-200">
                    {typeof item === 'object' ? renderObject(item, depth + 1) : formatValue(item)}
                  </div>
                ))}
                {value.length > 3 && (
                  <div className="text-sm text-gray-500 pl-4">
                    ... and {value.length - 3} more items
                  </div>
                )}
              </div>
            ) : typeof value === 'object' && value !== null ? (
              <div className="mt-1">
                {renderObject(value, depth + 1)}
              </div>
            ) : (
              formatValue(value)
            )}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete API Response Data</h3>
      
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {renderObject(data)}
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">API Fields</div>
          <div className="text-xl font-bold text-blue-900">
            {Object.keys(data).length}
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Accounts</div>
          <div className="text-xl font-bold text-green-900">
            {data.accounts?.length || 0}
          </div>
        </div>
        
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-600 font-medium">Ticker</div>
          <div className="text-xl font-bold text-purple-900">
            {data.ticker || 'N/A'}
          </div>
        </div>
        
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-sm text-orange-600 font-medium">Window</div>
          <div className="text-xl font-bold text-orange-900">
            {data.window || data.start_date && data.end_date ? 'Custom' : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}