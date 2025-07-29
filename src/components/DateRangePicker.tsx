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

  const presetOptions = [
    { value: '1d', label: '1 Day' },
    { value: '3d', label: '3 Days' },
    { value: '7d', label: '1 Week' },
    { value: '14d', label: '2 Weeks' },
    { value: '30d', label: '1 Month' },
    { value: '60d', label: '2 Months' },
    { value: '90d', label: '3 Months' },
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
    <div className="chart-container mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
      
      <div className="space-y-6">
        {/* Ticker Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Ticker
          </label>
          <input
            type="text"
            value={currentTicker}
            onChange={(e) => onTickerChange(e.target.value.toUpperCase())}
            placeholder="Enter ticker (e.g., MIRA)"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Time Window Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Time Window
          </label>
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4">
            {presetOptions.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectionMode === 'preset' && currentWindow === preset.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Days */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm text-slate-300">Custom Days (1-90):</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCustomDaysChange(customDays - 1)}
                disabled={customDays <= 1}
                className="w-8 h-8 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="90"
                value={customDays}
                onChange={(e) => handleCustomDaysChange(parseInt(e.target.value) || 1)}
                className={`w-16 px-2 py-1 text-center bg-slate-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectionMode === 'days' ? 'border-blue-500' : 'border-slate-600'
                }`}
              />
              <button
                onClick={() => handleCustomDaysChange(customDays + 1)}
                disabled={customDays >= 90}
                className="w-8 h-8 rounded-md bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 flex items-center justify-center"
              >
                +
              </button>
              <span className="text-sm text-slate-400">days</span>
            </div>
          </div>

          {/* Custom Date Range */}
          <div>
            <button
              onClick={handleDateRangeMode}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectionMode === 'daterange'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Custom Date Range
            </button>
          </div>

          {/* Date Range Inputs */}
          {isCustomRange && (
            <div className="mt-4 p-4 bg-slate-800 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    max={new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Historical data only - end date must be before today
              </p>
            </div>
          )}

          {/* Fetch Button */}
          {(selectionMode === 'days' || (selectionMode === 'daterange' && startDate && endDate)) && (
            <div className="mt-4">
              <button
                onClick={handleFetchData}
                className="btn-primary"
              >
                Fetch Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}