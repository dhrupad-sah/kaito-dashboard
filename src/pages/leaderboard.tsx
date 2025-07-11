import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DateRangePicker from '@/components/DateRangePicker';
import { fetchCommunityMindshare, MindshareParams } from '@/lib/api';
import { LeaderboardData, AccountMetrics } from '@/types';

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState('KAITO');
  const [window, setWindow] = useState('7d');
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AccountMetrics | null>(null);

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
    if (ticker) {
      fetchData({ ticker, window });
    }
  }, [ticker, window]);

  const handleWindowChange = (newWindow: string) => {
    setWindow(newWindow);
  };

  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setWindow('custom');
    fetchData({ ticker, start_date: startDate, end_date: endDate });
  };

  const handleTickerChange = (newTicker: string) => {
    setTicker(newTicker);
  };

  const handleUserClick = (user: AccountMetrics) => {
    setSelectedUser(user);
  };

  const closeDialog = () => {
    setSelectedUser(null);
  };

  return (
    <Layout title="Kaito Dashboard - Leaderboard">
      <div className="space-y-6">
        {/* Filters */}
        <DateRangePicker
          onWindowChange={handleWindowChange}
          onCustomDateChange={handleCustomDateChange}
          onTickerChange={handleTickerChange}
          currentTicker={ticker}
          currentWindow={window}
        />

        {/* API Status */}
        {apiStatus && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
            apiStatus.includes('mock') || apiStatus.includes('unavailable') 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {apiStatus}
          </div>
        )}

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
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
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
              <span className="text-primary-600 font-medium">Loading leaderboard...</span>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {data && data.accounts && (
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Top 100 Yappers ({data.accounts.length} users)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mindshare
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tweets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.accounts.map((account, index) => (
                    <tr 
                      key={account.user_id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleUserClick(account)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{account.ranking || index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={account.profile_image_url || '/placeholder-avatar.svg'} 
                            alt={account.display_name || account.username}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-avatar.svg';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {account.display_name || account.username || `User ${index + 1}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{account.username || `user_${account.user_id}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {((account.mindshare || 0) * 100).toFixed(4)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(account.impressions || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(account.likes || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.tweet_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="uppercase text-xs font-medium text-gray-600">
                          {account.language || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !data && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Leaderboard</h3>
            <p className="text-gray-500">Enter a ticker symbol above to view the top 100 yappers</p>
          </div>
        )}
      </div>

      {/* User Detail Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={closeDialog}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedUser.profile_image_url || '/placeholder-avatar.svg'} 
                      alt={selectedUser.display_name || selectedUser.username}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-avatar.svg';
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedUser.display_name || selectedUser.username || 'Unknown User'}
                      </h3>
                      <p className="text-gray-600">@{selectedUser.username || `user_${selectedUser.user_id}`}</p>
                      <p className="text-sm text-gray-500">User ID: {selectedUser.user_id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Rank</div>
                      <div className="text-xl font-bold text-gray-900">#{selectedUser.ranking}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Mindshare</div>
                      <div className="text-xl font-bold text-primary-600">
                        {((selectedUser.mindshare || 0) * 100).toFixed(4)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Language</div>
                      <div className="text-xl font-bold text-gray-900 uppercase">
                        {selectedUser.language || 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Raw Score</div>
                      <div className="text-xl font-bold text-gray-900">
                        {(selectedUser.raw_community_score || 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Engagement Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tweet Count</span>
                      <span className="font-medium">{(selectedUser.tweet_count || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Impressions</span>
                      <span className="font-medium">{(selectedUser.impressions || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Retweets</span>
                      <span className="font-medium">{(selectedUser.retweets || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Quote Tweets</span>
                      <span className="font-medium">{(selectedUser.quotes || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Likes</span>
                      <span className="font-medium">{(selectedUser.likes || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookmarks</span>
                      <span className="font-medium">{(selectedUser.bookmarks || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Smart Engagements</span>
                      <span className="font-medium">{(selectedUser.smart_engagements || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Community Engagements</span>
                      <span className="font-medium">{(selectedUser.community_engagements || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tweet URLs */}
              {selectedUser.tweet_urls && selectedUser.tweet_urls.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Tweet URLs ({selectedUser.tweet_urls.length})</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedUser.tweet_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-primary-600 hover:text-primary-800 truncate"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Peripheral Tweet URLs */}
              {selectedUser.peripheral_tweet_urls && selectedUser.peripheral_tweet_urls.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Peripheral Tweet URLs ({selectedUser.peripheral_tweet_urls.length})</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {selectedUser.peripheral_tweet_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-gray-600 hover:text-gray-800 truncate"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}