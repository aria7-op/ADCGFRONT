import React, { useState, useEffect, useRef } from 'react';

function Gantt() {
  const [selectedView, setSelectedView] = useState('Month');
  const ganttContainerRef = useRef(null);

  const viewOptions = [
    'Month',
    'Quarter Day',
    'Half Day',
    'Day',
    'Week'
  ];

  // Sample gantt data in GanttJS format
  const ganttData = [
    {
      id: 1,
      text: 'Project: Website Redesign',
      start_date: '2024-03-01',
      end_date: '2024-05-15',
      progress: 0.8,
      color: '#6B7280'
    },
    {
      id: 2,
      text: 'Task: Frontend Development',
      start_date: '2024-07-01',
      end_date: '2024-07-31',
      progress: 0.3,
      color: '#8B5CF6'
    },
    {
      id: 3,
      text: 'Project: Product Launch Campaign',
      start_date: '2024-05-15',
      end_date: '2024-07-30',
      progress: 0.6,
      color: '#8B5CF6'
    },
    {
      id: 4,
      text: 'Task: Event Venue Booking',
      start_date: '2024-05-25',
      end_date: '2024-06-15',
      progress: 0.9,
      color: '#8B5CF6'
    },
    {
      id: 5,
      text: 'Task: Prototype Testing',
      start_date: '2024-03-01',
      end_date: '2024-04-30',
      progress: 0.7,
      color: '#8B5CF6'
    },
    {
      id: 6,
      text: 'Project: Training Program',
      start_date: '2024-07-01',
      end_date: '2024-08-31',
      progress: 0.2,
      color: '#8B5CF6'
    },
    {
      id: 7,
      text: 'Task: Training',
      start_date: '2024-07-15',
      end_date: '2024-08-15',
      progress: 0.1,
      color: '#8B5CF6'
    }
  ];

  // Dependencies between tasks
  const dependencies = [
    { id: 1, source: 1, target: 2, type: 0 },
    { id: 2, source: 3, target: 4, type: 0 },
    { id: 3, source: 4, target: 6, type: 0 },
    { id: 4, source: 5, target: 7, type: 0 }
  ];

  useEffect(() => {
    // Load GanttJS CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/dhtmlx-gantt@8.0.6/codebase/dhtmlxgantt.css';
    document.head.appendChild(link);

    // Load GanttJS JavaScript
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/dhtmlx-gantt@8.0.6/codebase/dhtmlxgantt.js';
    script.onload = () => {
      if (window.gantt && ganttContainerRef.current) {
        // Configure GanttJS
        window.gantt.config.date_format = "%Y-%m-%d";
        window.gantt.config.scale_unit = "month";
        window.gantt.config.date_scale = "%F, %Y";
        window.gantt.config.subscales = [
          { unit: "month", step: 1, date: "%M" }
        ];
        
        // Set view mode based on selection
        switch (selectedView) {
          case 'Day':
            window.gantt.config.scale_unit = "day";
            window.gantt.config.date_scale = "%d %M";
            window.gantt.config.subscales = [
              { unit: "hour", step: 6, date: "%H:00" }
            ];
            break;
          case 'Week':
            window.gantt.config.scale_unit = "week";
            window.gantt.config.date_scale = "Week #%W";
            window.gantt.config.subscales = [
              { unit: "day", step: 1, date: "%d %M" }
            ];
            break;
          case 'Quarter Day':
            window.gantt.config.scale_unit = "day";
            window.gantt.config.date_scale = "%d %M";
            window.gantt.config.subscales = [
              { unit: "hour", step: 6, date: "%H:00" }
            ];
            break;
          case 'Half Day':
            window.gantt.config.scale_unit = "day";
            window.gantt.config.date_scale = "%d %M";
            window.gantt.config.subscales = [
              { unit: "hour", step: 12, date: "%H:00" }
            ];
            break;
          default: // Month
            window.gantt.config.scale_unit = "month";
            window.gantt.config.date_scale = "%F, %Y";
            window.gantt.config.subscales = [
              { unit: "month", step: 1, date: "%M" }
            ];
        }

        // Initialize GanttJS
        window.gantt.init(ganttContainerRef.current);
        
        // Load data
        window.gantt.parse({
          data: ganttData,
          links: dependencies
        });

        // Customize appearance
        window.gantt.templates.task_class = function(start, end, task) {
          return "custom-task";
        };

        // Add custom CSS for better styling
        const style = document.createElement('style');
        style.textContent = `
          .custom-task {
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .gantt_task_line {
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .gantt_task_progress {
            border-radius: 4px;
          }
          .gantt_grid_head_cell {
            background-color: #f8fafc;
            border-color: #e2e8f0;
            font-weight: 600;
            color: #374151;
          }
          .gantt_grid_data {
            background-color: #ffffff;
            border-color: #e2e8f0;
          }
          .gantt_row {
            border-color: #e2e8f0;
          }
          .gantt_cell {
            border-color: #e2e8f0;
          }
        `;
        document.head.appendChild(style);
      }
    };
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (window.gantt) {
        window.gantt.clearAll();
      }
    };
  }, [selectedView]);

  return (
    <div className="p-0 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gantt Chart</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* View Filter */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Mode
            </label>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {viewOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Project Filter */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Projects</option>
              <option value="1">Website Redesign</option>
              <option value="2">Mobile App Development</option>
              <option value="3">CRM Implementation</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Status</option>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          {/* Chart Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Project Timeline</h2>
          </div>

          {/* GanttJS Container */}
          <div 
            ref={ganttContainerRef}
            className="gantt-container"
            style={{ height: '500px', width: '100%' }}
          ></div>
        </div>
      </div>

           </div>
   );
 }

export default Gantt; 