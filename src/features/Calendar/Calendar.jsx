import React, { useState, useEffect, useRef } from 'react';

function Calendar() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);

  // Sample events data
  const events = [
    {
      id: '1',
      title: 'Team Meeting',
      start: '2025-08-06',
      end: '2025-08-06',
      color: '#9af80d',
      textColor: '#6f2525'
    },
    {
      id: '2',
      title: 'Project Review',
      start: '2025-08-15',
      end: '2025-08-15',
      color: '#3f0df8',
      textColor: '#ffffff'
    },
    {
      id: '3',
      title: 'Client Presentation',
      start: '2025-08-20',
      end: '2025-08-20',
      color: '#f80d0d',
      textColor: '#ffffff'
    },
    {
      id: '4',
      title: 'Training Session',
      start: '2025-08-25',
      end: '2025-08-25',
      color: '#1ba300',
      textColor: '#ffffff'
    }
  ];

  useEffect(() => {
    // Load FullCalendar CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css';
    document.head.appendChild(link);

    // Load FullCalendar JavaScript
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js';
    script.onload = () => {
      if (window.FullCalendar && calendarRef.current) {
        const calendar = new window.FullCalendar.Calendar(calendarRef.current, {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          events: events,
          editable: true,
          selectable: true,
          selectHelper: true,
          displayEventTime: true,
          eventClick: function(info) {
            setSelectedEvent(info.event);
            setShowEditModal(true);
          },
          dateClick: function(info) {
            setShowCreateModal(true);
          },
          select: function(info) {
            setShowCreateModal(true);
          }
        });
        calendar.render();
      }
    };
    document.head.appendChild(script);

    return () => {
      if (window.FullCalendar) {
        // Cleanup if needed
      }
    };
  }, []);

  return (
    <div className="p-0 sm:p-4 lg:p-4">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Calendar</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="px-2 py-1.5 sm:px-4 sm:py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
              <i className="fas fa-list mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">List View</span>
              <span className="sm:hidden">List</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-2 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Create Event</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div ref={calendarRef} className="calendar-container"></div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Event</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  className="w-full h-10 border border-gray-300 rounded-lg"
                  defaultValue="#3f0df8"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  defaultValue={selectedEvent.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  className="w-full h-10 border border-gray-300 rounded-lg"
                  defaultValue={selectedEvent.backgroundColor || '#3f0df8'}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar; 