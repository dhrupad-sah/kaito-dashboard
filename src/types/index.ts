export interface MetricData {
  unique_yappers?: number;
  total_tweets?: number;
  total_impressions?: number;
  total_retweets?: number;
  total_quotes?: number;
  total_likes?: number;
  total_replies?: number;
  // Allow additional fields from API
  [key: string]: any;
}

export interface AccountMetrics {
  username?: string;
  display_name?: string;
  profile_image_url?: string;
  impressions?: number;
  retweets?: number;
  quotes?: number;
  likes?: number;
  replies?: number;
  mindshare?: number;
  ranking?: number;
  tweet_urls?: string[];
  // Allow additional fields from API
  [key: string]: any;
}

export interface LeaderboardData {
  ticker?: string;
  window?: string;
  start_date?: string;
  end_date?: string;
  overall_metrics?: MetricData;
  accounts?: AccountMetrics[];
  // Allow additional fields from API
  [key: string]: any;
}

export interface ApiResponse {
  data: LeaderboardData;
  success: boolean;
  message?: string;
}