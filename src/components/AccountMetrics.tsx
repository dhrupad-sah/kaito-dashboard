import { AccountMetrics } from '@/types';

interface AccountMetricsProps {
  accounts: AccountMetrics[] | undefined;
  isLoading?: boolean;
}

export default function AccountMetricsComponent({ accounts, isLoading }: AccountMetricsProps) {
  if (isLoading) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const topAccounts = accounts ? accounts.slice(0, 6) : [];

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Account Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topAccounts.map((account) => (
          <div key={account.username} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
            <div className="flex items-center mb-4">
              <img 
                src={account.profile_image_url || '/placeholder-avatar.svg'} 
                alt={account.display_name}
                className="w-10 h-10 rounded-full object-cover mr-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-avatar.svg';
                }}
              />
              <div>
                <h4 className="font-semibold text-gray-900">{account.display_name}</h4>
                <p className="text-sm text-gray-500">@{account.username}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Impressions</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {account.impressions?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Likes</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {account.likes?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Retweets</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {account.retweets?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Quotes</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {account.quotes?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Community Engagements</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {account.community_engagements?.toLocaleString() || '0'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Tweet Count</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {account.tweet_count?.toLocaleString() || '0'}
                </span>
              </div>
              
              {account.language && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Language</span>
                  <span className="font-semibold text-gray-900 text-sm uppercase">
                    {account.language}
                  </span>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Mindshare</span>
                  <span className="text-lg font-bold text-primary-600">
                    {account.mindshare?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </div>
              
              {account.tweet_urls && account.tweet_urls.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-1">Recent tweets:</p>
                  <div className="space-y-1">
                    {account.tweet_urls.slice(0, 2).map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:text-primary-800 block truncate"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {topAccounts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p>No account data available</p>
        </div>
      )}
    </div>
  );
}