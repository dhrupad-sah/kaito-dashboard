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

  // Preset options
  const presetOptions = [
    { value: '1d', label: '1 Day', days: 1 },
    { value: '3d', label: '3 Days', days: 3 },
    { value: '7d', label: '7 Days', days: 7 },
    { value: '14d', label: '14 Days', days: 14 },
  ];

  const handlePresetClick = (preset: string) => {
    setSelectionMode('preset');
    setIsCustomRange(false);
    onWindowChange(preset);
  };

  const handleCustomDaysChange = (days: number) => {
    if (days >= 1 && days <= 15) {
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
              placeholder="Enter ticker (e.g., KAITO)"
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
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Time Window
          </label>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Presets */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Quick Select</p>
              <div className="flex flex-wrap gap-2">
                {presetOptions.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectionMode === 'preset' && currentWindow === preset.value
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Days Selector */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Custom Days (1-15)</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleCustomDaysChange(customDays - 1)}
                  disabled={customDays <= 1}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 flex items-center justify-center text-sm font-medium"
                >
                  −
                </button>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={customDays}
                    onChange={(e) => handleCustomDaysChange(parseInt(e.target.value) || 1)}
                    className={`w-16 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      selectionMode === 'days' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                    }`}
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
                <button
                  onClick={() => handleCustomDaysChange(customDays + 1)}
                  disabled={customDays >= 15}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 flex items-center justify-center text-sm font-medium"
                >
                  +
                </button>
              </div>
            </div>

            {/* Date Range Option */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Specific Date Range</p>
              <button
                onClick={handleDateRangeMode}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  selectionMode === 'daterange'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📅 Select Custom Dates
              </button>
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