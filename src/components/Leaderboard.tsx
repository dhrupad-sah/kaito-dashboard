import { AccountMetrics } from '@/types';

interface LeaderboardProps {
  accounts: AccountMetrics[] | undefined;
  isLoading?: boolean;
}

export default function Leaderboard({ accounts, isLoading }: LeaderboardProps) {
  if (isLoading) {
    return (
      <div className="chart-container">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Community Leaderboard</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedAccounts = accounts ? [...accounts].sort((a, b) => (b.mindshare || 0) - (a.mindshare || 0)) : [];

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Community Leaderboard</h3>
      
      <div className="space-y-4">
        {sortedAccounts.map((account, index) => (
          <div key={account.username} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full mr-4 font-semibold">
              {index + 1}
            </div>
            
            <div className="flex-shrink-0 mr-4">
              <img 
                src={account.profile_image_url || '/placeholder-avatar.svg'} 
                alt={account.display_name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-avatar.svg';
                }}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h4 className="font-semibold text-gray-900">{account.display_name}</h4>
                <span className="ml-2 text-sm text-gray-500">@{account.username}</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <span className="mr-4">
                  <span className="font-medium">{account.impressions?.toLocaleString() || '0'}</span> impressions
                </span>
                <span className="mr-4">
                  <span className="font-medium">{account.likes?.toLocaleString() || '0'}</span> likes
                </span>
                <span>
                  <span className="font-medium">{account.retweets?.toLocaleString() || '0'}</span> retweets
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary-600">
                {account.mindshare?.toFixed(2) || '0.00'}%
              </div>
              <div className="text-sm text-gray-500">Mindshare</div>
            </div>
          </div>
        ))}
      </div>
      
      {sortedAccounts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No leaderboard data available</p>
        </div>
      )}
    </div>
  );
}