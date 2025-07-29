import { useState } from 'react';

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
  const [customDays, setCustomDays] = useState(7);
  const [selectionMode, setSelectionMode] = useState<'preset' | 'days' | 'daterange'>('preset');

  // Preset options organized by time period
  const dayPresets = [
    { value: '1d', label: '1 Day', days: 1 },
    { value: '3d', label: '3 Days', days: 3 },
    { value: '7d', label: '1 Week', days: 7 },
    { value: '14d', label: '2 Weeks', days: 14 },
  ];

  const monthPresets = [
    { value: '30d', label: '1 Month', days: 30 },
    { value: '60d', label: '2 Months', days: 60 },
    { value: '90d', label: '3 Months', days: 90 },
  ];

  const popularRanges = [
    { value: '7d', label: '📊 Last Week', days: 7, color: 'bg-blue-500' },
    { value: '30d', label: '📈 Last Month', days: 30, color: 'bg-green-500' },
    { value: '90d', label: '🚀 Quarter', days: 90, color: 'bg-purple-500' },
  ];

  const handlePresetClick = (preset: string) => {
    setSelectionMode('preset');
    setIsCustomRange(false);
    onWindowChange(preset);
  };

  const handleCustomDaysChange = (days: number) => {
    if (days >= 1 && days <= 90) {
      setCustomDays(days);
      setSelectionMode('days');
      setIsCustomRange(false);
    }
  };

  const handleDateRangeMode = () => {
    setSelectionMode('daterange');
    setIsCustomRange(true);
  };

  const handleFetchData = () => {
    if (selectionMode === 'days') {
      onWindowChange(`${customDays}d`);
    } else if (selectionMode === 'daterange' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
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


  return (
    <div className="chart-container mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Top Row: Ticker and Fetch Button */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticker
            </label>
            <input
              type="text"
              value={currentTicker}
              onChange={(e) => onTickerChange(e.target.value.toUpperCase())}
              placeholder="Enter ticker (e.g., MIRA)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Fetch Button */}
          {(selectionMode === 'days' || (selectionMode === 'daterange' && startDate && endDate)) && (
            <button
              onClick={handleFetchData}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
            >
              📊 Fetch Data
            </button>
          )}
        </div>

        {/* Time Window Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            📊 Time Window Selection
          </label>
          
          <div className="space-y-6">
            {/* Popular Ranges - Hero Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">🔥 Popular Ranges</p>
              <div className="flex flex-wrap gap-3">
                {popularRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handlePresetClick(range.value)}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                      selectionMode === 'preset' && currentWindow === range.value
                        ? `${range.color} text-white shadow-lg`
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Days & Weeks */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">📅 Days & Weeks</p>
                  <div className="grid grid-cols-2 gap-2">
                    {dayPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handlePresetClick(preset.value)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                          selectionMode === 'preset' && currentWindow === preset.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Days */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">🎯 Custom Days (1-90)</p>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <button
                      onClick={() => handleCustomDaysChange(customDays - 1)}
                      disabled={customDays <= 1}
                      className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center text-sm font-bold shadow-sm"
                    >
                      −
                    </button>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={customDays}
                        onChange={(e) => handleCustomDaysChange(parseInt(e.target.value) || 1)}
                        className={`w-20 px-3 py-2 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold ${
                          selectionMode === 'days' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300'
                        }`}
                      />
                      <span className="text-sm text-gray-600 font-medium">days</span>
                    </div>
                    <button
                      onClick={() => handleCustomDaysChange(customDays + 1)}
                      disabled={customDays >= 90}
                      className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center text-sm font-bold shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Months & Date Range */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">📆 Monthly Ranges</p>
                  <div className="space-y-2">
                    {monthPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handlePresetClick(preset.value)}
                        className={`w-full px-4 py-3 rounded-md text-sm font-medium transition-all ${
                          selectionMode === 'preset' && currentWindow === preset.value
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {preset.label} <span className="text-xs opacity-70">({preset.days} days)</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Date Range */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">🗓️ Specific Dates</p>
                  <button
                    onClick={handleDateRangeMode}
                    className={`w-full px-4 py-3 rounded-md text-sm font-medium transition-all ${
                      selectionMode === 'daterange'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📅 Select Custom Date Range
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        {isCustomRange && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              📊 Historical data only - end date must be before today
            </p>
          </div>
        )}
      </div>

    </div>
  );
}