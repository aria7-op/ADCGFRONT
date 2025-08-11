import React, { useState } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2027, 1, 1)); // February 2027
  const [selectedDate, setSelectedDate] = useState(null);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const totalDays = 42; // 6 weeks * 7 days

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

      days.push({
        date,
        isCurrentMonth,
        isToday,
        isSelected
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-0 sm:p-4 lg:p-6">
      {/* Header with white background */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Projects-Calendar</h1>
          <button className="bg-blue-500 text-white px-2 py-1.5 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm sm:text-base">
            Create Project
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <h2 className="text-xl font-bold text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={goToNextMonth}
            className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2 text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => setSelectedDate(day.date)}
              className={`
                min-h-[80px] p-2 border border-gray-200 cursor-pointer transition-colors
                ${!day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white hover:bg-gray-50'}
                ${day.isToday ? 'bg-blue-100 border-blue-300' : ''}
                ${day.isSelected ? 'bg-blue-500 text-white border-blue-500' : ''}
              `}
            >
              <div className="text-sm font-medium mb-1">
                {day.date.getDate()}
              </div>
              
              {/* Event indicators can be added here */}
              {day.isCurrentMonth && (
                <div className="space-y-1">
                  {/* Sample events - you can make this dynamic */}
                  {day.date.getDate() === 5 && (
                    <div className="w-full h-1 bg-red-400 rounded-full"></div>
                  )}
                  {day.date.getDate() === 12 && (
                    <div className="w-full h-1 bg-green-400 rounded-full"></div>
                  )}
                  {day.date.getDate() === 15 && (
                    <div className="w-full h-1 bg-blue-400 rounded-full"></div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default Calendar; 