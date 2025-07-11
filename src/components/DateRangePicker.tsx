import { useState } from 'react';
import { timeWindows } from '@/lib/api';

interface DateRangePickerProps {
  onWindowChange: (window: string) => void;
  onCustomDateChange: (startDate: string, endDate: string) => void;
  onTickerChange: (ticker: string) => void;
  currentTicker: string;
  currentWindow: string;
}

export default function DateRangePicker({
  onWindowChange,
  onCustomDateChange,
  onTickerChange,
  currentTicker,
  currentWindow
}: DateRangePickerProps) {
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleWindowChange = (window: string) => {
    if (window === 'custom') {
      setIsCustomRange(true);
    } else {
      setIsCustomRange(false);
      onWindowChange(window);
    }
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      
      if (start > end) {
        alert('Start date must be before end date');
        return;
      }
      
      if (end >= today) {
        alert('End date must be before today. The API only provides historical data.');
        return;
      }
      
      onCustomDateChange(startDate, endDate);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="chart-container mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ticker Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticker
          </label>
          <input
            type="text"
            value={currentTicker}
            onChange={(e) => onTickerChange(e.target.value.toUpperCase())}
            placeholder="Enter ticker (e.g., KAITO)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Time Window Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Window
          </label>
          <select
            value={isCustomRange ? 'custom' : currentWindow}
            onChange={(e) => handleWindowChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {timeWindows.map((window) => (
              <option key={window.value} value={window.value}>
                {window.label}
              </option>
            ))}
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {isCustomRange && (
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select any date range for custom analysis (historical data only - end date must be before today)
            </p>
          </div>
        )}
      </div>

      {/* Custom Date Submit Button */}
      {isCustomRange && (
        <div className="mt-4">
          <button
            onClick={handleCustomDateSubmit}
            disabled={!startDate || !endDate}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Apply Custom Range
          </button>
          {startDate && endDate && (
            <p className="text-sm text-gray-600 mt-2">
              Range: {formatDate(startDate)} to {formatDate(endDate)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}