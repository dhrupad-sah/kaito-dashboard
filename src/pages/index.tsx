import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import MetricsOverview from '@/components/MetricsOverview';
import DateRangePicker from '@/components/DateRangePicker';
import ApiDataDisplay from '@/components/ApiDataDisplay';
import { fetchCommunityMindshare, MindshareParams } from '@/lib/api';
import { LeaderboardData } from '@/types';

export default function Home() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState('KAITO');
  const [window, setWindow] = useState('7d');
  const [showRawData, setShowRawData] = useState(false);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  const fetchData = async (params: MindshareParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchCommunityMindshare(params);
      
      if (response.success) {
        console.log('Full API response structure:', response.data);
        console.log('Available fields:', Object.keys(response.data));
        setData(response.data);
        setApiStatus(response.message || 'Data loaded successfully');
      } else {
        setError(response.message || 'Failed to fetch data');
        setApiStatus(null);
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticker && window !== 'custom') {
      fetchData({ ticker, window });
    }
  }, [ticker, window]);

  const handleWindowChange = (newWindow: string) => {
    setWindow(newWindow);
  };

  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setWindow('custom'); // Update state to reflect custom range
    fetchData({ ticker, start_date: startDate, end_date: endDate });
  };

  const handleTickerChange = (newTicker: string) => {
    setTicker(newTicker);
  };

  return (
    <Layout title="Kaito Dashboard - Community Mindshare">
      <div className="space-y-6">
        {/* Filters */}
        <DateRangePicker
          onWindowChange={handleWindowChange}
          onCustomDateChange={handleCustomDateChange}
          onTickerChange={handleTickerChange}
          currentTicker={ticker}
          currentWindow={window}
        />

        {/* Controls and Status */}
        <div className="flex justify-between items-center mb-4">
          {/* API Status */}
          {apiStatus && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              apiStatus.includes('mock') || apiStatus.includes('unavailable') 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {apiStatus}
            </div>
          )}
          
          {/* Toggle for Raw Data */}
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {showRawData ? 'Hide Raw API Data' : 'Show Raw API Data'}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error.includes('timed out') ? 'Request Timed Out' : 
                   error.includes('No data found') ? 'Ticker Not Found' : 'Error'}
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                {(error.includes('timed out') || error.includes('No data found')) && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">
                      💡 <strong>Suggestion:</strong> Try using "KAITO" as the ticker, as it's known to work.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-md">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-primary-600 font-medium">Loading data...</span>
            </div>
          </div>
        )}

        {/* Data Display */}
        {data && (
          <>
            {/* Overview Metrics */}
            <MetricsOverview data={data.overall_metrics} isLoading={loading} />

            {/* Raw API Data Display */}
            {showRawData && (
              <ApiDataDisplay data={data} isLoading={loading} />
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && !data && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Kaito Dashboard</h3>
            <p className="text-gray-500">Enter a ticker symbol above to view community mindshare data</p>
          </div>
        )}
      </div>
    </Layout>
  );
}