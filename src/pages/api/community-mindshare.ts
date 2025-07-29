import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = 'https://api.kaito.ai/api/v1';
const API_KEY = process.env.KAITO_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'KAITO_API_KEY environment variable is not set' });
  }

  const { ticker, window, start_date, end_date } = req.query;

  console.log('Received query parameters:', { ticker, window, start_date, end_date });

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker parameter is required' });
  }

  // Validate that we have either window OR both start_date and end_date
  if (!window && (!start_date || !end_date)) {
    return res.status(400).json({ 
      error: 'Either window parameter or both start_date and end_date parameters are required',
      received: { ticker, window, start_date, end_date }
    });
  }

  try {
    const searchParams = new URLSearchParams();
    searchParams.append('ticker', ticker as string);
    searchParams.append('api_key', API_KEY);
    
    if (window) {
      searchParams.append('window', window as string);
    } else if (start_date && end_date) {
      searchParams.append('start_date', start_date as string);
      searchParams.append('end_date', end_date as string);
    }

    const url = `${API_BASE_URL}/community_mindshare?${searchParams.toString()}`;
    console.log('Server-side API call to:', url);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': 'Kaito-Dashboard/1.0',
          'X-API-Key': API_KEY,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        
        // Try to get the error details from the response
        let errorDetails = '';
        try {
          const errorBody = await response.text();
          console.error('API Error Body:', errorBody);
          errorDetails = errorBody;
        } catch (e) {
          console.error('Could not read error body:', e);
        }
        
        return res.status(response.status).json({ 
          error: `API returned ${response.status}: ${response.statusText}`,
          details: errorDetails,
          url: url
        });
      }

      const data = await response.json();
      console.log('Raw API Response keys:', Object.keys(data));
      console.log('Community mindshare keys:', data.community_mindshare ? Object.keys(data.community_mindshare) : 'none');

      // Check if the response is empty or indicates no data
      if (!data.community_mindshare || !data.community_mindshare.top_100_yappers) {
        return res.status(404).json({
          error: 'No data found for this ticker',
          message: `The ticker "${ticker}" may not be available in the community leaderboard. Try using "MIRA" or other supported tokens.`,
          ticker: ticker
        });
      }
    
    // Transform the API response to match our expected structure
    const transformedData = {
      ticker: ticker as string,
      window: window as string,
      start_date: start_date as string,
      end_date: end_date as string,
      overall_metrics: {
        unique_yappers: data.community_mindshare?.total_unique_yappers || 0,
        total_tweets: data.community_mindshare?.total_unique_tweets || 0,
        total_impressions: data.community_mindshare?.top_100_yapper_impressions || 0,
        total_retweets: data.community_mindshare?.top_100_yapper_retweets || 0,
        total_quotes: data.community_mindshare?.top_100_yapper_quote_tweets || 0,
        total_likes: data.community_mindshare?.top_100_yapper_likes || 0,
        total_bookmarks: data.community_mindshare?.top_100_yapper_bookmarks || 0,
        total_smart_engagements: data.community_mindshare?.top_100_yapper_smart_engagements || 0,
        total_community_engagements: data.community_mindshare?.top_100_yapper_community_engagements || 0,
      },
      accounts: data.community_mindshare?.top_100_yappers?.map((account: any, index: number) => ({
        user_id: account.user_id,
        username: account.username || `User_${account.user_id}`,
        display_name: account.display_name || account.username || `User ${index + 1}`,
        profile_image_url: account.profile_image_url || '/placeholder-avatar.svg',
        impressions: account.total_impressions || 0,
        retweets: account.total_retweets || 0,
        quotes: account.total_quote_tweets || 0,
        likes: account.total_likes || 0,
        bookmarks: account.total_bookmarks || 0,
        smart_engagements: account.total_smart_engagements || 0,
        community_engagements: account.total_community_engagements || 0,
        mindshare: (account.mindshare || 0) * 100, // Convert to percentage
        ranking: parseInt(account.rank) || index + 1,
        tweet_count: account.tweet_counts || 0,
        tweet_urls: account.tweet_urls || [],
        peripheral_tweet_urls: account.peripheral_tweet_urls || [],
        language: account.language,
        raw_community_score: account.raw_community_score || 0,
      })) || [],
      // Include raw data for debugging
      raw_api_response: data
    };
    
    console.log('Transformed data structure:', {
      overall_metrics_keys: Object.keys(transformedData.overall_metrics),
      accounts_count: transformedData.accounts.length,
      first_account_keys: transformedData.accounts[0] ? Object.keys(transformedData.accounts[0]) : 'none'
    });
    
      res.status(200).json(transformedData);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('API request timed out for ticker:', ticker);
        return res.status(408).json({
          error: 'Request timed out',
          message: `The request for ticker "${ticker}" timed out. This ticker may not be supported or the API is experiencing issues.`,
          ticker: ticker,
          suggestion: 'Try using "MIRA" or check if the ticker is available in the community leaderboard.'
        });
      }
      
      throw fetchError; // Re-throw other fetch errors to be caught by outer catch
    }
  } catch (error) {
    console.error('Server-side API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from Kaito API',
      details: error instanceof Error ? error.message : 'Unknown error',
      ticker: ticker
    });
  }
}