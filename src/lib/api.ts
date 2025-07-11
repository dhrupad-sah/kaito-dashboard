import { ApiResponse } from '@/types';

const API_BASE_URL = 'https://api.kaito.ai/api/v1';

export interface MindshareParams {
  ticker: string;
  window?: string;
  start_date?: string;
  end_date?: string;
}

export async function fetchCommunityMindshare(params: MindshareParams, retryCount = 0): Promise<ApiResponse> {
  // Use Next.js API route to avoid CORS issues
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('ticker', params.ticker);
    
    console.log('Input params:', params);
    
    if (params.window) {
      searchParams.append('window', params.window);
    } else if (params.start_date && params.end_date) {
      searchParams.append('start_date', params.start_date);
      searchParams.append('end_date', params.end_date);
    }

    const apiUrl = `/api/community-mindshare?${searchParams.toString()}`;
    console.log('Making API call to:', apiUrl);
    console.log('Search params:', searchParams.toString());

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // If it's a 504 timeout and we haven't retried too many times, retry
      if (response.status === 504 && retryCount < 4) {
        console.log(`504 timeout, retrying... (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        return fetchCommunityMindshare(params, retryCount + 1);
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    return {
      data,
      success: true,
      message: 'Real API data loaded successfully'
    };
  } catch (error) {
    console.error('Error fetching community mindshare:', error);
    
    // If it's a 504 timeout error and we haven't retried too many times, retry
    if (error instanceof Error && error.message.includes('504') && retryCount < 4) {
      console.log(`504 timeout error, retrying... (attempt ${retryCount + 1})`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      return fetchCommunityMindshare(params, retryCount + 1);
    }
    
    // For all other errors, throw them instead of showing mock data
    throw error;
  }
}

export const timeWindows = [
  { value: '1d', label: '1 Day' },
  { value: '2d', label: '2 Days' },
  { value: '3d', label: '3 Days' },
  { value: '4d', label: '4 Days' },
  { value: '5d', label: '5 Days' },
  { value: '6d', label: '6 Days' },
  { value: '7d', label: '7 Days' },
  { value: '8d', label: '8 Days' },
  { value: '9d', label: '9 Days' },
  { value: '10d', label: '10 Days' },
  { value: '11d', label: '11 Days' },
  { value: '12d', label: '12 Days' },
  { value: '13d', label: '13 Days' },
  { value: '14d', label: '14 Days' },
  { value: '15d', label: '15 Days' },
];