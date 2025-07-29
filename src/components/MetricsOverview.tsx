import { MetricData } from '@/types';

interface MetricsOverviewProps {
  data: MetricData | undefined;
  isLoading?: boolean;
}

export default function MetricsOverview({ data, isLoading }: MetricsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="metric-card animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-slate-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="chart-container text-center mb-8">
        <div className="text-slate-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No Data Available</h3>
        <p className="text-slate-400">Unable to fetch metrics data. Please try again later.</p>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Unique Yappers',
      value: data?.unique_yappers?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-blue-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Total Unique Tweets',
      value: data?.total_tweets?.toLocaleString() || '0',  
      icon: (
        <svg className="w-8 h-8 text-green-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'Top 100 Yapper Impressions',
      value: data?.top_100_yapper_impressions?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-yellow-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: 'Top 100 Yapper Retweets',
      value: data?.top_100_yapper_retweets?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-pink-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: 'Top 100 Yapper Quote Tweets',
      value: data?.top_100_yapper_quote_tweets?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-indigo-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      )
    },
    {
      title: 'Top 100 Yapper Likes',
      value: data?.top_100_yapper_likes?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-red-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: 'Top 100 Yapper Bookmarks',
      value: data?.top_100_yapper_bookmarks?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-purple-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    },
    {
      title: 'Top 100 Yapper Smart Engagements',
      value: data?.top_100_yapper_smart_engagements?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-cyan-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: 'Top 100 Yapper Community Engagements',
      value: data?.top_100_yapper_community_engagements?.toLocaleString() || '0',
      icon: (
        <svg className="w-8 h-8 text-emerald-400 icon-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">Community Metrics</h2>
        <p className="text-slate-400">Overview of community engagement and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="metric-card group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-slate-700/50 group-hover:scale-110 transition-transform duration-300">
                <div className="w-6 h-6 text-current">
                  {metric.icon}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-slate-400 mb-1 group-hover:text-slate-300 transition-colors">
                {metric.title}
              </h3>
              <p className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                {metric.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}